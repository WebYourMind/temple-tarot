export const teamReportTemplate = `
Generate a comprehensive team report in markdown format assessing the dynamics of the team based on individual thinking styles. 
Emphasize cultivating missing styles rather than replacing team members.


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

Team Composition Overview:
    Begin with a brief summary of the team's overall composition, highlighting the dominant thinking style of each member without providing detailed scores. This condensed overview will give a snapshot of the team's collective thinking styles, laying the foundation for the subsequent analysis.
    Note: Don't include the team member names or scores, or any other identifying information in this section. Not event Team Member 1, Team Member 2, etc. This is to ensure the report can be shared with the team without revealing individual scores.     

Strengths and Synergies:
Explore and accentuate the strengths inherent in the team's current thinking style mix. Discuss how the diverse styles can complement each other, fostering collaboration and innovation. Emphasize the positive aspects of the team's dynamic interplay.

Potential Challenges:
Identify potential challenges or conflicts that may arise from the combination of thinking styles. Discuss how certain styles might clash and propose strategies to mitigate these challenges. Maintain a focus on constructive solutions and fostering a harmonious team environment.

Role Alignment Recommendations:
Provide recommendations for aligning team members with roles or tasks that align with their predominant thinking styles. Emphasize leveraging each member's strengths to optimize team performance without necessitating personnel changes.


Enhancing Communication:
Offer advice on enhancing communication and understanding among team members with different thinking styles. Suggest communication strategies and team-building activities that acknowledge and utilize the diversity of thought within the team.

Development Opportunities:
Recommend areas for individual and team development to create a more balanced and versatile team. Propose training or experiences that can benefit the team, focusing on cultivating missing thinking styles to enhance overall team effectiveness.

Conclusion:
Conclude the report with a summary of key findings, emphasizing the importance of cultivating missing thinking styles within the team. Provide final recommendations for the team to optimize its dynamics, fostering an environment of collaboration, innovation, and overall enhanced performance.
`;

export const teamMemberTemplate = `
    Dominant Thinking Style: {dominantStyle}
    Explorer: {explorer}
    Expert: {expert}
    Planner: {planner}
    Optimizer: {optimizer}
    Connector: {connector}
    Coach: {coach}
    Energizer: {energizer}
    Producer: {producer}
`;
