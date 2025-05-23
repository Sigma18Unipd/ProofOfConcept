import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css"
import Login from "./features/login/login";
import Landing from './features/landing/landing';
import Register from './features/register/register';

const router = createBrowserRouter([
  {
    path: "/",
    element:  <Landing />
  },
  {
    path: "/login",
    element:  <Login />
  },
  {
    path: "/register",
    element:  <Register />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)