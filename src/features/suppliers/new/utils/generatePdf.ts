import jsPDF from "jspdf";

import {
  Supplier,
  Warehouse,
  ProductWithQuantities,
  PaymentType,
} from "./types";

export const generateOrderPDF = (
  doc: jsPDF,
  supplier: Supplier | null,
  warehouse: Warehouse | null,
  state: string,
  products: ProductWithQuantities[],
  total: number,
  paymentTypes: PaymentType[],
  deliveryDate: Date,
  userName: string,
) => {
  const lineHeight = 7;

  const margin = 10;

  const pageWidth = doc.internal.pageSize.getWidth();

  let yOffset = margin;
  doc.setFontSize(12);

  yOffset += lineHeight;
  const headerStyle = {
    fontSize: 18,

    fontStyle: "bold" as const,

    textColor: [0, 0, 0] as [number, number, number],
  };

  const subHeaderStyle = {
    fontSize: 14,

    fontStyle: "bold" as const,

    textColor: [0, 0, 0] as [number, number, number],
  };

  const bodyStyle = {
    fontSize: 12,

    textColor: [51, 51, 51] as [number, number, number],
  };
  doc.setFontSize(headerStyle.fontSize);

  doc.setFont("helvetica", headerStyle.fontStyle);

  doc.text("Order Details", margin, yOffset);

  yOffset += lineHeight * 2;
  doc.setFontSize(bodyStyle.fontSize);

  doc.setTextColor(...bodyStyle.textColor);

  doc.setFont("helvetica", "normal");

  const details = [
    `Supplier: ${supplier?.companyName || "Not specified"}`,

    `Warehouse: ${warehouse?.name || "Not specified"}`,

    `Order Date: ${new Date().toLocaleDateString()}`,

    `Delivery Date: ${deliveryDate.toLocaleDateString()}`,

    `Status: ${state || "Not specified"}`,
  ];
  details.forEach((detail) => {
    doc.text(detail, margin, yOffset);

    yOffset += lineHeight;
  });
  yOffset += lineHeight;

  doc.line(margin, yOffset, pageWidth - margin, yOffset);

  yOffset += lineHeight * 2;

  doc.setFontSize(subHeaderStyle.fontSize);

  doc.setTextColor(...subHeaderStyle.textColor);

  doc.setFont("helvetica", subHeaderStyle.fontStyle);

  doc.text("Ordered Products:", margin, yOffset);

  yOffset += lineHeight * 1.5;

  doc.setFontSize(bodyStyle.fontSize);

  doc.setTextColor(...bodyStyle.textColor);

  doc.setFont("helvetica", "bold");

  const columns = [
    { text: "Product", x: margin },

    { text: "Quantity", x: 70 },

    { text: "Unit Price", x: 100 },

    { text: "Total", x: 140 },
  ];

  columns.forEach((col) => doc.text(col.text, col.x, yOffset));

  yOffset += lineHeight;
  doc.setLineWidth(0.1);

  doc.line(margin, yOffset, pageWidth - margin, yOffset);

  yOffset += lineHeight;
  doc.setFont("helvetica", "normal");

  products

    .filter((item) => item.quantity > 0)

    .forEach((item) => {
      const startY = yOffset;

      let maxHeight = lineHeight;
      const productLines = doc.splitTextToSize(
        item.product.name || "Nom inconnu",
        60,
      );
      productLines.forEach((line: string, i: number) => {
        doc.text(line, margin, yOffset + i * lineHeight);
      });

      maxHeight = Math.max(maxHeight, productLines.length * lineHeight);

      doc.text(`${item.quantity}`, 70, startY);

      doc.text(`${item.priceExclTax.toFixed(2)} DT`, 100, startY);

      doc.text(`${item.total.toFixed(2)} DT`, 140, startY);

      yOffset += maxHeight + lineHeight / 2;
    });

  yOffset += lineHeight;

  doc.setFontSize(subHeaderStyle.fontSize);

  doc.setFont("helvetica", subHeaderStyle.fontStyle);

  doc.text(`Total Amount: ${total.toFixed(2)} DT`, margin, yOffset);

  yOffset += lineHeight * 2;

  doc.text("Payment Details:", margin, yOffset);

  yOffset += lineHeight * 1.5;

  doc.setFontSize(bodyStyle.fontSize);

  doc.setFont("helvetica", "normal");

  paymentTypes.forEach((payment: PaymentType, index: number) => {
    if (payment.type && payment.amount) {
      doc.text(
        `${payment.type}: ${payment.percentage}% (${parseFloat(
          payment.amount,
        ).toFixed(2)} DT)`,

        margin,

        yOffset + index * lineHeight,
      );
    }
  });

  yOffset += paymentTypes.length * lineHeight + lineHeight;

  doc.setLineWidth(0.1);

  doc.line(margin, yOffset, pageWidth - margin, yOffset);
  yOffset += lineHeight;
  doc.text(`Made by ${userName}`, margin, yOffset);
};
