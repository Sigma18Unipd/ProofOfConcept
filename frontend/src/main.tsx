import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css"
import Login from "./features/login/login";
import Landing from './features/landing/landing';
import Register from './features/register/register';
import Edit from './features/edit/edit';
import Dashboard from './features/dashboard/dashboard';

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
  {
    path: "/edit/:id",
    element:  <Edit />
  },
  {
    path: "/dashboard",
    element:  <Dashboard />
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)