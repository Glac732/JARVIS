# BREACH — Tactical First-Person Shooter

**BREACH** is an original Windows desktop FPS built with Electron, React, TypeScript and Three.js. It is designed around the supplied BREACH identity and visual references while using original names, map layout, interface styling and procedural game assets.

## Current playable build

The current development milestone is a **single-player offline bot match** on the original OUTPOST environment. Gameplay is being hardened in small, testable phases before online services are introduced.

Implemented in this branch:
- First-person 3D camera and pointer-lock mouse aiming.
- WASD movement, sprint, crouch, jump and basic collision against map cover.
- Six selectable weapons across assault, battle rifle, shotgun, marksman rifle and sidearm classes: VKR-7, KX-9, M4A1, S12, DMR-11 and P9.
- Independent magazine/reserve ammunition, weapon-specific fire cadence, semi-automatic trigger gating, reload timing and movement/aim accuracy penalties.
- Right-mouse aim-down-sights with eased field-of-view transition, recoil and weapon sway.
- Magazine and reserve ammunition, reload, weapon switching and hitscan damage.
- Eight AI opponents with line-of-sight checks, last-known-player tracking, pressure-aware retreat, cover seeking, flanking, advancing and regrouping decisions.
- Synthesized combat sound effects for firing, reloads, impacts, footsteps and enemy shots. These are functional prototype effects, not final recorded audio assets.
- Player health, regeneration, respawn, match timer, elimination counter and match completion.
- Local profile persistence for XP, levels, credits, matches, wins, kills and deaths.
- Operator selection, loadout selection, mission progress display, armory information and settings.
- Graphics preset, field-of-view and mouse-sensitivity preferences.
- BREACH application name, icon generation, installer and portable Windows x64 packaging.
- GitHub Actions build, typecheck, tests, PE checks and Windows installer smoke tests.

## Controls

| Input | Action |
|---|---|
| W A S D | Move |
| Mouse | Aim |
| Left mouse | Fire |
| Shift | Sprint |
| Ctrl | Crouch |
| Space | Jump |
| R | Reload |
| 1 / 2 | Switch primary weapon |
| Esc | Pause / release mouse |

Click the game view to capture the mouse. Use the pause menu to resume or return to base.

## Honest feature status

This is an early playable vertical slice, not a finished AAA game. Online multiplayer, accounts, authoritative backend, matchmaking, voice chat, ranked play, global leaderboards, server-validated economy, store transactions, crates, seasons, anti-cheat, advanced animation, licensed 3D assets, full sound design, mobile controls and content patch delivery are **not implemented**. The UI does not invent online users or rankings. Profile and progression data are local to the current Windows installation and can be modified by a local user; they are not secure competitive progression.

The current 3D map, operators, weapons and bots still use original procedural geometry and materials. They are functional gameplay representations, not production-grade artist-authored character/weapon assets. Replacing these with polished original character, weapon and environment models remains a major art-production milestone. The two graphics preferences currently affect renderer antialiasing/pixel ratio, field of view and mouse sensitivity; additional graphics controls will be added only when they affect the game.

## Build on Windows

Requires Node.js 22 and npm.

```powershell
npm install
npm run typecheck
npm test
npm run dev
```

Build Windows x64 installer and portable package:

```powershell
./scripts/generate-icon.ps1
npm run dist:all
```

Artifacts are written to `release/`.

## CI and release

GitHub Actions workflow: [BREACH Windows x64](.github/workflows/windows-release.yml).

The workflow runs typechecking, Vitest, icon generation, packaging, PE architecture checks and Windows install/launch/uninstall smoke tests. A version tag such as `v0.1.0` publishes the installer and updater metadata to a GitHub Release after the build and smoke-test steps succeed. Installed builds use electron-updater to check the GitHub Releases feed. Updates to the executable still require a new signed/unsigned installer package; content-only patch bundles are not yet implemented.

## Reference direction

The supplied screenshots inform the tactical FPS HUD, match readability, operator/loadout presentation and battlefield atmosphere. BREACH does not reuse Call of Duty, Battlefield, Counter-Strike or other games' logos, maps, characters, models or proprietary assets.

## Project priorities

1. Continue hardening movement, collision, hit registration, enemy perception, tactical cover use and combat balance with regression tests.
2. Replace blockout/procedural geometry with authored original character, weapon, animation and environment assets; complete the sound pipeline.
3. Add further maps, modes, operators, weapon attachments and loadout persistence.
4. Build secure backend accounts, server-authoritative progression and inventory/economy APIs.
5. Implement authoritative dedicated multiplayer, matchmaking, parties and moderation/anti-cheat foundations.
6. Add patch delivery, performance profiling, accessibility and release hardening on declared target hardware.

Do not describe a feature as complete unless it has a working implementation and a passing verification test.
