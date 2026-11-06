# JARVIS CI test report — successful Windows build

Successful GitHub Actions run: [#35](https://github.com/Glac732/JARVIS/actions/runs/42204967977)  
Commit: `a638c07e94d9b29bfc5dc8beed7bb8d34f828945`  
Runner: `windows-latest`; Node 22.23.4; npm 10.9.9.

## Results

| Check | Result |
|---|---|
| Checkout and Node setup | PASS |
| npm dependency installation | PASS |
| TypeScript main, renderer and node configurations | PASS |
| Vitest | PASS — 10/10 |
| Windows icon generation | PASS |
| Vite renderer build | PASS |
| Electron main and preload bundle | PASS |
| NSIS and portable x64 package creation | PASS |
| Release filenames and PE headers | PASS |
| Packaged Electron application payload is x64 | PASS — PE machine 0x8664 |
| Portable executable startup | PASS — process alive after 10 seconds |
| Silent installation | PASS — installed JARVIS.exe found |
| Installed application startup | PASS — process alive after 10 seconds |
| Silent uninstallation | PASS — installed JARVIS.exe removed |

## Artifacts and integrity

GitHub Actions artifact: `JARVIS-Windows-x64`  
Artifact ID: `13495398671`  
Archive SHA-256: `5abba3eda46f328fbd9392a43e543a61c22bad7b01cde1007920e138ae35863e`

| File | Bytes | SHA-256 |
|---|---:|---|
| `JARVIS-Setup-x64.exe` | 85,503,340 | `B851E2FFC3B51DAD9772C71426E116D63305F582153C0AF7C885B58555111ADC` |
| `JARVIS-Portable-x64.exe` | 85,290,356 | `29C10EE06772A55443E33A5244694CCEB0375339D3F29B18A1779E3DCBE0BEA5` |

**PE launcher note:** The NSIS and portable wrapper stubs are PE32/i386 (0x014C); the unpacked Electron application `release/win-unpacked/JARVIS.exe` is PE32+/AMD64 (0x8664). The build uses x64 Electron, and the workflow checks the application payload—not the wrapper stub—for x64.

## Limits / not covered by these tests

- Unsigned build: no code-signing certificate has been configured.
- Provider API calls were not tested with a real user credential.
- Microphone and live speech interaction were not end-to-end tested.
- Browser automation, wake-word detection, full mouse/keyboard computer control, PDF/Office document extraction, image generation, OAuth integrations, editable semantic memory, notifications and automatic updates remain unimplemented.
- Smoke tests establish application process startup, install and uninstall, not full feature acceptance.

The first successful run's workflow report fallback contained a wrong generic message because of a report path mismatch. The PASS results above are taken from the Windows Actions job log. The path bug is being fixed in the subsequent repository commit.
