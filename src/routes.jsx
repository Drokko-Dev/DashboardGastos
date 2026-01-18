import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { App } from "./App.jsx";
import { Detalle } from "./components/Detalle.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Root Route: All navigation will start from here.
    <Route>
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<App />} />
      <Route path="/detalle" element={<Detalle />} />
    </Route>,
  ),
);
s;
