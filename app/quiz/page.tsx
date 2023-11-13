// pages/index.tsx
import ThinkingStyleQuiz from "./components/quiz";
import { getSession } from "lib/auth";

const QuizPage: React.FC = async () => {
  const userId = (await getSession())?.user.id;
  return (
    <div className="container mx-auto my-16 px-5">
      <h1 className="mb-8 text-2xl font-bold">Discover your thinking style</h1>
      <p className="mb-2 text-sm">
        For this assessment, we aim to understand your natural way of thinking. This isn&apos;t about what you strive to
        do but how you inherently process information and respond to situations, akin to being right or left-handed.
      </p>
      <p className="mb-4 text-sm">
        Please rate how strongly you agree with each statement on a scale from 1 (not at all like me) to 5 (very much
        like me).
      </p>
      {userId && <ThinkingStyleQuiz userId={userId} />}
    </div>
  );
};

export default QuizPage;
