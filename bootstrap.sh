#!/bin/bash
set -e

echo "🚀 Starting Cortex server..."
cd apps/cortex
bun start:cortex
echo "🚀 Cortex server started..."
