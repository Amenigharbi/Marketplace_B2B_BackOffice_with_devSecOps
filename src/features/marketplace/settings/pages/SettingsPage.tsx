import { useState, useEffect, useMemo } from "react";
import { useGetAllSettings } from "../hooks/useGetAllSettings";
import { useSettingsActions } from "../hooks/useSettingsActions";
import { useCreateSetting } from "../hooks/useCreateSettings";
import SettingsTable from "../table/settingsTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import CreateSettingModal from "../components/CreateSettingsModal";
import EditSettingModal from "../components/EditSettingsModal";
import { Setting } from "@/types/settings";

const SettingsPage = () => {
  const { settings, isLoading, error, refetch } = useGetAllSettings();
  const {
    editSetting,
    deleteSetting,
    isLoading: isActionLoading,
    error: actionError,
  } = useSettingsActions();
  const {
    createSetting,
    isLoading: isCreating,
    error: createError,
  } = useCreateSetting();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  const filteredSettings = useMemo(() => {
    return settings.filter((setting) => {
      const searchContent =
        `${setting.id} ${setting.deliveryType} ${setting.deliveryTypeAmount} ${setting.freeDeliveryAmount}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [settings, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (updatedSetting: Setting) => {
    const result = await editSetting(updatedSetting.id, updatedSetting);
    refetch();
    if (result) {
      setIsEditModalOpen(false);
      const latest = settings.find((s) => s.id === updatedSetting.id);
      if (latest) {
        setSelectedSetting(latest);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSetting(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSettings = filteredSettings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (setting: Setting) => {
    setSelectedSetting(setting);
    setIsEditModalOpen(true);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        paddingTop: "100px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-3xl font-bold capitalize text-primary">Settings</p>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-between">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-2 flex items-center">
                🔍
              </span>
            </div>

            <label htmlFor="sort" className="mr-2 whitespace-nowrap font-bold">
              Sort by:
            </label>
            <select
              id="sort"
              className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortState}
              onChange={(e) =>
                setSortState(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="flex h-16 w-full items-center justify-center sm:w-56">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn w-full px-4 py-2 text-sm sm:w-auto sm:text-base"
                title="New Setting"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                <span className="hidden md:inline">New Setting</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <SettingsTable
          settings={paginatedSettings}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          onEdit={openEditModal}
          onDelete={handleDelete}
          isSidebarOpen={false}
        />
      </div>

      <Divider />

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <CreateSettingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(newSetting) => {
            createSetting(newSetting, () => {
              refetch();
              setIsModalOpen(false);
            });
          }}
        />

        {isEditModalOpen && selectedSetting && (
          <EditSettingModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={handleEdit}
            setting={selectedSetting}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
