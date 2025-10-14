import { useEffect, useState } from "react";
import PromoTableHead from "./PromotionTableHead";
import PromoTableRow from "./PromotionTableRow";
import PromoTableSkeleton from "./PromotionTableSkeleton";
import { Promotion } from "../types/promo";

interface PromoTableProps {
  data: Promotion[];
  loading: boolean;
  onUpdate: (updatedPromo: Promotion) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (promotion: Promotion) => void;
}

const PromoTable = ({
  data,
  loading,
  onUpdate,
  onDelete,
  onEdit,
}: PromoTableProps) => {
  const [promotions, setPromotions] = useState<Promotion[]>(data);

  useEffect(() => {
    setPromotions(data);
  }, [data]);

  const handleUpdatePromo = async (updatedPromo: Promotion) => {
    try {
      await onUpdate(updatedPromo);
      setPromotions((prevPromotions) =>
        prevPromotions.map((promo) =>
          promo.id === updatedPromo.id ? updatedPromo : promo,
        ),
      );
    } catch (error) {
      console.error("Failed to update promotion:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <PromoTableHead />
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <PromoTableSkeleton />
          ) : (
            promotions.map((promotion) => (
              <PromoTableRow
                key={promotion.id}
                promotion={promotion}
                onUpdate={handleUpdatePromo}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PromoTable;
