import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import HomeSpots from "./components/HomeSpots";
import SpotDetail from "./components/SpotDetail";
import CreateSpot from "./components/CreateSpot";
import MySpots from "./components/MySpots";
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

function IsAuthenticated() {
  const isAuthenticated = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
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
                path: "/spots/:spotId",
                element: <SpotDetail />,
            },

        ],
    },
    {
        element: <IsAuthenticated />,
        children: [
            {
                path: "/my-spots",
                element: <MySpots />,
            },
            {
                path: "/new-spot",
                element: <CreateSpot />,
            },

        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
