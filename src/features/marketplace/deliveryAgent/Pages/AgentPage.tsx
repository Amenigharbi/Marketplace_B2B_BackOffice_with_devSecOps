import AgentTable from "../table/AgentTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllAgents } from "../hooks/useGetAllAgents";
import { Agent } from "@/types/agent";
import { useAgentsActions } from "../hooks/useAgentsActions";
import { useCreateAgent } from "../hooks/useCreateAgent";
import CreateAgentModal from "../components/CreateAgentModal";
import EditAgentModal from "../components/EditAgentModal";

const AgentPage = () => {
  const { agent: agents, isLoading, error, refetch } = useGetAllAgents();
  const {
    editAgent,
    deleteAgent,
    isLoading: isActionLoading,
    error: actionError,
  } = useAgentsActions();
  const {
    createAgent,
    isLoading: isCreating,
    error: createError,
  } = useCreateAgent();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAgent, setSortAgent] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = useMemo(() => {
    let result = agents.filter((agent) => {
      const searchContent =
        `${agent.id} ${agent.firstName} ${agent.lastName} ${agent.telephone} ${agent.address}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });

    // Add sorting
    result = result.sort((a, b) => {
      if (sortAgent === "newest") {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      } else {
        return (
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
        );
      }
    });

    return result;
  }, [agents, searchTerm, sortAgent]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  const handleEdit = async (id: string, updatedAgent: Agent) => {
    try {
      const result = await editAgent(id, updatedAgent);
      if (result) {
        refetch();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error editing agent:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAgent(id);
      if (result) {
        refetch();
      }
    } catch (err) {
      console.error("Error deleting agent:", err);
    }
  };

  const handleCreate = async (agentData: Omit<Agent, "id">) => {
    try {
      const result = await createAgent(agentData);
      if (result) {
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAgents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsEditModalOpen(true);
  };

  return (
    <div className="h-full min-h-screen w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
      <div className="flex h-screen w-full flex-col p-4">
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="mb-2 text-3xl font-bold capitalize text-primary md:mb-0">
              Delivery Agent
            </p>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-4">
              <div className="relative w-full md:w-64">
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
              <div className="flex w-full flex-row items-center gap-2 md:w-auto">
                <label htmlFor="sort" className="whitespace-nowrap font-bold">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-auto"
                  value={sortAgent}
                  onChange={(e) =>
                    setSortAgent(e.target.value as "newest" | "oldest")
                  }
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/80"
                title="New Agent"
                disabled={isCreating}
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
                <span>New Agent</span>
              </button>
            </div>
          </div>
          <Divider />
          <div className="relative flex w-full flex-grow flex-col overflow-x-auto overflow-y-scroll bg-n10 px-3">
            <AgentTable
              agent={paginatedAgents}
              isLoading={isLoading || isActionLoading}
              error={error || actionError}
              refetch={refetch}
              isSidebarOpen={false}
              onEdit={(id: string) => {
                const agent = agents.find((c) => c.id === id);
                if (agent) openEditModal(agent);
              }}
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
            <CreateAgentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCreate={handleCreate}
              isLoading={isCreating}
              error={createError}
            />
            {isEditModalOpen && selectedAgent && (
              <EditAgentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onEdit={async (id, updatedCustomer) => {
                  await handleEdit(id, updatedCustomer);
                }}
                agent={selectedAgent}
                isLoading={isActionLoading}
                error={actionError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
