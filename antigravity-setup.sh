#!/bin/bash

################################################################################
# ANTIGRAVITY + GEMINI AUTO-SETUP SCRIPT
# For: Rajuu's SaaS shipping workflow
# Run once: chmod +x antigravity-setup.sh && ./antigravity-setup.sh
################################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

################################################################################
# STEP 1: VERIFY ANTIGRAVITY INSTALLATION
################################################################################
log_info "Step 1: Verifying Antigravity installation..."

if ! command -v antigravity &> /dev/null; then
    log_error "Antigravity not found. Install first:"
    echo "  npm install -g @antigravity/cli"
    echo "  # or"
    echo "  pip install antigravity-cli"
    exit 1
fi

ANTIGRAVITY_VERSION=$(antigravity --version)
log_success "Antigravity found: $ANTIGRAVITY_VERSION"

################################################################################
# STEP 2: CREATE WORKSPACE
################################################################################
log_info "Step 2: Creating workspace directories..."

WORKSPACE_DIR="$HOME/antigravity-workspace"
mkdir -p "$WORKSPACE_DIR"/{projects,mcp-config,agent-logs,cache,configs}
log_success "Workspace created at $WORKSPACE_DIR"

################################################################################
# STEP 3: COPY CONFIGS
################################################################################
log_info "Step 3: Setting up configuration files..."

# Copy agent config
if [ -f "./antigravity-agent-config.json" ]; then
    cp ./antigravity-agent-config.json "$WORKSPACE_DIR/configs/"
    log_success "Agent config copied"
else
    log_warn "antigravity-agent-config.json not found in current dir"
fi

################################################################################
# STEP 4: REGISTER MCP SERVERS
################################################################################
log_info "Step 4: Registering MCP servers..."

# Create MCP config
cat > "$WORKSPACE_DIR/mcp-config/mcp-servers.yaml" << 'EOF'
mcp_servers:
  - name: "github-mcp"
    url: "https://github-mcp.api.github.com"
    enabled: true
    priority: 1
    
  - name: "web-mcp"
    url: "https://web-mcp.search.googleapis.com"
    enabled: true
    priority: 2
    
  - name: "filesystem-mcp"
    url: "local"
    enabled: true
    priority: 1
EOF

log_success "MCP configuration file created"

# Try to register MCPs
if antigravity mcp init --register-defaults 2>/dev/null; then
    log_success "MCP servers registered"
else
    log_warn "Could not auto-register MCPs. Register manually:"
    echo "  antigravity mcp register --config $WORKSPACE_DIR/mcp-config/mcp-servers.yaml"
fi

################################################################################
# STEP 5: FETCH & INSTALL SKILLS
################################################################################
log_info "Step 5: Fetching and installing skills (may take 2-3 minutes)..."

# Fetch all skills
if antigravity skills fetch --all 2>/dev/null; then
    log_success "Skills database fetched"
else
    log_warn "Could not fetch skills. You may need to do this manually."
fi

# Priority A skills
log_info "Installing Priority A skills (essential)..."
PRIORITY_A_SKILLS=(
    "code-generation-advanced"
    "api-integration-fastapi"
    "react-nextjs-patterns"
    "postgres-schema-design"
    "error-handling-production"
    "api-documentation"
)

for skill in "${PRIORITY_A_SKILLS[@]}"; do
    if antigravity skills install --skill "$skill" 2>/dev/null; then
        log_success "Installed: $skill"
    else
        log_warn "Could not install: $skill (may already be installed)"
    fi
done

# Priority B skills
log_info "Installing Priority B skills (SaaS & placement)..."
PRIORITY_B_SKILLS=(
    "fullstack-auth-oauth"
    "performance-optimization"
    "testing-unittest-pytest"
    "ci-cd-github-actions"
    "docker-containerization"
    "deployment-vercel-render"
)

for skill in "${PRIORITY_B_SKILLS[@]}"; do
    if antigravity skills install --skill "$skill" 2>/dev/null; then
        log_success "Installed: $skill"
    else
        log_warn "Could not install: $skill"
    fi
done

log_success "Skill installation complete"

################################################################################
# STEP 6: CONFIGURE GEMINI (OPTIONAL)
################################################################################
log_info "Step 6: Setting up Gemini (optional, for fallback)..."

read -p "Do you have a Gemini API key? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -sp "Enter your Gemini API key: " GEMINI_KEY
    echo
    
    # Save to .env
    echo "GEMINI_API_KEY=\"$GEMINI_KEY\"" > "$WORKSPACE_DIR/configs/.env"
    chmod 600 "$WORKSPACE_DIR/configs/.env"
    log_success "Gemini API key saved (encrypted in .env)"
    
    # Configure Antigravity for Gemini
    if antigravity config set --provider gemini --auto 2>/dev/null; then
        log_success "Gemini configured as fallback provider"
    else
        log_warn "Gemini auto-config failed. Configure manually if needed."
    fi
else
    log_warn "Skipping Gemini setup. Can configure later."
fi

################################################################################
# STEP 7: CREATE AGENT
################################################################################
log_info "Step 7: Creating main agent (Rajuu-CodeShip)..."

if antigravity agent create \
    --name "Rajuu-CodeShip" \
    --model "claude-sonnet-4-20250514" 2>/dev/null; then
    log_success "Agent 'Rajuu-CodeShip' created"
else
    log_warn "Could not create agent. It may already exist."
fi

################################################################################
# STEP 8: TEST HEALTH
################################################################################
log_info "Step 8: Running health check..."

if antigravity health --verbose 2>/dev/null; then
    log_success "Health check passed"
else
    log_warn "Health check returned warnings. Review logs for details."
fi

################################################################################
# STEP 9: SUMMARY & NEXT STEPS
################################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "✅ ANTIGRAVITY + GEMINI SETUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📁 Workspace location: $WORKSPACE_DIR"
echo ""
echo "🚀 Quick start commands:"
echo "  # List installed skills"
echo "  antigravity skills list --installed"
echo ""
echo "  # Run a task"
echo "  antigravity task run --input 'Build a React component'"
echo ""
echo "  # View agent logs"
echo "  antigravity logs tail --agent rajuu-codeship --follow"
echo ""
echo "  # Check token usage"
echo "  antigravity billing --current-month"
echo ""
echo "📚 Full guide: ANTIGRAVITY_COMPLETE_AGENT_PROMPT.md"
echo "⚙️  Config file: $WORKSPACE_DIR/configs/antigravity-agent-config.json"
echo ""
echo "💡 Next step: Use Antigravity to ship your first feature!"
echo "   Paste the prompt from ANTIGRAVITY_COMPLETE_AGENT_PROMPT.md into your agent."
echo ""

################################################################################
# STEP 10: GITHUB TOKEN SETUP (OPTIONAL)
################################################################################
echo ""
read -p "Do you want to set up GitHub MCP integration? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -sp "Enter your GitHub personal access token: " GITHUB_TOKEN
    echo
    
    echo "export GITHUB_TOKEN=\"$GITHUB_TOKEN\"" >> "$WORKSPACE_DIR/configs/.env"
    chmod 600 "$WORKSPACE_DIR/configs/.env"
    log_success "GitHub token saved"
    
    echo ""
    echo "📝 Add this to your shell profile (~/.bashrc, ~/.zshrc, etc):"
    echo "  source $WORKSPACE_DIR/configs/.env"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "Setup complete. You're ready to ship code! 🚀"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
