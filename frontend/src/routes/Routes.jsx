import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";
import SignIn from "../Pages/SharedPages/Auth/SignIn";

import Home from "../Pages/SharedPages/Home/Home";
import EmailVerificationPage from "../Pages/EmailVerificationPage";
import SignUp from "../Pages/SharedPages/Auth/SignUp";
import EventCard from "../Pages/SharedPages/AllEvents/EventCards";
import Dashboard from "../Layout/Dashboard";
import AdminAddEvent from "../Pages/AdminPages/AdminAddEvent";
import Profile from "../Pages/SharedPages/Profile/Profile";
import AllUsers from "../Pages/AdminPages/AllUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/events",
        element: <EventCard />,
      },
      {
        path: "/verify-email",
        element: <EmailVerificationPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "addEvents",
        element: <AdminAddEvent />,
      },
      {
        path: "manage-users",
        element: <AllUsers />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signUpFlow",
    element: <SignUp />,
  },
]);
