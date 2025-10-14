import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SettingsProps {
  settings: any;
  partnerId: string;
  onUpdate: (updatedSettings: any) => Promise<void>;
}

const Settings = ({ settings, partnerId, onUpdate }: SettingsProps) => {
  const [formData, setFormData] = useState({
    deliveryType: "",
    deliveryTypeAmount: "",
    freeDeliveryAmount: "",
    loyaltyPointsAmount: "",
    loyaltyPointsUnique: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const joursDisponibles = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const [schedules, setSchedules] = useState<
    { id?: string; day: string; startTime: string; endTime: string }[]
  >([]);

  useEffect(() => {
    if (settings) {
      setFormData({
        deliveryType: settings.deliveryType || "",
        deliveryTypeAmount: settings.deliveryTypeAmount || "",
        freeDeliveryAmount: settings.freeDeliveryAmount || "",
        loyaltyPointsAmount: settings.loyaltyPointsAmount || "",
        loyaltyPointsUnique: settings.loyaltyPointsUnique || "",
      });

      // Make sure we're properly handling the schedules array
      if (settings.schedules && Array.isArray(settings.schedules)) {
        console.log("Setting schedules:", settings.schedules);
        setSchedules(settings.schedules);
      } else {
        console.log("No schedules found, using empty array");
        setSchedules([]);
      }
    } else {
      // Initialize with default values when no settings exist
      setFormData({
        deliveryType: "",
        deliveryTypeAmount: "",
        freeDeliveryAmount: "",
        loyaltyPointsAmount: "",
        loyaltyPointsUnique: "",
      });
      setSchedules([]);
    }
  }, [settings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSchedule = () => {
    const usedDays = schedules.map((s) => s.day);
    const nextDay = joursDisponibles.find((day) => !usedDays.includes(day));
    if (nextDay) {
      setSchedules([
        ...schedules,
        { day: nextDay, startTime: "", endTime: "" },
      ]);
    }
  };

  const handleScheduleChange = (
    index: number,
    field: "day" | "startTime" | "endTime",
    value: string,
  ) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
    console.log(
      `Updated schedule at index ${index}, field ${field}:`,
      newSchedules[index],
    );
  };

  const handleRemoveSchedule = (index: number) => {
    console.log(`Removing schedule at index ${index}:`, schedules[index]);
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  const validateForm = () => {
    if (!formData.deliveryType || !formData.deliveryTypeAmount) {
      setFormError("Please fill in delivery type and amount");
      return false;
    }
    if (schedules.length === 0) {
      setFormError("Please add at least one schedule");
      return false;
    }
    if (schedules.some((s) => !s.startTime || !s.endTime)) {
      setFormError("Please fill in all schedule times");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log("Submitting settings:", {
        ...formData,
        partnerId,
        schedules,
      });

      await onUpdate({
        ...formData,
        partnerId,
        schedules,
      });
      // Removed toast.success here to prevent duplicate
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a debug log in the render to check schedules
  console.log("Current schedules in render:", schedules);

  return (
    <div className="box">
      <div className="mb-6 xxxl:mb-8">
        <h4 className="mb-4 text-xl font-semibold text-n700 dark:text-n0">
          Delivery Settings
        </h4>
        <p className="text-n200 dark:text-n300">
          Configure your delivery options and business hours
        </p>
      </div>

      {/* Error Message */}
      {formError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Type + Amount */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-n700 dark:text-n0">
              Delivery Type
            </label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
            >
              <option disabled value="">
                Select Type
              </option>
              <option value="Fixe">Fixed Rate</option>
              <option value="par KM">Per KM</option>
              <option value="Weight">Weight Based</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-medium text-n700 dark:text-n0">
              Delivery Amount
            </label>
            <input
              type="text"
              name="deliveryTypeAmount"
              placeholder="Amount"
              value={formData.deliveryTypeAmount}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
            />
          </div>
        </div>

        {/* Free Delivery */}
        <div>
          <label className="mb-2 block font-medium text-n700 dark:text-n0">
            Free Delivery From
          </label>
          <input
            type="text"
            name="freeDeliveryAmount"
            placeholder="Enter amount"
            value={formData.freeDeliveryAmount}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
          />
        </div>

        {/* Loyalty Points */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-medium text-n700 dark:text-n0">
              Points Amount
            </label>
            <input
              type="text"
              name="loyaltyPointsAmount"
              placeholder="Points Amount"
              value={formData.loyaltyPointsAmount}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-n700 dark:text-n0">
              Unique Points
            </label>
            <input
              type="text"
              name="loyaltyPointsUnique"
              placeholder="Unique Points"
              value={formData.loyaltyPointsUnique}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-n700 dark:text-n0">
              Value
            </label>
            <input
              type="text"
              value="1 DT"
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-n30 bg-n10 px-4 py-3 text-n700 outline-none dark:border-n600 dark:bg-n800 dark:text-n300"
            />
          </div>
        </div>

        {/* Schedules Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block font-medium text-n700 dark:text-n0">
              Business Hours
            </label>
            {schedules.length < 7 && (
              <button
                type="button"
                onClick={handleAddSchedule}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-n0 transition hover:bg-primary/90"
              >
                <span>+</span>
                <span>Add Schedule</span>
              </button>
            )}
          </div>

          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="rounded-xl border border-n30 bg-n10 p-4 shadow-sm dark:border-n600 dark:bg-n700"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-n700 dark:text-n0">
                    Day
                  </label>
                  <select
                    value={schedule.day}
                    onChange={(e) =>
                      handleScheduleChange(index, "day", e.target.value)
                    }
                    className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
                  >
                    {joursDisponibles
                      .filter(
                        (day) =>
                          !schedules.some(
                            (s, i) => s.day === day && i !== index,
                          ),
                      )
                      .map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-n700 dark:text-n0">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "startTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-n700 dark:text-n0">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "endTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-n30 bg-n0 px-4 py-3 text-n700 outline-none focus:border-primary dark:border-n500 dark:bg-n700 dark:text-n0"
                  />
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveSchedule(index)}
                    className="text-sm font-medium text-secondary2 hover:text-secondary2/80"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end gap-4 border-t border-n30 pt-6 dark:border-n600">
          <button type="submit" disabled={isSubmitting} className="btn px-6">
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
