import { createContext, useContext, useState, useEffect } from 'react';

interface SnackbarMessage {
  id: number;
  type: 'default' | 'success' | 'error' | 'info';
  title: string;
  content: string;
}

interface SnackbarContextType {
  messages: SnackbarMessage[];
  addMessage: (message: Omit<SnackbarMessage, 'id'>) => void;
  removeMessage: (id: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export default function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }: { children: React.ReactNode; }) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const addMessage = (message: Omit<SnackbarMessage, 'id'>) => {
    const id = new Date().getTime();
    setMessages((prevMessages) => [...prevMessages, { ...message, id }]);
  };

  const removeMessage = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 0) {
        removeMessage(messages[0].id);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <SnackbarContext.Provider value={{ messages, addMessage, removeMessage }}>
      {children}
    </SnackbarContext.Provider>
  );
};
