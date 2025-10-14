import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SkuPartner {
  id?: string;
  partnerId: string;
  skuPartner: string;
  stock?: number;
  Price?: string;
  price?: number;
  loyaltyPointsPerProduct?: number;
  loyaltyPointsPerUnit?: number;
  loyaltyPointsBonusQuantity?: number;
  loyaltyPointsThresholdQty?: number;
  partner?: { id: string; username: string };
}

interface ProductImage {
  id: string;
  url: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: any) => Promise<void>;
  product: any;
  suppliers?: Array<{ id: string; companyName: string }>;
  productTypes: Array<{ id: string; type: string }>;
  typePcbs: Array<{ id: string; name: string }>;
  productStatuses: Array<{ id: string; name: string }>;
  subCategories: Array<{ id: string; name: string }>;
  relatedProducts: Array<{ id: string; name: string }>;
  taxes: Array<{ id: string; value: string }>;
  promotions: Array<{ id: string; promoPrice: string }>;
  partners?: Array<{ id: string; username: string }>;
  skuPartners: SkuPartner[];
}

const EditProductModal = ({
  isOpen,
  onClose,
  onEdit,
  product,
  suppliers = [],
  productTypes,
  typePcbs,
  productStatuses,
  subCategories,
  relatedProducts,
  taxes,
  promotions,
  partners = [],
  skuPartners: initialSkuPartners,
}: EditProductModalProps) => {
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
  });

  const [skuPartners, setSkuPartners] = useState<SkuPartner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (product && isOpen) {
      setExistingImages(product.images || []);

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
        supplierId: product.supplierId || null,
        productTypeId: product.productTypeId || null,
        typePcbId: product.typePcbId || null,
        productStatusId: product.productStatusId || null,
        taxId: product.taxId || null,
        promotionId: product.promotionId || null,
        subCategories:
          product.productSubCategories?.map((sc: any) => sc.subcategoryId) ||
          [],
        relatedProducts:
          product.relatedProducts?.map((rp: any) => rp.relatedProductId) || [],
        promo: product.promo,
        images: [],
      });

      // Process SKU prtners to ensure price is correctly handled
      const processedSkuPartners = initialSkuPartners.map((sp) => {
        let priceValue = 0;

        if (sp.Price !== undefined && sp.Price !== null) {
          priceValue = parseFloat(String(sp.Price));
          if (isNaN(priceValue)) {
            priceValue = 0;
          }
        }

        return {
          id: sp.id,
          partnerId: sp.partnerId,
          skuPartner: sp.skuPartner,
          stock: sp.stock || 0,
          Price: sp.Price, // Keep the original Price string
          price: priceValue, // Store parsed float in lowercase price for UI
          loyaltyPointsPerProduct: sp.loyaltyPointsPerProduct,
          loyaltyPointsPerUnit: sp.loyaltyPointsPerUnit,
          loyaltyPointsBonusQuantity: sp.loyaltyPointsBonusQuantity,
          loyaltyPointsThresholdQty: sp.loyaltyPointsThresholdQty,
          partner: (partners || []).find((p) => p.id === sp.partnerId),
        };
      });

      setSkuPartners(processedSkuPartners);
      setActiveTab("basic");
    }
  }, [product, isOpen, initialSkuPartners, partners]);

  // Add this useEffect to reset loading state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false); // Reset loading state when modal opens
    }
  }, [isOpen]);

  const handleImageUpload = async (files: File[]) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("images", file);
      formData.append("productId", product.id);

      const response = await fetch("/api/marketplace/image/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Image upload error:", errorData);
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      if (data.images && data.images.length > 0) {
        return { id: data.id || "temp-id", url: data.images[0] };
      } else {
        throw new Error("No image URL returned from server");
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleInputChange = (field: string, value: any) => {
    const relationalFields = [
      "supplierId",
      "productTypeId",
      "typePcbId",
      "productStatusId",
      "taxId",
      "promotionId",
    ];

    const cleanedValue = relationalFields.includes(field)
      ? value === ""
        ? null
        : value
      : value;

    setFormState((prev) => ({
      ...prev,
      [field]: cleanedValue,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleInputChange("images", Array.from(e.target.files));
    }
  };

  const handleSkuPartnerChange = (index: number, field: string, value: any) => {
    const updatedPartners = [...skuPartners];
    if (field === "price") {
      let numValue: number;
      if (typeof value === "string") {
        numValue = value === "" ? 0 : parseFloat(value);
        if (isNaN(numValue)) numValue = 0;
      } else {
        numValue = value;
      }

      updatedPartners[index] = {
        ...updatedPartners[index],
        price: numValue,
        Price: String(numValue),
        partner: updatedPartners[index].partner,
      };
    } else if (field === "skuPartner") {
      updatedPartners[index] = {
        ...updatedPartners[index],
        skuPartner: value,
        partner: updatedPartners[index].partner,
      };
    } else {
      updatedPartners[index] = {
        ...updatedPartners[index],
        [field]: value,
        partner:
          field === "partnerId"
            ? partners.find((p) => p.id === value)
            : updatedPartners[index].partner,
      };
    }

    setSkuPartners(updatedPartners);
  };

  const addSkuPartner = () => {
    setSkuPartners([
      ...skuPartners,
      {
        partnerId: "",
        skuPartner: "",
        stock: 0,
        price: 0,
      },
    ]);
  };

  const removeSkuPartner = async (index: number) => {
    const partnerToRemove = skuPartners[index];

    if (partnerToRemove.id) {
      try {
        const response = await fetch(
          `/api/marketplace/sku_partner/${partnerToRemove.id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          toast.success("Partner SKU deleted successfully");
        } else {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete partner SKU");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete partner SKU",
        );
        return;
      }
    }

    const updatedPartners = [...skuPartners];
    updatedPartners.splice(index, 1);
    setSkuPartners(updatedPartners);
  };

  const getAvailablePartners = (currentIndex: number) => {
    const selectedPartnerIds = skuPartners
      .filter((_, i) => i !== currentIndex)
      .map((p) => p.partnerId);

    return (partners || []).filter(
      (p) =>
        !selectedPartnerIds.includes(p.id) ||
        p.id === skuPartners[currentIndex].partnerId,
    );
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/marketplace/image/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete image");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image",
      );
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.sku || !formState.price) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (formState.images.length > 0) {
        try {
          const newImages = await handleImageUpload(formState.images);
          setExistingImages((prev) => [...prev, ...newImages]);
        } catch (imageError) {
          console.error("Error uploading images:", imageError);
          toast.error("Failed to upload images");
        }
      }

      const cleanedData = {
        ...formState,
        id: product?.id,
        supplierId: formState.supplierId || null,
        productTypeId: formState.productTypeId || null,
        typePcbId: formState.typePcbId || null,
        productStatusId: formState.productStatusId || null,
        taxId: formState.taxId || null,
        promotionId: formState.promotionId || null,
        price: Number(formState.price),
        cost: formState.cost ? Number(formState.cost) : undefined,
        stock: formState.stock ? Number(formState.stock) : undefined,
        subCategories: formState.subCategories,
        relatedProducts: formState.relatedProducts,
      };

      try {
        await onEdit(cleanedData);
      } catch (productError: any) {
        let errorMessage = "Failed to update product";

        if (productError.response?.data) {
          if (productError.response.data.message) {
            errorMessage = productError.response.data.message;
          } else if (productError.response.data.error) {
            errorMessage = productError.response.data.error;
          }
        } else if (productError instanceof Error) {
          errorMessage = productError.message;
        }

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
        } else if (errorMessage.includes("Missing required fields")) {
          toast.error("Please fill in all required fields.");
        } else {
          toast.error(errorMessage);
        }

        console.error("Error updating product:", productError);
        setIsLoading(false);
        return;
      }

      try {
        await Promise.all(
          skuPartners.map(async (sp) => {
            if (!sp.partnerId) return;

            const priceAsString = sp.Price || String(sp.price) || "0";

            const partnerSku = sp.skuPartner?.trim() || formState.sku;

            const payload = {
              partnerId: sp.partnerId,
              skuPartner: partnerSku,
              skuProduct: formState.sku,
              productId: product?.id,
              stock: sp.stock !== undefined ? Number(sp.stock) : 0,
              Price: priceAsString,
              loyaltyPointsPerProduct: sp.loyaltyPointsPerProduct,
              loyaltyPointsPerUnit: sp.loyaltyPointsPerUnit,
              loyaltyPointsBonusQuantity: sp.loyaltyPointsBonusQuantity,
              loyaltyPointsThresholdQty: sp.loyaltyPointsThresholdQty,
            };

            if (sp.id) {
              const response = await fetch(
                `/api/marketplace/sku_partner/${sp.id}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.message ||
                    errorData.error ||
                    "Failed to update SKU partner",
                );
              }
            } else {
              const response = await fetch(
                "/api/marketplace/sku_partner/create",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                },
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.message ||
                    errorData.error ||
                    "Failed to create SKU partner",
                );
              }
            }
          }),
        );
      } catch (partnerError) {
        console.error("Error with SKU partners:", partnerError);
        toast.error(
          partnerError instanceof Error
            ? partnerError.message
            : "Failed to update partner SKUs",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      handleClose();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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

        <div className="sticky top-[76px] z-10 flex w-full overflow-x-auto border-b bg-white px-6">
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "basic"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "specs"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "pricing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pricing")}
          >
            Pricing & Stock
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "relations"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("relations")}
          >
            Relationships
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "partners"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("partners")}
          >
            Partner SKUs
          </button>
          <button
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium ${
              activeTab === "images"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("images")}
          >
            Images
          </button>
        </div>

        <div className="p-6">
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
                    onChange={(e) =>
                      handleInputChange("barcode", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Minimum Quantity"
                    value={formState.minimumQte || ""}
                    onChange={(e) =>
                      handleInputChange("minimumQte", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Maximum Quantity"
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
                        handleInputChange(
                          "loyaltyPointsPerUnit",
                          e.target.value,
                        )
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
                    value={formState.supplierId || ""}
                    onChange={(e) =>
                      handleInputChange("supplierId", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select Manufacturer</option>
                    {(suppliers || []).map((supplier) => (
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
                    value={formState.productTypeId || ""}
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
                    value={formState.typePcbId || ""}
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
                    value={formState.productStatusId || ""}
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
                    value={formState.taxId || ""}
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
                  <select
                    multiple
                    value={formState.subCategories}
                    onChange={(e) =>
                      handleInputChange(
                        "subCategories",
                        Array.from(e.target.selectedOptions).map(
                          (o) => o.value,
                        ),
                      )
                    }
                    className="w-full rounded-lg border p-3"
                    size={5}
                  >
                    {subCategories.map((cat) => (
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
                        Array.from(e.target.selectedOptions).map(
                          (o) => o.value,
                        ),
                      )
                    }
                    className="w-full rounded-lg border p-3"
                    size={5}
                  >
                    {relatedProducts.map((product) => (
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
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formState.promo}
                    onChange={(e) =>
                      handleInputChange("promo", e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                  <span>Promo Product</span>
                </label>
                {formState.promo && (
                  <select
                    value={formState.promotionId || ""}
                    onChange={(e) =>
                      handleInputChange("promotionId", e.target.value)
                    }
                    className="mt-2 w-full rounded-lg border p-3"
                  >
                    <option value="">Select Promotion</option>
                    {promotions.map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.promoPrice}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Partner SKUs */}
          {activeTab === "partners" && (
            <div className="space-y-4 pt-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary">
                Partner SKUs
              </h3>
              <div className="space-y-4">
                {skuPartners.map((partner, index) => (
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
                          placeholder="Stock quantity"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={partner.price}
                          onChange={(e) =>
                            handleSkuPartnerChange(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Price"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Per Product
                        </label>
                        <input
                          type="number"
                          value={partner.loyaltyPointsPerProduct}
                          onChange={(e) =>
                            handleSkuPartnerChange(
                              index,
                              "loyaltyPointsPerProduct",
                              Number(e.target.value),
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Loyalty points per product"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Per Unit
                        </label>
                        <input
                          type="number"
                          value={partner.loyaltyPointsPerUnit}
                          onChange={(e) =>
                            handleSkuPartnerChange(
                              index,
                              "loyaltyPointsPerUnit",
                              Number(e.target.value),
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Loyalty points per unit"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Bonus Quantity
                        </label>
                        <input
                          type="number"
                          value={partner.loyaltyPointsBonusQuantity}
                          onChange={(e) =>
                            handleSkuPartnerChange(
                              index,
                              "loyaltyPointsBonusQuantity",
                              Number(e.target.value),
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Bonus quantity"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loyalty Points Threshold Quantity
                        </label>
                        <input
                          type="number"
                          value={partner.loyaltyPointsThresholdQty}
                          onChange={(e) =>
                            handleSkuPartnerChange(
                              index,
                              "loyaltyPointsThresholdQty",
                              Number(e.target.value),
                            )
                          }
                          className="w-full rounded-lg border p-3"
                          placeholder="Threshold quantity"
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

          {/* Images */}
          {activeTab === "images" && (
            <div className="space-y-4 pt-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary">Images</h3>

              {/* Existing images */}
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <img
                      src={image.url}
                      alt="Product"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* New image upload */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload New Images
                </label>
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

          {/* Other form sections remain the same... */}
        </div>

        {/* Fixed footer with buttons */}
        <div className="sticky bottom-0 flex justify-end gap-4 border-t bg-white p-6">
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
