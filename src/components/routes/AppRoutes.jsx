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

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Login />
      ),
    },
    {
      // This is now the main layout route for all protected pages
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <Dashboard />
          ),
          errorElement: <div>Error loading dashboard</div>,
          children: [
            {
              index: true, // Default child for /dashboard
              element: (
                <Default />
              ),
            },
            {
              path: "test/:id?",
              element: (
                <PracticeAndTest />
              ),
            },
            {
              path: "reports",
              element: (
                <Reports />
              ),
            },
            {
              path: "notifications",
              element: (
                <RequestNotification />
              ),
            },
            {
              path: "topics",
              element: (
                <TopicList />
              ),
            },
            {
              path: "user",
              element: <UserDashboard />,
            },
            {
              path: "schedule",
              element: (
                <ManageSchedule />
              ),
            },
          ],
        },
        {
          path: "/test",
          element: (
            <PracticeTest />
          ),
        },
        {
          path: "/test/chat",
          element: (
            <PracticeTestChat />
          ),
        },
        {
          path: "/test/result",
          element: (
            <TestResultPage />
          ),
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/schedule",
          element: (
            <ScheduleSession />
          ),
        },
        {
          path: "/manage-users",
          element: (
            <ManageUser />
          ),
        },
      ],
    },
  ],
  {
    basename: "/comm_buddy_v2.0",   // ✅ Correct placement
  }
);
