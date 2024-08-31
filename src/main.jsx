import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import PlaylistsRoute from "./routes/playlistsRoute";
import { ResultRoute } from "./routes/result";
import { MusicKitProvider } from "./components/MusicKitProvider";
import { PlaylistProvider } from "./components/PlaylistProvider";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from "../theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/get-playlists",
    element: <PlaylistsRoute />,
  },
  {
    path: "/result",
    element: <ResultRoute />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MusicKitProvider>
      <ChakraProvider theme={theme}>
        <PlaylistProvider>
          <RouterProvider router={router} />
        </PlaylistProvider>
      </ChakraProvider>
    </MusicKitProvider>
  </React.StrictMode>
);
