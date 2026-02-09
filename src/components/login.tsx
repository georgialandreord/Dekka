"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import DropboxIcon from "~/components/ui/DropboxIcon";
import { Loader2 } from "lucide-react";
import { authClient } from "~/server/better-auth/client";
import GoogleIcon from "~/components/ui/google-icon";
import { motion } from "framer-motion";

const Login = () => {
  const [isDropboxLoading, setIsDropboxLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleDropboxLogin = async () => {
    try {
      setIsDropboxLoading(true);

      const data = await authClient.signIn.social({
        provider: "dropbox",
      });

      if (data.data?.url) {
        window.location.href = data.data.url; // Redirect to Dropbox OAuth
      } else {
        setIsDropboxLoading(false);
        console.error("No redirect URL returned from authClient.signIn.social");
      }
    } catch (error) {
      setIsDropboxLoading(false);
      console.error("Error during sign in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      setIsGoogleLoading(false);
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div className="from-primary to-primary/80 flex min-h-screen items-center justify-center bg-linear-to-r px-4 py-8">
      <Card className="border-border/50 w-full max-w-md shadow-lg">
        <CardHeader className="my-5 space-y-1 text-center">
          <div className="bg-primary ring-primary/20 shadow-primary/30 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl shadow-lg ring-1">
            <span className="text-primary-foreground text-2xl font-bold">
              D
            </span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to Dekka
          </CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>

        <CardContent className="my-5 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Button
              type="button"
              variant={"ghost"}
              onClick={handleDropboxLogin}
              disabled={isDropboxLoading || isGoogleLoading}
              className="bg-accent-foreground flex w-full cursor-pointer items-center justify-center p-6 text-white"
            >
              {isDropboxLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <DropboxIcon className="mr-2 h-5 w-5" />
                  Continue with Dropbox
                </>
              )}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Button
              type="button"
              variant={"ghost"}
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isDropboxLoading}
              className="bg-accent flex w-full cursor-pointer items-center justify-center p-6"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Continue with Google
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
