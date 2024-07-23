"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  type: "default" | "success" | "error" | "info";
  title: string;
  content: string;
}

interface SnackbarProps {
  message: Message;
  initialOpen?: boolean;
}

export function Snackbar({ message, initialOpen = false }: SnackbarProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div key={message.id} className={`mx-auto flex max-w-md flex-col items-center justify-between rounded-t-lg bg-transparent px-4 shadow-lg transition-opacity duration-300 translate-y-0 opacity-100 pointer-events-none ${ isOpen ? 'opacity-100' : 'opacity-0' }`}>
      <div
        className={`flex w-full items-center gap-3 p-4 mb-2 rounded-lg relative transition-opacity duration-300 ${ message.type === "default"
          ? "bg-muted/90 text-muted-foreground"
          : message.type === "success"
            ? "bg-secondary/90 text-green-50"
            : message.type === "error"
              ? "bg-red-500/90 text-red-50"
              : "bg-background/90 text-foreground"
          }`}
      >
        <div>
          <BellIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 pr-8 mr-1">
          <p className="text-sm font-medium leading-tight">{message.title}</p>
          <p className="text-sm leading-tight">{message.content}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-muted/50 pointer-events-auto"
          onClick={handleClose}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
}


function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}


function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
