import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SpotifyCallbackPage } from "./components/spotify-callback-page";

const Root = () => {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/callback") {
    return <SpotifyCallbackPage />;
  }

  return <App />;
};

createRoot(document.getElementById("root")!).render(<Root />);
