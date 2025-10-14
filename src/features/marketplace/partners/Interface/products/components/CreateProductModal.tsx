import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import { useSearchBar } from "@/features/shared/inputs/SearchBar/useSearchBar";

interface Product {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  price: number;
  cost?: number;
  stock?: number;
  description?: string;
  pcb?: string;
  weight?: number;
  minimumQte?: number;
  maximumQte?: number;
  sealable?: number;
  alertQte?: number;
  loyaltyPointsPerProduct?: number;
  loyaltyPointsPerUnit?: number;
  loyaltyPointsBonusQuantity?: number;
  loyaltyPointsThresholdQty?: number;
  supplierId?: string;
  productTypeId?: string;
  typePcbId?: string;
  productStatusId?: string;
  taxId?: string;
  promotionId?: string;
  productSubCategories?: Array<{
    subcategoryId: string;
    subcategory: {
      id: string;
      name: string;
    };
  }>;
  relatedProducts?: Array<{
    relatedProductId: string;
    relatedProduct: {
      id: string;
      name: string;
    };
  }>;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (product: {
    name: string;
    barcode: string;
    sku: string;
    price: number;
    cost?: number;
    stock?: number;
    description?: string;
    pcb?: string;
    weight?: number;
    minimumQte?: number;
    maximumQte?: number;
    sealable?: number;
    alertQte?: number;
    loyaltyPointsPerProduct?: number;
    loyaltyPointsPerUnit?: number;
    loyaltyPointsBonusQuantity?: number;
    loyaltyPointsThresholdQty?: number;
    supplierId?: string;
    productTypeId?: string;
    typePcbId?: string;
    productStatusId?: string;
    taxId?: string;
    promotionId?: string;
    subCategories: string[];
    relatedProducts: string[];
    promo: boolean;
    images?: File[];
    skuPartners?: Array<{
      partnerId: string;
      skuPartner: string;
      stock: number;
      price: number;
      loyaltyPointsPerProduct?: number;
      loyaltyPointsPerUnit?: number;
      loyaltyPointsBonusQuantity?: number;
      loyaltyPointsThresholdQty?: number;
    }>;
  }) => Promise<any>;
  suppliers: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
  partners: Array<{ id: string; username: string }>;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
  suppliers,
  productTypes,
  typePcbs,
  productStatuses,
  subCategories,
  relatedProducts,
  taxes,
  promotions,
  partners,
}: CreateProductModalProps) => {
  const [formState, setFormState] = useState({
    name: "",
    barcode: "",
    sku: "",
    price: 0,
    cost: undefined as number | undefined,
    stock: undefined as number | undefined,
    description: "",
    pcb: "",
    weight: undefined as number | undefined,
    minimumQte: undefined as number | undefined,
    maximumQte: undefined as number | undefined,
    sealable: undefined as number | undefined,
    alertQte: undefined as number | undefined,
    loyaltyPointsPerProduct: undefined as number | undefined,
    loyaltyPointsPerUnit: undefined as number | undefined,
    loyaltyPointsBonusQuantity: undefined as number | undefined,
    loyaltyPointsThresholdQty: undefined as number | undefined,
    supplierId: "",
    productTypeId: "",
    typePcbId: "",
    productStatusId: "",
    taxId: "",
    promotionId: "",
    subCategories: [] as string[],
    relatedProducts: [] as string[],
    promo: false,
    images: [] as File[],
    partnerSku: "", // Single field for partner SKU
    stocks: [] as Array<{
      sourceId: string;
      stockQuantity: number;
      minQty: number;
      maxQty: number;
      price: number;
      loyaltyPointsPerProduct?: number;
      loyaltyPointsPerUnit?: number;
      loyaltyPointsBonusQuantity?: number;
      loyaltyPointsThresholdQty?: number;
    }>,
  });

  const [activeTab, setActiveTab] = useState("basic");

  // Add state for sources
  const [partnerSources, setPartnerSources] = useState<
    Record<string, Array<{ id: string; name: string }>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add these state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<Product>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormState({
        name: "",
        barcode: "",
        sku: "",
        price: 0,
        cost: undefined,
        stock: undefined,
        description: "",
        pcb: "",
        weight: undefined,
        minimumQte: undefined,
        maximumQte: undefined,
        sealable: undefined,
        alertQte: undefined,
        loyaltyPointsPerProduct: undefined,
        loyaltyPointsPerUnit: undefined,
        loyaltyPointsBonusQuantity: undefined,
        loyaltyPointsThresholdQty: undefined,
        supplierId: "",
        productTypeId: "",
        typePcbId: "",
        productStatusId: "",
        taxId: "",
        promotionId: "",
        subCategories: [],
        relatedProducts: [],
        promo: false,
        images: [],
        partnerSku: "", // Single field for partner SKU
        stocks: [], // Empty array for stocks
      });
      setActiveTab("basic");
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleInputChange("images", Array.from(e.target.files));
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const dataLine = lines[1].split(",").map((d) => d.trim());

        const data: Record<string, string> = {};
        headers.forEach((header, index) => {
          data[header] = dataLine[index] || "";
        });

        // Update form state based on CSV data
        setFormState((prev) => ({
          ...prev,
          name: data["name"] || prev.name,
          barcode: data["barcode"] || prev.barcode,
          sku: data["sku"] || prev.sku,
          price: Number(data["price"]) || prev.price,
          cost: Number(data["cost"]) || prev.cost,
          stock: Number(data["stock"]) || prev.stock,
          description: data["description"] || prev.description,
          pcb: data["pcb"] || prev.pcb,
          weight: Number(data["weight"]) || prev.weight,
          minimumQte: Number(data["minimumQte"]) || prev.minimumQte,
          maximumQte: Number(data["maximumQte"]) || prev.maximumQte,
          sealable: Number(data["sealable"]) || prev.sealable,
          alertQte: Number(data["alertQte"]) || prev.alertQte,
          loyaltyPointsPerProduct:
            Number(data["loyaltyPointsPerProduct"]) ||
            prev.loyaltyPointsPerProduct,
          loyaltyPointsPerUnit:
            Number(data["loyaltyPointsPerUnit"]) || prev.loyaltyPointsPerUnit,
          loyaltyPointsBonusQuantity:
            Number(data["loyaltyPointsBonusQuantity"]) ||
            prev.loyaltyPointsBonusQuantity,
          loyaltyPointsThresholdQty:
            Number(data["loyaltyPointsThresholdQty"]) ||
            prev.loyaltyPointsThresholdQty,
        }));

        toast.success("CSV data imported successfully");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
      }
    };
    reader.readAsText(file);
  };

  const handlePartnerSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      partnerSku: e.target.value,
    }));
  };

  const handleStockChange = (stockIndex: number, field: string, value: any) => {
    const updatedStocks = [...formState.stocks];

    // Special handling for price field to ensure it's a float
    if (field === "price") {
      // Parse as float and handle empty values
      let floatValue = value === "" ? 0 : parseFloat(value);
      // If parsing fails, default to 0
      if (isNaN(floatValue)) floatValue = 0;

      updatedStocks[stockIndex] = {
        ...updatedStocks[stockIndex],
        [field]: floatValue,
      };
    } else {
      updatedStocks[stockIndex] = {
        ...updatedStocks[stockIndex],
        [field]: value,
      };
    }

    setFormState((prev) => ({
      ...prev,
      stocks: updatedStocks,
    }));
  };

  // Add a function to get available sources (not already selected)
  const getAvailableSources = (currentIndex: number) => {
    // Get all source IDs that are already selected in other stocks
    const selectedSourceIds = formState.stocks
      .filter((_, i) => i !== currentIndex) // Exclude current stock
      .map((stock) => stock.sourceId)
      .filter(Boolean); // Filter out empty strings or undefined

    // Return only sources that haven't been selected yet
    return Array.isArray(partnerSources)
      ? partnerSources.filter(
          (source) => !selectedSourceIds.includes(source.id),
        )
      : [];
  };
  const addStock = () => {
    setFormState((prev) => ({
      ...prev,
      stocks: [
        ...prev.stocks,
        {
          sourceId: "",
          stockQuantity: 0,
          minQty: 0,
          maxQty: 0,
          price: 0,
        },
      ],
    }));
  };

  const removeStock = (stockIndex: number) => {
    const updatedStocks = [...formState.stocks];
    updatedStocks.splice(stockIndex, 1);

    setFormState((prev) => ({
      ...prev,
      stocks: updatedStocks,
    }));
  };

  // Fetch sources when component mounts
  useEffect(() => {
    const fetchPartnerSources = async () => {
      try {
        const response = await axios.get(`/api/marketplace/source/getAll`);
        if (response.data && response.data.sources) {
          setPartnerSources(response.data.sources);
        }
      } catch (error) {
        console.error("Error fetching partner sources:", error);
        toast.error("Failed to load sources");
      }
    };

    fetchPartnerSources();
  }, []);

  // Add a function to search products by barcode or SKU
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `/api/marketplace/products/search?query=${encodeURIComponent(query)}`,
      );
      if (response.data && Array.isArray(response.data.products)) {
        setSearchResults(response.data.products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to search products");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add a debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const selectProduct = (product: Product) => {
    const subCategoryIds =
      product.productSubCategories?.map((sc) => sc.subcategoryId) || [];
    const relatedProductIds =
      product.relatedProducts?.map((rp) => rp.relatedProductId) || [];

    setFormState({
      name: product.name,
      barcode: product.barcode,
      sku: product.sku,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      description: product.description || "",
      pcb: product.pcb || "",
      weight: product.weight,
      minimumQte: product.minimumQte,
      maximumQte: product.maximumQte,
      sealable: product.sealable,
      alertQte: product.alertQte,
      loyaltyPointsPerProduct: product.loyaltyPointsPerProduct,
      loyaltyPointsPerUnit: product.loyaltyPointsPerUnit,
      loyaltyPointsBonusQuantity: product.loyaltyPointsBonusQuantity,
      loyaltyPointsThresholdQty: product.loyaltyPointsThresholdQty,
      supplierId: product.supplierId || "",
      productTypeId: product.productTypeId || "",
      typePcbId: product.typePcbId || "",
      productStatusId: product.productStatusId || "",
      taxId: product.taxId || "",
      promotionId: product.promotionId || "",
      subCategories: subCategoryIds,
      relatedProducts: relatedProductIds,
      promo: !!product.promotionId,
      images: [],
      partnerSku: "",
      stocks: [],
    });

    setSearchResults([]);
    setSearchTerm("");

    toast.success(`Product "${product.name}" loaded into form`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      toast.error("Product Name is required");
      return;
    }

    if (!formState.barcode.trim()) {
      toast.error("Barcode is required");
      return;
    }

    if (!formState.price || formState.price <= 0) {
      toast.error("Price is required and must be greater than zero");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formState,
        price: Number(formState.price),
        cost: formState.cost ? Number(formState.cost) : undefined,
        stock: formState.stock ? Number(formState.stock) : undefined,
        weight: formState.weight ? Number(formState.weight) : undefined,
        minimumQte: formState.minimumQte
          ? Number(formState.minimumQte)
          : undefined,
        maximumQte: formState.maximumQte
          ? Number(formState.maximumQte)
          : undefined,
        sealable: formState.sealable ? Number(formState.sealable) : undefined,
        alertQte: formState.alertQte ? Number(formState.alertQte) : undefined,
        loyaltyPointsPerProduct: formState.loyaltyPointsPerProduct
          ? Number(formState.loyaltyPointsPerProduct)
          : undefined,
        loyaltyPointsPerUnit: formState.loyaltyPointsPerUnit
          ? Number(formState.loyaltyPointsPerUnit)
          : undefined,
        loyaltyPointsBonusQuantity: formState.loyaltyPointsBonusQuantity
          ? Number(formState.loyaltyPointsBonusQuantity)
          : undefined,
        loyaltyPointsThresholdQty: formState.loyaltyPointsThresholdQty
          ? Number(formState.loyaltyPointsThresholdQty)
          : undefined,
        // Convert empty strings to undefined for relational IDs
        supplierId: formState.supplierId || undefined,
        productTypeId: formState.productTypeId || undefined,
        typePcbId: formState.typePcbId || undefined,
        productStatusId: formState.productStatusId || undefined,
        taxId: formState.taxId || undefined,
        promotionId: formState.promotionId || undefined,
      };

      // Remove partnerSku from the payload as it's not part of the product creation
      const { partnerSku, stocks, ...productPayload } = payload;

      const productResponse = await onCreate(productPayload);

      if (!productResponse || !productResponse.id) {
        throw new Error("Failed to create product");
      }

      const productId = productResponse.id;

      // Create SKU partner and stocks
      if (productId) {
        try {
          // Create SKU partner - partnerId will be added in the route
          const skuPartnerResponse = await axios.post(
            "/api/marketplace/sku_partner/create",
            {
              productId,
              skuPartner: formState.partnerSku || formState.sku, // Use product SKU if empty
              skuProduct: formState.sku,
            },
          );

          if (skuPartnerResponse.data && skuPartnerResponse.data.skuPartner) {
            const skuPartnerId = skuPartnerResponse.data.skuPartner.id;

            // Create stocks for this SKU partner
            const stockPromises = formState.stocks.map((stock) => {
              if (!stock.sourceId) return Promise.resolve();

              return axios.post("/api/marketplace/stock/create", {
                skuPartnerId,
                sourceId: stock.sourceId,
                stockQuantity: stock.stockQuantity,
                minQty: stock.minQty,
                maxQty: stock.maxQty,
                price: parseFloat(stock.price.toString()), // Convert to float
                loyaltyPointsPerProduct: stock.loyaltyPointsPerProduct,
                loyaltyPointsPerUnit: stock.loyaltyPointsPerUnit,
                loyaltyPointsBonusQuantity: stock.loyaltyPointsBonusQuantity,
                loyaltyPointsThresholdQty: stock.loyaltyPointsThresholdQty,
              });
            });

            await Promise.all(stockPromises.filter(Boolean));
          }
        } catch (skuError) {
          console.error("Error creating SKU partner or stocks:", skuError);
          // Continue with success message even if SKU partner creation fails
        }
      }

      toast.success("Product created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Product
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* CSV Upload and Product Search */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Import from CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full rounded-lg border p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by Barcode or SKU
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Enter barcode or SKU to search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border p-2 text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                </div>
              )}

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                  <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                    {searchResults.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-gray-500">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>Barcode: {product.barcode}</span>
                          <span>SKU: {product.sku}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b">
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "basic"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "specs"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "pricing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pricing")}
          >
            Pricing & Stock
          </button>
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "relations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("relations")}
          >
            Relationships
          </button>
          <button
            className={`mr-4 pb-2 text-sm font-medium ${
              activeTab === "partners"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("partners")}
          >
            Partner SKUs
          </button>
        </div>

        {/* Basic Information */}
        {activeTab === "basic" && (
          <div className="space-y-4 pb-6">
            <h3 className="text-xl font-semibold text-primary">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bar Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Bar Code"
                  value={formState.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="SKU"
                  value={formState.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={formState.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full rounded-lg border p-3"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Specifications */}
        {activeTab === "specs" && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Specifications
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PCB
                </label>
                <input
                  type="text"
                  placeholder="PCB"
                  value={formState.pcb}
                  onChange={(e) => handleInputChange("pcb", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <input
                  type="number"
                  placeholder="Weight"
                  value={formState.weight || ""}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min Quantity
                </label>
                <input
                  type="number"
                  placeholder="Min Quantity"
                  value={formState.minimumQte || ""}
                  onChange={(e) =>
                    handleInputChange("minimumQte", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Quantity
                </label>
                <input
                  type="number"
                  placeholder="Max Quantity"
                  value={formState.maximumQte || ""}
                  onChange={(e) =>
                    handleInputChange("maximumQte", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sealable
                </label>
                <input
                  type="number"
                  placeholder="Sealable"
                  value={formState.sealable || ""}
                  onChange={(e) =>
                    handleInputChange("sealable", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alert Quantity
                </label>
                <input
                  type="number"
                  placeholder="Alert Quantity"
                  value={formState.alertQte || ""}
                  onChange={(e) =>
                    handleInputChange("alertQte", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Stock */}
        {activeTab === "pricing" && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Pricing & Stock
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Price"
                  value={formState.price || ""}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost
                </label>
                <input
                  type="number"
                  placeholder="Cost"
                  value={formState.cost || ""}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={formState.stock || ""}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            {/* Loyalty Program */}
            <div className="pt-4">
              <h4 className="mb-3 text-lg font-medium text-gray-800">
                Loyalty Program
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Points Per Product
                  </label>
                  <input
                    type="number"
                    placeholder="Points Per Product"
                    value={formState.loyaltyPointsPerProduct || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "loyaltyPointsPerProduct",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Points Per Unit
                  </label>
                  <input
                    type="number"
                    placeholder="Points Per Unit"
                    value={formState.loyaltyPointsPerUnit || ""}
                    onChange={(e) =>
                      handleInputChange("loyaltyPointsPerUnit", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bonus Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Bonus Quantity"
                    value={formState.loyaltyPointsBonusQuantity || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "loyaltyPointsBonusQuantity",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Threshold Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Threshold Quantity"
                    value={formState.loyaltyPointsThresholdQty || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "loyaltyPointsThresholdQty",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Relationships */}
        {activeTab === "relations" && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-semibold text-primary">
              Relationships
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturer
                </label>
                <select
                  value={formState.supplierId}
                  onChange={(e) =>
                    handleInputChange("supplierId", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Select Manufacturer</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <select
                  value={formState.productTypeId}
                  onChange={(e) =>
                    handleInputChange("productTypeId", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Product Type</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PCB Type
                </label>
                <select
                  value={formState.typePcbId}
                  onChange={(e) =>
                    handleInputChange("typePcbId", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">PCB Type</option>
                  {typePcbs.map((pcb) => (
                    <option key={pcb.id} value={pcb.id}>
                      {pcb.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Status
                </label>
                <select
                  value={formState.productStatusId}
                  onChange={(e) =>
                    handleInputChange("productStatusId", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Product Status</option>
                  {productStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax
                </label>
                <select
                  value={formState.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Select Tax</option>
                  {taxes.map((tax) => (
                    <option key={tax.id} value={tax.id}>
                      {tax.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-Categories & Related Products */}
            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sub-Categories
                </label>
                <Select
                  isMulti
                  name="subCategories"
                  options={subCategories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formState.subCategories.map((id) => {
                    const cat = subCategories.find((c) => c.id === id);
                    return { value: id, label: cat ? cat.name : id };
                  })}
                  onChange={(selected) => {
                    handleInputChange(
                      "subCategories",
                      selected ? selected.map((option) => option.value) : [],
                    );
                  }}
                  placeholder="Search and select subcategories..."
                  noOptionsMessage={() => "No subcategories found"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Related Products
                </label>
                <Select
                  isMulti
                  name="relatedProducts"
                  options={relatedProducts.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formState.relatedProducts.map((id) => {
                    const product = relatedProducts.find((p) => p.id === id);
                    return { value: id, label: product ? product.name : id };
                  })}
                  onChange={(selected) => {
                    handleInputChange(
                      "relatedProducts",
                      selected ? selected.map((option) => option.value) : [],
                    );
                  }}
                  placeholder="Search and select related products..."
                  noOptionsMessage={() => "No related products found"}
                />
              </div>
            </div>

            {/* Promotion */}
            <div className="pt-4">
              <h4 className="mb-3 text-lg font-medium text-gray-800">
                Promotion
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formState.promo}
                  onChange={(e) => handleInputChange("promo", e.target.checked)}
                  className="h-5 w-5"
                  id="promo-checkbox"
                />
                <label
                  htmlFor="promo-checkbox"
                  className="text-sm font-medium text-gray-700"
                >
                  Promo Product
                </label>
              </div>

              {formState.promo && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Promotion
                  </label>
                  <select
                    value={formState.promotionId}
                    onChange={(e) =>
                      handleInputChange("promotionId", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select Promotion</option>
                    {promotions.map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.promoPrice}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="pt-4">
              <h4 className="mb-3 text-lg font-medium text-gray-800">Images</h4>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>
        )}

        {/* Partner SKUs */}
        {activeTab === "partners" && (
          <div className="space-y-4 pt-6 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary">Partner SKU</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Partner SKU
                  </label>
                  <input
                    type="text"
                    value={formState.partnerSku}
                    onChange={handlePartnerSkuChange}
                    className="w-full rounded-lg border p-3"
                    placeholder="Partner's SKU code (leave empty to use product SKU)"
                  />
                </div>

                {/* Stocks Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-md font-medium text-gray-700">
                      Stocks
                    </h5>
                    <button
                      type="button"
                      onClick={addStock}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      Add Stock
                    </button>
                  </div>

                  {formState.stocks.map((stock, stockIndex) => (
                    <div
                      key={stockIndex}
                      className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h6 className="text-sm font-medium">
                          Stock #{stockIndex + 1}
                        </h6>
                        <button
                          type="button"
                          onClick={() => removeStock(stockIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Source
                          </label>
                          <select
                            value={stock.sourceId}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "sourceId",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          >
                            <option value="">Select Source</option>
                            {getAvailableSources(stockIndex).map((source) => (
                              <option key={source.id} value={source.id}>
                                {source.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            value={stock.stockQuantity}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "stockQuantity",
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Minimum Quantity
                          </label>
                          <input
                            type="number"
                            value={stock.minQty}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "minQty",
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Maximum Quantity
                          </label>
                          <input
                            type="number"
                            value={stock.maxQty}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "maxQty",
                                Number(e.target.value),
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Price
                          </label>
                          <input
                            type="number"
                            value={stock.price || ""}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "price",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        {/* Loyalty Points Fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Loyalty Points Per Product
                          </label>
                          <input
                            type="number"
                            value={stock.loyaltyPointsPerProduct || ""}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "loyaltyPointsPerProduct",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Loyalty Points Per Unit
                          </label>
                          <input
                            type="number"
                            value={stock.loyaltyPointsPerUnit || ""}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "loyaltyPointsPerUnit",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Loyalty Points Bonus Quantity
                          </label>
                          <input
                            type="number"
                            value={stock.loyaltyPointsBonusQuantity || ""}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "loyaltyPointsBonusQuantity",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Loyalty Points Threshold Quantity
                          </label>
                          <input
                            type="number"
                            value={stock.loyaltyPointsThresholdQty || ""}
                            onChange={(e) =>
                              handleStockChange(
                                stockIndex,
                                "loyaltyPointsThresholdQty",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className="w-full rounded-lg border p-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formState.stocks.length === 0 && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                      No stocks added. Click &quot;Add Stock&quot; to add stock
                      information.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
