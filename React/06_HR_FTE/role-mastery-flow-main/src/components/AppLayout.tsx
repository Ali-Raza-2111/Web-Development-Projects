import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { CommandBar } from "./CommandBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-[220px] min-h-screen">
        {children}
      </main>
      <CommandBar />
    </div>
  );
}
