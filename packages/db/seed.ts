import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool as any);
const db = new PrismaClient({ adapter });

const ADMIN_EMAIL = "admin@workverse.dev";
const ADMIN_PASSWORD = "Admin@123";
const USER_EMAIL = "user@workverse.dev";
const USER_PASSWORD = "User@123";
const ORG_NAME = "WorkVerse HQ";
const ORG_SLUG = "workverse-hq";
const WORKSPACE_NAME = "General";
const WORKSPACE_SLUG = "general";

async function main() {
  console.log("Seeding database...\n");

  const adminHash = await Bun.password.hash(ADMIN_PASSWORD, { algorithm: "bcrypt" });
  const userHash = await Bun.password.hash(USER_PASSWORD, { algorithm: "bcrypt" });

  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      name: "Admin User",
      passwordHash: adminHash,
    },
  });
  console.log(`  Admin user: ${admin.email} (id: ${admin.id})`);

  const member = await db.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: {
      email: USER_EMAIL,
      name: "Regular User",
      passwordHash: userHash,
    },
  });
  console.log(`  Regular user: ${member.email} (id: ${member.id})`);

  const org = await db.organization.upsert({
    where: { slug: ORG_SLUG },
    update: {},
    create: {
      name: ORG_NAME,
      slug: ORG_SLUG,
      description: "Default organization for testing",
      createdById: admin.id,
    },
  });
  console.log(`  Organization: ${org.name} (id: ${org.id})`);

  await db.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: admin.id } },
    update: {},
    create: {
      organizationId: org.id,
      userId: admin.id,
      role: "OWNER",
    },
  });
  console.log(`  Membership: ${admin.name} -> OWNER of ${org.name}`);

  await db.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: member.id } },
    update: {},
    create: {
      organizationId: org.id,
      userId: member.id,
      role: "MEMBER",
    },
  });
  console.log(`  Membership: ${member.name} -> MEMBER of ${org.name}`);

  const workspace = await db.workspace.upsert({
    where: { slug: WORKSPACE_SLUG },
    update: {},
    create: {
      name: WORKSPACE_NAME,
      slug: WORKSPACE_SLUG,
      description: "General purpose workspace",
      organizationId: org.id,
      createdById: admin.id,
    },
  });
  console.log(`  Workspace: ${workspace.name} (id: ${workspace.id})`);

  let channel = await db.channel.findFirst({
    where: { workspaceId: workspace.id, name: "general" },
  });
  if (!channel) {
    channel = await db.channel.create({
      data: {
        workspaceId: workspace.id,
        name: "general",
        type: "PUBLIC",
      },
    });
  }
  console.log(`  Channel: ${channel.name} (id: ${channel.id})`);

  const existingSpace = await db.space.findUnique({ where: { workspaceId: workspace.id } });
  if (!existingSpace) {
    await db.space.create({
      data: {
        name: "Main Space",
        orgId: org.id,
        workspaceId: workspace.id,
        createdById: admin.id,
        userId: admin.id,
      },
    });
    console.log(`  Space: Main Space created`);
  } else {
    console.log(`  Space: Main Space already exists`);
  }

  console.log("\n--- Seed Complete ---\n");
  console.log("Test Credentials:");
  console.log("  Admin  : admin@workverse.dev / Admin@123");
  console.log("  User   : user@workverse.dev  / User@123");
}

main()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await db.$disconnect();
    process.exit(1);
  });
