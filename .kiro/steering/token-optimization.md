# Token Optimization Rules

## Guidelines
- Keep responses concise and focused
- Use caching for repeated file reads
- Prefer smart tools (smart_read, smart_grep) over standard ones when available
- Don't load unnecessary context
- Archive completed work to docs/archive/
- Use RTK for terminal commands when possible: prefix with `rtk` (e.g., `rtk git status`)

## Available Token Optimization Tools
1. **Token Optimizer MCP** - Configured as MCP server, auto-reduces tokens
2. **RTK** - Installed at ~/.local/bin/rtk.exe - use for compressed terminal output
3. **Doc Structure** - Only load docs from docs/learnings/ when needed
