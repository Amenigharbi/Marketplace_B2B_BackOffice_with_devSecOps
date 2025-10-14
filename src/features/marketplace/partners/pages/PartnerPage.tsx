import PartnerTable from "../table/PartnerTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllPartners } from "../hooks/useGetAllPartners";
import { Partner } from "@/types/partner";
import { usePartnerActions } from "../hooks/usePartnerActions";
import { useCreatePartner } from "../hooks/useCreatePartner";
import CreatePartnerModal from "../components/CreatePartnerModal";
import EditPartnerModal from "../components/EditPartnerModal";

interface TypePartner {
  id: string;
  name: string;
}
interface Role {
  id: string;
  name: string;
}

const PartnerPage = () => {
  const { partners, isLoading, error, refetch } = useGetAllPartners();
  const { editPartner, deletePartner } = usePartnerActions();
  const { createPartner } = useCreatePartner();

  // State for type partners dropdown
  const [typePartners, setTypePartners] = useState<TypePartner[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const fetchTypePartners = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/marketplace/typePartner/getAll"),
        ]);
        const [typePartners] = await Promise.all(
          responses.map((res) => res.json()),
        );
        setTypePartners(typePartners.typePartners);
      } catch (error) {
        console.error("Error fetching type partners:", error);
        setTypePartners([]);
        setRoles([]);
      }
    };

    const fetchRoles = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/marketplace/roles/getAll"),
        ]);
        const [roles] = await Promise.all(responses.map((res) => res.json()));
        setRoles(roles.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setTypePartners([]);
        setTypePartners([]);
      }
    };

    fetchTypePartners();
    fetchRoles();
  }, []);

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const searchContent = `
        ${partner.username}
        ${partner.firstName}
        ${partner.lastName}
        ${partner.email}
        ${partner.telephone}
      `.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [partners, searchTerm]);

  // Pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedPartner: Partial<Partner>) => {
    const result = await editPartner(id, {
      ...updatedPartner,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });
    if (result) refetch();
  };

  const handleDelete = async (id: string) => {
    const result = await deletePartner(id);
    if (result) refetch();
  };

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPartners = filteredPartners.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (partner: Partner) => {
    setSelectedPartner(partner);
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
        paddingTop: "30px",
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
          <p className="text-3xl font-bold capitalize text-primary">Partners</p>
          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Search partners..."
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

            <div className="flex h-16 w-56 items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                title="Add new partner"
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
                <span className="hidden md:inline">Add Partner</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="relative flex w-full flex-grow flex-col overflow-y-scroll bg-n10 px-3">
        <PartnerTable
          partners={paginatedPartners}
          isLoading={isLoading}
          error={error}
          onEdit={openEditModal}
          onDelete={handleDelete}
          typePartners={typePartners}
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

        <CreatePartnerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (partnerData) => {
            try {
              await createPartner(partnerData);
              refetch();
              setIsModalOpen(false);
            } catch (error) {
              console.error("Error creating partner:", error);
            }
          }}
          typePartners={typePartners}
          roles={roles}
        />

        {isEditModalOpen && selectedPartner && (
          <EditPartnerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEdit={(updatedData) =>
              handleEdit(selectedPartner.id, updatedData)
            }
            partner={selectedPartner}
            typePartners={typePartners}
            roles={roles}
          />
        )}
      </div>
    </div>
  );
};

export default PartnerPage;
