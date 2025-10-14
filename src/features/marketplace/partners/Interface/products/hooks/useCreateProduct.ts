// hooks/useCreateProduct.ts
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface CreateProductData {
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
}

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (
    productData: CreateProductData,
    onSuccess?: (productId: string) => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const images = productData.images || [];

      // Make sure we're adding all required fields
      formData.append("name", productData.name);
      formData.append("barcode", productData.barcode || "");
      formData.append("sku", productData.sku);
      formData.append("price", productData.price.toString());

      // Add optional fields only if they exist
      if (productData.cost !== undefined)
        formData.append("cost", productData.cost.toString());
      if (productData.stock !== undefined)
        formData.append("stock", productData.stock.toString());
      if (productData.description)
        formData.append("description", productData.description);
      if (productData.pcb) formData.append("pcb", productData.pcb);
      if (productData.weight !== undefined)
        formData.append("weight", productData.weight.toString());
      if (productData.minimumQte !== undefined)
        formData.append("minimumQte", productData.minimumQte.toString());
      if (productData.maximumQte !== undefined)
        formData.append("maximumQte", productData.maximumQte.toString());
      if (productData.sealable !== undefined)
        formData.append("sealable", productData.sealable.toString());
      if (productData.alertQte !== undefined)
        formData.append("alertQte", productData.alertQte.toString());
      if (productData.loyaltyPointsPerProduct !== undefined)
        formData.append(
          "loyaltyPointsPerProduct",
          productData.loyaltyPointsPerProduct.toString(),
        );
      if (productData.loyaltyPointsPerUnit !== undefined)
        formData.append(
          "loyaltyPointsPerUnit",
          productData.loyaltyPointsPerUnit.toString(),
        );
      if (productData.loyaltyPointsBonusQuantity !== undefined)
        formData.append(
          "loyaltyPointsBonusQuantity",
          productData.loyaltyPointsBonusQuantity.toString(),
        );
      if (productData.loyaltyPointsThresholdQty !== undefined)
        formData.append(
          "loyaltyPointsThresholdQty",
          productData.loyaltyPointsThresholdQty.toString(),
        );

      // Add relational IDs
      if (productData.supplierId)
        formData.append("supplierId", productData.supplierId);
      if (productData.productTypeId)
        formData.append("productTypeId", productData.productTypeId);
      if (productData.typePcbId)
        formData.append("typePcbId", productData.typePcbId);
      if (productData.productStatusId)
        formData.append("productStatusId", productData.productStatusId);
      if (productData.taxId) formData.append("taxId", productData.taxId);
      if (productData.promotionId)
        formData.append("promotionId", productData.promotionId);

      // Add arrays
      productData.subCategories.forEach((subcategoryId, index) => {
        formData.append(`subCategories[${index}]`, subcategoryId);
      });

      productData.relatedProducts.forEach((relatedProductId, index) => {
        formData.append(`relatedProducts[${index}]`, relatedProductId);
      });

      // Add promo flag
      formData.append("promo", productData.promo.toString());

      // Log the FormData entries for debugging - using Array.from instead of for...of
      const formDataEntries: string[] = [];
      formData.forEach((value, key) => {
        formDataEntries.push(`${key}: ${value}`);
      });
      const response = await axios.post(
        "/api/marketplace/products/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status == 200 || response.status == 201) {
        toast.success("Product created successfully!");
      }
      const productId = response.data.product.id;

      const promises = [
        ...productData.subCategories.map((subcategoryId) =>
          axios.post("/api/marketplace/product_subcategories/create", {
            productId,
            subcategoryId,
          }),
        ),
        ...productData.relatedProducts.map((relatedProductId) =>
          axios.post("/api/marketplace/related_products/create", {
            productId,
            relatedProductId,
          }),
        ),
      ];

      // Add SKU partner creation promises
      if (productData.skuPartners && productData.skuPartners.length > 0) {
        const validSkuPartners = productData.skuPartners.filter(
          (partner) => partner.partnerId,
        );

        promises.push(
          ...validSkuPartners.map((partner) =>
            axios.post("/api/marketplace/sku_partner/create", {
              productId,
              partnerId: partner.partnerId,
              skuPartner: partner.skuPartner || productData.sku,
              skuProduct: productData.sku,
              stock: partner.stock || 0,
              price: partner.price || 0,
              loyaltyPointsPerProduct: partner.loyaltyPointsPerProduct,
              loyaltyPointsPerUnit: partner.loyaltyPointsPerUnit,
              loyaltyPointsBonusQuantity: partner.loyaltyPointsBonusQuantity,
              loyaltyPointsThresholdQty: partner.loyaltyPointsThresholdQty,
            }),
          ),
        );
      }

      // Only add image upload promise if there are images
      if (images.length > 0) {
        const imageFormData = new FormData();
        imageFormData.append("productId", productId);
        images.forEach((image) => {
          imageFormData.append("images", image);
        });

        promises.push(
          axios.post("/api/marketplace/image/create", imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        );
      }

      await Promise.all(promises);

      if (response.status === 201 && response.data.product?.id) {
        onSuccess?.(response.data.product.id);
        return response.data.product;
      }

      return null;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error creating product";
      setError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createProduct, isLoading, error };
}
