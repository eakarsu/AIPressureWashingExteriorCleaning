#!/bin/bash

# ============================================================
# AI Pressure Washing & Exterior Cleaning - Start Script
# ============================================================
# This script:
#   1. Kills any processes on ports 3000 and 3001
#   2. Creates/resets the PostgreSQL database
#   3. Seeds all tables with realistic data (15+ items each)
#   4. Installs dependencies
#   5. Starts backend (with hot reload via nodemon) and frontend
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🧹 AI Pressure Washing & Exterior Cleaning Platform 🧹   ║"
echo "║                     Starting Up...                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}✗ .env file not found! Please create one.${NC}"
    exit 1
fi

# ============================================================
# Step 1: Clean up used ports
# ============================================================
echo -e "\n${BLUE}[1/5] Cleaning up ports 3000 and 3001...${NC}"

cleanup_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}  Killing processes on port $port: $pids${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        echo -e "${GREEN}  Port $port is free${NC}"
    fi
}

cleanup_port 3000
cleanup_port 3001

# ============================================================
# Step 2: Setup PostgreSQL Database
# ============================================================
echo -e "\n${BLUE}[2/5] Setting up PostgreSQL database...${NC}"

# Extract DB name from DATABASE_URL
DB_NAME=$(echo $DATABASE_URL | sed 's/.*\///')
DB_USER=$(echo $DATABASE_URL | sed 's/postgresql:\/\/\([^:]*\).*/\1/')

# Drop and recreate database
echo -e "${YELLOW}  Dropping existing database (if any)...${NC}"
dropdb --if-exists "$DB_NAME" 2>/dev/null || true
echo -e "${YELLOW}  Creating database '$DB_NAME'...${NC}"
createdb "$DB_NAME" 2>/dev/null || {
    echo -e "${YELLOW}  Database may already exist, continuing...${NC}"
}
echo -e "${GREEN}✓ Database ready${NC}"

# ============================================================
# Step 3: Install dependencies
# ============================================================
echo -e "\n${BLUE}[3/5] Installing dependencies...${NC}"

echo -e "${YELLOW}  Installing server dependencies...${NC}"
npm install --silent 2>&1 | tail -1

echo -e "${YELLOW}  Installing client dependencies...${NC}"
cd client
npm install --silent 2>&1 | tail -1
cd ..

echo -e "${GREEN}✓ Dependencies installed${NC}"

# ============================================================
# Step 4: Seed the database
# ============================================================
echo -e "\n${BLUE}[4/5] Seeding database with sample data...${NC}"
node server/seed.js
echo -e "${GREEN}✓ Database seeded with sample data${NC}"

# ============================================================
# Step 5: Start the application
# ============================================================
echo -e "\n${BLUE}[5/5] Starting application...${NC}"
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Application Starting                      ║"
echo "║                                                              ║"
echo "║   Frontend:  http://localhost:3000                           ║"
echo "║   Backend:   http://localhost:3001                           ║"
echo "║                                                              ║"
echo "║   Login:     admin@pressurewash.com / admin123               ║"
echo "║                                                              ║"
echo "║   Press Ctrl+C to stop all services                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Start backend with nodemon (hot reload) and frontend concurrently
npx concurrently \
    --names "SERVER,CLIENT" \
    --prefix-colors "blue,green" \
    "npx nodemon --watch server server/index.js" \
    "cd client && PORT=3000 BROWSER=none npm start"
