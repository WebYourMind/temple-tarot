import Card from "components/card";
import { ThinkingStyle, UserProfile } from "lib/types";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Greenish
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#a4de6c", // Light Green
  "#d0ed57", // Lime Green
  "#ffc658", // Gold
  "#A569BD", // Purple
];

type Props = {
  teamMembers: UserProfile[];
};

const ThinkingStyleDistribution = ({ teamMembers }: Props) => {
  // Calculate the distribution of thinking styles
  const styleCounts = teamMembers.reduce((acc: any, member: UserProfile) => {
    acc[(member.dominantStyle as ThinkingStyle) || "Assessment Pending"] =
      (acc[member.dominantStyle as ThinkingStyle] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(styleCounts).map((key) => ({ name: key, value: styleCounts[key] }));

  return (
    <Card>
      <>
        <h2 className="mb-4 text-center text-2xl font-bold">Team Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </>
    </Card>
  );
};

export default ThinkingStyleDistribution;
