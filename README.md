# J.A.R.V.I.S. — Windows Desktop Assistant

**Just A Rather Very Intelligent System**  
Created by **SHREYAS**.

JARVIS is an Electron + React + TypeScript Windows desktop assistant. The primary release targets are:

- `JARVIS-Setup-x64.exe` — NSIS installer.
- `JARVIS-Portable-x64.exe` — portable executable.

## Windows build workflow
GitHub Actions workflow: [Windows x64](.github/workflows/windows-release.yml).

The workflow runs on pushes to `main`, pull requests, version tags and manual dispatch. It installs dependencies, typechecks all projects, runs Vitest, generates the application icon, builds the x64 NSIS and portable packages, verifies PE architecture and SHA-256 hashes, then performs install/start/uninstall smoke tests.

## Local development
Requires Node.js 22 and npm:

```powershell
npm install
npm run typecheck
npm test
npm run dev
```

Build Windows release artifacts from a Windows x64 environment:

```powershell
./scripts/generate-icon.ps1
npm run dist:all
```

Artifacts are written to `release/`.

## Provider setup
Configure a provider and model in Settings. OpenAI-compatible, Anthropic and Ollama adapters are included in the source. Hosted providers require the user's API credential. Ollama requires a running local service. Credentials are stored using Electron safeStorage when the OS reports encryption available.

Brave web search is optional and requires a Brave Search API key.

## Permissions and privacy
Windows application launching is disabled by default and restricted to a predefined allowlist. Website URLs are validated before opening. Conversation history is stored locally only when enabled. No telemetry is configured.

## Known limitations
See [Feature Matrix](docs/FEATURE-MATRIX.md). Browser automation, full computer-use automation, document extraction, image generation, wake-word detection, OAuth integrations and automatic updates are not implemented in this version.

## Release integrity
See [Test Report](docs/TEST-REPORT.md). A workflow being present does not imply that a build has passed. Executables must be downloaded from a successful CI run or tagged release and verified by their hashes.
