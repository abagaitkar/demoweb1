import jsPDF from "jspdf";
import "jspdf-autotable";

const GeneratePDF = (quotation) => {
  const doc = new jsPDF("l", "mm", "a4"); // Landscape format

  // **Header Section**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SteelStrong Valves (I) Pvt. Ltd.", 14, 15);

  doc.setFontSize(12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Quotation Ref: ${quotation.QuotationRef}`, 14, 23);
  doc.text(`Customer: ${quotation.CustomerName}`, 14, 27);
  doc.text(`Project: ${quotation.ProjectName}`, 14, 31);
  doc.text(`Sales Engineer: ${quotation.SalesEngineerName}`, 14, 35);
  doc.text(`Quotation Date: ${quotation.CreatedDate}`, 14, 39);

  // **Table Header Columns**
  const tableColumn = [
    "Sr. No.",
    "Enq No.",
    "Data Sheet No.",
    "Valve Type",
    "Subtype",
    "Size",
    "Class",
    "Bore",
    "End Conn.",
    "Operator",
    "Design Std.",
    "Testing Std.",
    "Face to Face",
    "Body Material",
    "Ball/Wedge",
    "Seat Ring",
    "Stem",
    "Body Seals",
    "Packing",
    "Fasteners",
    "Specialty",
    "Certification",
    "Qty",
    "Unit Price",
    "Total Price",
  ];

  const tableRows = [];

  quotation.details.forEach((detail, index) => {
    tableRows.push([
      index + 1,
      detail.EnquiryNo,
      detail.DataSheetNo,
      detail.ValveType,
      detail.Subtype,
      detail.Size,
      detail.Class,
      detail.Bore,
      detail.EndConn,
      detail.Operator,
      detail.DesignStd,
      detail.TestingStd,
      detail.FaceToFace,
      detail.BodyMaterial,
      detail.BallWedge,
      detail.SeatRing,
      detail.Stem,
      detail.BodySeals,
      detail.Packing,
      detail.Fasteners,
      detail.Specialty,
      detail.Certification,
      detail.Quantity,
      `₹${detail.UnitPrice}`,
      `₹${detail.TotalPrice}`,
    ]);
  });

  // **Insert Table**
  doc.autoTable({
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [200, 200, 200] },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 20 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
    },
  });

  let finalY = doc.autoTable.previous.finalY + 10;

  // **Technical Notes**
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Technical Notes:", 14, finalY);

  doc.setFont("helvetica", "normal");
  const technicalNotes = [
    "1. Prices are inclusive of all applicable taxes.",
    "2. Delivery will be within 3-4 weeks from the date of order confirmation.",
    "3. Payment terms: 50% advance, balance on delivery.",
    "4. Warranty: 12 months from the date of installation.",
  ];
  technicalNotes.forEach((line, i) => {
    doc.text(line, 14, finalY + 6 + i * 5);
  });

  finalY += 30;

  // **Commercial Notes**
  doc.setFont("helvetica", "bold");
  doc.text("Commercial Terms:", 14, finalY);

  doc.setFont("helvetica", "normal");
  const commercialNotes = [
    "1. 3% Extra for inland transport at actual, to your account.",
    "2. 16 to 18 weeks ex-mfg unit, after receipt of approval on GAD / QAP (ITP).",
    "3. 30% advance and balance against Pro-forma Invoice before dispatch.",
    "4. Taxes at actual. Presently 18% GST is applicable.",
    "5. Warranty: 12 months from installation or 18 months from dispatch.",
  ];
  commercialNotes.forEach((line, i) => {
    doc.text(line, 14, finalY + 6 + i * 5);
  });

  finalY += 40;

  // **Footer - Authorized Signature**
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signature", 14, finalY);
  doc.line(14, finalY + 2, 60, finalY + 2);

  // **Save the PDF**
  doc.save(`Quotation_${quotation.QuotationRef}.pdf`);
};

export default GeneratePDF;
