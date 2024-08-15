"use client";

import Login from "@/components/login";
import { ReferendumList } from "@/components/referendum-list";
import { useAccounts } from "@/lib/providers/account";
import { useDialog } from "@/lib/providers/dialog";
import { useSnackbar } from "@/lib/providers/snackbar";
import { useEffect } from "react";

export default function App() {
  const { openLoginScreen, setOpenLoginScreen } = useDialog();
  const { selectedAccount: activeAccount } = useAccounts();
  const { addMessage } = useSnackbar();

  useEffect(() => {
    if (activeAccount) {
      setOpenLoginScreen(false);
      addMessage({ title: '', content: "Welcome back!", type: "success" });
    } else {
      setOpenLoginScreen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  if (openLoginScreen) {
    return <Login />;
  }

  return <div>
    <ReferendumList />
  </div>;
}
