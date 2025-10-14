import emailjs from "emailjs-com";
import { Supplier, Warehouse, ProductWithQuantities } from "./types";

type EmailParams = {
  supplier: Supplier | null;
  warehouse: Warehouse | null;
  products: ProductWithQuantities[];
  totalAmount: number;
  comment: string;
};

export const sendOrderEmail = async (params: EmailParams) => {
  const { supplier, warehouse, products, totalAmount, comment } = params;

  try {
    const productsText = products
      .filter((item) => item.quantity > 0)
      .map(
        (item) => `
        Product: ${item.product.name}
        Quantity: ${item.quantity}
        Price: ${item.priceExclTax.toFixed(2)}
        Total: ${item.total.toFixed(2)}
      `,
      )
      .join("\n\n");

    const templateParams = {
      supplierName: supplier?.companyName || "Unknown Supplier",
      warehouse: warehouse?.name || "Unknown Warehouse",
      totalAmount: totalAmount.toFixed(2),
      comment: comment || "No comment",
      productsText,
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!,
    );

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};
