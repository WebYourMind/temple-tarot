// pages/index.tsx
import ThinkingStyleQuiz from "./components/quiz";
import { getSession } from "lib/auth";

const QuizPage: React.FC = async () => {
  const userId = (await getSession())?.user.id;
  return (
    <div className="container mx-auto my-16 flex h-full max-w-2xl grow flex-col px-5">
      <h1 className="mb-8 text-2xl font-bold">Discover your thinking style</h1>
      {userId && <ThinkingStyleQuiz userId={userId} />}
    </div>
  );
};

export default QuizPage;
