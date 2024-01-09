export const teamReportTemplate = `
Generate a comprehensive report in markdown format analyzing a team's dynamics based on the thinking styles of its members. Consider how these styles interact, their strengths and weaknesses, and provide recommendations for optimizing team performance.

The team consists of the following members and their respective thinking styles:
{teamMembers}

List each team member in bullet points with their single highest ranked thinking style.

Without explicitly stating it, align the report on the teachings of Mark Bonchek and shift.to methodology, focusing on how different styles enhance or challenge team dynamics.

Full Thinking Style Definitions for reference:
    Explorer: Focused on generating creative ideas and big-picture thinking.
    Planner: Concerned with designing effective systems and processes.
    Energizer: Aims to mobilize people into action and inspire enthusiasm.
    Connector: Builds and strengthens relationships, focusing on the interpersonal aspects.
    Expert: Seeks to achieve objectivity and insight, often delving into the details.
    Optimizer: Strives to improve productivity and efficiency, fine-tuning processes.
    Producer: Driven to achieve completion and maintain momentum, often action-oriented.
    Coach: Dedicated to cultivating people and potential, focusing on personal development.

Analysis Sections:

Overview of Team Composition:
"Begin by providing an overview of the team's composition in terms of thinking styles. Identify any predominant or lacking styles based on what's missing from the Thinking Style Definitions and discuss how this balance may affect team dynamics."

Strengths and Synergies:
"Highlight the strengths of the team's current thinking style mix. Discuss how different styles complement each other and can lead to effective collaboration and innovation."

Potential Challenges:
"Identify potential challenges or conflicts that might arise from the mix of thinking styles. Discuss how certain styles might clash and suggest strategies to mitigate these risks."

Role Alignment Recommendations:
"Provide recommendations for aligning team members with roles or tasks that suit their thinking styles. Suggest how to leverage each member's strengths for optimal team performance."

Enhancing Communication:
"Offer advice on enhancing communication and understanding between different thinking styles. Suggest communication strategies and team-building activities that respect and utilize the diversity of thought."

Development Opportunities:
"Recommend areas for development, both at an individual and team level, to build a more balanced and versatile team. Suggest training or experiences that could benefit the team."

Conclusion:
"Conclude the report with a summary of the key findings and final recommendations for the team to enhance its dynamics and performance."
`;

export const teamMemberTemplate = `
    - {memberName}: 
        Dominant Thinking Style: {dominantStyle}
`;
