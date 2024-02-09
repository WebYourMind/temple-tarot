import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import React from "react";

interface QuizNavigationProps {
  currentPage: number;
  totalPages: number;
  finalQuestionVisible: boolean;
  showSubmit: boolean;
  handlePageChange: (page: number) => void;
  SubmitButton: React.ComponentType; // If SubmitButton is a React component
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentPage,
  totalPages,
  finalQuestionVisible,
  showSubmit,
  handlePageChange,
  SubmitButton,
}) => {
  return (
    <>
      {!finalQuestionVisible ? (
        <div className="flex w-full justify-between">
          {currentPage <= 0 ? (
            <div />
          ) : (
            <Button variant={"outline"} size={"icon"} onClick={() => handlePageChange(currentPage - 1)}>
              <ArrowLeftIcon />
            </Button>
          )}
          {currentPage > 0 &&
            Array.from({ length: totalPages - 1 }, (_, index) => (
              <Button
                className="hidden md:block"
                variant={index + 1 === currentPage ? "secondary" : "ghost"}
                size={"icon"}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          {currentPage >= totalPages - 1 ? (
            <SubmitButton />
          ) : currentPage === 0 ? (
            <Button onClick={() => handlePageChange(currentPage + 1)} className="space-x-1">
              <span>Start</span>
              <ArrowRightIcon />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              size={"icon"}
              className={
                currentPage >= totalPages - 1
                  ? "hidden"
                  : "float-right space-x-1 place-self-end self-end justify-self-end"
              }
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ArrowRightIcon />
            </Button>
          )}
        </div>
      ) : showSubmit ? (
        <div>
          <SubmitButton />
        </div>
      ) : (
        <div className="h-10" />
      )}
    </>
  );
};

export default QuizNavigation;
