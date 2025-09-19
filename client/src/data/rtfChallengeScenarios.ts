export const RTF_CHALLENGE_SCENARIOS = [
  {
    id: 'lesson-plan',
    title: 'Lesson Planning Assistant',
    description: 'You need to create a engaging lesson plan for teaching fractions to 4th graders.',
    context: 'Your students struggle with understanding fractions conceptually. You want a hands-on approach.',
    hints: [
      'Role: Think about what type of educator would be best for this',
      'Task: Be specific about the grade level and topic',
      'Format: Consider what structure would be most useful for a lesson plan'
    ],
    examplePrompt: 'Act as an elementary math specialist and create an engaging lesson plan for teaching fractions to 4th graders. Include hands-on activities, visual aids, and differentiation strategies. Format as a detailed 45-minute lesson plan with objectives, materials, and step-by-step instructions.'
  },
  {
    id: 'parent-email',
    title: 'Parent Communication',
    description: 'You need to write an email to parents about an upcoming field trip.',
    context: 'The field trip is to a science museum, costs $15, and requires permission slips.',
    hints: [
      'Role: Consider your position and tone',
      'Task: Include all necessary information',
      'Format: Think about email structure and clarity'
    ],
    examplePrompt: 'Act as a 5th grade teacher and write a friendly, informative email to parents about our upcoming science museum field trip. Include the date, cost ($15), educational benefits, and permission slip deadline. Format as a professional but warm email with clear action items.'
  },
  {
    id: 'student-feedback',
    title: 'Student Essay Feedback',
    description: 'You need to provide constructive feedback on a student\'s persuasive essay.',
    context: 'The essay is about climate change, written by an 8th grader, with good ideas but poor organization.',
    hints: [
      'Role: What type of writing instructor perspective?',
      'Task: Balance encouragement with specific improvements',
      'Format: Consider how to structure feedback effectively'
    ],
    examplePrompt: 'Act as a middle school writing coach and provide constructive feedback on an 8th grader\'s persuasive essay about climate change. Focus on organization, evidence use, and argument structure while maintaining an encouraging tone. Format as a feedback rubric with specific examples and suggestions for improvement.'
  },
  {
    id: 'quiz-creation',
    title: 'Assessment Design',
    description: 'You need to create a quiz to assess understanding of the American Revolution.',
    context: 'High school US History class, mix of question types, should take 20 minutes.',
    hints: [
      'Role: Subject matter expert needed',
      'Task: Specify the assessment goals and variety',
      'Format: Clear structure for different question types'
    ],
    examplePrompt: 'Act as a high school history teacher and create a 20-minute quiz on the American Revolution. Include 5 multiple choice questions, 3 short answer questions, and 1 essay question. Format with clear point values, answer key, and grading rubric.'
  }
];

export type RTFChallengeScenario = typeof RTF_CHALLENGE_SCENARIOS[0];