import { createBrowserRouter } from "react-router";
import React, { lazy, Suspense } from "react";
import ProtectedRoute from "../pages/auth/ProtectedRoute";
import ManageSchedule from "../pages/admin/ManageSchedule";
import ManageUser from "../pages/admin/ManageUser";
import ScheduleSession from "../pages/scheduleSession/ScheduleSession";

// Lazy-loaded components improve performance by splitting code into smaller chunks
const AppLayout = lazy(() => import("../layout/AppLayout"));
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Default = lazy(() => import("../pages/dashboard/Default"));
const Reports = lazy(() => import("../pages/dashboard/Reports"));
const PracticeAndTest = lazy(() => import("../pages/users/PracticeAndTest"));
const PracticeTest = lazy(() => import("../pages/practiceTest/PracticeTest"));
const RequestNotification = lazy(() =>
  import("../pages/dashboard/RequestNotification")
);
const TopicList = lazy(() => import("../pages/users/TopicList"));
const scheduleSession = lazy(() => import("../pages/scheduleSession/ScheduleSession"));

// Loader component for fallback UI
const Loader = () => (
  <div className="text-center text-teal-300 py-6"></div>
);

export const router = createBrowserRouter(
  [
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
              path: "/dashboard/test/:id?",
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
                  <ProtectedRoute>
                    <TopicList />
                  </ProtectedRoute>
                </Suspense>
              ),
            },
            {
              path: "/dashboard/user",
              element: <ManageUser />,
            },
            {
              path: "/dashboard/schedule",
              element: <ManageSchedule />,
            },
          ],
        },
      ],
    },
    {
      path: "/test",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute>
            <AppLayout>
              <PracticeTest/>
            </AppLayout>  
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/schedule",
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute>
            <AppLayout>
              <ScheduleSession/>
            </AppLayout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
  ],
  {
    basename: "/comm_buddy_v2.0",   // ✅ Correct placement
  }
);
