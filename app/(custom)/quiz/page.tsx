import ThinkingStyleQuiz from "./components/quiz";
import { getSession } from "lib/auth";

const QuizPage: React.FC = async () => {
  const userId = (await getSession())?.user.id;
  return (
    <div className="container mx-auto my-16 flex h-full max-w-4xl grow flex-col px-5">
      {userId && <ThinkingStyleQuiz userId={userId} />}
    </div>
  );
};

export default QuizPage;
