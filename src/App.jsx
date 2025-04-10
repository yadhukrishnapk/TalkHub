import React, { Suspense, lazy } from "react";
import { Provider } from "jotai";
import { useAtomValue } from "jotai";
import { globalState } from "./jotai/globalState";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import MainLayout from "./components/MainLayout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import usePresence from "./hooks/usePresence";
import GlobalShimmer from "./components/ui/Shimmers/GlobalShimmer";

// Lazy load components
const Login = lazy(() => import("./Login"));
const Home = lazy(() => import("./components/Home"));
const ProfileSettings = lazy(() => import("./components/settings/ProfileSettings"));
const LightningPage = lazy(() => import("./components/About/LightningPage"));
const ErrorPage = lazy(() => import("./components/Errors/ErrorPage"));

function AppContent() {
  const user = useAtomValue(globalState);
  usePresence();
  
  return (
    <>
      <Toaster />
      <Router>
        <Suspense fallback={<div><GlobalShimmer/></div>}>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/home/:username" element={<Home />} />
              <Route path="/settings" element={<ProfileSettings />} />
              <Route path="/potraits" element={<LightningPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

export default App;