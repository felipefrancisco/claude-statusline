# Local config

The statusline setup Felipe runs on every machine. An agent setting up a new machine applies this
on top of [SETUP_PROMPT.md](SETUP_PROMPT.md).

## Source

Run the renderer from `main` of the `felipefrancisco/claude-statusline` fork, checked out at
`$HOME/projects/claude-statusline` with `main` tracking the fork. `<REPO>` below means that path.

## `~/.claude/settings.json`

```json
{
  "env": {
    "STATUSLINE_SEGMENTS": "model,effort,vim,agent,cost,ratelimits,context,worktree",
    "STATUSLINE_MONTHLY_BUDGET": "10000",
    "STATUSLINE_COST_PERIODS": "m",
    "STATUSLINE_MONTHLY_PROGRESS": "1",
    "STATUSLINE_NO_BURN_RATE": "1",
    "STATUSLINE_WORKTREE_LAST_SEGMENT": "1"
  },
  "statusLine": {
    "type": "command",
    "command": "node <REPO>/hooks/statusline.js"
  },
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"<REPO>/hooks/refresh-cost-cache.js\""
          }
        ]
      }
    ]
  }
}
```

Use an absolute `node` path if `node` isn't on the PATH Claude Code spawns hooks with (nvm installs).

## What it looks like

- One line, segments in the order above: model, effort, vim mode, agent, cost, rate limits,
  context bar, worktree.
- Cost shows the session chip without the `$X/h` burn rate, plus only the `m` chip as spend over a
  $10K monthly budget, e.g. `m $1234.00/$10K (12%)`. It stays dim until 90%, then turns red.
- Worktree shows only the part after the last `-`, e.g. `statusline-update` becomes `update`.
- No branch, dir, duration or lines segments.

## Vibe Island

On machines with Vibe Island installed, its installer rewrites `statusLine.command` to
`$HOME/.vibe-island/bin/vibe-island-statusline-chain` and stores the command above in
`~/.vibe-island/cache/statusline-chain-original-command`. Leave that as is. The chain still runs
this renderer.
