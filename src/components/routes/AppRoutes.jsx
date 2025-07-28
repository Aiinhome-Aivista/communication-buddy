import { createBrowserRouter } from "react-router";
import React, { lazy, Suspense } from "react";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

// Lazy-loaded components improve performance by splitting code into smaller chunks
const AppLayout = lazy(() => import("../layout/AppLayout"));
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Default = lazy(() => import("../pages/dashboard/Default"));
const Reports = lazy(() => import("../pages/dashboard/Reports"));
const PracticeAndTest = lazy(() => import("../pages/users/PracticeAndTest"));
const RequestNotification = lazy(() =>
  import("../pages/dashboard/RequestNotification")
);
const TopicList = lazy(() => import("../pages/users/TopicList"));

// Loader component for fallback UI
const Loader = () => (
  <div className="text-center text-teal-300 py-6">Loading...</div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<Loader />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        ),
        errorElement: <div>Error loading dashboard</div>,
        children: [
          {
            path: "/dashboard/",
            element: (
              <Suspense fallback={<Loader />}>
                <Default />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/test",
            element: (
              <Suspense fallback={<Loader />}>
                <PracticeAndTest />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/reports",
            element: (
              <Suspense fallback={<Loader />}>
                <Reports />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/notifications",
            element: (
              <Suspense fallback={<Loader />}>
                <RequestNotification />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/topics",
            element: (
              <Suspense fallback={<Loader />}>
                <TopicList />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
