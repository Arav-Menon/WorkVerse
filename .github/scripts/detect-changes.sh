#!/usr/bin/env bash
set -euo pipefail

log_header() {
  echo ""
  echo "━━━ $1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

log_action() {
  echo "  → $1"
}

log_error() {
  echo ""
  echo "ERROR: $1"
  echo "  -> $2"
  echo "  -> $3"
  exit 1
}

validate_json() {
  if ! echo "$1" | jq empty 2>/dev/null; then
    log_error "Invalid JSON matrix" \
      "Generated JSON is malformed: $1" \
      "Check the SERVICE_DOCKERFILES and PACKAGE_CONSUMERS mappings in detect-changes.sh"
  fi
}

validate_file() {
  if [ ! -f "$1" ]; then
    log_error "File not found: $1" \
      "$2" \
      "$3"
  fi
}

declare -A SERVICE_DOCKERFILES=(
  [cortex]="containers/backend/cortex.dockerfile"
  [flux]="containers/backend/flux.dockerfile"
  [orion]="containers/backend/orion.dockerfile"
  [relay]="containers/backend/relay.dockerfile"
  [space]="containers/backend/space.dockerfile"
  [stream]="containers/backend/stream.dockerfile"
  [synapse]="containers/backend/synapse.dockerfile"
  [executor]="containers/workers/executor.dockerfile"
  [forger]="containers/workers/forger.dockerfile"
  [mail-forger]="containers/workers/mail-forger.dockerfile"
  [scribe]="containers/workers/scribe.dockerfile"
  [n8n]="containers/automation/n8n.dockerfile"
)

# Services deployed via Vercel (not Docker) — detected but not built in CI
declare -A VERCEL_SERVICES=(
  [web]="https://vercel.com"
)

declare -A PACKAGE_CONSUMERS=(
  [db]="cortex orion space synapse executor forger scribe n8n"
  [events]="flux synapse executor forger"
  [mcp]="cortex orion executor"
  [queue]="cortex orion forger mail-forger"
  [redis]="cortex orion relay space stream synapse executor forger scribe n8n"
  [schemas]="cortex orion stream"
  [rbac]="cortex"
  [rate-limit]="cortex orion stream"
  [evaluator]="cortex orion forger"
  [email]="mail-forger"
  [ui]="web"
)

declare -A NON_CONSUMABLE_PACKAGES=(
  [convo-store]=1
  [eslint-config]=1
  [testing]=1
  [typescript-config]=1
  [security]=1
)

ROOT_REBUILD_FILES="package.json bun.lock turbo.json"

CHANGED_FILES=()

BEFORE="${BEFORE_SHA:-HEAD~1}"

if [ "$BEFORE" = "0000000000000000000000000000000000000000" ]; then
  log_header "Initial Push Detected"
  echo "  No previous commit. Marking all services for rebuild."
  mapfile -t CHANGED_FILES < <(find apps/ packages/ containers/ -type f 2>/dev/null)
else
  mapfile -t CHANGED_FILES < <(git diff --name-only --diff-filter=ACMR "$BEFORE" HEAD 2>/dev/null)
fi

if [ ${#CHANGED_FILES[@]} -eq 0 ]; then
  log_header "No Changes Detected"
  echo "matrix={\"include\":[]}" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  echo "has_changes=false" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  exit 0
fi

log_header "Changed Files (${#CHANGED_FILES[@]})"
for f in "${CHANGED_FILES[@]}"; do
  [ -z "$f" ] && continue
  echo "  $f"
done

declare -A AFFECTED_SERVICES=()
declare -A AFFECTED_PACKAGES=()

for file in "${CHANGED_FILES[@]}"; do
  [ -z "$file" ] && continue

  base_file=$(basename "$file")
  if echo "$ROOT_REBUILD_FILES" | grep -qw "$base_file"; then
    log_header "Root File Changed"
    log_action "$file → rebuilding ALL services"
    for svc in "${!SERVICE_DOCKERFILES[@]}"; do
      AFFECTED_SERVICES[$svc]=1
    done
    break
  fi

  if [[ "$file" =~ ^apps/([^/]+)/ ]]; then
    svc="${BASH_REMATCH[1]}"
    if [ -n "${SERVICE_DOCKERFILES[$svc]+_}" ]; then
      log_action "App change: $file → $svc"
      AFFECTED_SERVICES[$svc]=1
    elif [ -n "${VERCEL_SERVICES[$svc]+_}" ]; then
      log_action "Vercel service: $file → $svc (deployed via Vercel, skipping Docker build)"
    else
      log_action "WARNING: App change detected but '${svc}' is not in SERVICE_DOCKERFILES (skipped)"
      log_action "  -> If this service should be deployed via Docker, add it to SERVICE_DOCKERFILES."
      log_action "  -> If deployed via Vercel, add it to VERCEL_SERVICES."
    fi
  fi

  if [[ "$file" =~ ^packages/([^/]+)(?:/([^/]+))?/ ]]; then
    if [ -n "${BASH_REMATCH[2]}" ]; then
      pkg="${BASH_REMATCH[2]}"
    else
      pkg="${BASH_REMATCH[1]}"
    fi

    if [ -n "${NON_CONSUMABLE_PACKAGES[$pkg]+_}" ]; then
      log_action "Non-consumable package (skipped): $file"
      continue
    fi

    if [ -z "${PACKAGE_CONSUMERS[$pkg]+_}" ]; then
      log_error "Unknown package detected: packages/${pkg}/" \
        "Package '${pkg}' is not in PACKAGE_CONSUMERS or NON_CONSUMABLE_PACKAGES." \
        "Add it to PACKAGE_CONSUMERS in detect-changes.sh with its consumer services, \
or add it to NON_CONSUMABLE_PACKAGES if it's dev-only. Affected file: $file"
    fi

    AFFECTED_PACKAGES[$pkg]=1
    log_action "Package change: $file"
    log_action "  Consumers: ${PACKAGE_CONSUMERS[$pkg]}"
    for svc in ${PACKAGE_CONSUMERS[$pkg]}; do
      AFFECTED_SERVICES[$svc]=1
    done
  fi

  if [[ "$file" =~ ^containers/([^/]+)/([^/]+)\.dockerfile$ ]]; then
    svc="${BASH_REMATCH[2]}"
    if [ -n "${SERVICE_DOCKERFILES[$svc]+_}" ]; then
      log_action "Dockerfile change: $file → $svc"
      AFFECTED_SERVICES[$svc]=1
    fi
  fi
done

if [ ${#AFFECTED_SERVICES[@]} -eq 0 ]; then
  log_header "Detection Results"
  echo "No services affected."
  echo "matrix={\"include\":[]}" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  echo "has_changes=false" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  exit 0
fi

# Separate Docker services from Vercel services
DOCKER_SERVICES=()
VERCEL_AFFECTED=()
for svc in "${!AFFECTED_SERVICES[@]}"; do
  if [ -n "${VERCEL_SERVICES[$svc]+_}" ]; then
    VERCEL_AFFECTED+=("$svc")
  else
    DOCKER_SERVICES+=("$svc")
  fi
done

if [ ${#VERCEL_AFFECTED[@]} -gt 0 ]; then
  log_header "Vercel Services Detected"
  for svc in "${VERCEL_AFFECTED[@]}"; do
    log_action "$svc → deployed via Vercel (auto-deploys on push, no Docker build needed)"
  done
fi

if [ ${#DOCKER_SERVICES[@]} -eq 0 ]; then
  log_header "Detection Results"
  echo "Only Vercel services affected — no Docker builds needed."
  echo "matrix={\"include\":[]}" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  echo "has_changes=false" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  exit 0
fi

SORTED_SERVICES=($(printf '%s\n' "${DOCKER_SERVICES[@]}" | sort))

MATRIX_ITEMS=()
for svc in "${SORTED_SERVICES[@]}"; do
  dockerfile="${SERVICE_DOCKERFILES[$svc]}"
  MATRIX_ITEMS+=("{\"service\":\"${svc}\",\"dockerfile\":\"${dockerfile}\"}")
done

MATRIX=$(printf '%s\n' "${MATRIX_ITEMS[@]}" | jq -sc '{"include":.}')

# ---------------------------------------------------------------------------
# Validate matrix
# ---------------------------------------------------------------------------
log_header "Matrix Validation"

# Check for duplicates
UNIQUE_COUNT=$(printf '%s\n' "${SORTED_SERVICES[@]}" | sort -u | wc -l)
if [ "${#SORTED_SERVICES[@]}" -ne "$UNIQUE_COUNT" ]; then
  log_error "Duplicate services in matrix" \
    "Found ${#SORTED_SERVICES[@]} entries but only $UNIQUE_COUNT are unique." \
    "Check SERVICE_DOCKERFILES mapping for duplicates."
fi

# Check for empty service names
for svc in "${SORTED_SERVICES[@]}"; do
  if [ -z "$svc" ]; then
    log_error "Empty service name in matrix" \
      "One of the resolved services has an empty name." \
      "Check the dependency graph and affected file paths."
  fi
done

# Validate JSON is parseable
validate_json "$MATRIX"

# Validate Dockerfiles exist
for svc in "${SORTED_SERVICES[@]}"; do
  df="${SERVICE_DOCKERFILES[$svc]}"
  validate_file "$df" \
    "Dockerfile for service '${svc}' not found at: $df" \
    "Verify the containers/ directory structure and SERVICE_DOCKERFILES mapping."
done

log_action "JSON valid ✓"
log_action "No duplicates ✓"
log_action "All Dockerfiles exist ✓"

# ---------------------------------------------------------------------------
# Output results
# ---------------------------------------------------------------------------
log_header "Detection Results"

echo "Affected packages (${#AFFECTED_PACKAGES[@]}): $(echo "${!AFFECTED_PACKAGES[@]}" | tr ' ' '\n' | sort | tr '\n' ', ' | sed 's/,$//')"
echo "Docker services (${#SORTED_SERVICES[@]}): ${SORTED_SERVICES[*]}"
if [ ${#VERCEL_AFFECTED[@]} -gt 0 ]; then
  echo "Vercel services (${#VERCEL_AFFECTED[@]}): ${VERCEL_AFFECTED[*]}"
fi
echo ""
echo "Matrix: $MATRIX"
echo "matrix=$MATRIX" >> "${GITHUB_OUTPUT:-/dev/stdout}"
echo "has_changes=true" >> "${GITHUB_OUTPUT:-/dev/stdout}"
