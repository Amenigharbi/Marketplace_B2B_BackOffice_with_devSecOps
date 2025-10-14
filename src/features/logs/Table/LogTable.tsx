"use client";
import { useState, useEffect } from "react";
import ContextModal from "../components/ContextModal";
import { MilkRunUpdatedModal } from "../components/MilkRunUpdated";
import { OrderEditedModal } from "../components/OrderEditedModal";
import { OrderStatusChangedModal } from "../components/OrderStatusChangedModal";

interface LogTableProps {
  logs: any[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isSidebarOpen: boolean;
  onClearSelection: () => void;
  onLogSelection: (id: string) => void;
  selectedLogs: any[];
  setSelectedLogs: (logs: any[]) => void;
}

export default function LogTable({
  logs,
  isLoading,
  error,
  refetch,
  isSidebarOpen,
  onLogSelection,
  onClearSelection,
  selectedLogs,
  setSelectedLogs,
}: LogTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState<any>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "context" | "statusChanged" | "edited" | "milkRunUpdated" | null
  >(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [isAllSelected, setIsAllSelected] = useState(false);

  const filteredLogs = logs; // Define filteredLogs as the full logs array or apply filtering logic if needed.

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set()); // Désélectionner tous les logs
    } else {
      setSelectedRows(new Set(filteredLogs.map((log) => log.id))); // Sélectionner tous les logs visibles
    }
    setIsAllSelected(!isAllSelected); // Inverser l'état de "Sélectionner tout"
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      setIsAllSelected(newSelection.size === logs.length);

      onLogSelection(id);
      return newSelection;
    });
  };

  const handleDataClick = (data: any, message: string) => {
    setSelectedData(data);

    if (
      message.includes("order status changed") ||
      message.includes("order changed") ||
      message.includes("Order status changed") ||
      message.includes("order canceled")
    ) {
      setModalType("statusChanged");
    } else if (message.includes("Order edited")) {
      setModalType("edited");
    } else if (message.includes("milk run updated for order")) {
      setModalType("milkRunUpdated");
    } else {
      return;
    }

    setIsModalOpen(true);
  };

  const handleContextClick = (context: any) => {
    setSelectedContext(context);
    setModalType("context");
    setIsModalOpen(true);
  };
  const safeDataDisplay = (data: any) => {
    if (data === "error") {
      return "Erreur système";
    }

    if (typeof data === "object" && data !== null) {
      return Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : "";
    }

    return data && data !== "" ? data : "";
  };

  const parseJsonSafely = (data: any): any | null => {
    if (typeof data === "object") {
      return data;
    }

    if (data === "error") {
      console.error("Erreur reçue : message d'erreur du serveur.");
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Erreur lors de la lecture du JSON:", error);
      return null;
    }
  };
  useEffect(() => {
    if (selectedLogs.length === 0) {
      setSelectedRows(new Set());
      setIsAllSelected(false);
    }
  }, [selectedLogs]);

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between  rounded-lg bg-primary/5 p-0 dark:bg-bg3 "
        style={{ maxHeight: "600px", overflowY: "auto", position: "relative" }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          style={{ width: "100%", borderSpacing: 0 }}
        >
          <thead
            className="border-b border-gray-100 bg-primary"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 0,
              padding: 0,
              margin: 0,
            }}
          >
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={isAllSelected}
                  className="h-3 w-3 cursor-pointer appearance-none rounded-full border-2 border-gray-400 transition-colors checked:border-blue-500 checked:bg-blue-500 hover:border-blue-600 hover:bg-blue-200"
                />
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Type
              </th>
              <th className="px-6 py-4 text-left text-center text-xs  font-semibold uppercase tracking-wider text-white">
                Message
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Context
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Data Before
              </th>
              <th className="px-6 py-4 text-left text-center text-xs font-semibold uppercase tracking-wider text-white">
                Data After
              </th>
            </tr>
          </thead>
          <tbody className="pt-100 divide-y divide-gray-200 overflow-y-auto">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-600" colSpan={6}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Chargement des logs...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td className="px-4 py-4 text-center text-red-600" colSpan={6}>
                  <div className="flex flex-col items-center gap-2">
                    <p>{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      Réessayer
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && logs.length === 0 && (
              <tr className="cursor-pointer even:bg-primary/5 hover:bg-n60 dark:even:bg-bg3">
                <td className="px-4 py-4 text-center text-gray-500" colSpan={6}>
                  <p>Aucun log ne correspond à vos critères de recherche.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              logs.map((log, index) => {
                const context = parseJsonSafely(log.context);
                const dataBefore = parseJsonSafely(log.dataBefore);
                const dataAfter = parseJsonSafely(log.dataAfter);

                return (
                  <tr
                    key={log.id}
                    className="transition-colors duration-150 hover:bg-gray-50 "
                  >
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(log.id)}
                        onChange={() => toggleRowSelection(log.id)}
                        className="h-3 w-3 cursor-pointer appearance-none rounded-full border-2 border-gray-400 transition-colors checked:border-blue-500 checked:bg-blue-500 hover:border-blue-600 hover:bg-blue-200"
                      />
                    </td>
                    <td className="px-4 py-2  text-center text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          log.type === "error"
                            ? "bg-red-100 text-red-800"
                            : log.type === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : log.type === "info"
                            ? "bg-blue-100 text-blue-800"
                            : log.type === "Order"
                            ? "bg-purple-100 text-purple-800"
                            : log.type === "milk run"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="break-words px-4 py-2 text-center text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString("fr-FR")}
                    </td>
                    <td
                      className="cursor-pointer break-words px-4 py-2 text-center text-sm text-gray-500"
                      onClick={() => handleContextClick(context)}
                    >
                      <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                        {context?.username || " "}
                      </pre>
                    </td>
                    <td
                      className="cursor-pointer break-words px-4 py-2 text-center text-sm text-gray-500"
                      onClick={() => handleDataClick(dataBefore, log.message)}
                    >
                      <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                        {safeDataDisplay(dataBefore?.status)}
                      </pre>
                    </td>
                    <td
                      className="cursor-pointer break-words px-4 py-2 text-center text-sm text-gray-500"
                      onClick={() => handleDataClick(dataAfter, log.message)}
                    >
                      <pre className="whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-xs">
                        {dataAfter?.status || String(dataAfter) || ""}
                      </pre>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {isModalOpen && modalType === "context" && (
          <ContextModal
            data={selectedContext}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {isModalOpen && modalType === "statusChanged" && (
          <OrderStatusChangedModal
            data={selectedData}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {isModalOpen && modalType === "edited" && (
          <OrderEditedModal
            data={selectedData}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {isModalOpen && modalType === "milkRunUpdated" && (
          <MilkRunUpdatedModal
            data={selectedData}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
