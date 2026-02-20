import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Sidebar from "./navbar-sidebar";
import NavbarSession from "./navbar-session";

export default async function NavbarAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = Boolean(session);

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden lg:flex items-center gap-4">
        <NavbarSession isLoggedIn={isLoggedIn} />
      </nav>
      <Sidebar isLoggedIn={isLoggedIn} />
    </div>
  );
}
