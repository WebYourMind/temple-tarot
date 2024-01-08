"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getRelativePercentages } from "./utils";
import { ThinkingStyle } from "./types";
import { Score } from "./quiz";

export const thinkingStyleDescriptions = {
  Explorer: "Focused on generating creative ideas and big-picture thinking.",
  Expert: "Seeks to achieve objectivity and insight, often delving into the details.",
  Planner: "Concerned with designing effective systems and processes.",
  Optimizer: "Strives to improve productivity and efficiency, fine-tuning processes.",
  Connector: "Builds and strengthens relationships, focusing on the interpersonal aspects.",
  Coach: "Dedicated to cultivating people and potential, focusing on personal development.",
  Energizer: "Aims to mobilize people into action and inspire enthusiasm.",
  Producer: "Driven to achieve completion and maintain momentum, often action-oriented.",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0] as { name: ThinkingStyle; value: string };
    const description = name in thinkingStyleDescriptions ? thinkingStyleDescriptions[name] : null;
    return (
      <div className="rounded-lg border bg-background p-2">
        <p className="font-bold">{name}</p>
        <p>{value}%</p>
        <p className="text-sm">{description}</p>
      </div>
    );
  }

  return null;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57", "#ffc658", "#8884d8"];

type Props = {
  scores: Score;
};

const ArchetypePieChart = ({ scores }: Props) => {
  const relativePercentages = getRelativePercentages(scores);
  const data = [
    {
      name: "Explorer",
      value: relativePercentages[0],
      desc: "Focused on generating creative ideas and big-picture thinking.",
    },
    { name: "Expert", value: relativePercentages[1] },
    { name: "Planner", value: relativePercentages[2] },
    { name: "Optimizer", value: relativePercentages[3] },
    { name: "Connector", value: relativePercentages[4] },
    { name: "Coach", value: relativePercentages[5] },
    { name: "Energizer", value: relativePercentages[6] },
    { name: "Producer", value: relativePercentages[7] },
  ];

  return (
    <div className="my-20 flex flex-col items-center">
      <h3 className="text-xl">Total Scoring</h3>
      <p>(Hover for more info)</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, desc }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend /> */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ArchetypePieChart;
