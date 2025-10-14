import { useEffect, useState } from "react";
import TaxTableHead from "./TaxTableHead";
import TaxTableRow from "./TaxTableRow";
import TaxTableSkeleton from "./TaxTableSkeleton";
import { Tax } from "../types/tax";

interface TaxTableProps {
  data: Tax[];
  loading: boolean;
  onUpdate: (updatedTax: Tax) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TaxTable = ({ data, loading, onUpdate, onDelete }: TaxTableProps) => {
  const [taxes, setTaxes] = useState<Tax[]>(data);

  useEffect(() => {
    setTaxes(data);
  }, [data]);

  const handleUpdateTax = async (updatedTax: Tax) => {
    try {
      await onUpdate(updatedTax);

      setTaxes((prevTaxes) =>
        prevTaxes.map((tax) => (tax.id === updatedTax.id ? updatedTax : tax)),
      );
    } catch (error) {
      console.error("Failed to update tax:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <TaxTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <TaxTableSkeleton />
          ) : (
            taxes.map((tax) => (
              <TaxTableRow
                key={tax.id}
                tax={tax}
                onUpdate={handleUpdateTax}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaxTable;
