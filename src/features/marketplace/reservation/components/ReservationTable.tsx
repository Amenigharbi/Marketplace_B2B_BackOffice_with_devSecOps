import { useEffect, useState } from "react";
import ReservationTableHead from "./ReservationTableHead";
import ReservationTableRow from "./ReservationTableRow";
import ReservationTableSkeleton from "./ReservationTableSkeleton";
import { Reservation } from "../types/reservation";

interface ReservationTableProps {
  data: Reservation[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

const ReservationTable = ({
  data,
  loading,
  onDelete,
}: ReservationTableProps) => {
  const [reservations, setReservations] = useState<Reservation[]>(data);

  useEffect(() => {
    setReservations(data);
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <ReservationTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <ReservationTableSkeleton />
          ) : (
            reservations.map((reservation) => (
              <ReservationTableRow
                key={reservation.id}
                reservation={reservation}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
