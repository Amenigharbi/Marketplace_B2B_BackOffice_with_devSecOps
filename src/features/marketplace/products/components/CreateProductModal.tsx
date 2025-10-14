import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
  suppliers?: Array<{ id: string; companyName: string }>;
  productTypes?: Array<{ id: string; type: string }>;
  typePcbs?: Array<{ id: string; name: string }>;
  productStatuses?: Array<{ id: string; name: string }>;
  subCategories?: Array<{ id: string; name: string }>;
  relatedProducts?: Array<{ id: string; name: string }>;
  taxes?: Array<{ id: string; value: string }>;
  promotions?: Array<{ id: string; promoPrice: string }>;
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
    skuPartners: [] as Array<{
      partnerId: string;
      skuPartner: string;
      stock: number;
      price: number;
      loyaltyPointsPerProduct?: number;
      loyaltyPointsPerUnit?: number;
      loyaltyPointsBonusQuantity?: number;
      loyaltyPointsThresholdQty?: number;
    }>,
    partners: [] as Array<{ id: string; username: string }>,
  });

  const [activeTab, setActiveTab] = useState("basic");

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
        skuPartners: [],
        partners: [],
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

  const handleSkuPartnerChange = (index: number, field: string, value: any) => {
    const updatedPartners = [...formState.skuPartners];
    updatedPartners[index] = {
      ...updatedPartners[index],
      [field]: value,
    };
    setFormState((prev) => ({ ...prev, skuPartners: updatedPartners }));
  };

  const addSkuPartner = () => {
    setFormState((prev) => ({
      ...prev,
      skuPartners: [
        ...prev.skuPartners,
        {
          partnerId: "",
          skuPartner: "",
          stock: 0,
          price: 0,
        },
      ],
    }));
  };

  const removeSkuPartner = (index: number) => {
    const updatedPartners = [...formState.skuPartners];
    updatedPartners.splice(index, 1);
    setFormState((prev) => ({ ...prev, skuPartners: updatedPartners }));
  };

  const getAvailablePartners = (currentIndex: number) => {
    const selectedPartnerIds = formState.skuPartners
      .filter((_, i) => i !== currentIndex)
      .map((p) => p.partnerId);

    return (partners || []).filter((p) => !selectedPartnerIds.includes(p.id));
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.sku || !formState.price) {
      toast.error("Please fill in required fields");
      return;
    }

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
        supplierId: formState.supplierId || undefined,
        productTypeId: formState.productTypeId || undefined,
        typePcbId: formState.typePcbId || undefined,
        productStatusId: formState.productStatusId || undefined,
        taxId: formState.taxId || undefined,
        promotionId: formState.promotionId || undefined,
        skuPartners:
          formState.skuPartners.length > 0 ? formState.skuPartners : undefined,
      };

      const result = await onCreate(payload);
      if (result) {
        onClose();
      }
    } catch (error) {
      // Handle errors without closing the modal
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";

      if (errorMessage.includes("Barcode already exists")) {
        toast.error(
          "This barcode already exists. Please use a different barcode.",
        );
      } else if (errorMessage.includes("SKU already exists")) {
        toast.error("This SKU already exists. Please use a different SKU.");
      } else if (errorMessage.toLowerCase().includes("unique constraint")) {
        if (errorMessage.toLowerCase().includes("barcode")) {
          toast.error(
            "This barcode already exists. Please use a different barcode.",
          );
        } else if (errorMessage.toLowerCase().includes("sku")) {
          toast.error("This SKU already exists. Please use a different SKU.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }

      console.error("Error details:", error);
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

        {/* CSV Upload and SKU Search */}
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
                  Product Name *
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
                  Bar Code
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
                  SKU *
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
                  Price *
                </label>
                <input
                  type="number"
                  placeholder="Price *"
                  value={formState.price}
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
                  {suppliers?.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.companyName}
                    </option>
                  ))}
                </select>{" "}
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
                  {productTypes?.map((type) => (
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
                  {typePcbs?.map((pcb) => (
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
                  {productStatuses?.map((status) => (
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
                  {taxes?.map((tax) => (
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
                <select
                  multiple
                  value={formState.subCategories}
                  onChange={(e) =>
                    handleInputChange(
                      "subCategories",
                      Array.from(e.target.selectedOptions).map((o) => o.value),
                    )
                  }
                  className="w-full rounded-lg border p-3"
                  size={5}
                >
                  {subCategories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Related Products
                </label>
                <select
                  multiple
                  value={formState.relatedProducts}
                  onChange={(e) =>
                    handleInputChange(
                      "relatedProducts",
                      Array.from(e.target.selectedOptions).map((o) => o.value),
                    )
                  }
                  className="w-full rounded-lg border p-3"
                  size={5}
                >
                  {relatedProducts?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
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
                    {promotions?.map((promo) => (
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
            <h3 className="text-xl font-semibold text-primary">Partner SKUs</h3>
            <div className="space-y-4">
              {formState.skuPartners.map((partner, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">Partner SKU #{index + 1}</h4>
                    <button
                      onClick={() => removeSkuPartner(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Partner
                      </label>
                      <select
                        value={partner.partnerId}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "partnerId",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      >
                        <option value="">Select Partner</option>
                        {getAvailablePartners(index).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Partner SKU
                      </label>
                      <input
                        type="text"
                        value={partner.skuPartner}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "skuPartner",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Partner's SKU code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={partner.stock}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "stock",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        value={partner.price}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "price",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loyalty Points Per Product
                      </label>
                      <input
                        type="number"
                        value={partner.loyaltyPointsPerProduct || ""}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "loyaltyPointsPerProduct",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loyalty Points Per Unit
                      </label>
                      <input
                        type="number"
                        value={partner.loyaltyPointsPerUnit || ""}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "loyaltyPointsPerUnit",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loyalty Points Bonus Quantity
                      </label>
                      <input
                        type="number"
                        value={partner.loyaltyPointsBonusQuantity || ""}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "loyaltyPointsBonusQuantity",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loyalty Points Threshold Quantity
                      </label>
                      <input
                        type="number"
                        value={partner.loyaltyPointsThresholdQty || ""}
                        onChange={(e) =>
                          handleSkuPartnerChange(
                            index,
                            "loyaltyPointsThresholdQty",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSkuPartner}
                className="w-full rounded-lg bg-gray-100 p-3 text-gray-700 hover:bg-gray-200"
              >
                + Add Partner SKU
              </button>
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
