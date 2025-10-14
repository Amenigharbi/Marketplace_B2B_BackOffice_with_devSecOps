import { useMainLayout } from "./useMainLayout";
import Sidebar from "@/features/layout/widgets/Sidebar";
import TopNav from "@/features/layout/widgets/TopNavbar";
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const {
    isAdmin,
    isNoEditUser,
    sidebarIsOpen,
    navigateToOrders,
    setSidebarIsOpen,
  } = useMainLayout();
  return (
    <div className="h-screen w-screen overflow-hidden">
      <TopNav setSidebar={setSidebarIsOpen} sidebarIsOpen={sidebarIsOpen} />
      <div className="flex h-[calc(100vh-64px)] pt-16">
        <Sidebar
          isAdmin={isAdmin}
          isNoEditUser={isNoEditUser}
          sidebarIsOpen={sidebarIsOpen}
          setSidebar={setSidebarIsOpen}
          onOrderStatusClick={(status: any) => {
            navigateToOrders();
          }}
        />
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarIsOpen ? "ml-[280px] xxxl:ml-[336px]" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
