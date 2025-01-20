# ollama on Mac mini

made with

- ollama
- macOS launchctl
- cloudflare tunnel

## Setup macOS

```sh
sudo vim /Library/LaunchDaemons/com.ollama.server.plist

sudo chown root:wheel /Library/LaunchDaemons/com.ollama.server.plist
sudo chmod 644 /Library/LaunchDaemons/com.ollama.server.plist

sudo launchctl load -w /Library/LaunchDaemons/com.ollama.server.plist
sudo launchctl start com.ollama.server
```

```sh
lsof -i :11434
```

## Setup Public URL

```sh
brew install cloudflared

cloudflared tunnel login
cloudflared tunnel create mac-mini

vim ~/.cloudflared/config.yml

cloudflared tunnel run mac-mini
```

open http://<your public url>

## troubleshooting

1. 403 Forbidden

set `OLLAMA_HOST` in /Library/LaunchDaemons/com.ollama.server.plist

2. Failed to launchctl start com.ollama.server

set `HOME` in /Library/LaunchDaemons/com.ollama.server.plist

refs: https://github.com/ollama/ollama/issues?q=is:issue%20%20%20$HOME%20is%20not%20defined%20
