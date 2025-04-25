
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Dashboard from "./pages/Index";
import Login from "./pages/Login";
import MembersPage from "./pages/MembersPage";
import MemberDetailPage from "./pages/MemberDetail";
import MemberFormPage from "./pages/MemberForm";
import MembershipsPage from "./pages/MembershipsPage";
import MembershipFormPage from "./pages/MembershipForm";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/:id" element={<MemberDetailPage />} />
            <Route path="/members/new" element={<MemberFormPage />} />
            <Route path="/members/edit/:id" element={<MemberFormPage />} />
            <Route path="/memberships" element={<MembershipsPage />} />
            <Route path="/memberships/new" element={<MembershipFormPage />} />
            <Route path="/memberships/edit/:id" element={<MembershipFormPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
