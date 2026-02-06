# Qt Desktop Wrapper

This folder contains the Qt 6 desktop shell that runs the offline UI locally.

## Build Steps

1. Build the web UI:
   - `npm install`
   - `npm run build`
2. Copy the Vite output into the Qt runtime folder:
   - Create `qt/web/`
   - Copy the contents of `dist/` into `qt/web/`
3. Build the Qt app:
   - Configure with CMake and Qt 6 (Core, Widgets, WebEngineWidgets).
   - Build the `CryptoMinerOptimizer` target.

The Qt app loads `qt/web/index.html` via `file://` and blocks external network requests to keep the
application fully offline while preserving the existing UI.
