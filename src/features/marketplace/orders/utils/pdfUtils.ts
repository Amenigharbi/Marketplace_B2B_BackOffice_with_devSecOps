import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderWithRelations } from "../types/order";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
    autoTable: (options: any) => void;
  }
}
export const downloadOrderPDF = (order: OrderWithRelations) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const primaryColor: [number, number, number] = [0, 51, 102];
  const secondaryColor: [number, number, number] = [51, 102, 0];
  const accentColor: [number, number, number] = [102, 0, 51];

  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text(`Order #${order.id}`, 105, 20, { align: "center" });

  const getLastY = (defaultY: number) => {
    return doc.lastAutoTable?.finalY ?? defaultY;
  };

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Order Summary", 14, 30);

  const summaryData = [
    ["Order ID", order.id],
    ["Status", order.status?.name || "N/A"],
    ["State", order.state?.name || "N/A"],
    [
      "Customer",
      `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`,
    ],
    [
      "Agent",
      order.agent ? `${order.agent.firstName} ${order.agent.lastName}` : "N/A",
    ],
    ["Payment Method", order.paymentMethod?.name || "N/A"],
    ["Shipping Method", order.shippingMethod || "N/A"],
    ["Created At", new Date(order.createdAt).toLocaleString()],
    ["Updated At", new Date(order.updatedAt).toLocaleString()],
    ["Active", order.isActive ? "Yes" : "No"],
    ["Mobile Order", order.fromMobile ? "Yes" : "No"],
  ];

  autoTable(doc, {
    startY: 35,
    head: [["Field", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    margin: { horizontal: 14 },
  });

  doc.text("Financial Summary", 14, getLastY(35) + 15);

  const financialData = [
    ["Amount TTC", `${order.amountTTC?.toFixed(2) || "0.00"}`],
    ["Amount Ordered", `${order.amountOrdered?.toFixed(2) || "0.00"}`],
    ["Amount Shipped", `${order.amountShipped?.toFixed(2) || "0.00"}`],
    ["Amount Refunded", `${order.amountRefunded?.toFixed(2) || "0.00"}`],
    ["Amount Canceled", `${order.amountCanceled?.toFixed(2) || "0.00"}`],
    ["Shipping Amount", `${order.shippingAmount?.toFixed(2) || "0.00"}`],
    ["Loyalty Points Value", `${order.loyaltyPtsValue || "0"}`],
  ];

  autoTable(doc, {
    startY: getLastY(35) + 20,
    head: [["Field", "Value"]],
    body: financialData,
    theme: "grid",
    headStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    margin: { horizontal: 14 },
  });

  if (order.comment) {
    doc.text("Order Comment", 14, getLastY(35) + 15);

    const commentLines = doc.splitTextToSize(order.comment, 180);
    doc.setFontSize(10);
    doc.text(commentLines, 14, getLastY(35) + 20);
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Page 1 of 2 - Generated on ${new Date().toLocaleString()}`,
    105,
    290,
    { align: "center" },
  );

  doc.addPage();
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text(`Order #${order.id} - Items`, 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Order Items", 14, 30);

  const orderItemsData = order.orderItems.map((item) => [
    item.sku || "N/A",
    item.product?.name || item.productName || "N/A",
    item.qteOrdered?.toString() || "0",
    item.qteShipped?.toString() || "0",
    item.qteRefunded?.toString() || "0",
    item.qteCanceled?.toString() || "0",
    item.discountedPrice ? item.discountedPrice.toFixed(2) : "0.00",
    item.weight ? item.weight.toFixed(2) : "0.00",
  ]);

  autoTable(doc, {
    startY: 35,
    head: [
      [
        "SKU",
        "Product",
        "Ordered",
        "Shipped",
        "Refunded",
        "Canceled",
        "Price",
        "Weight",
      ],
    ],
    body: orderItemsData,
    theme: "grid",
    headStyles: {
      fillColor: accentColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      minCellHeight: 5,
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "left" }, // SKU
      1: { cellWidth: 45, halign: "left" }, // Product
      2: { cellWidth: 15, halign: "center" }, // Ordered
      3: { cellWidth: 17, halign: "center" }, // Shipped
      4: { cellWidth: 17, halign: "center" }, // Refunded
      5: { cellWidth: 17, halign: "center" }, // Canceled
      6: { cellWidth: 15, halign: "right" }, // Price
      7: { cellWidth: 15, halign: "right" }, // Weight
    },
    margin: { horizontal: 14 },
    styles: {
      overflow: "linebreak",
      cellPadding: 2,
    },
    didParseCell: (data) => {
      if (data.column.index >= 2 && data.column.index <= 5) {
        data.cell.styles.halign = "center";
      }
      if (data.column.index >= 6) {
        data.cell.styles.halign = "right";
      }
    },
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Page 2 of 2 - Generated on ${new Date().toLocaleString()}`,
    105,
    290,
    { align: "center" },
  );

  doc.save(`order_${order.id}_report.pdf`);
};
