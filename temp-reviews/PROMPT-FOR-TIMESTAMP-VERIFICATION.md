# 🎬 Prompt for AI Video Timestamp Verification

Copy and paste this entire prompt to another AI assistant (Claude, ChatGPT, etc.) that can analyze videos:

---

## PROMPT START

I need you to verify and correct video timestamps for an educational module. I'll provide 3 video URLs and 7 segments that need precise start/end timestamps.

**Your task:** Watch each video segment and provide corrected timestamps where the content ACTUALLY starts and ends (no irrelevant intro/outro).

---

### Video 1: Unlocking_the_AI_Black_Box.mp4

**URL:**
```
https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FIntro%20to%20LLMS%2FUnlocking_the_AI_Black_Box.mp4?alt=media
```

#### Segment 1: "Magic Trick" Hook
- **Current timestamps:** Start: 0:15 | End: 0:37
- **Expected content:** Hook about AI feeling like magic, opening that engages students, "What's really happening under the hood?"
- **Verify:** Does it start cleanly? Does it end without trailing content?

#### Segment 2: Prediction Core Function
- **Current timestamps:** Start: 1:33 | End: 2:46
- **Expected content:** Must include these phrases:
  - "Its main, its core, its only function is to predict what word should come next"
  - "Super advanced pattern matcher"
  - "Auto-complete on a cosmic scale"
  - "It's pure statistics"
- **Verify:** Captures full explanation of prediction, no irrelevant content before/after

#### Segment 3: Pattern-Finding Web
- **Current timestamps:** Start: 3:57 | End: 4:14
- **Expected content:**
  - Neural network as "pattern-finding web"
  - "Very loosely inspired by our own [brains]"
  - Designed to find patterns, not think
- **Verify:** This is a SHORT segment (17 seconds) - make sure it's complete but not too long

#### Segment 4: Big Takeaway - You're in Control
- **Current timestamps:** Start: 5:20 | End: 6:14
- **Expected content - Must include ALL 4 takeaways:**
  1. LLMs are predictors, not thinkers
  2. Knowledge only as reliable as training data
  3. Answers are statistically likely, not factually true
  4. You're always responsible for checking its work
  - Plus: "You're the one in control" message
  - Plus: Tool metaphor language
- **Verify:** All 4 points included, control message clear, no cut-offs

---

### Video 2: 3Understanding LLM Models.mp4

**URL:**
```
https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FIntro%20to%20LLMS%2F3Understanding%20LLM%20Models.mp4?alt=media
```

#### Segment 1: Training Loop Visual
- **Current timestamps:** Start: 3:02 | End: 3:44
- **Expected content:**
  - Visual demonstration: predict → compare → adjust
  - "Matt" example with 0.7 probability
  - Error calculation and weight adjustment
- **Verify:** Complete training loop cycle, Matt example included, adjustment process shown

---

### Video 3: How Chatbots and LLMS.mp4

**URL:**
```
https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2FStudent%20Videos%2FIntro%20to%20LLMS%2FHow%20Chatbots%20and%20LLMS.mp4?alt=media
```

#### Segment 1: Shakespeare Analogy
- **Current timestamps:** Start: 1:44 | End: 3:11
- **Expected content:**
  - Shakespeare letter-by-letter prediction example
  - Why context matters
  - Probability tables
  - Why single-letter prediction fails
- **Verify:** Complete Shakespeare example, shows limitations, sets up need for neural networks

#### Segment 2: Data & Tokens
- **Current timestamps:** Start: 4:59 | End: 5:35
- **Expected content:**
  - Training on internet data (not just Shakespeare)
  - Introduction to tokens vs. letters
  - Token definition
  - Why tokens are better than letters
- **Verify:** Explains transition from letters to tokens, clear definition, complete explanation

---

## Output Format

For EACH segment, provide:

```
Video: [Name]
Segment: [Name]
Status: [✅ CORRECT | ⚠️ NEEDS ADJUSTMENT]

Current: Start MM:SS | End MM:SS
Corrected: Start MM:SS | End MM:SS

Issues Found:
- [Describe what was wrong - started too early/late, ended too early/late, etc.]

Key Content Verification:
- [✅ or ❌] All required phrases/concepts included
- [✅ or ❌] No irrelevant intro content
- [✅ or ❌] No trailing/cut-off content
- [✅ or ❌] Natural start/end points (not mid-sentence)
```

---

## Important Guidelines:

1. **Precision:** Provide timestamps in MM:SS format (e.g., 1:33 not 1:30)
2. **Natural boundaries:** Start/end at sentence boundaries, not mid-word
3. **No dead air:** Avoid long pauses at start or end
4. **Content complete:** All key phrases must be included
5. **Clean transitions:** Consider how it flows to next activity

---

## Summary Table (Fill in corrected times)

| Segment | Current Start | Current End | Corrected Start | Corrected End | Adjustment Needed? |
|---------|---------------|-------------|-----------------|---------------|-------------------|
| Magic Hook | 0:15 | 0:37 | _____ | _____ | YES/NO |
| Prediction Core | 1:33 | 2:46 | _____ | _____ | YES/NO |
| Shakespeare | 1:44 | 3:11 | _____ | _____ | YES/NO |
| Pattern Web | 3:57 | 4:14 | _____ | _____ | YES/NO |
| Training Loop | 3:02 | 3:44 | _____ | _____ | YES/NO |
| Data & Tokens | 4:59 | 5:35 | _____ | _____ | YES/NO |
| Big Takeaway | 5:20 | 6:14 | _____ | _____ | YES/NO |

---

**Please analyze all 7 segments and provide detailed corrections. Thank you!**

## PROMPT END
