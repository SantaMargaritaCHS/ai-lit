#!/bin/bash

# Screenshot Watcher
# Monitors the screenshots directory and notifies when new files are added

SCREENSHOT_DIR="/home/runner/workspace/screenshots"
WATCH_FILE="/home/runner/workspace/.screenshot-latest"

echo "📸 Screenshot watcher started"
echo "   Watching: $SCREENSHOT_DIR"
echo "   Drop screenshots here and I'll automatically see them!"
echo ""

# Create directory if it doesn't exist
mkdir -p "$SCREENSHOT_DIR"

# Create initial watch file
touch "$WATCH_FILE"

# Function to process new screenshots
process_screenshot() {
  local file="$1"
  local filename=$(basename "$file")

  echo "🆕 New screenshot detected: $filename"
  echo "   Path: $file"
  echo "   Size: $(du -h "$file" | cut -f1)"
  echo "   Time: $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  echo "💡 You can now reference this file in your conversation with Claude:"
  echo "   \"Please look at screenshots/$filename\""
  echo ""

  # Update watch file with latest screenshot
  echo "$file" > "$WATCH_FILE"
}

# Initial check for existing files
for file in "$SCREENSHOT_DIR"/*.{png,jpg,jpeg,PNG,JPG,JPEG} 2>/dev/null; do
  if [ -f "$file" ]; then
    echo "📋 Existing: $(basename "$file")"
  fi
done

echo ""
echo "✅ Ready! Save screenshots to: $SCREENSHOT_DIR"
echo "   Supported formats: PNG, JPG, JPEG"
echo ""

# Watch for new files using inotifywait if available
if command -v inotifywait &> /dev/null; then
  inotifywait -m -e create -e moved_to --format '%w%f' "$SCREENSHOT_DIR" | while read file; do
    if [[ "$file" =~ \.(png|jpg|jpeg|PNG|JPG|JPEG)$ ]]; then
      process_screenshot "$file"
    fi
  done
else
  # Fallback: poll every 2 seconds
  echo "⚠️  inotifywait not available, using polling mode (checks every 2s)"
  last_check=$(date +%s)

  while true; do
    sleep 2
    for file in "$SCREENSHOT_DIR"/*.{png,jpg,jpeg,PNG,JPG,JPEG} 2>/dev/null; do
      if [ -f "$file" ]; then
        file_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file")
        if [ "$file_time" -gt "$last_check" ]; then
          process_screenshot "$file"
        fi
      fi
    done
    last_check=$(date +%s)
  done
fi
