"use client";

import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What are the available product options?",
      answer: "We offer two product options: Unlimited Monthly and Unlimited Yearly. Each grant 77 readings per day.",
    },
    {
      question: "Do the passes and subscriptions renew automatically?",
      answer: "The Unlimited Monthly and Unlimited Yearly plans renew automatically.",
    },
    {
      question: "How many readings do I get per day?",
      answer: "All our product options, including subscriptions and passes, provide 77 readings per day.",
    },
    {
      question: "What happens if my subscription is not renewed at the end of the cycle?",
      answer:
        "If your subscription is not renewed, you will lose access to the 77 daily readings included in the subscription.",
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
