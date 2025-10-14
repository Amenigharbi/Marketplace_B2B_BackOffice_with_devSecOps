"use client";

import LogTable from "../Table/LogTable";
import { useGetAllLogs } from "../getLogs/useGetAllLogs";
import { useMemo, useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import { FaRedo } from "react-icons/fa";
//import Pagination from "@mui/material/Pagination";
import styles from "../styles/pagination.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogsPage() {
  const { logs, isLoading, error, refetch } = useGetAllLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "error" | "warning" | "info" | "order" | "milk run"
  >("all");
  const [sortLog, setSortLog] = useState<"newest" | "oldest">("newest");
  const [filters, setFilters] = useState({
    orderId: "",
    username: "",
    product: "",
    sku: "", // Nouveau filtre SKU
    timestamp: { start: "", end: "" },
    isValid: () => {
      if (!tempFilters.timestamp.start && !tempFilters.timestamp.end)
        return true;
      if (tempFilters.timestamp.start && tempFilters.timestamp.end) {
        return (
          new Date(tempFilters.timestamp.start) <=
          new Date(tempFilters.timestamp.end)
        );
      }
      return true;
    },
  });
  const [tempFilters, setTempFilters] = useState({
    orderId: "",
    username: "",
    product: "",
    sku: "",
    timestamp: { start: "", end: "" },
    isValid: () => {
      if (!tempFilters.timestamp.start && !tempFilters.timestamp.end)
        return true;
      if (tempFilters.timestamp.start && tempFilters.timestamp.end) {
        return (
          new Date(tempFilters.timestamp.start) <=
          new Date(tempFilters.timestamp.end)
        );
      }
      return true;
    },
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedLogs, setSelectedLogs] = useState<any[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const onClearSelection = () => setSelectedLogs([]);

  const refetchLogs = async () => {
    await refetch();
    onClearSelection();
    setCurrentPage(1);
  };

  const parseJsonSafely = (data: any) => {
    if (typeof data === "string") {
      if (
        (data.trim().startsWith("{") && data.trim().endsWith("}")) ||
        (data.trim().startsWith("[") && data.trim().endsWith("]"))
      ) {
        try {
          return JSON.parse(data);
        } catch (error) {
          return data;
        }
      }

      return data;
    }

    return data;
  };

  const filteredLogs = useMemo(() => {
    if (error) {
      return [];
    }
    return logs
      .filter((log) => {
        const context = parseJsonSafely(log.context);
        const dataBefore = parseJsonSafely(log.dataBefore);
        const dataAfter = parseJsonSafely(log.dataAfter);

        const searchContent = `${log.type} ${log.message} ${log.timestamp} ${
          context ? JSON.stringify(context) : ""
        } ${dataBefore ? JSON.stringify(dataBefore) : ""} ${
          dataAfter ? JSON.stringify(dataAfter) : ""
        }`.toLowerCase();

        const matchesSearch = searchContent.includes(searchTerm.toLowerCase());

        const matchesTab =
          activeTab === "all" ? true : log.type.toLowerCase() === activeTab;

        const matchesOrderId =
          !filters.orderId ||
          (dataBefore &&
            typeof dataBefore === "object" &&
            "orderId" in dataBefore &&
            dataBefore.orderId.toString() === filters.orderId.toString()) ||
          (dataAfter &&
            typeof dataAfter === "object" &&
            "orderId" in dataAfter &&
            dataAfter.orderId.toString() === filters.orderId.toString());

        const matchesUsername =
          !filters.username ||
          (context &&
            typeof context === "object" &&
            "username" in context &&
            context.username.toLowerCase() === filters.username.toLowerCase());

        const matchesProduct =
          !filters.product ||
          [dataBefore, dataAfter].some((data) => {
            return (
              data &&
              typeof data === "object" &&
              "items" in data &&
              Array.isArray(data.items.updatedItems) &&
              data.items.updatedItems.some((item: any) => {
                return (
                  item.productName &&
                  item.productName.toLowerCase() ===
                    filters.product.toLowerCase()
                );
              })
            );
          });

        const matchesSku =
          !filters.sku ||
          [dataBefore, dataAfter].some((data) => {
            return (
              data &&
              typeof data === "object" &&
              "items" in data &&
              Array.isArray(data.items?.updatedItems) &&
              data.items.updatedItems.some((item: any) => {
                return (
                  item.sku &&
                  item.sku.toLowerCase() === filters.sku.toLowerCase()
                );
              })
            );
          });
        const logDate = new Date(log.timestamp);
        const startDate = filters.timestamp.start
          ? new Date(filters.timestamp.start)
          : null;
        const endDate = filters.timestamp.end
          ? new Date(filters.timestamp.end)
          : null;
        const isDateInRange = (logDate: Date, start: string, end: string) => {
          const logTime = logDate.getTime();
          const startTime = start
            ? new Date(start + "T00:00:00").getTime()
            : -Infinity;
          const endTime = end
            ? new Date(end + "T23:59:59").getTime()
            : Infinity;

          return logTime >= startTime && logTime <= endTime;
        };
        const matchesDate = isDateInRange(
          new Date(log.timestamp),
          filters.timestamp.start,
          filters.timestamp.end,
        );

        return (
          matchesSearch &&
          matchesTab &&
          matchesOrderId &&
          matchesUsername &&
          matchesProduct &&
          matchesSku &&
          matchesDate
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();

        if (sortLog === "newest") {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
  }, [logs, searchTerm, sortLog, activeTab, filters]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Logs");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Type", key: "type", width: 15 },
      { header: "Message", key: "message", width: 30 },
      { header: "Timestamp", key: "timestamp", width: 20 },
      { header: "Context", key: "context", width: 25 },
      { header: "Data Before", key: "dataBefore", width: 25 },
      { header: "Data After", key: "dataAfter", width: 25 },
    ];

    selectedLogs.forEach((log) => {
      if (typeof log === "object" && log !== null) {
        worksheet.addRow({
          id: log.id,
          type: log.type,
          message: log.message,
          timestamp: log.timestamp,
          context: log.context ? JSON.stringify(log.context) : "N/A",
          dataBefore: log.dataBefore ? JSON.stringify(log.dataBefore) : "N/A",
          dataAfter: log.dataAfter ? JSON.stringify(log.dataAfter) : "N/A",
        });
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      FileSaver.saveAs(blob, "logs.xlsx");

      setSelectedLogs([]);
    });
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
          <p className="text-xl font-bold capitalize">Logs</p>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end sm:justify-between">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Rechercher..."
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
              value={sortLog}
              onChange={(e) =>
                setSortLog(e.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              className="ml-5 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300"
              onClick={() => setIsFilterOpen(true)}
            >
              Filtrer
            </button>

            <button
              className={`rounded-md bg-gray-500 px-4 py-2 text-white transition-colors duration-300`}
              onClick={() => {
                setFilters({
                  orderId: "",
                  username: "",
                  product: "",
                  sku: "",
                  timestamp: { start: "", end: "" },
                  isValid: () => true,
                });
                setTempFilters({
                  orderId: "",
                  username: "",
                  product: "",
                  sku: "",
                  timestamp: { start: "", end: "" },
                  isValid: () => {
                    if (
                      !tempFilters.timestamp.start &&
                      !tempFilters.timestamp.end
                    )
                      return true;
                    if (
                      tempFilters.timestamp.start &&
                      tempFilters.timestamp.end
                    ) {
                      return (
                        new Date(tempFilters.timestamp.start) <=
                        new Date(tempFilters.timestamp.end)
                      );
                    }
                    return true;
                  },
                });
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="tab mt-4 flex flex-wrap gap-2 border-b pb-2">
          {["all", "error", "order", "milk run"].map((tab) => (
            <button
              key={tab}
              className={`rounded-t-lg px-4 py-2 ${
                activeTab === tab
                  ? "bg-gray-300 font-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() =>
                setActiveTab(tab as "all" | "error" | "order" | "milk run")
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button
            onClick={() => {
              refetchLogs();
            }}
            className="rounded-t bg-gray-100 px-4 py-2 hover:bg-gray-200"
          >
            <FaRedo className="mr-2" />
          </button>
        </div>
      </div>

      <div style={{ flexGrow: 1, margin: "16px 0", maxHeight: "600px" }}>
        <LogTable
          logs={paginatedLogs}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          selectedLogs={selectedLogs}
          setSelectedLogs={setSelectedLogs}
          isSidebarOpen={isSidebarOpen}
          onClearSelection={onClearSelection}
          onLogSelection={(logId) => {
            const log = logs.find((l) => l.id === logId);
            if (log) {
              setSelectedLogs((prevState) =>
                prevState.some((item) => item.id === log.id)
                  ? prevState.filter((item) => item.id !== log.id)
                  : [...prevState, log],
              );
            }
          }}
        />
      </div>

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {selectedLogs.length > 0 && (
        <div style={{ padding: "16px", textAlign: "right" }}>
          <button
            className="rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
            onClick={handleExport}
          >
            Export Logs
          </button>
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Filter Logs</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Order ID"
                className="rounded-lg border p-2"
                value={tempFilters.orderId}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, orderId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Username"
                className="rounded-lg border p-2"
                value={tempFilters.username}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, username: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Product"
                className="rounded-lg border p-2"
                value={tempFilters.product}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, product: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="SKU"
                className="rounded-lg border p-2"
                value={tempFilters.sku}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, sku: e.target.value })
                }
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Date Range</label>
                <DatePicker
                  selected={
                    tempFilters.timestamp.start
                      ? new Date(tempFilters.timestamp.start)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    const newStart = date?.toISOString().split("T")[0] || "";
                    setTempFilters({
                      ...tempFilters,
                      timestamp: {
                        start: newStart,
                        end:
                          tempFilters.timestamp.end &&
                          newStart > tempFilters.timestamp.end
                            ? ""
                            : tempFilters.timestamp.end,
                      },
                    });
                  }}
                  maxDate={
                    tempFilters.timestamp.end
                      ? new Date(tempFilters.timestamp.end)
                      : undefined
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date de début"
                  className="w-full rounded-lg border p-2"
                  isClearable
                />
                <span className="text-center">to</span>
                <DatePicker
                  selected={
                    tempFilters.timestamp.end
                      ? new Date(tempFilters.timestamp.end)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    const newEnd = date?.toISOString().split("T")[0] || "";
                    setTempFilters({
                      ...tempFilters,
                      timestamp: {
                        ...tempFilters.timestamp,
                        end: newEnd,
                      },
                    });
                  }}
                  minDate={
                    tempFilters.timestamp.start
                      ? new Date(tempFilters.timestamp.start)
                      : undefined
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date de fin"
                  className="w-full rounded-lg border p-2"
                  isClearable
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={() => setIsFilterOpen(false)}
              >
                Close
              </button>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => {
                  if (
                    tempFilters.timestamp.start &&
                    tempFilters.timestamp.end &&
                    new Date(tempFilters.timestamp.start) >
                      new Date(tempFilters.timestamp.end)
                  ) {
                    toast.error(
                      "La date de fin doit être postérieure à la date de début",
                    );
                    return;
                  }
                  setFilters({
                    ...tempFilters,
                    isValid: () => {
                      if (
                        !tempFilters.timestamp.start &&
                        !tempFilters.timestamp.end
                      )
                        return true;
                      if (
                        tempFilters.timestamp.start &&
                        tempFilters.timestamp.end
                      ) {
                        return (
                          new Date(tempFilters.timestamp.start) <=
                          new Date(tempFilters.timestamp.end)
                        );
                      }
                      return true;
                    },
                  });
                  setIsFilterOpen(false);
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
