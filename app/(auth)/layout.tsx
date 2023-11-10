import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">{children}</div>
    </div>
  );
}
