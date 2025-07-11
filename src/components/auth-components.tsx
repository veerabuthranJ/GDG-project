"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await signInWithPopup(auth, provider);
      // Optional: log user info or redirect
      console.log("User signed in:", result.user);
    } catch (error: any) {
      // Firebase error codes: https://firebase.google.com/docs/auth/admin/errors
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setErrorMsg("Sign-in popup closed before completing sign-in.");
          break;
        case "auth/cancelled-popup-request":
          setErrorMsg("Only one popup request is allowed at a time.");
          break;
        case "auth/popup-blocked":
          setErrorMsg("Your browser blocked the popup. Please allow popups and try again.");
          break;
        case "auth/network-request-failed":
          setErrorMsg("Network error. Check your internet connection and try again.");
          break;
        default:
          setErrorMsg("An unexpected error occurred. Please try again.");
          console.error("Unhandled sign-in error:", error);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleLogin} size="lg" disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>
      {errorMsg && (
        <p className="text-red-500 mt-2 text-sm">{errorMsg}</p>
      )}
    </div>
  );
}
