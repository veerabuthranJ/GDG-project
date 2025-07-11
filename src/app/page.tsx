"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { LoginButton } from '@/components/auth-components';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/interview');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-6 text-center p-8 max-w-md w-full">
        {/* 👇 Add your Google Cloud image here */}
        <img
          src="https://images.seeklogo.com/logo-png/33/1/google-cloud-logo-png_seeklogo-336116.png"
          alt="Interview Insights Logo"
          width={100}
          height={100}
        />

        <h1 className="text-4xl font-bold font-headline text-primary">
          Interview Insights Pro
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back. Please sign in to continue analyzing interviews and gaining valuable insights.
        </p>
        <LoginButton />
      </div>
    </div>
  );
}
