"use client";

import { Login } from "@/components/login";
import { ReferendumList } from "@/components/referendum-list";
import { useDialog } from "@/lib/providers/dialog";
import { useEffect } from "react";

export default function App() {
  const { openLoginScreen, setOpenLoginScreen } = useDialog();
  useEffect(() => {
    setOpenLoginScreen(true);
  }, []);
  if (openLoginScreen) {
    return <Login />;
  }
  return <div>
    <ReferendumList />
  </div>;
}
