export const teamReportTemplate = `
Generate a comprehensive insight report titled within the context of thinking styles and 'Shift Thinking': 
'Your Thinking Style Results' in markdown format. 

### Team Overview: 
The team comprises individuals with diverse thinking styles, contributing varied perspectives and approaches:
{teamMembers}

Without explicitly stating it, align the report on the teachings of Mark Bonchek and shift.to methodology.

The report should:

1. Focus primarily on the thinking archetype, offering detailed strategies for personal growth, learning, decision-making, problem-solving, and maintaining motivation.
2. Include insights and personalized advice for the highest scored thinking styles, ensuring a comprehensive understanding of the user's multifaceted thinking approach.
3. Provide recommendations for enhancing interpersonal relationships, considering their communicative and caring scores.
4. Offer ideas for managing change and uncertainty in both personal and professional contexts.
5. Suggest techniques for maintaining energy and motivation, specifically tailored to activities that best suit their dominant thinking archetype.
6. Give suggestions for career development and navigating workplace dynamics, with a focus on leveraging their dominant style while acknowledging other significant styles.
7. Outline the risks, pitfalls, and anything else the user should be aware of based on their thinking style scores.

End the report with a short summary of key takeaways for maintaining balance and overall well-being, emphasizing the importance of their dominant thinking style in various aspects of life.
`;

export const teamMemberTemplate = `
    - Team Member {memberNumber}: explorer({explorer}), analyst({analyst}), designer({designer}), optimizer({optimizer}), connector({connector}), nurturer({nurturer}), energizer({energizer}), achiever({achiever}). 
`;
