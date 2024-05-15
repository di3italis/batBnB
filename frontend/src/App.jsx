import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import HomeSpots from "./components/HomeSpots";
import SpotDetail from "./components/SpotDetail";
import ManageSpots from "./components/ManageSpots";
import CreateSpot from "./components/CreateSpot";
import * as sessionActions from "./store/session";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </div>
  );
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomeSpots />,
            },
            {
                path: "*undefined",
                element: <div>404 Not Found</div>,
            },
            {
                path: "/spots/:spotId",
                element: <SpotDetail />,
            },
            {
                path: "/spots/current",
                element: <ManageSpots />,
            },
            {
                path: "/create-spot",
                element: <CreateSpot />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
