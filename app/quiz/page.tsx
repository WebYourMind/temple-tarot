// pages/index.tsx
import ThinkingStyleQuiz from "./components/quiz";
import { getSession } from "lib/auth";

const Home: React.FC = async () => {
  const userId = (await getSession())?.user.id;
  return (
    <div>
      <h1 className="my-8 text-center text-2xl font-bold">Find out your thinking style!</h1>
      {userId && <ThinkingStyleQuiz userId={userId} />}
    </div>
  );
};

export default Home;
