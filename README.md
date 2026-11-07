# BREACH — Tactical First-Person Shooter

**BREACH** is an original Windows desktop FPS built with Electron, React, TypeScript and Three.js. It is designed around the supplied BREACH identity and visual references while using original names, map layout, interface styling and procedural game assets.

## Current playable build

The current development milestone is a **single-player offline bot match** on the original OUTPOST environment.

Implemented in this branch:
- First-person 3D camera and pointer-lock mouse aiming.
- WASD movement, sprint, crouch, jump and basic collision against map cover.
- Two playable primary weapons: VKR-7 automatic rifle and KX-9 battle rifle.
- Magazine and reserve ammunition, reload, weapon switching and hitscan damage.
- Eight moving AI opponents with simple pursuit, attack, elimination and respawn behavior.
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

The current 3D map, operators, weapons and bots use original procedural geometry and materials. They are functional gameplay representations, not production-grade scanned or artist-authored character/weapon assets. The two graphics preferences currently affect renderer antialiasing/pixel ratio, field of view and mouse sensitivity; additional graphics controls will be added only when they affect the game.

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

1. Improve core FPS feel, AI behavior, collision and map quality.
2. Add original animation, audio and more weapon families.
3. Add secure persistent accounts and backend progression.
4. Implement authoritative dedicated multiplayer and matchmaking.
5. Expand maps, modes, cosmetics and content delivery.
6. Profile and optimize performance on declared target hardware.

Do not describe a feature as complete unless it has a working implementation and a passing verification test.
