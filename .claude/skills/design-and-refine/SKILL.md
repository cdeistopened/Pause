---
name: design-and-refine
description: Start a design exploration session - generate 5 distinct UI variations, compare side-by-side, collect feedback, and iterate to a final design. Use when exploring UI options, redesigning components, or creating new interfaces.
---

# Design and Refine

Generate multiple UI variations, compare them side-by-side, and iterate based on feedback until you reach the perfect design.

## When to Use

- Starting a new component or page - explore approaches before committing
- Redesigning existing UI - see alternatives to what you have
- Stuck on a design direction - generate options
- Getting stakeholder buy-in - show concrete variations

## How It Works

1. **Preflight** - Detect framework, styling system, and infer existing design tokens
2. **Interview** - Ask about scope, pain points, inspiration, brand direction, constraints
3. **Generate** - Create 5 distinct variations exploring different design axes
4. **Preview** - User views at `/__design_lab` route (or web preview for Expo)
5. **Feedback** - Pick a winner or synthesize elements from multiple variants
6. **Iterate** - Refine until confident
7. **Finalize** - Clean up temp files, generate DESIGN_PLAN.md

## Full Workflow

See the complete skill definition at:
`.claude/skills/design-plugin/design-and-refine/skills/design-lab/SKILL.md`

When invoked, follow that workflow exactly. Key phases:

### Phase 0: Preflight Detection
- Detect package manager (pnpm/yarn/npm/bun)
- Detect framework (Next.js, Vite, Expo, etc.)
- Detect styling (Tailwind, CSS modules, styled-components)
- Infer visual styles from existing configs and components

### Phase 1-2: Interview & Brief
Use AskUserQuestion tool to gather:
- Scope (component vs page, new vs redesign)
- Pain points and inspiration
- Brand direction and density preference
- Target user and key tasks
- Constraints

Generate design-brief.json from responses.

### Phase 3-4: Generate Design Lab
Create 5 meaningfully distinct variants:
- A: Information hierarchy focus
- B: Layout model exploration
- C: Density variation
- D: Interaction model
- E: Expressive direction

For Expo/React Native:
- Create variants as components in `.claude-design/lab/variants/`
- Use `expo export --platform web` for preview
- Or generate screenshots using simulator

### Phase 5-7: Feedback & Refinement
- Ask if user found a winner or wants to synthesize
- If synthesizing, combine best elements into Variant F
- Iterate until user confirms

### Phase 8: Finalize
- Delete all `.claude-design/` temp files
- Delete temp routes
- Generate DESIGN_PLAN.md with implementation steps
- Update DESIGN_MEMORY.md with learned preferences

## Expo/React Native Adaptation

Since this project is Expo (not web), adapt the workflow:
- Skip web route creation
- Generate component variations in `.claude-design/`
- Preview options:
  1. Run `expo export --platform web` and view at localhost
  2. Use simulator screenshots
  3. Hot reload in Expo Go

## Abort Handling

If user says cancel/abort/stop at any point:
1. Confirm the abort
2. Delete `.claude-design/` entirely
3. Do NOT generate any plan
