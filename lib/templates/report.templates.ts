export const userReportTemplate = `
Objective: Create an insightful and engaging report for someone based on their Thinking Styles assessment results, emphasizing actionable strategies for personal and professional development.
Format: Title the report 'Your Personalized Insight Report' with '{dominantStyle}' as the subheading in markdown format with dominant "{dominantStyle}" thinking styles. 
Voice and Tone: The report should be warm, encouraging, and professional, with an energizing tone that motivates the user towards growth and improvement. It should be genuine, avoiding hyperbole, and respectful of the user's experiences and background. Avoid being generic and don't use placeholders like 'Dear [User]'.
Depth: Each section should be a few sentences or a short paragraph to create a full and nuanced representation for the user that avoids oversimplification
Introduction:
Begin with a personalized greeting that acknowledges the user’s effort in completing the assessment.
Set an optimistic tone for the report, highlighting the opportunity for discovery and growth.
Core Thinking Style Overview:
Provide a detailed description of the user's dominant Thinking Styles, emphasizing their unique strengths in a professional context.
The user's full thinking style profile is as follows: {sortedStyles}. 
Use direct and engaging language to outline how these styles can be advantageous in both personal and work environments.
Strengths and Potential Areas for Growth:
Celebrate the user’s inherent strengths with genuine enthusiasm, illustrating how these can be leveraged for success.
Identify areas for development in a positive light, presenting them as opportunities for expanding their skill set and enhancing versatility.
Real-World Applications:
Offer scenarios where the dominant Thinking Styles can shine, using clear and motivating examples.
Describe representative Role Models for that style, naming notable individuals who exemplify similar Thinking Styles. Provide short, inspiring narratives about how these role models have harnessed their styles for fulfillment and achievement.
Cognitive Flexibility and Style Integration:
Suggest practical ways for blending and adapting Thinking Styles to various situations, emphasizing the benefits of a well-rounded approach.
Encourage openness to exploring less dominant styles, framing this exploration as an exciting aspect of personal growth.
Personalized Development Plan:
Include specific, actionable strategies for developing underrepresented Thinking Styles, encouraging the user to set realistic goals.
Guide users in creating a plan that aligns with their aspirations, using motivating language to spur action.
Communication and Collaboration Insights:
Provide insights on how the user’s Thinking Styles influence their interactions, offering tips for enhancing communication and teamwork.
Use encouraging language to suggest ways for the user to contribute more effectively to team dynamics.
Stress Management and Resilience Building:
Recommend stress management techniques tailored to the user’s Thinking Styles, emphasizing the importance of well-being for sustained performance.
Advise on building resilience, portraying challenges as opportunities for learning and growth.
Conclusion and Next Steps:
Summarize the key takeaways of the report with an uplifting message that reinforces the user’s potential for achieving a balanced and fulfilling personal and professional life.
Close with an invitation for feedback, expressing genuine interest in the user’s thoughts and experiences.
Feedback Mechanism:
Mention the feedback button shown on the page as a simple and accessible way for users to provide feedback on the report, underscoring the value of their input for continuous improvement.
Implementation Notes:
Ensure all recommendations are clear and concise, providing the user with a sense of direction and purpose.
Maintain a professional yet accessible language throughout, making the insights valuable to users from diverse backgrounds and industries.

The Eight Thinking Styles:
These dimensions combine to form eight distinct Thinking Styles, each with unique characteristics and preferences:
Explore (Macro + Head): Focuses on generating creative ideas and big-picture thinking. Explorers are curious, open to new experiences, and thrive on innovation.
Connect (Macro + Heart): Builds and strengthens relationships, emphasizing empathy, communication, and interpersonal understanding. Connectors value harmony and collaboration.
Plan (Macro + How): Concerned with designing effective systems and strategies. Planners are organized, forward-thinking, and excel in mapping out processes.
Energize (Macro + What): Aims to mobilize and inspire action towards achieving goals. Energizers are motivational, enthusiastic, and focus on driving momentum.
Analyze (Micro + Head): Seeks to achieve objectivity and insight through detailed analysis. Analyzers are critical thinkers, meticulous and data-driven.
Nurture (Micro + Heart): Dedicated to supporting and developing others, focusing on empathy and personal growth. Nurturers are compassionate, patient, and encouraging.
Optimize (Micro + How): Strives to improve efficiency and productivity by fine-tuning processes. Optimizers are practical, systematic, and detail-oriented.
Achieve (Micro + What): Driven to complete tasks and achieve results, often with a focus on execution and pragmatism. Achievers are goal-oriented, persistent, and action-focused.

`;
