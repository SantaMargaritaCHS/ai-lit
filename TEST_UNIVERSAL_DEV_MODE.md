# Universal Developer Mode Test Guide

## How to Test the Universal Developer Mode

### 1. Activation
- Open the app in the browser (http://localhost:5001)
- Press **Ctrl+Alt+D** (Windows/Linux) or **Cmd+Alt+D** (Mac)
- Enter the secret key: **752465Ledezma**
- The developer panel should appear

### 2. Features to Test

#### Global Navigation
- **Left/Right Arrow Keys**: Navigate between activities at the most granular level
- The panel shows current activity and progress

#### Activity List
- View all registered activities across all modules
- Click on any activity to jump directly to it
- Activities show completion status

#### Quick Actions
- **Auto-Complete Current**: Completes the current activity
- **Skip to End**: Jumps to the last activity
- **Reset Progress**: Resets all progress

#### Collapsible Panel
- Click the minimize button to collapse the panel
- Panel stays accessible but doesn't block content

### 3. Test with IntroToGenAIModule

1. Navigate to "Introduction to Generative AI" module
2. Activate dev mode (Ctrl+Alt+D, enter: 752465Ledezma)
3. The dev panel should show all activities:
   - Module Introduction
   - Traditional vs Generative AI Sorting
   - Video: What is Generative AI?
   - Reflection: Using Generative AI
   - Comprehension Check
   - Video: Popular Generative AI Tools
   - AI Playground Activity
   - Explore AI Tools
   - Video: Benefits and Limitations
   - Exit Ticket
   - Module Certificate

4. Test navigation:
   - Use arrow keys to move between activities
   - Click on activities to jump directly
   - Use Auto-Complete to finish activities
   - Reset and try again

### Success Criteria
✅ Dev mode activates with correct secret key
✅ Panel shows all module activities
✅ Arrow key navigation works
✅ Direct activity jumping works
✅ Auto-complete functionality works
✅ Panel can be collapsed/expanded
✅ Progress tracking is accurate