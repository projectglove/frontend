import { createContext, useContext, useState, useEffect } from 'react';
import { SnackbarContextType, SnackbarMessage } from '../types';

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
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
