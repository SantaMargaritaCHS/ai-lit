// historyVideoQuestions.ts
// Video comprehension questions for History of AI segments

export const videoQuestions = {
  turingTest: {
    question: "What was Alan Turing's main contribution to AI in 1950?",
    options: [
      { 
        id: 'a', 
        text: "He built the first computer", 
        correct: false,
        feedback: "Not quite! While Turing worked on early computers, his 1950 contribution was about testing machine intelligence."
      },
      { 
        id: 'b', 
        text: "He proposed a test to evaluate if machines can think", 
        correct: true,
        feedback: "Correct! The Turing Test evaluates whether a machine can exhibit intelligent behavior indistinguishable from a human."
      },
      { 
        id: 'c', 
        text: "He invented the first AI program", 
        correct: false,
        feedback: "Not yet! The first AI programs came later. Turing's contribution was theoretical - defining how to test machine intelligence."
      },
      { 
        id: 'd', 
        text: "He coined the term 'artificial intelligence'", 
        correct: false,
        feedback: "Actually, the term 'artificial intelligence' wasn't coined until 1956 at the Dartmouth Conference."
      }
    ]
  },
  
  aiWinter: {
    question: "Why was the period from the 1960s-70s called the 'AI Winter'?",
    options: [
      { 
        id: 'a', 
        text: "AI research was banned by governments", 
        correct: false,
        feedback: "No, AI research wasn't banned. The 'winter' refers to reduced interest and funding."
      },
      { 
        id: 'b', 
        text: "Technology limitations and lack of data reduced funding and interest", 
        correct: true,
        feedback: "Exactly right! Limited computing power and data availability made progress difficult, leading to reduced funding."
      },
      { 
        id: 'c', 
        text: "All AI researchers went on vacation", 
        correct: false,
        feedback: "Ha! No, the 'winter' is a metaphor for a cold, difficult period in AI research."
      },
      { 
        id: 'd', 
        text: "Computers stopped working in cold weather", 
        correct: false,
        feedback: "The 'winter' is metaphorical - it represents a period when AI progress slowed significantly."
      }
    ]
  },
  
  breakthroughs: {
    question: "What two key factors enabled the AI breakthrough in the 2000s?",
    options: [
      { 
        id: 'a', 
        text: "Faster cars and better phones", 
        correct: false,
        feedback: "Not quite! Think about what AI needs to learn and process information."
      },
      { 
        id: 'b', 
        text: "Massive amounts of digital data and powerful computers", 
        correct: true,
        feedback: "Perfect! The internet provided huge datasets, and faster computers could finally process them effectively."
      },
      { 
        id: 'c', 
        text: "New programming languages and better keyboards", 
        correct: false,
        feedback: "While tools improved, the key breakthroughs were in data availability and processing power."
      },
      { 
        id: 'd', 
        text: "Social media and video games", 
        correct: false,
        feedback: "These contributed data, but the main factors were overall data volume and computational power."
      }
    ]
  },
  
  transformers: {
    question: "What 2017 breakthrough led directly to ChatGPT and modern AI chatbots?",
    options: [
      { 
        id: 'a', 
        text: "The invention of smartphones", 
        correct: false,
        feedback: "Smartphones were already common by 2017. The breakthrough was in AI architecture."
      },
      { 
        id: 'b', 
        text: "The Transformer model with self-attention mechanisms", 
        correct: true,
        feedback: "Excellent! Transformers revolutionized how AI processes language, making ChatGPT possible."
      },
      { 
        id: 'c', 
        text: "Faster internet speeds", 
        correct: false,
        feedback: "While helpful, the key was a new way for AI to understand and process language."
      },
      { 
        id: 'd', 
        text: "Better computer screens", 
        correct: false,
        feedback: "The breakthrough was in AI architecture, not display technology."
      }
    ]
  }
};