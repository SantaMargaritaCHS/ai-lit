# Screenshot Upload Workflow

The user wants to easily share screenshots with you. They can:

1. **Take a screenshot** normally on their system
2. **Save it to**: `/home/runner/workspace/screenshots/`
3. The file will be **automatically detected and displayed**

To set this up:

1. Create the screenshots directory if it doesn't exist
2. Create a watcher script that monitors for new images
3. Automatically read and display any new screenshots
4. Provide context about what you see in the screenshot

**For the user:**
- Save screenshots to: `/home/runner/workspace/screenshots/`
- Any PNG, JPG, or JPEG files will be automatically detected
- You can name them descriptively (e.g., `console-error.png`, `devtools-network.png`)

**Implementation:**
Create a file watcher that:
- Watches `/home/runner/workspace/screenshots/`
- Uses `inotifywait` or Node.js `fs.watch()`
- Automatically reads new files with the Read tool
- Displays them to the user
