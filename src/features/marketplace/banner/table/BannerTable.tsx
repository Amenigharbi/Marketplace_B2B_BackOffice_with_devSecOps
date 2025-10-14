import { FaEdit, FaTrash } from "react-icons/fa";
import { useBannerActions } from "../hooks/useBannerActions";
import { Banner } from "@/types/banner";
import { formatDate } from "../../../../utils/dateFormatter";
interface BannerTableProps {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function BannerTable({
  banners,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: BannerTableProps) {
  const { deleteBanner } = useBannerActions();

  const handleDelete = (id: string) => {
    deleteBanner(id).then(() => refetch());
  };

  return (
    <div className="mt-5 rounded-lg bg-primary/5 dark:bg-bg3">
      <table className="min-w-full">
        <thead className="sticky top-0 border-b border-gray-100 bg-primary ">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Image
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Alt Text
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Description
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Created At
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Updated At
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-lg text-gray-600">Loading banners...</p>
                </div>
              </td>
            </tr>
          )}

          {error && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-lg text-red-500"
              >
                {error}
              </td>
            </tr>
          )}

          {!isLoading && !error && banners.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-lg text-gray-500"
              >
                No banners found
              </td>
            </tr>
          )}

          {!isLoading &&
            !error &&
            banners.map((banner) => (
              <tr
                key={banner.id}
                className="group transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="left-0 z-10 bg-white px-4 py-2 text-center dark:bg-bg3">
                  <img
                    src={banner.url}
                    alt={banner.altText || "Banner image"}
                    className="mx-auto h-20 w-40 rounded-lg border border-gray-200 object-cover shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=Image+Error";
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {banner.altText || "-"}
                </td>
                <td className="max-w-xs truncate px-4 py-2 text-center text-sm text-gray-900">
                  {banner.description || "-"}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-500">
                  {formatDate(banner.created_at)}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-500">
                  {formatDate(banner.updated_at)}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(banner)}
                      className="rounded-full p-2 text-blue-500 transition hover:text-blue-700"
                      title="Edit Banner"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="rounded-full p-2 text-red-500 transition hover:text-red-700"
                      title="Delete Banner"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
