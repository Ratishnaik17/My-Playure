import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/home";

function App() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);

  if (isLoaded && !isSignedIn && !demoAuthenticated) {
    return <Home onSignInSuccess={() => setDemoAuthenticated(true)} />;
  }

  const handleSignOut = async () => {
    setDemoAuthenticated(false);
    localStorage.removeItem("playure_demo_user_name");
    localStorage.removeItem("playure_demo_user_email");
    localStorage.removeItem("playure_demo_user_id");
    if (isSignedIn && signOut) {
      try {
        await signOut();
      } catch (err) {
        console.warn("Clerk sign out error:", err);
      }
    }
  };

  return <Dashboard onSignOut={handleSignOut} clerkUser={user} />;
}

export default App;
