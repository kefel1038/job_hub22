import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import JobsList from "@/pages/jobs-list";
import JobDetail from "@/pages/job-detail";
import PostJob from "@/pages/post-job";
import Companies from "@/pages/companies";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient();

function ProtectedDashboard() {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAdmin) return <Redirect to="/admin/login" />;
  return <Dashboard />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={JobsList} />
      <Route path="/jobs/:id" component={JobDetail} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/companies" component={Companies} />
      <Route path="/dashboard" component={ProtectedDashboard} />
      <Route path="/admin/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
