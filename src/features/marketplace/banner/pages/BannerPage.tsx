import BannerTable from "../table/BannerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "@/features/shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllBanners } from "../hooks/useGetAllBanners";
import { Banner } from "@/types/banner";
import { useBannerActions } from "../hooks/useBannerActions";
import { useCreateBanner } from "../hooks/useCreateBanner";
import CreateBannerModal from "../components/CreateBannerModal";
import EditBannerModal from "../components/EditBannerModal";

const BannerPage = () => {
  const { banners, isLoading, error, refetch } = useGetAllBanners();

  const {
    editBanner,
    deleteBanner,
    isLoading: isActionLoading,
    error: actionError,
  } = useBannerActions();
  const {
    createBanner,
    isLoading: isCreating,
    error: createError,
  } = useCreateBanner();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const filteredBanners = useMemo(() => {
    let filtered = banners.filter((banner) => {
      const searchContent = `${banner.id} ${banner.url} ${
        banner.altText || ""
      } ${banner.description || ""}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    if (sortState === "newest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else {
      filtered = filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }

    return filtered;
  }, [banners, searchTerm, sortState]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (
    id: string,
    updatedBanner: Partial<Banner> & { image?: File | null },
  ) => {
    try {
      const result = await editBanner(id, updatedBanner);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error("Error editing banner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteBanner(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBanners = filteredBanners.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsEditModalOpen(true);
  };

  return (
    <div className="h-full min-h-screen w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
      <div className="flex h-screen w-full flex-col p-4">
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xl font-bold capitalize">Banners</p>
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
              <label
                htmlFor="sort"
                className="mr-2 whitespace-nowrap font-bold"
              >
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
              <div className="flex h-16 w-56 items-center justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn"
                  title="Add new"
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
                  <span className="hidden md:inline">Add banner</span>
                </button>
              </div>
            </div>
          </div>
          <Divider />
          <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
            <BannerTable
              banners={paginatedBanners}
              isLoading={isLoading}
              error={error}
              refetch={refetch}
              onEdit={openEditModal}
              onDelete={handleDelete}
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
            <CreateBannerModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCreate={(bannerData) => {
                createBanner(bannerData, () => {
                  refetch();
                  setIsModalOpen(false);
                });
              }}
            />
            {isEditModalOpen && selectedBanner && (
              <EditBannerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onEdit={(updatedBanner) => {
                  handleEdit(updatedBanner.id, updatedBanner);
                  setIsEditModalOpen(false);
                }}
                initialData={selectedBanner}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerPage;
