"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Title from "../title";
// import { SubmitErrorHandler } from "react-hook-form";

interface LoginModalProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({
  onSuccess,
  onSwitchToSignup,
}: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        toast.error(result.error.message || "Failed to sign in");
      } else {
        toast.success("Welcome back!");
        onSuccess();
        router.refresh();
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Title />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-cream">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-transparent text-cream border border-white/5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-cream">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-transparent text-cream border border-white/5 text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-chess text-ink hover:bg-cream h-11"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <span className="font-bold">Login</span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-cream hover:underline font-medium"
          >
            Create one for free
          </button>
        </p>
      </div>
    </div>
  );
}
