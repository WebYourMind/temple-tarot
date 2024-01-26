export const teamReportTemplate = `
Generate a comprehensive team report in markdown format assessing the dynamics of the team based on its member's thinking styles. 

The team consists of the following members and their respective thinking styles:
{teamMembers}

Rather than single out individual members, view the team as one whole organism consisting of varying thinking styles.

Full Thinking Style Definitions for reference:
    Explore: Focused on generating creative ideas and big-picture thinking.
    Design: Concerned with designing effective systems and processes.
    Energize: Aims to mobilize people into action and inspire enthusiasm.
    Connect: Builds and strengthens relationships, focusing on the interpersonal aspects.
    Analyze: Seeks to achieve objectivity and insight, often delving into the details.
    Optimize: Strives to improve productivity and efficiency, fine-tuning processes.
    Achieve: Driven to achieve completion and maintain momentum, often action-oriented.
    Nurture: Dedicated to cultivating people and potential, focusing on personal development.

Analysis Sections:

Collective Strengths: Highlight the dominant and stronger thinking styles within the team, explaining how these strengths contribute to the team's success. This positive reinforcement encourages team members to leverage their natural thinking styles for the benefit of the team.

Diversity in Thinking: Acknowledge the diversity of thinking styles specifically present within this team and illustrate how this variety is a strategic asset, fostering creativity, innovation, and comprehensive problem-solving.

Gaps and Opportunities: Instead of pointing out individual deficiencies, the report can identify areas where the team as a whole could benefit from additional perspectives. For instance, if the team collectively scores lower in a certain thinking style, the report can suggest how embracing this style can lead to more balanced decision-making and problem-solving.

Recommendations for Development: Provide suggestions for workshops, training, or team-building activities that can help develop underrepresented thinking styles within the team. These recommendations should be framed positively, as opportunities for growth and learning.

Strategies for Collaboration: Offer strategies or communication techniques that cater to the teams unique pattern of thinking styles, encouraging team members to appreciate and utilize the unique perspectives each member brings to the table.

Actionable Goals: Set actionable goals for the team to work on, focusing on inclusive participation and collective growth. These goals can encourage the team to engage with different thinking styles and learn from each other.

Leverage: Include example scenarios where the team could leverage the strengths of their thinking styles to lead to successful outcomes, reinforcing the value of a multi-faceted team approach.

Conclusion:
Conclude the report with a summary of key findings, emphasizing the importance of cultivating missing thinking styles within the team. Provide final recommendations for the team to optimize its dynamics, fostering an environment of collaboration, innovation, and overall enhanced performance.
`;

export const teamMemberTemplate = `
    Explore: {explore}
    Analyze: {analyze}
    Design: {design}
    Optimize: {optimize}
    Connect: {connect}
    Nurture: {nurture}
    Energize: {energize}
    Achieve: {achieve}
`;
