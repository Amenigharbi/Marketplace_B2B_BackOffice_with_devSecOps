import { FaEdit, FaTrash } from "react-icons/fa";
import { useProductActions } from "../hooks/useProductActions";
import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  isLoading,
  error,
  refetch,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { deleteProduct } = useProductActions();

  const handleDelete = (id: string) => {
    deleteProduct(id).then(() => refetch());
  };

  return (
    <div className="mt-5 overflow-x-auto rounded-lg bg-primary/5 dark:bg-bg3">
      <table className="min-w-full">
        <thead className="sticky top-0 z-10 border-b border-gray-100 bg-primary">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Image
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              BarCode
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              SKU
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Price
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Stock
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Supplier
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading && (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2">Loading products...</p>
                </div>
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-red-600">
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
          {!isLoading && !error && products?.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                <p>No products found.</p>
              </td>
            </tr>
          )}
          {!isLoading &&
            !error &&
            products.map((product) => (
              <tr
                key={product.id}
                className="group transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* Image column */}
                <td className="z-10 bg-white px-4 py-2 text-center dark:bg-bg3">
                  <img
                    src={
                      product.images &&
                      product.images.length > 0 &&
                      product.images[0]?.url
                        ? product.images[0].url
                        : "https://via.placeholder.com/40x40?text=No+Image"
                    }
                    alt={product.name}
                    className="mx-auto h-10 w-10 rounded border border-gray-200 object-cover"
                  />
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {product.barcode}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {product.sku}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {product.price.toFixed(2)} DT
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {product.stock ?? "N/A"}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-900">
                  {product.supplier?.companyName || "N/A"}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-semibold 
                      ${
                        product.productStatus?.actif
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {product.productStatus?.name || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-full p-2 text-blue-500 transition hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full p-2 text-red-500 transition hover:text-red-700"
                      title="Delete"
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
