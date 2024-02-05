export const teamReportTemplate = `
Generate a detailed team report in markdown format assessing the dynamics of a team based on its members' thinking styles. View the team as a holistic organism with a unique blend of thinking styles, without singling out individual members.

The team consists of {numberOfMembers} members, and this is their collective thinking style map:
{collectiveThinkingStyles}

Full Thinking Style Definitions for reference:
    Explore: Focused on generating creative ideas and big-picture thinking.
    Plan: Concerned with designing effective systems and processes.
    Energize: Aims to mobilize people into action and inspire enthusiasm.
    Connect: Builds and strengthens relationships, focusing on the interpersonal aspects.
    Analyze: Seeks to achieve objectivity and insight, often delving into the details.
    Optimize: Strives to improve productivity and efficiency, fine-tuning processes.
    Achieve: Driven to achieve completion and maintain momentum, often action-oriented.
    Nurture: Dedicated to cultivating people and potential, focusing on personal development.

Analysis Sections:

Collective Strengths: Discuss the stronger thinking styles within the team, their interaction, and how these dynamics contribute to the team's success and challenges.

Diversity in Thinking: Illustrate how the variety of thinking styles within the team is a strategic asset, offering specific scenarios where this diversity leads to innovative solutions or potential challenges.

Gaps and Opportunities: Identify collective gaps in thinking styles and provide positive, strategic advice on how embracing underrepresented styles can lead to more balanced decision-making and problem-solving.

Recommendations for Development: Suggest tailored workshops, training, or activities that address the unique composition of the team's thinking styles, aiming for collective growth and performance enhancement.

Strategies for Collaboration: Offer detailed strategies and communication techniques that cater to the team's unique pattern of thinking styles, promoting effective collaboration and understanding.

Conflict Resolution: Provide approaches or techniques to resolve conflicts arising from diverse thinking styles, ensuring a cohesive and supportive team environment.

Leadership Approaches: Advise on leadership styles or management approaches that are likely to be most effective for guiding and motivating a team with this specific blend of thinking styles.

Team Morale and Well-being: Discuss strategies for maintaining or enhancing team morale and individual well-being, considering the distribution of work and recognition in line with the team's thinking styles.

Long-term Strategies: Provide advice on sustaining a balanced and productive team environment over time, including tips on recruiting, developing, or adapting the team composition to complement the existing thinking styles.

Actionable Goals: Set specific, actionable goals focusing on inclusive participation and collective growth, encouraging the team to engage with and learn from each other's thinking styles.

Leverage: Include scenarios where the team can leverage the strengths of their thinking styles for successful outcomes, reinforcing the value of a multifaceted team approach.

Conclusion: Summarize key findings and provide final recommendations for optimizing team dynamics, fostering an environment of collaboration, innovation, and enhanced performance.
`;

export const teamMemberTemplate = `
    Explore: {explore}
    Analyze: {analyze}
    Plan: {plan}
    Optimize: {optimize}
    Connect: {connect}
    Nurture: {nurture}
    Energize: {energize}
    Achieve: {achieve}
`;

export const styleTemplate = `{name}: {value}%`;
