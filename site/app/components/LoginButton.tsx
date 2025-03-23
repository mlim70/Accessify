"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      console.log("User email: ", session.user.email);
      fetch("http://localhost:3001/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: session.user.email }),
      }).then(res => res.json())
        .then(data => {
          console.log("Backend response:", data);
        }).catch(err => {
          console.error("Error updating user in database:", err);
        });
    }
  }, [session]);
  
  if (session) {
    return (
      <Button
        variant="outline"
        onClick={() => signOut()}
        className="text-gray-700 hover:text-gray-900"
      >
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {signIn("google", { redirect: false })}}
      className="bg-primary hover:bg-primary/90"
    >
      Sign in with Google
    </Button>
  );
}
