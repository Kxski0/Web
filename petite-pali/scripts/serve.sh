#!/usr/bin/env bash
# Startet den Produktionsserver neu und wartet, bis er antwortet.
# Ein zuvor laufender Server wird gezielt über /proc gefunden — ein pkill mit
# Musterabgleich träfe in dieser Umgebung auch die aufrufende Shell.
set -euo pipefail
PORT="${PORT:-3200}"

# Kurzlebige Prozesse verschwinden mitten im Durchlauf — daher die Existenz-
# prüfung, sonst rauscht jeder Lauf voll mit „No such file or directory“.
for pid in $(ls /proc 2>/dev/null | grep -E '^[0-9]+$'); do
  [ -r "/proc/$pid/cmdline" ] || continue
  cmd=$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null) || continue
  case "$cmd" in
    *next-server*) kill "$pid" 2>/dev/null || true ;;
  esac
done
sleep 1

PORT="$PORT" pnpm start > "${LOG:-/tmp/petite-pali-server.log}" 2>&1 &
for _ in $(seq 1 40); do
  if curl -sf -o /dev/null "http://localhost:$PORT/"; then echo "Server auf $PORT"; exit 0; fi
  sleep 1
done
echo "Server kam nicht hoch:"; tail -20 "${LOG:-/tmp/petite-pali-server.log}"; exit 1
