type CardProps = {
  children: JSX.Element;
};

export default function Card({ children }: CardProps) {
  return <div className="w-full max-w-md rounded-lg border p-6">{children}</div>;
}
