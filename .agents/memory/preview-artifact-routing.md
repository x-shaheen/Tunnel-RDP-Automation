---
name: Preview artifact routing
description: Register a root web artifact when a project has a runnable app but no previewable web artifact.
---

A running local port does not by itself create a Replit preview. The app must also be registered as a web artifact with a unique preview path and an active managed service; only one workflow should own the assigned preview port.

**Why:** A workspace can have a healthy legacy workflow and still show “no previewable artifacts” when the artifact registry has no web entry, while duplicate workflows can race for the same port.

**How to apply:** Register or update the web artifact, route its service to the actual app command, stop duplicate port owners, restart the managed artifact workflow, and verify both its HTTP response and rendered preview.