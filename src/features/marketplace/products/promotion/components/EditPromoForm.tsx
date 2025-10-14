"use client";
import { useState, useEffect } from "react";
import { Promotion } from "../types/promo";

const EditPromoForm = ({
  promotion,
  onClose,
  onUpdate,
}: {
  promotion: Promotion;
  onClose: () => void;
  onUpdate: (updatedPromotion: Promotion) => void;
}) => {
  const [promoPrice, setPromoPrice] = useState<number>(promotion.promoPrice);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const start =
      promotion.startDate instanceof Date
        ? promotion.startDate
        : new Date(promotion.startDate);
    const end =
      promotion.endDate instanceof Date
        ? promotion.endDate
        : new Date(promotion.endDate);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, [promotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(promoPrice) || promoPrice <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      setError("Please enter valid dates");
      return;
    }

    if (parsedStartDate >= parsedEndDate) {
      setError("Start date must be before end date");
      return;
    }

    const updatedPromotion: Promotion = {
      ...promotion,
      promoPrice,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    };

    onUpdate(updatedPromotion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6 backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[80vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Edit Promotion
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Promo Price (DT)
          </label>
          <input
            type="number"
            step="0.01"
            value={promoPrice}
            onChange={(e) => setPromoPrice(parseFloat(e.target.value))}
            className={`w-full rounded-md border ${
              error ? "border-red-500" : "border-gray-300"
            } px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
            placeholder="Promotion Price"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPromoForm;
