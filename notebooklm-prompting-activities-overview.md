# Introduction to Prompting: 5 Advanced Interactive Activities

## Overview

This document describes 5 new interactive activities added to the "Introduction to Prompting" module in an AI literacy course for high school students (ages 14-18). These activities come after students have already learned the RTF (Role-Task-Format) framework and expand their prompt engineering skills with concepts adapted from Anthropic's official prompt engineering tutorial.

The 5 activities are:
1. Spot the Difference (Specificity and Clarity)
2. Think Out Loud (Chain-of-Thought Reasoning)
3. Teach By Example (Few-Shot Prompting)
4. Can AI Admit It? (Hallucination Awareness)
5. Prompt Layer Cake (Combining All Techniques - Capstone)

Students complete these activities in order after mastering RTF basics. Each builds on the last, culminating in the capstone where all techniques are combined.

---

## Activity 1: Spot the Difference

### Concept Taught
Specificity and clarity in prompts. This is the single most important prompt engineering skill: the more specific your prompt, the more useful the output.

### How It Works
Students see two AI outputs displayed side by side, labeled Output A and Output B. One output was generated from a vague prompt, and the other from a specific prompt. The student's job is to figure out which output came from the better, more specific prompt. After they pick, the actual prompts are revealed so they can see exactly what made the difference.

There are 3 rounds, each covering a different topic.

### Round 1: Poetry

**Vague prompt:** "Write a poem"

**Specific prompt:** "Write a 4-line poem about autumn rain using vivid sensory imagery"

**Output from the vague prompt:**
Rain is nice sometimes.
It falls from the sky and lands on things.
People use umbrellas when it rains.
Nature needs water to grow.

**Output from the specific prompt:**
Autumn rain taps the tin roof like tired fingers,
each drop a cold whisper sliding down copper gutters.
The sidewalk breathes up petrichor, that earthy sweetness
you only notice when the world decides to slow down.

The difference is dramatic. The vague prompt produces a flat, generic response that could have been about anything. The specific prompt produces a focused, vivid poem because the AI knew exactly what was wanted: 4 lines, about autumn rain, with sensory imagery.

### Round 2: Advice

**Vague prompt:** "Tell me about basketball"

**Specific prompt:** "Who is the greatest NBA point guard of all time? Give your top pick with 3 supporting arguments"

**Output from the vague prompt:**
Basketball is a sport played by two teams of five players. The objective is to shoot a ball through a hoop to score points. It was invented by James Naismith in 1891. Many people enjoy watching and playing basketball around the world.

**Output from the specific prompt:**
Magic Johnson is the greatest NBA point guard of all time, and here's why:

1. Versatility at 6'9" - He could play all five positions, famously starting at center in the 1980 Finals as a rookie and dropping 42 points.

2. Five championships - He led the Showtime Lakers to five titles in nine Finals appearances, proving he elevated entire rosters.

3. He redefined the position - Before Magic, point guards were small ball-handlers. He turned the role into a playmaking engine, averaging 11.2 assists for his career.

The vague prompt got a Wikipedia-style overview. The specific prompt got a focused argument with evidence because it asked for a specific opinion and a specific format (top pick with 3 arguments).

### Round 3: Help

**Vague prompt:** "Help me with my essay"

**Specific prompt:** "Check this paragraph for grammar errors and suggest a more engaging opening sentence: 'Social media have changed how teenager communicate. They spend hours scrolling and its affecting there grades.'"

**Output from the vague prompt:**
Sure! Here are some tips for writing essays:
- Make sure you have a thesis statement
- Use topic sentences for each paragraph
- Include evidence to support your points
- Write a conclusion that summarizes your main ideas
- Proofread before submitting
Good luck with your essay!

**Output from the specific prompt:**
Here's your paragraph with corrections:

Grammar fixes:
- "have" changed to "has" (social media is singular in common usage)
- "teenager" changed to "teenagers" (plural needed)
- "its" changed to "it's" (contraction of "it is")
- "there" changed to "their" (possessive, not location)

Corrected: "Social media has changed how teenagers communicate. They spend hours scrolling, and it's affecting their grades."

More engaging opening: "The average teenager unlocks their phone 80 times a day, and the ripple effects on academic performance are hard to ignore."

The vague prompt got generic advice anyone could Google. The specific prompt got line-by-line corrections and a concrete improvement suggestion because it gave the AI actual text to work with and a clear task.

### Key Insight
Specific prompts that mention exactly what you want - topic, length, style, details - produce focused, useful output. Vague prompts get vague results every time.

---

## Activity 2: Think Out Loud

### Concept Taught
Chain-of-thought reasoning. When you add "think step by step" or "show your reasoning" to a prompt, the AI works through problems more carefully and catches mistakes it would otherwise make.

### How It Works
Students see a tricky question. They can switch between two tabs: "Quick Answer" (where the AI gives a fast, off-the-cuff response) and "Think Step by Step" (where the AI works through the problem carefully). After viewing both tabs, students reveal the verdict to see which one got it right and why.

There are 3 examples.

### Example 1: Math

**Question:** A jacket costs $80. It's 25% off, and you have a 10% coupon applied after the sale. What do you pay?

**Quick Answer (WRONG):** $52.00. I subtracted 25% and 10% (that's 35% off) from $80.

**Step-by-Step Answer (CORRECT):**
Let me work through this step by step:
1. Original price: $80.00
2. Apply 25% sale first: 25% of $80 = $20 discount. Sale price: $80 - $20 = $60.00
3. Apply 10% coupon to the SALE price (not the original): 10% of $60 = $6 discount
4. Final price: $60 - $6 = $54.00

The answer is $54.00. The key is that the coupon applies to the already-discounted price, not the original.

**Why step-by-step won:** The quick answer incorrectly combined the discounts (25% + 10% = 35%). In reality, the 10% coupon applies to the sale price of $60, not the original $80. Step-by-step reasoning catches this because it processes each discount in order.

### Example 2: Logic

**Question:** A farmer has 15 sheep. All but 8 die. How many sheep does the farmer have left?

**Quick Answer (WRONG):** 7 sheep. 15 minus 8 equals 7.

**Step-by-Step Answer (CORRECT):**
Let me parse this carefully:
1. The farmer starts with 15 sheep.
2. "All but 8 die" - let me think about what this means.
3. "All but 8" = every sheep EXCEPT 8 of them died.
4. So 8 sheep survived.
5. The farmer has 8 sheep left.

The answer is 8. The phrase "all but 8" means "all except 8," so 8 remain alive.

**Why step-by-step won:** The quick answer fell for the classic word trick. It assumed "all but 8 die" meant "subtract 8." But "all but 8" actually means "all except 8," so 8 sheep survive. Step-by-step reasoning forces the AI to parse the tricky phrasing before calculating.

### Example 3: Sarcasm

**Question:** Is this movie review positive or negative?

"Oh wow, where do I start? The plot was SO original - I've only seen it in about twelve other movies. The lead actor really brought his A-game, if by A-game you mean staring blankly while things explode. And the dialogue? Pure poetry. If poetry were written by a caffeinated chatbot. But hey, at least the popcorn was good."

**Quick Answer (WRONG):** This is a positive review. The reviewer says the plot is "original," the actor brought his "A-game," and calls the dialogue "pure poetry."

**Step-by-Step Answer (CORRECT):**
Let me analyze the tone carefully:
1. "SO original - I've only seen it in about twelve other movies" - Sarcastic. Saying it's been done many times before.
2. "brought his A-game, if by A-game you mean staring blankly" - Sarcastic. Actually says the acting was terrible.
3. "Pure poetry. If poetry were written by a caffeinated chatbot." - Sarcastic. The dialogue was bad/robotic.
4. "at least the popcorn was good" - The only genuine compliment is about the snacks, not the movie.

This is a clearly NEGATIVE review disguised in sarcastic language. Every "compliment" is immediately undercut.

**Why step-by-step won:** The quick answer took the sarcastic compliments at face value. Step-by-step reasoning examines each sentence and notices that every positive phrase is immediately contradicted, a classic sarcasm pattern that surface-level reading misses.

### Key Takeaway
Adding "think step by step" or "show your reasoning" to a prompt forces AI to slow down and work through problems carefully, catching mistakes that quick answers miss.

---

## Activity 3: Teach By Example

### Concept Taught
Few-shot prompting. Instead of just describing what you want, you can show the AI an example of the style, tone, or format you're looking for. This is called "few-shot prompting" because you give the AI a few examples (shots) to learn from before it generates its response.

### How It Works
Students see a prompt with a default output. On the left side, they have example conversation cards they can toggle on or off. On the right side, the AI's output updates in real time to match the style demonstrated by the selected examples. Students can mix and match examples to see how combinations affect the output.

There are 2 scenarios.

### Scenario 1: Tone Shift

**Prompt:** "Explain photosynthesis."

**Default output (no examples, textbook tone):**
Photosynthesis is the biological process by which green plants, algae, and certain bacteria convert light energy, usually from the Sun, into chemical energy in the form of glucose. This process occurs primarily in the chloroplasts of plant cells, utilizing chlorophyll to absorb light. The general equation is: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2.

**Available examples to add:**

Example 1 - Kid-Friendly style:
User: "Explain gravity."
AI: "You know how when you jump, you always come back down? That's gravity! It's like the Earth is giving you a big invisible hug and pulling you toward it. Everything that has weight gets pulled - that's why your ball falls when you drop it!"

Example 2 - Sarcastic Teen style:
User: "Explain gravity."
AI: "Oh, gravity? It's basically the universe saying 'you're not going anywhere.' You jump, it pulls you back down. You throw your phone, gravity catches it - with the screen, obviously. Isaac Newton got bonked by an apple and suddenly he's a genius. Wild."

Example 3 - Rhyming style:
User: "Explain gravity."
AI: "There's a force that keeps your feet upon the ground, it pulls things down without a single sound. Newton saw an apple fall one day, and figured out why things don't float away!"

**When Kid-Friendly example is added, the photosynthesis output becomes:**
So you know how you need to eat food to get energy? Well, plants eat too, but their food is sunlight! They soak up sunshine through their leaves (that's why leaves are usually facing up), mix it with water from their roots and air from, well, the air, and BOOM - they make their own sugar snack. Oh, and they breathe out oxygen while they do it, which is pretty nice of them since we need that to, you know, live.

**When Sarcastic Teen example is added, the output becomes:**
Photosynthesis is basically plants being overachievers. While you're struggling to microwave ramen, plants are out here making food from literal SUNLIGHT. They grab some CO2 (the stuff you breathe out), add water, throw in some sunshine, and boom - glucose and oxygen. They're essentially running a restaurant powered by the sun while we can't even remember to water them. The audacity.

**When Rhyming example is added, the output becomes:**
The sun shines down upon the leaf so green, the finest food factory you've ever seen! Water travels up from roots below, while CO2 joins in to start the show. Chlorophyll catches light so bright, and turns it into sugar - what a sight! Oxygen floats out into the air, a gift from plants showing that they care.

Students can also combine multiple examples at once. For instance, adding both Kid-Friendly and Sarcastic examples together produces a blend of both tones.

### Scenario 2: Format Shift

**Prompt:** "What are the benefits of exercise?"

**Default output:** A standard paragraph about cardiovascular health, weight management, mental health, and so on.

**Available examples to add:**

Example 1 - Bullet Points: Shows the benefits of reading as a clean bulleted list.
Example 2 - Emoji List: Shows the benefits of reading with emojis leading each point.
Example 3 - Table Format: Shows the benefits of reading in a table with columns for Benefit, How It Works, and Evidence.

Each example changes the format of the exercise output accordingly. Combining them creates hybrid formats, for instance bullets with emojis, or a table with emoji headers.

### Key Takeaway
Instead of just describing what you want, you can show the AI an example of the style, tone, or format you're looking for. This is called "few-shot prompting," and it works even better than detailed instructions.

---

## Activity 4: Can AI Admit It?

### Concept Taught
Hallucination awareness. AI systems can generate confident, detailed, and completely fabricated information. They will invent names, dates, statistics, and citations that sound real but are entirely made up. The key defense is to explicitly tell the AI that it's okay to say "I don't know."

### How It Works
Students are shown a trick question designed to elicit a hallucinated response. They first read the AI's confidently wrong answer with every fabricated claim labeled with a "Hallucination" badge. Then they click to see what happens when the same question is asked with a safety prompt added. Finally, the exact prompt addition that made the difference is revealed.

There are 3 trick questions.

### Question 1: The Pogo Stick Record

**Question:** What is the world record for crossing the English Channel entirely on a pogo stick?

**AI Response WITHOUT safety prompt (hallucinated):**
The world record for crossing the English Channel on a pogo stick is held by Thomas Reddington of the UK, who completed the feat on August 12, 2017, in 14 hours and 23 minutes. He used a specially modified Vurtego V4 Pro pogo stick with marine-grade waterproof seals and a reinforced titanium spring rated for saltwater conditions. The Guinness Book of World Records officially certified the record under their "Human-Powered Channel Crossings" category.

**Fabricated claims identified:**
- Thomas Reddington - fabricated person
- August 12, 2017 - fabricated date
- Vurtego V4 Pro - real brand, fake modifications
- Guinness category - doesn't exist
- Physically impossible - you can't pogo stick across water

**AI Response WITH safety prompt (honest):**
I'm not aware of any verified record for crossing the English Channel on a pogo stick. This is likely not physically possible. A pogo stick requires a solid surface to bounce on, and the English Channel is approximately 21 miles of open water. If you're interested in unusual Channel crossing records, I can help you find those instead.

**The prompt addition that made the difference:** "If you're not sure, say so. Don't make up information."

### Question 2: The Fake Court Case

**Question:** Can you summarize the landmark Supreme Court case Henderson v. United States (2025)?

**AI Response WITHOUT safety prompt (hallucinated):**
Henderson v. United States (2025) was a landmark 6-3 Supreme Court decision delivered on March 14, 2025. The case centered on Marcus Henderson, a software engineer from Portland, Oregon, who challenged the constitutionality of the Digital Privacy Restoration Act of 2023. The Court, in an opinion written by Justice Ketanji Brown Jackson, held that the Fourth Amendment's protections extend to AI-generated behavioral profiles used by law enforcement. The ruling established the "digital personhood" doctrine, requiring warrants for accessing AI-derived personality assessments. The dissent, led by Justice Samuel Alito, argued the majority's framework was unworkable and would hamper legitimate law enforcement efforts.

**Fabricated claims identified:**
- Henderson v. United States (2025) - fabricated case
- Marcus Henderson - fabricated plaintiff
- Digital Privacy Restoration Act of 2023 - fabricated law
- "Digital personhood" doctrine - fabricated legal concept
- Detailed opinions - entirely invented

**AI Response WITH safety prompt (honest):**
I don't have information about a Supreme Court case called "Henderson v. United States" from 2025. There is a real Henderson v. United States (2015) about firearm forfeiture, but I don't want to confuse the two. Could you double-check the case name and year? I'd rather point you to the right case than guess.

**The prompt addition that made the difference:** "If this case doesn't exist or you're unsure, say that clearly instead of guessing."

### Question 3: Pickle Juice Health Claims

**Question:** What are the documented health benefits of drinking 3 glasses of pickle juice daily?

**AI Response WITHOUT safety prompt (hallucinated):**
According to a 2023 study published in the Journal of Nutritional Medicine by Dr. Rebecca Thornton at Stanford, drinking 3 glasses of pickle juice daily has several documented benefits:
1. Reduces muscle cramps by 37% due to the vinegar's effect on alpha motor neuron activity
2. Lowers blood sugar spikes by 25% after meals (glycemic stabilization effect)
3. Improves gut microbiome diversity by 40% within 6 weeks
4. The sodium content (1,200mg per glass) supports healthy electrolyte balance for active lifestyles
5. Contains antioxidant compounds that reduce inflammation markers by up to 15%
The American Dietetic Association recommends starting with one glass and gradually increasing intake.

**Fabricated claims identified:**
- Journal of Nutritional Medicine - not a real journal
- Dr. Rebecca Thornton - fabricated researcher
- All specific percentages - fabricated statistics
- ADA recommendation - fabricated endorsement
- 3 glasses/day of pickle juice could cause dangerous sodium overload

**AI Response WITH safety prompt (honest):**
I should be upfront: I'm not aware of credible medical research specifically recommending 3 glasses of pickle juice daily. That amount would contain extremely high sodium levels (potentially 3,000+ mg), which most health guidelines would flag as concerning. There is some limited research suggesting small amounts of pickle juice may help with acute muscle cramps, but "3 glasses daily" as a health regimen isn't something I can find evidence for. I'd recommend checking with a doctor or dietitian before trying this.

**The prompt addition that made the difference:** "Be honest about what the evidence actually shows. If claims seem exaggerated, say so."

### Key Insight
AI will confidently make things up if you don't tell it that honesty is an option. Adding phrases like "if you're not sure, say so" gives the AI permission to be honest instead of creative with facts.

---

## Activity 5: Prompt Layer Cake (Capstone)

### Concept Taught
Combining all techniques. This is the capstone activity that brings together everything students have learned: specificity, roles, chain-of-thought reasoning, few-shot examples, and format control. Each technique is a "layer" that stacks on top of the previous one, and students see how the AI's output improves with each addition.

### How It Works
Students start with a single base prompt and watch the AI's output transform as they add one layer at a time. A visual "cake" on the left side grows with each layer, using different colors. The AI output on the right updates to show the dramatic improvement. Students can click back to any previous layer to compare how the output looked at each stage.

The scenario is: "Help me prepare for a tech job interview."

### Layer 1: Base Prompt (Gray)

**Prompt:** "Help me prepare for a tech job interview."

**AI Output:**
Sure! Here are some tips for preparing for a tech job interview:
1. Research the company
2. Practice common interview questions
3. Review technical concepts
4. Prepare questions to ask the interviewer
5. Dress appropriately and arrive on time
Good luck with your interview!

This is generic advice anyone could Google. It doesn't know what kind of tech role, what level, what the student needs help with, or how to structure the advice.

### Layer 2: + Role (Blue)

**Added to prompt:** "Act as a senior software engineering hiring manager at a top tech company who has conducted over 500 interviews."

**AI Output:**
As someone who's sat on the other side of the table for hundreds of interviews, here's what actually matters:

The candidates who stand out aren't the ones who memorized every algorithm - they're the ones who can clearly explain their thinking process. When I ask a coding question, I'm watching HOW you approach it, not just whether you get the right answer.

The biggest red flag? Candidates who go silent and code for 10 minutes without saying a word. The biggest green flag? Someone who talks through their approach before writing a single line.

Start by understanding the company's tech stack, recent projects, and engineering culture. Then focus on behavioral questions - "Tell me about a time..." questions reveal more than any whiteboard problem.

Now it sounds like insider advice from someone who actually hires people, not a generic article.

### Layer 3: + Specific Task (Green)

**Added to prompt:** "Create a 2-week preparation plan for a junior frontend developer position, covering both technical skills and behavioral interview prep."

**AI Output:**
A detailed 2-week plan broken into Week 1 (Technical Foundation: JavaScript fundamentals, React deep dive, CSS layout, coding challenges) and Week 2 (Interview Simulation: portfolio project, behavioral prep with the STAR method, mock interviews, and a rest day). Each day has specific actionable tasks.

The output is now focused and structured because the AI knows the exact role (junior frontend dev), the timeframe (2 weeks), and the scope (technical and behavioral).

### Layer 4: + Think Step by Step (Purple)

**Added to prompt:** "For each recommendation, explain your reasoning - why this matters and what mistake candidates commonly make here."

**AI Output:**
The same 2-week plan, but now each day includes a "WHY" explanation and a "Common mistake" warning. For example:

Days 1-2: JavaScript Core
WHY: I ask about these in every junior interview because they reveal whether you understand the language or just copy-paste from Stack Overflow. Common mistake: memorizing definitions without being able to explain them in your own words.

Days 3-4: React Deep Dive
WHY: I'm not testing if you know the API - I'm testing if you understand WHEN to use useEffect vs useMemo and WHY. Common mistake: over-using useEffect. If you can explain when NOT to use it, you're ahead of 80% of candidates.

Step-by-step reasoning makes the advice deeper and more actionable.

### Layer 5: + Examples (Orange)

**Added to prompt:** "When giving advice, include a brief 'What I'd say in the interview' example showing exactly how a candidate should phrase their answer."

**AI Output:**
The plan now includes concrete example answers for key interview moments:

JavaScript Core - When asked "Explain closures":
WHAT I'D SAY: "A closure is when a function remembers variables from where it was created, even after that outer function has finished running. For example, in a counter function, the inner increment function 'closes over' the count variable. I use this pattern a lot in React hooks - useState is essentially a closure."

Behavioral - "Tell me about a time you failed":
WHAT I'D SAY: "During a group project, I took on too many tasks thinking I could handle everything. The deadline hit and I'd finished nothing properly. I learned to communicate my workload and ask for help early. Now I break work into smaller pieces and check in with my team daily."

The examples make the advice immediately usable instead of abstract.

### Layer 6: + Format (Pink)

**Added to prompt:** "Format the plan as a clean daily checklist with checkboxes, priority tags (Must-Do / Nice-to-Have), and a confidence meter for each day showing expected readiness."

**AI Output:**
A beautifully structured checklist format:

DAY 1-2: JavaScript Core                    Confidence: _/10
[ ] [MUST-DO] Practice explaining closures out loud
[ ] [MUST-DO] Write 3 examples using async/await
[ ] [MUST-DO] Draw the event loop and explain it
[ ] [NICE] Read "You Don't Know JS" chapter on scope
EXAMPLE ANSWER: "A closure is when a function remembers variables from where it was created..."

Every day has checkboxes, priority tags, example answers, and a confidence meter. It's gone from "Good luck with your interview!" to a comprehensive, actionable, personalized preparation system.

### Key Insight
Every technique you learned - specificity, roles, step-by-step reasoning, examples, and format - stacks together. The more layers you add, the more control you have over the AI's output. You don't always need all of them, but knowing how to combine them is your prompt engineering superpower.

---

## How These Activities Fit Into the Full Module

The Introduction to Prompting module has 17 total segments:

| # | Title | Type |
|---|-------|------|
| 0 | Welcome | Intro |
| 1 | Say What You See | Interactive game |
| 2 | What Is a Prompt? | Animated lesson |
| 3 | Rate the Prompts | Interactive quiz |
| 4 | Prompting Principles | Card reveal |
| 5 | Meet the RTF Framework | Visual funnel |
| 6 | Role: Your AI Expert | Matching game |
| 7 | Task: What You Want | Fix-the-vague-task |
| 8 | Format: How You Want It | Format transformer |
| 9 | Build Your RTF Prompt | Interactive builder |
| 10 | **Spot the Difference** | NEW |
| 11 | **Think Out Loud** | NEW |
| 12 | **Teach By Example** | NEW |
| 13 | **Can AI Admit It?** | NEW |
| 14 | **Prompt Layer Cake** | NEW (capstone) |
| 15 | Exit Ticket | Reflection |
| 16 | Certificate | Completion |

Segments 0-9 teach the RTF framework basics. Segments 10-14 (the 5 new activities) expand into advanced techniques. Then the Exit Ticket asks students to apply everything they've learned to a real assignment in their life, and they earn a certificate of completion.

## Summary of Techniques Covered

1. **Specificity and Clarity** (Spot the Difference) - Be precise about what you want: topic, length, style, and details.
2. **Chain-of-Thought Reasoning** (Think Out Loud) - Add "think step by step" to make AI work through problems carefully.
3. **Few-Shot Prompting** (Teach By Example) - Show the AI examples of the tone, style, or format you want.
4. **Hallucination Prevention** (Can AI Admit It?) - Tell AI it's okay to say "I don't know" instead of making things up.
5. **Combining Techniques** (Prompt Layer Cake) - Stack role + task + reasoning + examples + format for maximum control.

These five skills, combined with the RTF framework from the first half of the module, give students a complete toolkit for communicating effectively with AI systems.
