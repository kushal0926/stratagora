import Link from "next/link";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

type NavbarSessionProps = {
  isLoggedIn: boolean;
};

export default function NavbarSession({ isLoggedIn }: NavbarSessionProps) {
  if (isLoggedIn) {
    return (
      <Link href="/dashboard">
        <Button
          variant="ghost"
          className="p-5 text-cream hover:bg-kala hover:text-chess cursor-pointer"
        >
          <span className="text-3xl logo">Dashboard</span>
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/signup">
        <button className="auth">
          <span className="font-bold">Join Stratagora</span>
        </button>
      </Link>
      <Link href="/login">
        <button className="login-btn">
          <span className="font-bold ml-2">Login</span>
          <LogIn className="align-middle h-4 w-4 mx-1" />
        </button>
      </Link>
    </>
  );
}
