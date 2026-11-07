# BREACH development roadmap

This roadmap separates prototype functionality from production requirements. A feature is considered complete only when its implementation is present, automated tests cover its critical rules, and the relevant end-to-end acceptance checks pass.

## Current release baseline

**0.1.0 — offline playable prototype.** The project has a Three.js OUTPOST blockout, a local bot match, local profile progression and a Windows packaging workflow. It is not an online multiplayer release.

## Phase 1 — combat foundation (in progress)

Implemented in the current development branch:
- Six weapon definitions and independent magazine/reserve state.
- Weapon-specific cadence, semi-automatic trigger gating and reload timing.
- Movement/aim/crouch spread, ADS field-of-view easing and basic recoil/sway.
- Acceleration/deceleration, sprint stamina and revised movement speeds.
- Enemy line-of-sight checks, last-known-position tracking and tactical state selection.
- Grid A* navigation around map cover for bot movement.
- Synthesized prototype firing, reload, impact, footstep and enemy-fire audio.
- Unit tests for weapon state, firing, reload, AI decisions, accuracy and pathfinding.

Acceptance criteria before closing Phase 1:
- TypeScript typecheck and all unit tests pass in CI.
- Windows packaging and launch smoke tests pass.
- Manual playtest verifies each weapon, ADS, reload, movement, collision, AI line-of-sight and bot navigation.
- No HUD values or controls claim unsupported functionality.

## Phase 2 — original production art and presentation

Required work:
- Author original operator and weapon meshes in Blender or an equivalent DCC tool; export glTF 2.0 with documented scale, pivots and material naming.
- Create first-person weapon rigs and separate third-person operator rigs.
- Add skeletal animation: idle, walk, sprint, crouch, jump, reload, fire, aim, hit reaction and elimination.
- Build original PBR material sets (base color, normal, roughness/metallic and ambient occlusion) with LODs and texture budgets.
- Replace OUTPOST blockout geometry with modular authored environment assets, set dressing, terrain, decals and lighting.
- Replace synthesized placeholder effects with original recorded/designed weapon, movement, ambience and UI audio.
- Add animation blending, footstep surface events, muzzle flash, shell ejection, tracers and impact decals.

Acceptance criteria:
- No placeholder primitives remain for player-visible hero assets.
- GLB assets pass load/scale/material checks and performance budgets.
- Animation state transitions are validated in game.
- Audio has independent master, SFX and ambience controls.

## Phase 3 — content and game modes

Required work:
- Add original maps with distinct layouts and cover/navigation data.
- Implement Free-for-All, Team Deathmatch and objective modes (e.g. Domination) with explicit rules, spawn logic, scoring and match lifecycle.
- Expand operators with meaningful, balanced gameplay roles; cosmetic-only variants must be identified as cosmetic.
- Add weapon attachments only when they affect real weapon statistics and are represented in the simulation.
- Add bot difficulty levels, squad roles, communication cues and objective awareness.

Acceptance criteria:
- Every mode can be started, completed, scored and replayed.
- Spawn selection avoids immediate line-of-sight kills and invalid geometry.
- Weapon and operator balance has repeatable test scenarios.

## Phase 4 — online services and competitive integrity

Required work:
- Separate dedicated authoritative game server from the Electron client.
- Design versioned network messages, reconnect handling, latency compensation and server-side hit validation.
- Implement account registration/login, session security and account recovery.
- Add matchmaking, parties, server browser/region selection and match results.
- Store progression, inventory and currency in a server-controlled database.
- Implement transaction-safe rewards, inventory changes, moderation tools, rate limits and audit logs.
- Add anti-cheat telemetry and server-side validation; never trust client-reported kills, currency or inventory.

Acceptance criteria:
- Two or more real clients can join the same authoritative match.
- Disconnect/reconnect and server restart scenarios are tested.
- Client tampering cannot grant currency, inventory, rank or match wins.
- Load, latency and abuse testing meet published target limits.

## Phase 5 — release, updates and operations

Required work:
- Signed Windows installers and verified update metadata.
- Staged releases, rollback strategy and update failure recovery.
- Crash reporting with privacy controls, telemetry opt-in and support diagnostics.
- Automated Windows test matrix, performance benchmarks and security scans.
- Content patch manifests and integrity verification for large asset updates.

Acceptance criteria:
- Clean install, upgrade, rollback and uninstall pass on supported Windows versions.
- Updates preserve user settings and recover safely after interruption.
- Every public build has a tested artifact, release notes and checksums.

## Engineering rules

1. Do not show a control unless it performs the advertised action.
2. Do not simulate online players, matchmaking, server status or competitive rankings.
3. Keep local prototype progression clearly labelled as local and non-authoritative.
4. Add unit tests for deterministic game rules and integration tests for network/persistence boundaries.
5. Keep gameplay simulation separate from rendering and UI wherever practical.
6. Do not merge a milestone while required CI checks are failing or pending.
7. Track known limitations in release notes; do not call a prototype production-ready.
