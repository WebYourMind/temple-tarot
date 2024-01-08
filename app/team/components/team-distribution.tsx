import Card from "components/card";
import { thinkingStyleDescriptions } from "lib/ArchetypePieChart";
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

export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0] as { name: ThinkingStyle; value: string };
    const description = name in thinkingStyleDescriptions ? thinkingStyleDescriptions[name] : null;
    return (
      <div className="rounded-lg border bg-background p-2">
        <p className="font-bold">{name}</p>
        <p>
          {value} member{parseFloat(value) > 1 && "s"}
        </p>
        <p className="text-sm">{description}</p>
      </div>
    );
  }

  return null;
};

const ThinkingStyleDistribution = ({ teamMembers }: Props) => {
  // Calculate the distribution of thinking styles
  const styleCounts = teamMembers.reduce((acc: any, member: UserProfile) => {
    const styleKey = member?.dominantStyle ? member.dominantStyle : "Assessment Pending";
    acc[styleKey] = (acc[styleKey] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(styleCounts).map((key) => ({ name: key, value: styleCounts[key] }));

  return (
    <Card>
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-center text-2xl font-bold">Team Distribution</h2>
        <p>(Hover for more info)</p>
        <ResponsiveContainer width="100%" height={300}>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ThinkingStyleDistribution;
