"use client";

import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is the difference between subscription credits and credit bundles?",
      answer:
        "Subscription credits are granted each month as part of your subscription plan and do not carry over from month to month. Credit bundles are one-time purchases and carry over month to month until they are used.",
    },
    {
      question: "How are credits prioritized?",
      answer: "Subscription credits are always used first before any credits from credit bundles.",
    },
    {
      question: "How many credits do I get with a subscription?",
      answer: "You receive 100 credits per month with your subscription.",
    },
    {
      question: "Can I purchase additional credits?",
      answer:
        "Yes, you can purchase additional credit bundles which will be used after your subscription credits are exhausted.",
    },
    {
      question: "What happens if my subscription is not renewed at the end of the cycle?",
      answer:
        "If your subscription is not renewed, your subscription credits will reset to zero, but any remaining credit bundles will still be available for use.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto my-8 p-4 text-start md:p-8">
      <h1 className="mb-6 text-3xl font-bold">FAQ</h1>
      {faqs.map((faq, index) => (
        <details
          key={index}
          className="mb-4 border-b pb-4"
          open={activeIndex === index}
          onClick={() => toggleFAQ(index)}
        >
          <summary className="cursor-pointer text-xl font-semibold focus:outline-none">{faq.question}</summary>
          <div className="mt-2 text-sm opacity-70">
            <p>{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
};

export default FAQ;
