interface AuthenticationProps {
  heading: string;
  paragraph: string;
  formComponent?: JSX.Element;
  children?: JSX.Element;
}

const AuthPage: React.FC<AuthenticationProps> = ({ heading, paragraph, formComponent, children }) => {
  return (
    <div className="mx-auto mt-16 flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:mt-32">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-sm text-muted-foreground">{paragraph}</p>
      </div>
      {formComponent || children}
    </div>
  );
};

export default AuthPage;
