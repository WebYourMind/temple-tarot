interface AuthenticationProps {
  heading: string;
  paragraph: string;
  formComponent: JSX.Element;
}

const AuthPage: React.FC<AuthenticationProps> = ({ heading, paragraph, formComponent }) => {
  return (
    <div className="mx-auto mt-5 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-sm text-muted-foreground">{paragraph}</p>
      </div>
      {formComponent}
    </div>
  );
};

export default AuthPage;
