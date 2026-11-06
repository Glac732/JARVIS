# J.A.R.V.I.S. — Windows Desktop Assistant

Created by **SHREYAS**.

This repository contains the Electron + React + TypeScript desktop application. The Windows release workflow builds:
- `JARVIS-Setup-x64.exe` (NSIS installer)
- `JARVIS-Portable-x64.exe` (portable executable)

## Build on Windows
GitHub Actions workflow: `.github/workflows/windows-release.yml`.

The release pipeline installs dependencies, runs typechecking and tests, packages x64 binaries, verifies output files and publishes CI artifacts. A successful source commit does not itself mean the release has passed; inspect the workflow run and downloaded artifacts.

## Development
Requires Node.js 22 and npm. Run:
```powershell
npm install
npm run typecheck
npm test
npm run build
```

## Security
Provider credentials must be stored in the operating-system credential store. Model output must never be executed as arbitrary shell commands. OS tools require explicit allowlists and permission checks.

## Status
Initial repository bootstrap. Feature support and test status must be recorded from actual test execution.