import { createBrowserRouter } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import ProtectedRoute from "../pages/auth/ProtectedRoute";
import ManageSchedule from "../pages/admin/ManageScheduleOld";
// Lazy-loaded components improve performance by splitting code into smaller chunks
const AppLayout = lazy(() => import("../layout/AppLayout"));
const Login = lazy(() => import("../pages/auth/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const UserDashboard = lazy(() => import("../pages/dashboard/UserDashboardMain"));
const Default = lazy(() => import("../pages/dashboard/Default"));
const Reports = lazy(() => import("../pages/dashboard/Reports"));
const PracticeAndTest = lazy(() => import("../pages/users/PracticeAndTest"));
const PracticeTest = lazy(() => import("../pages/practiceTest/PracticeTest"));
const PracticeTestChat = lazy(() => import("../pages/practiceTest/PracticeTestChat"));
const TestResultPage = lazy(() => import("../pages/practiceTest/TestResultPage"));
const RequestNotification = lazy(() =>
  import("../pages/dashboard/RequestNotification")
);
const TopicList = lazy(() => import("../pages/users/TopicList"));
const ScheduleSession = lazy(() => import("../pages/scheduleSession/ScheduleSession"));
const ManageUser = lazy(() => import("../pages/admin/ManageUser"));
const Settings = lazy(() => import("../pages/setting/Settings"));
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
      // This is now the main layout route for all protected pages
      element: (
        <Suspense fallback={<Loader />}>
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          ),
          errorElement: <div>Error loading dashboard</div>,
          children: [
            {
              index: true, // Default child for /dashboard
              element: (
                <Suspense fallback={<Loader />}>
                  <Default />
                </Suspense>
              ),
            },
            {
              path: "test/:id?",
              element: (
                <Suspense fallback={<Loader />}>
                  <PracticeAndTest />
                </Suspense>
              ),
            },
            {
              path: "reports",
              element: (
                <Suspense fallback={<Loader />}>
                  <Reports />
                </Suspense>
              ),
            },
            {
              path: "notifications",
              element: (
                <Suspense fallback={<Loader />}>
                  <RequestNotification />
                </Suspense>
              ),
            },
            {
              path: "topics",
              element: (
                <Suspense fallback={<Loader />}>
                  <TopicList />
                </Suspense>
              ),
            },
            {
              path: "user",
              element: <UserDashboard />,
            },
            {
              path: "schedule",
              element: (
                <Suspense fallback={<Loader />}>
                  <ManageSchedule />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/test",
          element: (
            <Suspense fallback={<Loader />}>
              <PracticeTest />
            </Suspense>
          ),
        },
        {
          path: "/test/chat",
          element: (
            <Suspense fallback={<Loader />}>
              <PracticeTestChat />
            </Suspense>
          ),
        },
        {
          path: "/test/result",
          element: (
            <Suspense fallback={<Loader />}>
              <TestResultPage />
            </Suspense>
          ),
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/schedule",
          element: (
            <Suspense fallback={<Loader />}>
              <ScheduleSession />
            </Suspense>
          ),
        },
        {
          path: "/manage-users",
          element: (
            <Suspense fallback={<Loader />}>
              <ManageUser />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: "/comm_buddy_v2.0",   // ✅ Correct placement
  }
);
