import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { UserContext, UserContextType } from "./Store";
import { Button } from "primereact/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(UserContext) as UserContextType;

  const loggedIn = user?.primaryMembershipId ? true : false;

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("tokenData");
    localStorage.removeItem("expiresAt");

    router.reload();
  };

  return (
    <>
      <nav>
        <div id="nav-inner">
          <Link href="/">
            <h1>Yet Another Destiny App</h1>
          </Link>

          <div className="login-container">
            {loggedIn ? (
              <Button onClick={handleLogout} severity="secondary">
                Log Out
              </Button>
            ) : (
              <a
                href={`https://www.bungie.net/en/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_BUNGIE_APP_CLIENT_ID}&response_type=code`}
                // target="_blank"
                rel="noreferrer">
                <Button>Log In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>
      {children}
      <footer>
        <p>
          &copy; {new Date().getFullYear()} -{" "}
          <a href="https://twitter.com/kindofsticky" target="_blank">
            @kindofsticky
          </a>{" "}
          🤠
        </p>
        <p>Destiny 2 and all related content &copy; Bungie</p>
      </footer>
    </>
  );
}
