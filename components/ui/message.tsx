"use client";

const Message = ({ children, error }: { children: string; error?: boolean }) => {
  return (
    <div className={`rounded border p-2 ${error ? "border-red-500 text-red-500" : "border-black"}`}>{children}</div>
  );
};

export default Message;
