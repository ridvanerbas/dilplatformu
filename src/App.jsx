import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider.jsx";
import AppRoutes from "./components/routes";
import { Toaster } from "./components/ui/toaster";
import routes from "tempo-routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        >
          <AppRoutes />
          {import.meta.env.VITE_TEMPO === "true" && routes}
          <Toaster />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
