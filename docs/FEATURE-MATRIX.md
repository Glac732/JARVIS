# JARVIS Feature Support Matrix

Status reflects the code currently committed to this repository. No provider, Windows device, or third-party account has been connected or tested by this document.

| Capability | Current status | Notes |
|---|---|---|
| Electron desktop shell | Implemented in source; Windows build unverified | Electron main/preload/renderer separated |
| OpenAI-compatible chat | Implemented; provider-dependent | API key required |
| Anthropic messages API | Implemented in main process | Vision content path not fully implemented for Anthropic |
| Gemini | Provider-dependent | OpenAI-compatible Gemini endpoint |
| Ollama | Provider-dependent | Local server must be running |
| Secure credential storage | Implemented with Electron safeStorage | Availability depends on OS |
| Conversation persistence | Implemented | Local JSON file; opt-out deletes history |
| Speech output | Implemented using system speech synthesis | OS/browser voice availability varies |
| Speech recognition | Implemented using Web Speech API when available | Engine support / permission dependent |
| App launching | Implemented for an allowlisted set on Windows | Requires explicit opt-in; discovery currently limited to PATH |
| Website opening | Implemented | URL normalization and shell.openExternal |
| User folders | Implemented | Downloads/Documents/Desktop only |
| Image input | Partially implemented | OpenAI-compatible vision content supported |
| Document extraction | Not implemented | PDF/DOCX/XLSX/PPTX are not parsed |
| Web research | Implemented with Brave Search | Requires API key; sources returned, no multi-source synthesis engine |
| Browser automation | Not implemented | No extension/native messaging integration |
| Wake phrase | Not implemented | No always-on listener |
| Computer-use mouse/keyboard | Not implemented | No arbitrary desktop interaction |
| Image generation | Not implemented | No generation adapter |
| Persistent editable memory | Not implemented | Conversation history only |
| OAuth productivity integrations | Not implemented | No calendar/email/drive OAuth |
| Native notifications | Not implemented | No notification workflow |
| Automatic updater | Implemented in packaged builds | Checks GitHub Releases at startup and every 6 hours; downloads in background and prompts to restart. Windows binaries remain unsigned until a signing certificate is configured |
| Code signing | Not configured | Public release would be unsigned unless certificate configured |
| Portable data directory | Implemented in source | Uses PORTABLE_EXECUTABLE_DIR when set |

