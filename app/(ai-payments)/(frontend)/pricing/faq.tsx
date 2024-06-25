"use client";

import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What are the available product options?",
      answer:
        "We offer four product options: Unlimited Monthly, Unlimited Yearly, Day Pass, and Week Pass. All options grant 22 readings per day.",
    },
    {
      question: "Do the passes and subscriptions renew automatically?",
      answer:
        "The Unlimited Monthly and Unlimited Yearly plans renew automatically. The Day Pass and Week Pass do not automatically renew.",
    },
    {
      question: "How many readings do I get per day?",
      answer: "All our product options, including subscriptions and passes, provide 22 readings per day.",
    },
    {
      question: "Can I purchase additional readings?",
      answer:
        "No, additional readings beyond the 22 per day provided by our plans and passes are not currently available.",
    },
    {
      question: "What happens if my subscription is not renewed at the end of the cycle?",
      answer:
        "If your subscription is not renewed, you will lose access to the 22 daily readings provided by the subscription. You can purchase a Day Pass or Week Pass to continue using the service.",
    },
    {
      question: "Can I switch between different product options?",
      answer:
        "Yes, you can switch between product options. However, please note that passes do not renew automatically, while subscriptions do. There is also no reason to purchase a day or week pass if you already have an active subscription.",
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
