import { useEffect, useState } from "react";
import ReservationTable from "./components/ReservationTable";
import Pagination from "../../shared/elements/Pagination/Pagination";
import { Reservation } from "./types/reservation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const ReservationManagementPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalReservations, setTotalReservations] = useState(0);
  const [deleteReservationId, setDeleteReservationId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/marketplace/reservation/getAll?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearchTerm}&sort=-createdAt`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch reservations");
        }

        const transformedReservations = data.reservations.map(
          (reservation: any) => ({
            ...reservation,
            reservationItems: reservation.reservationItems.map((item: any) => ({
              ...item,
              productName: item.product?.name ?? "N/A",
              taxValue: item.tax?.value ?? 0,
            })),
          }),
        );

        setReservations(transformedReservations || []);
        setTotalReservations(data.totalReservations || 0);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [currentPage, debouncedSearchTerm, itemsPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="mb-4 text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalReservations / itemsPerPage);

  const handleDelete = async (id: string) => {
    setDeleteReservationId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteReservationId) return;

    try {
      const response = await fetch(
        `/api/marketplace/reservation/${deleteReservationId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete reservation");
      }

      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== deleteReservationId,
        ),
      );

      toast.success("Reservation deleted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsModalOpen(false);
      setDeleteReservationId(null);
    }
  };

  return (
    <div className="h-full min-h-screen w-full rounded-lg bg-[url(/images/login-bg.png)] bg-cover">
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          marginTop: "60px",
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
          <div className="relative grid h-full w-full items-center justify-center gap-4">
            <div className="box w-full min-w-[800px] xl:p-8">
              <div className="bb-dashed mb-4 flex items-center justify-between pb-4">
                <p className="ml-4 text-3xl font-bold text-primary">
                  Reservations
                </p>
              </div>

              <div className="mb-5 space-y-4">
                <div className="relative flex w-full gap-2 sm:w-auto sm:min-w-[200px] sm:flex-1">
                  <input
                    type="text"
                    placeholder="Search Reservations by id..."
                    className="w-[400px] rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    🔍
                  </span>
                </div>
              </div>

              <div
                className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
                style={{ maxHeight: "600px", width: "100%" }}
              >
                <ReservationTable
                  data={reservations}
                  loading={loading}
                  onDelete={handleDelete}
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
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        reservation={null}
      />
    </div>
  );
};

export default ReservationManagementPage;
