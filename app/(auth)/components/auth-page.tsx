import Link from "next/link";
import { cn } from "lib/utils";
import { buttonVariants } from "components/ui/button";

interface AuthenticationProps {
  heading: string;
  paragraph: string;
  formComponent: JSX.Element;
  link: string;
  linkText: string;
}

const AuthPage: React.FC<AuthenticationProps> = ({ heading, paragraph, formComponent, link, linkText }) => {
  return (
    <>
      <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none">
        <Link
          href={link}
          className={cn(buttonVariants({ variant: "ghost" }), "absolute right-4 top-4 md:right-8 md:top-8")}
        >
          {linkText}
        </Link>
        <div className="pt-20 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
              <p className="text-sm text-muted-foreground">{paragraph}</p>
            </div>
            {formComponent}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
