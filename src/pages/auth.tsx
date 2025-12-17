'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReCAPTCHA from 'react-google-recaptcha';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { app } from '@/lib/firebase';

const AuthPage = () => {
  const { user, signInWithGoogle, signInWithGithub, signInWithFacebook, loading, error } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async (provider: () => Promise<void>, providerName: string) => {
    setIsSigningIn(providerName);
    try {
      await provider();
    } finally {
      setIsSigningIn(null);
    }
  };

  if (loading && !isSigningIn) {
      return (
          <div className="flex items-center justify-center h-screen">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
  }


  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-6 space-y-4">
                <CardDescription className="text-center">Sign in with your email and password</CardDescription>
                <EmailPasswordForm type="login" />
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button onClick={() => handleSignIn(signInWithGoogle, 'google')} className="w-full" variant="outline" disabled={!!isSigningIn}>
                  {isSigningIn === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" width={20} height={20} className="mr-2" />}
                  Sign in with Google
                </Button>
                <Button onClick={() => handleSignIn(signInWithFacebook, 'facebook')} className="w-full" variant="outline" disabled={!!isSigningIn}>
                  {isSigningIn === 'facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg" alt="Facebook" width={20} height={20} className="mr-2" />}
                  Sign in with Facebook
                </Button>
                {error && <p className="text-sm text-center text-destructive">{error}</p>}
              </TabsContent>
              <TabsContent value="signup" className="pt-6 space-y-4">
                <CardDescription className="text-center">Create a new account with your email and password</CardDescription>
                <EmailPasswordForm type="signup" />
                {error && <p className="text-sm text-center text-destructive">{error}</p>}
              </TabsContent>
              <TabsContent value="phone" className="pt-6 space-y-4">
                <CardDescription className="text-center">Sign in with your phone number</CardDescription>
                <PhoneAuthForm />
                {error && <p className="text-sm text-center text-destructive">{error}</p>}
              </TabsContent>
            </Tabs>

          </CardContent>
        </Card>
      </div>
    </>
  );
};

const EmailPasswordForm: React.FC<{ type: 'login' | 'signup' }> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, loading: authLoading, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!captchaValue) {
      console.error("reCAPTCHA not verified");
      setIsLoading(false);
      return;
    }

    try {
      if (type === 'login') {
        await login(email, password, captchaValue as string);
      } else {
        await signup(email, password, captchaValue as string);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setCaptchaValue(null);
      reCaptchaRef.current?.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${type}-email`} className="block text-sm font-medium mb-1">Email</label>
        <input
          id={`${type}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div>
        <label htmlFor={`${type}-password`} className="block text-sm font-medium mb-1">Password</label>
        <input
          id={`${type}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div className="flex justify-center pt-2">
        <ReCAPTCHA
          sitekey="{process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}"
          ref={reCaptchaRef}
          onChange={(value) => setCaptchaValue(value as string | null)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || authLoading || !captchaValue}>
        {isLoading || authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
      {authError && <p className="text-sm text-center text-destructive">{authError}</p>}
    </form>
  );
};

export default AuthPage;

const PhoneAuthForm = () => {
  return (
    <div>Phone Auth Form</div>
  )
};

// Instructions:
// 1. Get a reCAPTCHA site key from https://www.google.com/recaptcha/admin/create and add it to .env.local as NEXT_PUBLIC_RECAPTCHA_SITE_KEY
// 2. Add the reCAPTCHA secret key to Firebase Functions environment variables: firebase functions:secrets:set RECAPTCHA_SECRET_KEY