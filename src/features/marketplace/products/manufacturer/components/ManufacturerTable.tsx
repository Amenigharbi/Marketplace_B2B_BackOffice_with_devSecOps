import { useEffect, useState } from "react";
import ManufacturerTableHead from "./ManufacturerTableHead";
import ManufacturerTableRow from "./ManufacturerTableRow";
import ManufacturerTableSkeleton from "./ManufacturerTableSkeleton";
import { Manufacturer, Category } from "../types/manufacturer";
interface ManufacturerTableProps {
  data: Manufacturer[];
  categories: Category[];
  loading: boolean;
  onUpdate: (updatedManufacturer: Manufacturer) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (manufacturer: Manufacturer) => void;
}

const ManufacturerTable = ({
  data,
  categories,
  loading,
  onUpdate,
  onDelete,
  onEdit,
}: ManufacturerTableProps) => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(data);

  useEffect(() => {
    setManufacturers(data);
  }, [data]);

  const handleUpdateManufacturer = async (
    updatedManufacturer: Manufacturer,
  ) => {
    try {
      await onUpdate(updatedManufacturer);
      setManufacturers((prevManufacturers) =>
        prevManufacturers.map((manufacturer) =>
          manufacturer.id === updatedManufacturer.id
            ? updatedManufacturer
            : manufacturer,
        ),
      );
    } catch (error) {
      console.error("Failed to update manufacturer:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <ManufacturerTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <ManufacturerTableSkeleton />
          ) : (
            manufacturers.map((manufacturer) => (
              <ManufacturerTableRow
                key={manufacturer.id}
                manufacturer={manufacturer}
                onUpdate={handleUpdateManufacturer}
                onDelete={onDelete}
                onEdit={onEdit}
                categories={categories}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManufacturerTable;
