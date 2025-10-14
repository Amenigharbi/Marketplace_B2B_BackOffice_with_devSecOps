import { FaEdit, FaTrash } from "react-icons/fa";
import { useSettingsActions } from "../hooks/useSettingsActions";
import { Setting } from "@/types/settings";

interface SettingsTableProps {
  settings: Setting[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (setting: Setting) => void;
  onDelete: (id: string) => void;
  isSidebarOpen: boolean;
}

export default function SettingsTable({
  settings,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: SettingsTableProps) {
  const { deleteSetting } = useSettingsActions();

  const handleDelete = (id: string) => {
    deleteSetting(id).then(() => refetch());
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        className="box mb-5 mt-5 flex w-full justify-between overflow-y-auto rounded-lg bg-primary/5 p-0 dark:bg-bg3"
        style={{ maxHeight: "600px" }}
      >
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-primary">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Partner
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Delivery Type
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Loyalty Points Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading settings...</p>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-red-600">
                  <div className="flex flex-col items-center gap-2">
                    <p>{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && settings?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  <p>No settings found.</p>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              settings.map((setting) => (
                <tr
                  key={setting.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {setting.partner.username}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {setting.deliveryType}
                  </td>

                  <td className="px-4 py-2 text-center text-sm text-gray-900">
                    {setting.loyaltyPointsAmount}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onEdit(setting)}
                      className="mx-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(setting.id)}
                      className="mx-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
