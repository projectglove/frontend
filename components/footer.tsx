import useSnackbar from "@/lib/providers/snackbar";
import { Snackbar } from "./ui/snackbar";

export default function Footer() {
  const { messages } = useSnackbar();
  return <div className="fixed inset-x-0 bottom-0 z-100 flex flex-col gap-2 mb-1">
    {messages.map((message) => (
      <Snackbar key={message.id} message={message} />
    ))}
  </div>;
};