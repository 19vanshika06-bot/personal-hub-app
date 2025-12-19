import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/Calendar";
import Tasks from "@/pages/Tasks";
import Notes from "@/pages/Notes";
import Journal from "@/pages/Journal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/notes" component={Notes} />
      <Route path="/journal" component={Journal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
