import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css"
import Login from "./features/login/login";
import Landing from './features/landing/landing';
import Register from './features/register/register';
import Edit from './features/edit/edit';
import AutomationList from './features/automation_list/automation_list';

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
    path: "/automation_list",
    element:  <AutomationList />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)