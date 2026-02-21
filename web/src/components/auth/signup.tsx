'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Title from '../title';

interface SignupModalProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ onSuccess, onSwitchToLogin }: SignupModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.email({ email, password, name });

      if (result.error) {
        toast.error(result.error.message || 'Failed to create account');
      } else {
        toast.success('Account created! Welcome to Stratagora');
        onSuccess();
        router.refresh();
      }
    } catch (error) {
      console.log(error)
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-8">
        <Title />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-cream">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
           className="h-11 bg-transparent text-cream border border-white/5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-cream">Email</Label>
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
          <Label htmlFor="password" className="text-cream">Password</Label>
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
          <p className="text-xs text-gray-500">Must be at least 8 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-cream">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              Creating account...
            </>
          ) : (
            <span className='font-bold'>Signup</span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-cream hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}