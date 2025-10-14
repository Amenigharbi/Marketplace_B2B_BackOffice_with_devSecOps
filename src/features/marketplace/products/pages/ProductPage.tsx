import ProductTable from "../table/ProductTable";
import Divider from "@/features/shared/elements/SidebarElements/Divider";
import Pagination from "../../../shared/elements/Pagination/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useGetAllProducts } from "../hooks/useGetAllProducts";
import { Product } from "@/types/product";
import { useProductActions } from "../hooks/useProductActions";
import { useCreateProduct } from "../hooks/useCreateProduct";
import CreateProductModal from "../components/CreateProductModal";
import EditProductModal from "../components/EditProductModal";

const ProductPage = () => {
  const { products, isLoading, error, refetch } = useGetAllProducts();
  const {
    editProduct,
    deleteProduct,
    isLoading: isActionLoading,
    error: actionError,
  } = useProductActions();
  const {
    createProduct,
    isLoading: isCreating,
    error: createError,
  } = useCreateProduct();
  interface Supplier {
    id: string;
    companyName: string;
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [skuPartners, setSkuPartners] = useState([]);

  // Change your state initializations to:
  const [typePcbs, setTypePcbOptions] = useState<any[]>([]);
  const [productTypes, setProductTypeOptions] = useState<any[]>([]);
  const [productStatuses, setProductStatusOptions] = useState<any[]>([]);
  const [suppliers, setSupplierOptions] = useState<Supplier[]>([]);
  const [taxes, setTaxOptions] = useState<any[]>([]);
  const [promotions, setPromotionOptions] = useState<any[]>([]);
  const [subCategories, setSubCategoryOptions] = useState<any[]>([]);
  const [partners, setPartners] = useState<
    Array<{ id: string; username: string }>
  >([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchContent =
        `${product.id} ${product.name} ${product.barcode} ${product.sku}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [products, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleEdit = async (id: string, updatedProduct: Partial<Product>) => {
    const result = await editProduct(id, updatedProduct);
    if (result) {
      refetch();
    }
  };

  useEffect(() => {
    const fetchProductSkuPartners = async () => {
      if (selectedProduct) {
        try {
          const response = await fetch(`/api/marketplace/sku_partner/getAll`);
          const data = await response.json();
          const productSkuPartners = data.skuPartners.filter(
            (sp: any) => sp.productId === selectedProduct.id,
          );
          setSkuPartners(productSkuPartners);
        } catch (error) {
          console.error("Error fetching SKU partners:", error);
        }
      }
    };

    fetchProductSkuPartners();
  }, [selectedProduct]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const endpoints = [
          "/api/marketplace/type_pcb/getAll",
          "/api/marketplace/product_type/getAll",
          "/api/marketplace/product_status/getAll",
          "/api/marketplace/supplier/getAll",
          "/api/marketplace/tax/getAll",
          "/api/marketplace/promotion/getAll",
          "/api/marketplace/sub_category/getAll",
          "/api/marketplace/partners/getAll",
          "/api/marketplace/products/getAll",
        ];

        const responses = await Promise.all(
          endpoints.map((url) =>
            fetch(url).then((res) => {
              if (!res.ok) throw new Error(`Erreur ${res.status} sur ${url}`);
              return res.json();
            }),
          ),
        );

        const [
          typePcbsRes,
          productTypesRes,
          productStatusesRes,
          suppliersRes,
          taxesRes,
          promotionsRes,
          subCategoriesRes,
          partnersRes,
          productsRes,
        ] = responses;
        setTypePcbOptions(typePcbsRes?.typePcbs || []);
        setProductTypeOptions(productTypesRes?.productTypes || []);
        setProductStatusOptions(productStatusesRes?.productStatuses || []);

        setSupplierOptions(
          suppliersRes?.data?.map((supplier: any) => ({
            id: supplier.id,
            companyName: supplier.companyName || "Nom inconnu",
          })) || [],
        );

        setTaxOptions(taxesRes?.taxes || []);
        setPromotionOptions(promotionsRes?.promotions || []);
        setSubCategoryOptions(subCategoriesRes?.subCategories || []);

        setPartners(
          partnersRes?.data?.map((partner: any) => ({
            id: partner.id,
            username:
              partner.username ||
              partner.email ||
              partner.name ||
              "Partenaire sans nom",
          })) || [],
        );
      } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);
    if (result) {
      refetch();
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="box-border flex h-screen w-full flex-col p-4 pt-24">
      <div className="flex-shrink-0 bg-white p-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold capitalize">Products</h1>

          <div className="flex flex-wrap gap-2 sm:items-center sm:justify-end">
            <div className="relative m-4 w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-2 flex items-center">
                🔍
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="whitespace-nowrap font-bold">
                Sort by:
              </label>
              <select
                id="sort"
                className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortState}
                onChange={(e) =>
                  setSortState(e.target.value as "newest" | "oldest")
                }
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="flex h-16 w-56 items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn hover:bg-primary-dark bg-primary text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                <span className="hidden md:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="relative flex w-full flex-grow flex-col overflow-y-auto bg-n10 px-3">
        <ProductTable
          products={paginatedProducts}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </div>

      <Divider />

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        <CreateProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (productData) => {
            try {
              const result = await createProduct(productData);
              if (result) {
                refetch();
                return result;
              }
              return null;
            } catch (error) {
              // Pass the error up to the modal to handle
              throw error;
            }
          }}
          suppliers={suppliers}
          productTypes={productTypes}
          typePcbs={typePcbs}
          productStatuses={productStatuses}
          subCategories={subCategories}
          relatedProducts={products}
          taxes={taxes}
          promotions={promotions}
          partners={partners}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={async (productData) => {
            await editProduct(productData.id, productData);
            refetch();
            setIsEditModalOpen(false);
          }}
          product={selectedProduct}
          suppliers={suppliers}
          productTypes={productTypes}
          typePcbs={typePcbs}
          productStatuses={productStatuses}
          subCategories={subCategories}
          relatedProducts={products}
          taxes={taxes}
          promotions={promotions}
          partners={partners}
          skuPartners={skuPartners}
        />
      </div>
    </div>
  );
};

export default ProductPage;
