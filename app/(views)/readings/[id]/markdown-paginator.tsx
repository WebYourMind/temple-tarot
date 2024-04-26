import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

function MarkdownPaginator({ markdownContent }) {
  // Split the markdown content by '---'
  const sections = markdownContent.split("---");
  const [currentPage, setCurrentPage] = useState(0);

  // Function to handle page change
  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % sections.length);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + sections.length) % sections.length);
  };

  return (
    <div className="markdown-paginator flex h-screen flex-col justify-between">
      <ReactMarkdown className="prose prose-sm prose-indigo mx-auto my-4 flex w-full max-w-full leading-relaxed text-foreground md:prose-lg">
        {sections[currentPage]}
      </ReactMarkdown>
      <div className="mt-4 flex justify-between">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentPage === sections.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

export default MarkdownPaginator;
