"use client";

import { Button } from "components/ui/button";

import { DialogContent } from "components/ui/dialog";
import ReactMarkdown from "react-markdown";

export default function InfoDialog({ infoContent, closeDialog }) {
  return (
    <DialogContent className="scroll-fade-bottom my-16 max-h-[80vh] w-full max-w-xs overflow-scroll rounded-md px-4 py-0 md:max-w-2xl">
      <ReactMarkdown className="prose prose-sm prose-indigo mx-auto my-4 w-full max-w-full px-4 py-8 leading-relaxed text-foreground">
        {infoContent}
      </ReactMarkdown>
      <div className="flex justify-center">
        <Button onClick={closeDialog}>Got it!</Button>
      </div>
    </DialogContent>
  );
}
