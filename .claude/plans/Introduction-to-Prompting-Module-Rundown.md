# Introduction to Prompting Module - Complete Rundown

**Route:** `/module/introduction-to-prompting`
**Module ID:** `introduction-to-prompting`
**Main File:** `client/src/components/modules/IntroductionToPromptingModule.tsx` (~1328 lines)
**Sub-Components:** 10 extracted components in `IntroductionToPromptingModule/`
**Video:** Single video file split into 4 clips: `Videos/Student Videos/Introduction to Prompting/How_Prompting_Actually_Works.mp4` (~7:19 total)

**Tagline:** "Master the art of communicating with AI"

---

## Module Structure Overview (21 Segments)

| # | Segment Title | Type | Component |
|---|---|---|---|
| 0 | Welcome | intro | Inline |
| 1 | Say What You See | interactive | `SayWhatYouSeeActivity.tsx` |
| 2 | Video: The Prediction Machine | video | Clip 1 (00:00-02:33) |
| 3 | What Is a Prompt? | transition | Inline |
| 4 | Rate the Prompts | interactive | `PromptRaterActivity.tsx` |
| 5 | Prompting Principles | interactive | Inline (card flip) |
| 6 | Video: The Funnel of Control | video | Clip 2 (02:34-04:09) |
| 7 | Meet the RTFC Framework | interactive | `PromptFunnelVisualization.tsx` |
| 8 | Role: Your AI Expert | interactive | Inline (matching game) |
| 9 | Task: What You Want | interactive | Inline (fix-the-vague-task) |
| 10 | Format: How You Want It | interactive | `FormatActivity.tsx` |
| 11 | Context: Background Info | interactive | Inline (comparison) |
| 12 | Build Your RTFC Prompt | interactive | `RTFOutputBuilder.tsx` |
| 13 | Video: Level Up Your Prompts | video | Clip 3 (04:10-05:39) |
| 14 | Think Out Loud | interactive | `ThinkOutLoudActivity.tsx` |
| 15 | Teach By Example | interactive | `TeachByExampleActivity.tsx` |
| 16 | Can AI Admit It? | interactive | `CanAIAdmitItActivity.tsx` |
| 17 | Prompt Layer Cake | interactive | `PromptLayerCakeActivity.tsx` |
| 18 | Video: The Golden Rule | video | Clip 4 (05:40-07:19) |
| 19 | Exit Ticket | exit-ticket | Inline |
| 20 | Certificate | certificate | `<Certificate />` |

---

## Pedagogical Flow & Rationale

The module follows a **spiral learning** approach: introduce a concept casually, reinforce with video, deepen with interaction, then synthesize. It moves from "what is a prompt?" through the RTFC framework, then to advanced techniques, then to a capstone application.

**Arc:** Hook (observation) -> Theory (video) -> Guided Practice (RTFC) -> Advanced Techniques -> Synthesis (Layer Cake) -> Assessment (Exit Ticket)

---

## Segment-by-Segment Deep Dive

---

### Segment 0: Welcome
**Type:** Intro screen
**Purpose:** Hook the student with a relatable analogy and set expectations.

**Opening Analogy:**
> "Ever ordered food at a restaurant? The more specific you are -- 'no onions, extra cheese, well done' -- the more likely you get exactly what you want. Talking to AI works the same way."

**Learning Objectives Listed (4 bullet points):**
1. What a prompt is and why it matters
2. Key principles for writing effective prompts
3. The RTFC Framework: Role, Task, Format, Context
4. How to build prompts that get you exactly what you need

**CTA Button:** "Let's Get Started"

**Why it leads to Segment 1:** The restaurant analogy primes students to think about *specificity* and *description*. The next activity (Say What You See) immediately tests their ability to be specific and descriptive -- but about an image, not an AI prompt. This creates a bridge from everyday observation skills to prompting skills.

---

### Segment 1: Say What You See
**Type:** Interactive activity
**Component:** `SayWhatYouSeeActivity.tsx` (~1000+ lines, the largest sub-component)
**Purpose:** Teach students that *being specific and detailed in descriptions matters* -- the foundational skill of prompting.

**How it Works:**
- Students are shown an AI-generated image and asked to describe what they see in a free-text box.
- Their description is evaluated against a checklist of scene elements (using keyword matching or Gemini AI if available).
- They get structured feedback on what they caught and what they missed.

**Two Rounds (Two Images):**

**Round 1 - Sunset Landscape:**
- Image: `/images/say-what-you-see/sunset-landscape.png`
- The original AI prompt that generated it: *"Create an image of a vibrant sunset over mountains with a calm reflective lake in the foreground. The sky has a gradient from deep purple at top through pink to orange near the horizon. A glowing sun near the horizon. Two mountain ranges - distant peaks and closer silhouettes. Two wispy clouds. The lake reflects sky colors. Photorealistic, no text."*
- **7 Elements to identify:**
  1. **Sky Gradient** - gradient transitioning from warm orange at horizon through pink to deep purple at top
  2. **Glowing Sun** - yellow-orange sun sitting near the horizon
  3. **Distant Mountains** - lighter mountain range in the background with multiple peaks
  4. **Foreground Mountains** - closer, darker mountain silhouettes
  5. **Reflective Lake** - calm lake reflecting the sky colors and mountains
  6. **Wispy Clouds** - thin wispy cloud streaks across the sky
  7. **Mirror Reflection** - the lake creates a near-perfect mirror reflection

**Round 2 - Night Cityscape:**
- Image: `/images/say-what-you-see/night-cityscape.png`
- The original AI prompt: *"Create an image of a nighttime cityscape. Several buildings of different heights against a dark blue night sky. Crescent moon and twinkling stars. Tallest building has an antenna with red light. Buildings have glowing windows. Grey street with dashed white road markings. A street lamp emitting warm glow. Photorealistic, no text."*
- **7 Elements to identify:**
  1. **3D / Animated Style** - clearly a 3D render or video-game style, not a photograph
  2. **Night Sky** - dark blue gradient night sky
  3. **Crescent Moon** - white crescent moon in upper sky
  4. **Stars** - several small twinkling stars
  5. **City Buildings** - multiple tall buildings with glowing windows
  6. **Street/Road** - street with road markings at the base
  7. **Street Lamp** - lamp casting warm yellow glow

**Scoring System:**
- **Match threshold:** 65% of elements (about 5 of 7)
- **Score tiers:** 85%+ = 5/5, 65%+ = 4/5, 50%+ = 3/5, 30%+ = 2/5, below = 1/5
- **Minimum characters:** 30
- **Max attempts per round:** 3 (escape hatch after 3 failed attempts below threshold)

**Feedback Structure (per attempt):**
- "What You Caught" - shows matched elements with the student's exact phrase highlighted
- "Technique Coaching" - attempt 1: "Describe background, middle, and foreground separately." / attempt 2+: "Say WHERE things are, not just what they are."
- "Where to Look" - progressive hints for missed elements (vague spatial hint on attempt 1, more specific hint on attempt 2+)

**The Reveal:**
After passing or using the escape hatch, students see the *actual AI prompt* that generated the image, with each element highlighted/color-coded against what they caught. This is the "aha moment": the prompt that created this image is basically a very detailed description -- exactly what they just practiced writing.

**Steps within the activity:**
1. `intro` - Explanation: "You'll see an AI-generated image. Your job: describe everything you see in as much detail as possible."
2. `round1` - Sunset image + text input
3. `feedback1` - Scoring + reveal of the original prompt
4. `round2` - Cityscape image + text input
5. `feedback2` - Scoring + reveal of the original prompt
6. `summary` - "What did you learn?" recap with key takeaway

**Key Takeaway Text:** Shows the original prompts and connects the idea that detailed descriptions = detailed prompts.

**Why it leads to Segment 2:** Students now understand that *being specific matters*. The video explains *why* from a technical perspective -- how AI is a prediction machine that relies on your words as its input signal.

---

### Segment 2: Video - The Prediction Machine
**Type:** Video clip
**Timestamp:** 00:00 - 02:33 (153 seconds)
**Video ID:** `introduction-to-prompting-clip1`

**Description shown to students:**
> "Before we dive into prompts, watch this short clip about how AI actually processes your words -- it's not magic, it's prediction."

**Purpose:** Ground the practical observation from Segment 1 in theory. AI isn't "understanding" you -- it's predicting the most likely next words based on your input. This explains *why* specific prompts work better: they narrow the prediction space.

**Why it leads to Segment 3:** The video introduces the concept that your words are the AI's only input. Segment 3 formally defines what a "prompt" is with concrete examples.

---

### Segment 3: What Is a Prompt?
**Type:** Transition/Teaching screen (animated)
**Purpose:** Formally define "prompt" and show the contrast between vague and specific ones.

**Definition:**
> A **prompt** is any instruction or question you give to an AI. It's how you communicate what you want.

**Two Examples Side by Side:**

**Vague Prompt (red box, AlertCircle icon):**
- Prompt: `"Help me with my homework"`
- Explanation: "The AI doesn't know what subject, what assignment, what grade level, or what kind of help you need. You'll get a generic, unhelpful response."

**Specific Prompt (green box, CheckCircle icon):**
- Prompt: `"I'm a 10th grader studying for my biology test on cell division. Create 10 flashcards with key terms and simple definitions."`
- Explanation: "Now the AI knows who you are, what you're studying, and exactly what you need. The response will be targeted and useful."

**Key Statement (purple box):**
> "The quality of your prompt directly determines the quality of the AI's response. Better prompts = better results."

**Why it leads to Segment 4:** Students now know what a prompt is and have seen good vs. bad examples. Segment 4 lets them *practice* identifying prompt quality before learning the formal framework.

---

### Segment 4: Rate the Prompts
**Type:** Interactive activity
**Component:** `PromptRaterActivity.tsx` (~218 lines)
**Purpose:** Build intuition for what makes a prompt good or bad before introducing the RTFC framework.

**Mechanic:** Students see prompts one at a time and rate each as "Poor," "Okay," or "Excellent" using thumbs-down/dash/thumbs-up buttons. After rating, they see feedback explaining why.

**3 Prompts to Rate:**

**Prompt 1 (Correct answer: Poor):**
- `"Help me write something for school"`
- Explanation: "This prompt is way too vague. What subject? What type of writing? What grade level? The AI has no idea what you need."
- Why: "No subject, no assignment type, no context = useless response"

**Prompt 2 (Correct answer: Poor):**
- `"I need to study for a test"`
- Explanation: "Again, too vague. What subject? What topics? What kind of help do you want -- flashcards, a summary, practice questions? The AI can't read your mind."
- Why: "Missing: subject, topic, and what kind of study help"

**Prompt 3 (Correct answer: Excellent):**
- `"Act as a 10th-grade history tutor. Create a timeline of the 5 most important events leading to the American Revolution, with a one-sentence explanation for each event and a discussion question at the end."`
- Explanation: "This prompt nails it! It has a clear Role (history tutor), a specific Task (timeline of 5 events), a defined Format (one-sentence explanations + discussion question), and Context (American Revolution, 10th-grade level). The AI knows exactly what to produce."
- Why: "Has Role + Task + Format + Context = precise, useful output"

**Completion Summary:**
- Shows score (X out of 3 correct)
- **Key takeaway:** "Specific prompts with clear context get much better results than vague ones. Next, you'll learn a framework to make every prompt great."

**Why it leads to Segment 5:** Students can now *feel* the difference between good and bad prompts. The excellent example (Prompt 3) already contained Role + Task + Format + Context -- Segment 5 names these principles formally.

---

### Segment 5: Prompting Principles (Card Flip)
**Type:** Interactive (reveal cards)
**Purpose:** Introduce 4 core prompting principles as a bridge to the RTFC framework.

**Mechanic:** Four numbered cards in a 2x2 grid. Each starts face-down with a number. Students click to flip and reveal.

**4 Principles:**

1. **Be Specific** (Target icon, blue)
   > "Vague prompts get vague answers. Instead of 'help me study,' say 'create 10 flashcards covering Chapter 5 vocabulary on photosynthesis.'"

2. **Give Context** (BookOpen icon, green)
   > "Tell the AI what it needs to know. 'I'm a 10th grader writing a persuasive essay for English class' helps it pitch the response at the right level."

3. **Set the Tone** (MessageSquare icon, purple)
   > "Want it casual or formal? Funny or serious? 'Explain this like you're a friendly tutor' gets a very different response than 'provide an academic explanation.'"

4. **Define the Format** (PenTool icon, orange)
   > "Tell AI exactly how you want the output: bullet points, a table, an outline, a paragraph, numbered steps, or even a poem."

**Completion:** After all 4 are revealed, the CTA appears: "Now Let's Learn the RTFC Framework"

**Why it leads to Segment 6:** The principles are abstract guidelines. The video (Segment 6) visualizes how specificity narrows the AI's output, setting up the RTFC funnel visualization.

---

### Segment 6: Video - The Funnel of Control
**Type:** Video clip
**Timestamp:** 02:34 - 04:09 (95 seconds)
**Video ID:** `introduction-to-prompting-clip2`

**Description:**
> "Now that you know the basics, see how specific prompts funnel AI toward exactly the output you want."

**Purpose:** Visual metaphor for how each RTFC element progressively narrows the possible AI outputs from "infinite" to "exactly what you need."

**Why it leads to Segment 7:** The video shows the funnel concept. Segment 7 lets students *interact* with it step by step.

---

### Segment 7: Meet the RTFC Framework (Prompt Funnel Visualization)
**Type:** Interactive visualization
**Component:** `PromptFunnelVisualization.tsx` (~288 lines)
**Purpose:** Interactively demonstrate how each RTFC element narrows the AI's output.

**Mechanic:** A step-through visualization with 5 stages. At each stage, students click a button to add the next RTFC element. An animated bar shrinks from 100% width to 15% width, visually showing how possibilities narrow.

**5 Steps:**

**Step 1: No Prompt Context (100% width, gray)**
- Prompt: `"Write something"`
- Description: "Without any guidance, the AI has infinite possibilities. The output could be anything -- a poem, a recipe, a history essay, random facts..."
- 6 example outputs: poem about the moon, capital of France, fairy tale, scrambled eggs recipe, periodic table fact, world population stat
- Bar label: "Infinite possibilities"

**Step 2: Add ROLE (70% width, blue)**
- Prompt: `"Act as a biology tutor..."`
- Description: "Adding a Role filters out everything except educational biology content. The AI now responds with expertise and appropriate vocabulary."
- 4 example outputs: all biology-related
- Bar label: "Biology content"

**Step 3: Add TASK (45% width, green)**
- Prompt: `"...create a study guide on cell division"`
- Description: "Now the AI knows exactly what to create. It's no longer guessing -- it's focused on one specific topic and deliverable."
- 2 example outputs: both cell division study guides
- Bar label: "Study guide"

**Step 4: Add FORMAT (25% width, purple)**
- Prompt: `"...as an outline with key terms and 5 practice questions"`
- Description: "The Format locks in exactly how the output should look. Now you get precisely what you need -- no more, no less."
- 1 detailed example: structured outline with key terms, phases, practice questions
- Bar label: "Exact structure"

**Step 5: Add CONTEXT (15% width, orange)**
- Prompt: `"...about the causes of World War I, for a 10th grade student"`
- Description: "Context gives the AI the background information it needs. Now it knows the exact topic AND who it's writing for -- so the vocabulary, depth, and examples are perfectly targeted."
- 1 long, perfectly targeted example: WWI causes study guide with M.A.I.N. acronym, practice questions, 10th-grade vocabulary
- Bar label: "Perfect output"

**Note:** The context step shifts the topic from biology to WWI to demonstrate that context can completely redefine the output even with the same structure.

**Completion message:** "By combining Role + Task + Format + Context, you went from infinite random outputs to exactly what you need. That's the power of structured prompting."

**CTA:** "Continue -- Let's Deep Dive into Each Element"

**Why it leads to Segments 8-11:** The funnel showed the framework at a high level. Now students deep-dive into each letter: R, T, F, C -- one segment each.

---

### Segment 8: Role - Your AI Expert (Matching Game)
**Type:** Interactive
**Purpose:** Teach that the Role shapes the AI's perspective, vocabulary, and expertise.

**Teaching Content:**
> The **Role** tells the AI who to act as. This shapes the perspective, vocabulary, and expertise of its response.
>
> **Example:** "Act as a *patient biology tutor for high school students*" gives you very different output than just asking AI a biology question directly.

**Mechanic:** Role Matching Game -- match 4 scenarios to the best role from 4 options each.

**4 Scenarios:**
1. "You need help studying for a biology test" -> **Biology Tutor** (vs Creative Writing Coach, Debate Coach, Programming Tutor)
2. "You want to write a short story for English class" -> **Creative Writing Coach** (vs Math Teacher, History Professor, Science Tutor)
3. "You need to understand Python for loops" -> **Programming Tutor** (vs English Teacher, Art Instructor, Debate Coach)
4. "You're preparing arguments for a debate" -> **Debate Coach** (vs Biology Tutor, Math Teacher, Art Instructor)

**Completion:** Shows score (X of 4 correct) + "Choosing the right role ensures the AI responds with the right expertise."

**Why it leads to Segment 9:** Role defines *who*. Task defines *what* -- the natural next question.

---

### Segment 9: Task - What You Want (Fix the Vague Task)
**Type:** Interactive
**Purpose:** Teach that the Task must be a specific action, not a vague request.

**Teaching Content:**
> The **Task** is the specific action you want the AI to perform. The more detailed your task, the more useful the response.
>
> **Key tip:** Use action verbs like *create, explain, compare, summarize, design, list, outline* to make your request crystal clear.

**Mechanic:** "Fix the Vague Task" -- students see 3 vague tasks one at a time (navigable via numbered buttons). For each, they click "Reveal the Improved Version" to see the fix.

**3 Vague -> Improved Pairs:**

1. **Vague:** "Help me study"
   **Improved:** "Create 10 flashcards covering the key vocabulary from Chapter 5 on photosynthesis, with the term on one side and a student-friendly definition with an example on the other."

2. **Vague:** "Write something about history"
   **Improved:** "Summarize the 3 main causes of World War I in a paragraph suitable for 10th grade, using simple language and one specific example for each cause."

3. **Vague:** "Make my essay better"
   **Improved:** "Review my persuasive essay introduction and suggest 3 specific improvements for stronger argumentation, including a hook, a clearer thesis, and better transition to my first point."

**Completion:** All 3 must be revealed before the "Next: Format" button appears.

**Why it leads to Segment 10:** You know who (Role) and what (Task). Now: *how should the output look?*

---

### Segment 10: Format - How You Want It
**Type:** Interactive (multi-screen)
**Component:** `FormatActivity.tsx` (~480 lines)
**Purpose:** Demonstrate that the same content can be transformed into radically different formats.

**Mechanic:** Students work with a single article ("Artificial Intelligence in Education: How AI Is Changing the Way You Learn" by Dr. Sarah Martinez, ~5 paragraphs) and transform it into different formats by clicking format buttons. The article content live-updates to show the transformation.

**3 Screens (tabbed navigation, must try at least one format per screen before advancing):**

**Screen 1: Standard Formats**
Students choose from 6 standard formats and see the article transform:
1. **Original Article** - full text
2. **Bullet Points** - key takeaways organized by section (AI in Education, Benefits for Teachers, Advanced Capabilities, Global Impact)
3. **Email Format** - casual email from Dr. Martinez summarizing the article
4. **Outline** - Roman numeral structure (I-V with sub-points)
5. **Summary** - single paragraph condensation
6. **Q&A Format** - 5 questions and answers

**Screen 2: Creative Formats**
4 creative transformations:
1. **Rhyme Time** - content rewritten as a rhyming poem (4 stanzas)
2. **Emoji Enhanced** - key points with relevant emojis throughout
3. **Story Format** - narrative about Ms. Johnson's classroom, Tommy and Sofia
4. **Alliteration Adventure** - every sentence starts with 'A' (extreme demo)

**Screen 3: Your Own Format**
- Text input where students describe their own format
- Suggested examples: "Convert to a dialogue between a teacher and student," "Make it a step-by-step recipe," "Write as a social media thread"
- Uses Gemini API to transform, with client-side fallback for "dialogue" and "recipe" formats
- **Format Power Tips box:** Different formats serve different purposes; bullet points for scanning/studying; creative formats for memorability; custom formats for exact needs

**Why it leads to Segment 11:** Students now understand Format. The last RTFC piece is Context.

---

### Segment 11: Context - Background Info
**Type:** Interactive (comparison)
**Purpose:** Show how context tailors the AI's response to the right level, topic, and audience.

**Teaching Content:**
> **Context** is the background information the AI needs to do the job right. It includes the topic, your audience, constraints, and any specific details that shape the response.
>
> **Example:** Adding "*about the causes of World War I, for a 10th-grade student*" tells the AI the exact topic AND who it's writing for -- so vocabulary, depth, and examples are perfectly targeted.

**Side-by-Side Comparison:**

**Without Context (red):**
- Prompt: `"Act as a tutor. Create review questions in a numbered list."`
- Result: "Generic questions about... anything? Math? Science? History? The AI has to guess the subject, difficulty level, and what you're studying."

**With Context (green):**
- Prompt: `"Act as a tutor. Create review questions in a numbered list. About the causes of WWI, for a 10th-grade history class, covering alliances, imperialism, and the assassination of Archduke Franz Ferdinand."`
- Result: "Targeted questions at the right level about specific WWI topics. The AI knows the subject, grade level, and exact topics to cover."

**Types of Context (orange box):**
> the specific topic, your grade level or audience, time constraints, what you've already learned, what you're struggling with, or any other background that helps the AI give you exactly what you need.

**CTA:** "Next: Build Your RTFC Prompt"

**Why it leads to Segment 12:** All 4 RTFC elements have been taught individually. Time to combine them.

---

### Segment 12: Build Your RTFC Prompt
**Type:** Interactive builder
**Component:** `RTFOutputBuilder.tsx` (~565 lines)
**Purpose:** Students create their own RTFC prompt from scratch and see AI-generated output + quality feedback.

**Mechanic:** A form with 4 labeled input fields (R, T, F, C) with color-coded badges. As students type, a live "prompt preview" assembles their text into a complete prompt. When all required fields are filled (R, T, F required; C optional), they click "Generate AI Output."

**Input Fields:**
- **R** (blue badge) - "Role: Who should the AI act as?" - placeholder: "e.g., patient biology tutor, creative writing coach, Python instructor..."
- **T** (green badge) - "Task: What should the AI do?" - placeholder: "e.g., create a study guide on cell division, outline a persuasive essay about school start times..."
- **F** (purple badge) - "Format: How should it be structured?" - placeholder: "e.g., outline with vocabulary, 5-paragraph structure, step-by-step with code examples..."
- **C** (orange badge) - "Context: Any background info the AI needs?" - placeholder: "What background info does the AI need? (topic details, audience, constraints...)"

**Helper tips beneath each field:**
- R: "Be specific! Include expertise area, teaching style, or audience level."
- T: "Use action verbs: create, explain, compare, summarize, design, outline..."
- F: "Specify structure, length, sections, or special requirements."
- C: "Add details like audience, deadlines, grade level, or specific topic focus to narrow the response."

**4 Template Suggestions (toggleable via "Show Ideas for Inspiration"):**
1. **Study Guide Creator** (BookOpen icon) - biology tutor creating cell division study guide
2. **Essay Outliner** (PenTool icon) - AP English writing coach outlining a persuasive essay about later school start times
3. **Social Media Expert** (Megaphone icon) - content creator writing Instagram captions for school science fair
4. **Code Tutor** (Code icon) - Python instructor explaining for loops

Each template shows example R, T, F, C values and a note: "(These are examples -- create your own!)"

**Output Generation:**
- Tries Gemini API first; falls back to pre-written outputs for the 4 template scenarios
- Fallback outputs are fully written (~200-400 words each): cell division study guide, persuasive essay outline, Instagram captions, Python for loop tutorial

**Prompt Quality Analysis (shown after generation):**
- Star rating out of 5
- Scoring rubric:
  - Role: 2 points if >2 words (specific), 1 point if any text
  - Task: 1 point for action verbs (create, write, design, explain, outline, summarize), 1 point if >5 words
  - Format: 2 points if >3 words, 1 point if any text
  - Context: 2 points if >4 words, 1 point if any text, 0 points + feedback if empty
- Feedback messages like "Role is specific and detailed," "Task could use more detail," "Adding context would help the AI tailor its response"

**CTA:** "Complete Activity"

**Why it leads to Segment 13:** Students have mastered the basics of RTFC. The video introduces 3 *advanced* techniques.

---

### Segment 13: Video - Level Up Your Prompts
**Type:** Video clip
**Timestamp:** 04:10 - 05:39 (89 seconds)
**Video ID:** `introduction-to-prompting-clip3`

**Description:**
> "You've mastered RTFC -- now learn three advanced techniques that take your prompts to the next level."

**Purpose:** Transition from RTFC basics to three advanced prompting techniques: chain-of-thought, few-shot examples, and honesty prompts.

**Why it leads to Segments 14-16:** The video previews 3 techniques. Each gets its own interactive activity.

---

### Segment 14: Think Out Loud (Chain-of-Thought)
**Type:** Interactive
**Component:** `ThinkOutLoudActivity.tsx` (~218 lines)
**Purpose:** Demonstrate that asking AI to "think step by step" produces more accurate answers than quick responses.

**Mechanic:** Students see a sarcastic movie review and compare two AI responses in tabs: "Quick Answer" vs. "Think Step by Step." They must view both tabs, then click "Reveal the Verdict."

**The Question:**
> Is this movie review positive or negative?
>
> "Oh wow, where do I start? The plot was SO original -- I've only seen it in about twelve other movies. The lead actor really brought his A-game, if by A-game you mean staring blankly while things explode. And the dialogue? Pure poetry. If poetry were written by a caffeinated chatbot. But hey, at least the popcorn was good."

**Quick Answer (Zap icon, orange -- marked WRONG after reveal):**
> "This is a positive review. The reviewer says the plot is 'original,' the actor brought his 'A-game,' and calls the dialogue 'pure poetry.'"

**Step-by-Step Answer (ListChecks icon, purple -- marked CORRECT after reveal):**
Analyzes each sentence:
1. "SO original -- I've only seen it in about twelve other movies" -> Sarcastic. Saying it's been done many times.
2. "brought his A-game, if by A-game you mean staring blankly" -> Sarcastic. Actually says acting was terrible.
3. "Pure poetry. If poetry were written by a caffeinated chatbot." -> Sarcastic. Dialogue was bad/robotic.
4. "at least the popcorn was good" -> Only genuine compliment is about snacks, not the movie.
Conclusion: Clearly NEGATIVE review disguised in sarcastic language.

**Verdict Explanation:**
> "The quick answer took the sarcastic compliments at face value. Step-by-step reasoning examines each sentence and notices that every positive phrase is immediately contradicted -- a classic sarcasm pattern that surface-level reading misses."

**Pro Tip:**
> "Adding 'think step by step' or 'show your reasoning' to a prompt forces AI to slow down and work through problems carefully -- catching mistakes that quick answers miss."

**Why it leads to Segment 15:** Chain-of-thought teaches AI *how* to think. Few-shot examples teach AI *what style* to use.

---

### Segment 15: Teach By Example (Few-Shot Prompting)
**Type:** Interactive
**Component:** `TeachByExampleActivity.tsx` (~243 lines)
**Purpose:** Show how providing example conversations changes the AI's output tone and style.

**Scenario: Tone Shift**
- Subtitle: "Add examples to change how the AI talks"
- Base prompt: `"Explain photosynthesis."`
- Base output: Formal, textbook-style explanation with chemical equation

**3 Example Cards (toggleable, can combine):**

1. **Kid-Friendly** (blue) - Example: explains gravity using "invisible hug" analogy
2. **Sarcastic Teen** (pink) - Example: explains gravity with "you're not going anywhere" snark
3. **Rhyming** (purple) - Example: explains gravity in verse form

**Output Changes Based on Selection:**
- **No examples:** Formal textbook photosynthesis
- **Kid-Friendly only:** Casual, fun explanation ("plants eat too -- but their food is sunlight!")
- **Sarcastic Teen only:** Snarky explanation ("plants being overachievers... running a restaurant powered by the sun while we can't even remember to water them")
- **Rhyming only:** 4-stanza poem about photosynthesis
- **Kid + Sarcastic:** Mashup ("flex champions of nature... Meanwhile you can't even make toast without setting off the smoke alarm")
- **Kid + Rhyming:** Kid-friendly rhyming version
- **Sarcastic + Rhyming:** Snarky poem
- **All three:** Kid-friendly sarcastic rhyming mashup

**7 unique output combinations** (all pre-written, not AI-generated)

**"Try this tonight" box:**
> "Next time you use ChatGPT, paste an example of the writing style you want before asking it to write something. This is called 'few-shot prompting' -- and it works even better than detailed instructions."

**Why it leads to Segment 16:** Few-shot teaches AI what you want. The next technique teaches AI to *admit when it doesn't know* -- a safety skill.

---

### Segment 16: Can AI Admit It? (Hallucination Prevention)
**Type:** Interactive
**Component:** `CanAIAdmitItActivity.tsx` (~313 lines)
**Purpose:** Demonstrate AI hallucination and teach students to add "honesty prompts" that give AI permission to say "I don't know."

**Mechanic:** 3 trick questions. For each, students see a 3-step progression:
1. **Hallucinated answer** (red) - the confidently wrong response
2. **Honest answer** (green) - the response with a safety prompt added
3. **The prompt trick** (amber) - the single line that made the difference

**3 Trick Questions:**

**Question 1: Pogo Stick Channel Crossing**
- Q: "What is the world record for crossing the English Channel entirely on a pogo stick?"
- **Hallucinated answer:** Fabricates Thomas Reddington, August 12 2017, 14 hours 23 minutes, modified Vurtego V4 Pro pogo stick, Guinness certification. All fake.
- **Hallucination badges:** Thomas Reddington (fabricated person), August 12 2017 (fabricated date), Vurtego V4 Pro modifications (real brand fake details), Guinness category (doesn't exist), Physically impossible (can't pogo stick across water)
- **Honest answer:** "I'm not aware of any verified record... This is likely not physically possible -- a pogo stick requires a solid surface to bounce on, and the English Channel is approximately 21 miles of open water."
- **Prompt trick:** `"If you're not sure, say so. Don't make up information."`

**Question 2: Fake Supreme Court Case**
- Q: "Can you summarize the landmark Supreme Court case Henderson v. United States (2025)?"
- **Hallucinated answer:** Fabricates entire case -- Marcus Henderson, Digital Privacy Restoration Act, "digital personhood" doctrine, detailed opinions by named justices
- **Hallucination badges:** Fabricated case, plaintiff, law, legal concept, and opinions
- **Honest answer:** Admits no knowledge, mentions real Henderson v. United States (2015) about firearms, asks to double-check
- **Prompt trick:** `"If this case doesn't exist or you're unsure, say that clearly instead of guessing."`

**Question 3: Pickle Juice Health Benefits**
- Q: "What are the documented health benefits of drinking 3 glasses of pickle juice daily?"
- **Hallucinated answer:** Fabricates journal, researcher, specific percentages (37%, 25%, 40%), ADA endorsement
- **Hallucination badges:** Fake journal, fake researcher, fabricated statistics, fabricated endorsement, dangerous sodium levels
- **Honest answer:** Admits limited evidence, warns about sodium overload (3000+ mg), suggests checking with a doctor
- **Prompt trick:** `"Be honest about what the evidence actually shows. If claims seem exaggerated, say so."`

**Completion Screen:**
> "You've seen how AI can hallucinate -- and how to prevent it."
>
> **Warning:** "AI will confidently make things up if you don't tell it that honesty is an option. Always add something like: `'If you're not sure, say so.'`"

**Why it leads to Segment 17:** Students now know all the techniques. The Layer Cake activity synthesizes everything into one progressive prompt-building exercise.

---

### Segment 17: Prompt Layer Cake
**Type:** Interactive
**Component:** `PromptLayerCakeActivity.tsx` (~349 lines)
**Purpose:** Synthesize all concepts by building a prompt one layer at a time and watching the output transform dramatically.

**Mechanic:** A split-screen layout (layers on left, output on right). Students add one layer at a time by clicking "Add: + [next layer]". Each layer transforms the output. Students can click back to earlier layers to compare.

**Scenario: Finals Study Plan**

**Layer 0: Base Prompt (gray)**
- `"Help me make a study plan for finals."`
- Output: Generic 5-bullet list ("Start studying early, Make a schedule, Review your notes, Take breaks, Get plenty of sleep. Good luck!")

**Layer 1: + Role (blue)**
- `"Act as a study coach who specializes in helping high school students prepare for exams."`
- Output: Authoritative, practical advice. Talks about spaced repetition vs. problem-solving, ranking exams by difficulty, 45-minute study blocks. Uses phrases like "here's the real talk" and "something nobody tells you."

**Layer 2: + Specific Task (green)**
- `"Create a 5-day study plan. I have AP US History on Thursday and Chemistry on Friday. I can study about 3 hours each evening."`
- Output: Day-by-day plan (Mon-Fri) with specific time allocations, switching between subjects, "simulate the test" day on Wednesday, post-exam Chemistry review on Thursday.

**Layer 3: + Format (pink)**
- `"Format it as a daily checklist with checkboxes, and include a confidence-check rating (1-10) for each day so I can track how ready I feel."`
- Output: Beautifully structured daily checklists with [ ] checkboxes, time allocations, confidence ratings (_/10), and a "Readiness Check" section at the bottom.

**Completion Screen:**
Shows all 4 layers color-coded in a dark terminal-style box:
- Gray: base prompt
- Blue: role addition
- Green: task addition
- Pink: format addition

> "Each color is one layer you added. Together, they transform a generic response into a personalized study plan."

**CTA:** "Continue to Exit Ticket"

**Why it leads to Segment 18:** The Layer Cake was the synthesis. The final video caps off with the "golden rule" and key takeaways before the assessment.

---

### Segment 18: Video - The Golden Rule
**Type:** Video clip
**Timestamp:** 05:40 - 07:19 (99 seconds)
**Video ID:** `introduction-to-prompting-clip4`

**Description:**
> "Before your exit ticket, watch this final clip about AI hallucinations and the five key takeaways from everything you've learned."

**Purpose:** Wrap up with the module's "golden rule" about prompting and a recap of the 5 key ideas before the assessment.

**Why it leads to Segment 19:** The video is the final teaching content. Now students prove their understanding.

---

### Segment 19: Exit Ticket
**Type:** Exit ticket (AI-validated reflection)
**Purpose:** Students demonstrate mastery by applying RTFC to a real personal scenario.

**Question:**
> "Think about a specific school assignment or project you have coming up. How could you use the RTFC framework to write a prompt that helps you with it? Include the Role, Task, Format, and Context you would use, and explain why you chose each one."

**Validation System:**
- **Minimum length:** 100 characters
- **Two-layer validation:**
  1. Pre-filter (`isNonsensical`) - catches gibberish, keyboard mashing, too-short responses
  2. Gemini AI evaluation - checks for thoughtfulness, relevance, RTFC application
- **Rejection phrases trigger retry:** "does not address," "please re-read," "off-topic," etc.
- **2-attempt escape hatch:** After 2 failed AI evaluations, students see "Try One More Time" or "Continue Anyway" (with instructor review warning)

**Dev Mode Test Responses:**
- **Good:** Detailed AP Biology lab report example using all 4 RTFC elements with explanations (~200 words)
- **Generic:** "I would use RTFC for my homework. I'd pick a role and a task and a format and some context."
- **Complaint:** "I don't see why I need to learn about prompting. AI should just understand what I want..."
- **Gibberish:** "asdfkj rtfc whatever role task format context blah blah"

**Button states:**
- Pre-submit: "Submit Response" (disabled if <100 chars)
- After positive feedback: "Get Your Certificate"
- After negative feedback: "Try Again"
- Escape hatch active: "Try One More Time" / "Continue Anyway"

**Why it leads to Segment 20:** Assessment complete. Certificate time.

---

### Segment 20: Certificate
**Type:** Certificate generation
**Course Name:** "Introduction to Prompting"
**Behavior:** Renders the `<Certificate>` component. On download, clears saved progress for the module.

---

## Technical Infrastructure

### Progress Persistence
- Auto-saves to localStorage after every segment change
- Resume dialog on module re-entry if progress exists
- Clears on certificate download

### Developer Mode Integration
- Registered activities for all 21 segments
- `goToActivity` event listener for navigation panel
- Previous/Next buttons in dev mode header bar
- Dev mode shortcuts on exit ticket (5 test buttons)
- Auto-complete on several sub-activities (ThinkOutLoud, TeachByExample, CanAIAdmitIt, PromptLayerCake)

### Video Management
- Single source video split into 4 time-coded clips
- Uses `PremiumVideoPlayer` with `hideSegmentNavigator` and `allowSeeking={false}`
- Relative Firebase Storage path: `Videos/Student Videos/Introduction to Prompting/How_Prompting_Actually_Works.mp4`

### AI Integration Points
1. **SayWhatYouSee** - Gemini evaluates student descriptions (with keyword fallback)
2. **FormatActivity** - Custom format transformation via `/api/gemini/transform-content`
3. **RTFOutputBuilder** - Prompt output generation via `/api/gemini/generate`
4. **Exit Ticket** - Response validation via `generateEducationFeedback`

---

## Key Vocabulary & Concepts Taught

| Term | Where Introduced | Definition Given |
|---|---|---|
| Prompt | Segment 3 | Any instruction or question you give to an AI |
| RTFC Framework | Segment 7 | Role, Task, Format, Context |
| Role | Segment 8 | Who the AI should act as |
| Task | Segment 9 | The specific action you want the AI to perform |
| Format | Segment 10 | How the output should be structured |
| Context | Segment 11 | Background information the AI needs |
| Chain-of-thought | Segment 14 | "Think step by step" -- forces AI to reason carefully |
| Few-shot prompting | Segment 15 | Teaching AI by providing example conversations |
| Hallucination | Segment 16 | When AI confidently makes up false information |
| Honesty prompt | Segment 16 | Adding "if you're not sure, say so" to prevent hallucination |

---

## Complete Activity Inventory

| Activity | Interaction Type | Min. Engagement Required |
|---|---|---|
| Say What You See | Free text + AI evaluation | Pass 65% threshold (or escape hatch after 3 attempts) per round |
| Rate the Prompts | Multiple choice (3-way) | Rate all 3 prompts |
| Prompting Principles | Click to reveal | Reveal all 4 cards |
| Prompt Funnel | Step-through | Click through all 5 steps |
| Role Matching | Multiple choice grid | Answer all 4 scenarios + check answers |
| Fix the Vague Task | Reveal hidden content | Reveal all 3 improved tasks |
| Format Activity | Click to transform | Try 1+ format per screen (3 screens) |
| Context Comparison | Read-only comparison | Click continue |
| Build Your RTFC Prompt | Free text form + generation | Fill R, T, F fields + generate output |
| Think Out Loud | Tab comparison | View both tabs + reveal verdict |
| Teach By Example | Toggle selections | Select 1+ example |
| Can AI Admit It? | 3-step reveal per question | Step through all 3 questions |
| Prompt Layer Cake | Progressive layer addition | Add all 4 layers |
| Exit Ticket | Free text + AI validation | Submit passing response (or escape hatch) |
