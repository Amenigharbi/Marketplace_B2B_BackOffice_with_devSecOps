import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Reservation } from "../types/reservation";

export const downloadReservationPDF = (reservations: Reservation[]) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Document styling
  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text("Detailed Reservations Report", 105, 15, { align: "center" });

  let startY = 25;

  reservations.forEach((reservation, index) => {
    // Main reservation section
    const mainInfo = [
      ["Reservation ID", reservation.id],
      [
        "Customer",
        `${reservation.customer?.firstName} ${reservation.customer?.lastName}` ||
          "N/A",
      ],
      ["Status", reservation.isActive ? "Active" : "Inactive"],
      ["Creation Date", new Date(reservation.createdAt).toLocaleDateString()],
      ["Shipping Method", reservation.shippingMethod],
      ["Total Weight", `${reservation.weight} kg`],
      ["Total Amount (incl. tax)", `${reservation.amountTTC} DT`],
      ["Ordered Amount", `${reservation.amountOrdered} DT`],
      ["Shipping Fees", `${reservation.shippingAmount} DT`],
    ];

    // Main table
    autoTable(doc, {
      head: [["Main Information", "Details"]],
      body: mainInfo,
      startY,
      theme: "grid",
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 40 },
        1: { cellWidth: "auto" },
      },
      margin: { left: 10, right: 10 },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;

    // Reserved items
    if (reservation.reservationItems.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(13, 110, 253);
      doc.text(
        `Reserved Items (${reservation.reservationItems.length})`,
        14,
        startY,
      );
      startY += 8;

      const itemsData = reservation.reservationItems.map((item) => [
        item.productName || "N/A",
        item.sku,
        item.qteReserved,
        `${item.price} DT`,
        `${item.weight} kg`,
        item.source?.name || "N/A",
      ]);

      autoTable(doc, {
        head: [["Product", "SKU", "Quantity", "Price", "Weight", "Source"]],
        body: itemsData,
        startY,
        theme: "grid",
        headStyles: {
          fillColor: [50, 50, 50],
          textColor: 255,
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
        },
        margin: { left: 10, right: 10 },
      });

      startY = (doc as any).lastAutoTable.finalY + 15;
    }

    // Comment
    if (reservation.comment) {
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text("Comment:", 14, startY);
      startY += 5;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const splitComment = doc.splitTextToSize(reservation.comment, 250);
      doc.text(splitComment, 14, startY);
      startY += splitComment.length * 5 + 10;
    }

    // Page break if not last reservation
    if (index < reservations.length - 1) {
      doc.addPage();
      startY = 20;
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} • Generated on ${new Date().toLocaleDateString()}`,
      105,
      200,
      { align: "center" },
    );
  }

  doc.save(`reservations_report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
