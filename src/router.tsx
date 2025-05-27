// src/router.tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Home from "./routes/home";
import About from "./routes/about";
import TodoPage from "./routes/todo";


const rootRoute = createRootRoute({
  component: () => (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-200">
        
        <Link to="/" className="text-blue-600 font-semibold">
          Home
        </Link>
        <Link to="/todo" className="text-blue-600 font-semibold">
          Todo
        </Link>
        <Link to="/about" className="text-blue-600 font-semibold">
          About
        </Link>
      </nav>

      <Outlet />
    </div>
  ),
});

const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: Home,
});

const todoRoute = createRoute({
  path: "/todo",
  getParentRoute: () => rootRoute,
  component: TodoPage,
});

const aboutRoute = createRoute({
  path: "/about",
  getParentRoute: () => rootRoute,
  component: About,
});

const routeTree = rootRoute.addChildren([homeRoute, todoRoute, aboutRoute]);

export const router = createRouter({
  routeTree,
});
