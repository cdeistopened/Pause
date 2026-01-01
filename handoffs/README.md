# Handoff System

## Strategy

**One active handoff, archived history.**

### Files

| File | Purpose |
|------|---------|
| `HANDOFF.md` (root) | Current session state - always up to date |
| `handoffs/YYYY-MM-DD.md` | Archived sessions with date stamps |
| `handoffs/README.md` | This file - system documentation |

### Workflow

#### Starting a Session
1. Read `HANDOFF.md` at project root
2. Check `handoffs/` for any recent context if needed

#### During a Session
- Update `HANDOFF.md` as you complete work
- Add new findings to "What's Next" or "Known Issues"

#### Ending a Session (`/handoff`)
1. **Archive current**: Copy `HANDOFF.md` → `handoffs/YYYY-MM-DD.md`
2. **Update current**: Refresh `HANDOFF.md` with latest state
3. **Prune old**: Remove completed items, update priorities

### What Goes Where

**HANDOFF.md (Current)**
- Current runnable state
- THIS session's accomplishments
- Immediate next priorities
- Active blockers/issues
- Key commands and paths

**Archived Handoffs**
- Historical record of what was done when
- Decisions made and why
- Problems solved (for reference)
- Feature evolution over time

### Archive Naming

```
handoffs/
├── README.md           # This file
├── 2024-12-31.md       # Today's archive
├── 2024-12-30.md       # Yesterday
└── ...
```

If multiple sessions in one day, use: `2024-12-31-2.md`

### Pruning Strategy

Keep last 5-7 archived handoffs. Older ones can be deleted unless they contain unique context not captured elsewhere (like major architectural decisions).

---

*This system ensures context is never lost while keeping the active handoff clean and focused.*
