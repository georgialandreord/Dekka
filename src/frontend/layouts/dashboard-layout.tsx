import { useState } from "react";
import { Outlet } from "react-router";
import { CollapsibleSidebar } from "~/frontend/components/collapsible-sidebar";
import DashboardHeader from "~/frontend/components/dashboard-header";

export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-sidebar h-screen md:m-2 rounded-2xl fixed z-50 shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:z-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} `}
      >
        <CollapsibleSidebar setMobileMenuOpen={setMobileMenuOpen}/>
      </div>

      {/* Main content */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <DashboardHeader onMobileMenuToggle={toggleMobileMenu} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
