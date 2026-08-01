---
name: mobile-dev-bun
description: Guidelines for running local servers with Bun/bunx, previewing websites on Android/mobile devices over local Wi-Fi/USB, generating QR codes, and using tunnels.
---

# Mobile Testing & Bun Utility Skill

This skill documents how to manage local servers, generate QR codes, and preview web applications on mobile devices (Android/iOS) using `bun` and `bunx`.

## 1. Package Management & Utilities with Bun
- Prefer `bun` and `bunx` over `npm` / `npx` for speed and consistency across commands.
- Run CLI tools with `bunx`:
  ```bash
  bunx <tool-name>
  ```

## 2. One-Command USB Auto-Launch (Android)
To automatically reverse port forwarding and launch Chrome on your Android phone screen:
```bash
bun run mobile
```
or run:
```bash
./mobile.sh
```

## 3. Serving Projects Locally for Mobile Testing
To preview static web applications on Android or other mobile devices:

- **Option A: Python HTTP Server (Bound to all interfaces)**
  ```bash
  python3 -m http.server 8080 --bind 0.0.0.0
  ```

- **Option B: Bun Serve**
  ```bash
  bunx serve . -p 8080
  ```

## 4. Connecting from Mobile (Same Wi-Fi)
1. Find your computer's local IP address:
   ```bash
   ip addr show | grep 'inet '
   ```
2. Open the URL in your mobile browser:
   `http://<YOUR_LOCAL_IP>:8080` (e.g. `http://192.168.1.4:8080`)

## 5. Generating Terminal QR Codes
Generate a quick QR code in the terminal so mobile devices can scan and open the URL immediately:
```bash
bunx qrcode-terminal "http://<YOUR_LOCAL_IP>:8080" small
```

## 6. Mobile Tunnels (Public Remote Testing)
If the mobile device is on mobile data or a different network:
```bash
bunx localtunnel --port 8080
```
or:
```bash
bunx cloudflared tunnel --url http://localhost:8080
```

## 7. Mobile Layout Best Practices
- Use Flexbox (`display: flex; flex-direction: column;`) for touch layouts.
- Use `word-break: break-word` and `overflow-wrap: break-word` on text containers.
- Avoid rigid `white-space: nowrap` on flex buttons for narrow viewports.
