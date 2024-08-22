import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import PlaylistsRoute from "./routes/playlistsRoute";
import { MusicKitProvider } from "./components/MusicKitProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/get-playlists",
    element: <PlaylistsRoute />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MusicKitProvider>
      <RouterProvider router={router} />
    </MusicKitProvider>
  </React.StrictMode>
);
