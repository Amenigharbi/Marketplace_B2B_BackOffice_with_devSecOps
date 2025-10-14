import RolePermissionMatrix from "./RBACMatrix";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

export default function RolePermissionsPage() {
  const { sidebarIsOpen } = useGlobalStore();

  return (
    <main
      className={`min-h-screen bg-n10 transition-all duration-300 dark:bg-bg3 ${
        sidebarIsOpen
          ? "ml-80 w-full xxl:w-[calc(100%-280px)] xxxl:w-[calc(100%-336px)] ltr:xxl:ml-[280px] ltr:xxxl:ml-[336px] rtl:xxl:mr-[280px] rtl:xxxl:mr-[336px]"
          : "w-full"
      }`}
    >
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            Role Permissions
          </h1>
        </div>
        <div className="rounded-xl bg-white shadow-sm dark:bg-bg4">
          <RolePermissionMatrix />
        </div>
      </div>
    </main>
  );
}
