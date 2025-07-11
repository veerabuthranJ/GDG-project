"use client";

import { BrainCircuit } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1>HI</h1>
          <h2 className="text-xl font-bold font-headline text-primary">
            Interview Insights Pro
          </h2>
        </div>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-9 w-9">
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (auth) {
                    signOut(auth);
                  } else {
                    console.error("Firebase auth is not initialized.");
                  }
                }}
                className="cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}


