import Card from "components/card";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57", "#ffc658"];

const ThinkingStyleDistribution = ({ teamMembers }: any) => {
  // Calculate the distribution of thinking styles
  const styleCounts = teamMembers.reduce((acc: any, member: any) => {
    acc[member.thinkingStyle] = (acc[member.thinkingStyle] || 0) + 1;
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
