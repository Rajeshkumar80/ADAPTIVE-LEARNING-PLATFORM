# ANTIGRAVITY + GEMINI | QUICK REFERENCE

**Print this. Use daily.** ⚡

---

## BEFORE EVERY CODING SESSION
```bash
# 1. Check cache is warm
antigravity cache status

# 2. Load project context
antigravity context set --file .context.json

# 3. List available skills
antigravity skills list --installed
```

---

## BUILD CODE (MAIN COMMANDS)

### Quick Task (single file)
```bash
antigravity task run --input "Build a React button component"
```

### Full Feature (workflow)
```bash
antigravity workflow run --name fullstack --feature "User authentication"
```

### Batch Mode (5+ similar tasks)
```bash
antigravity batch --file tasks.yaml --optimize
```

### Code Review
```bash
antigravity workflow run --name review --files "src/**/*.ts"
```

---

## TOKEN OPTIMIZATION (ALWAYS DO THESE)

| Goal | Command |
|------|---------|
| See remaining tokens | `antigravity billing --current-month` |
| Save context for reuse | `antigravity context cache --save` |
| Prune context aggressively | `antigravity context prune --aggressive` |
| Check cache hit rate | `antigravity cache stats --detailed` |
| Enable batch processing | `antigravity config set batch_mode true` |

---

## SWITCHING BETWEEN CLAUDE & GEMINI

```bash
# Use Gemini (faster, cheaper for small tasks)
antigravity provider switch gemini
antigravity task run --input "Build form validation"

# Back to Claude (better for complex code)
antigravity provider switch antigravity
antigravity task run --input "Complex auth flow"

# Use both in parallel
antigravity task run --providers ["claude", "gemini"] --input "X"
```

---

## LOGGING & MONITORING

```bash
# Tail logs in real-time
antigravity logs tail --agent rajuu-codeship --follow

# View specific task logs
antigravity logs view --task-id abc123

# Export logs for analysis
antigravity logs export --format json --output logs.json

# Clear old logs (>7 days)
antigravity logs clean --older-than 7d
```

---

## SKILL MANAGEMENT

```bash
# Search for a skill
antigravity skills search "authentication"

# Install a specific skill
antigravity skills install --skill "fullstack-auth-oauth"

# Remove a skill (free up space)
antigravity skills remove --skill "accessibility-wcag"

# Update all skills
antigravity skills update --all
```

---

## PROJECT SETUP

```bash
# Start a new SaaS project
antigravity project init myapp --template saas-quick --optimize-tokens

# Switch between projects
antigravity project switch adaptive-learning
antigravity project switch devflow

# List projects
antigravity project list
```

---

## MCP SERVERS

```bash
# Check MCP status
antigravity mcp status

# Test GitHub MCP (requires GitHub token)
antigravity mcp test --server github-mcp

# Re-register all MCPs
antigravity mcp init --register-defaults

# Diagnose MCP issues
antigravity mcp diagnose
```

---

## TROUBLESHOOTING QUICK FIXES

| Problem | Solution |
|---------|----------|
| Agent slow/hanging | `antigravity agent kill rajuu-codeship` then restart |
| Cache not working | `antigravity cache clear && antigravity cache warmup` |
| Token limit hit | `antigravity context prune --aggressive` |
| MCP fails | `antigravity mcp diagnose` + check env vars |
| Gemini timeout | `antigravity config set gemini.timeout 300` |
| Out of space | `antigravity logs clean --older-than 7d` |

---

## WORKFLOW TEMPLATES (Copy & modify)

### Ship a feature end-to-end
```bash
antigravity workflow run fullstack \
  --feature "Add payment processing" \
  --track-tokens \
  --stream
```

### Review & optimize code
```bash
antigravity workflow run review \
  --files "src/components/**" \
  --check-security \
  --check-performance
```

### Run tests & deploy
```bash
antigravity workflow run test-deploy \
  --build-first \
  --deploy-target vercel
```

---

## COST CONTROL (CRITICAL FOR PLACEMENT BUDGET)

```bash
# Budget remaining
antigravity billing --remaining

# Breakdown by provider
antigravity billing --by-provider

# Token use by task
antigravity billing --detailed

# Set monthly limit alert
antigravity config set billing.monthly_limit_tokens 500000
antigravity config set billing.alert_threshold 80%
```

---

## BEFORE SUBMITTING TO RECRUITER

```bash
# Final check - code quality
antigravity workflow run review --files "src/**" --security --perf

# Get all project logs
antigravity logs export --format json --output project-logs.json

# Show token usage summary
antigravity billing --summary

# Cache analytics (show efficiency)
antigravity cache stats --detailed
```

---

## DAILY CHECKLIST (Copy this)

- [ ] Check tokens remaining (`billing --remaining`)
- [ ] Clear old logs if >10 files (`logs clean --older-than 7d`)
- [ ] Update skills if needed (`skills update --all`)
- [ ] Test one small task to verify agent is responsive
- [ ] Review cache hit rate (target: >70%)
- [ ] Check MCP servers are all green (`mcp status`)

---

## EMERGENCY COMMANDS

```bash
# Nuclear reset (WARNING: clears everything)
antigravity reset --full

# Kill stuck agent
pkill -f "antigravity agent"

# View system health
antigravity health --verbose

# Get support
antigravity support --open
```

---

## COMMON TASK TEMPLATES

### "Build a full-stack feature"
```bash
antigravity task run \
  --input "Add admin panel for user management" \
  --skills "fullstack-auth,postgres-schema,react-nextjs-patterns" \
  --output-format json \
  --track-tokens
```

### "Fix performance issue"
```bash
antigravity task run \
  --input "Optimize N+1 queries in FastAPI" \
  --skill "performance-optimization" \
  --mcp-use github \
  --streaming
```

### "Add tests"
```bash
antigravity task run \
  --input "Write unit tests for auth module" \
  --skill "testing-unittest-pytest" \
  --files "src/auth/**"
```

---

## GEMINI-SPECIFIC TIPS

```bash
# Gemini is faster & cheaper - good for:
# - Simple components
# - Bug fixes
# - Refactoring
# - Tests

antigravity provider switch gemini
antigravity task run --input "Fix typo in modal component"

# Switch back for complex tasks
antigravity provider switch antigravity
```

---

**Status Check (should be green):**
```bash
antigravity health
```

**One-liner to verify setup:**
```bash
antigravity agent test --quick && echo "✅ Ready to ship!" || echo "⚠️ Check setup"
```

---

**Print & pin this to desk.** Reference it every session. ⭐
