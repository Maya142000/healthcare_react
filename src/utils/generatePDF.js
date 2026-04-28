import jsPDF from "jspdf";

export function generatePrescriptionPDF(consultation, rx, doctorName = "") {
    console.log("...consultation...",consultation)
    const doc    = new jsPDF();
    const margin = 20;
    let y        = margin;

    doc.setFillColor(15, 118, 110);
    doc.rect(0, 0, 210, 42, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MediConsult", margin, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Online Prescription Platform", margin, 28);

    const today = new Date().toLocaleDateString("en-IN");
    const rxId  = `RX-${Date.now().toString().slice(-8)}`;
    doc.setFontSize(9);
    doc.text(`Date : ${today}`, 145, 18);
    doc.text(`ID   : ${rxId}`,  145, 26);

    y = 55;

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(doctorName || consultation.doctorName || "Doctor", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(
        `${consultation.doctorSpecialty || "Specialist"} · MediConsult Certified`,
        margin, y
    );
    y += 14;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, 190, y);
    y += 10;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, 170, 28, 3, 3, "F");

    doc.setTextColor(15, 118, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PATIENT DETAILS", margin + 4, y + 7);

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(consultation.patientId.name || "Patient", margin + 4, y + 17);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
        `Age: ${consultation.patientId.age || "—"}   ·   Phone: ${consultation.patientId.mobileNo || "—"}`,
        margin + 4, y + 24
    );
    y += 36;

    doc.setTextColor(15, 118, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("CURRENT ILLNESS", margin, y);
    y += 6;

    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const illnessLines = doc.splitTextToSize(
        consultation.current_illness || "Not specified", 170
    );
    doc.text(illnessLines, margin, y);
    y += illnessLines.length * 5 + 12;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, 190, y);
    y += 10;

    doc.setFillColor(240, 253, 250);
    doc.roundedRect(margin, y, 170, 8, 2, 2, "F");
    doc.setTextColor(15, 118, 110);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("CARE TO BE TAKEN", margin + 4, y + 5.5);
    y += 14;

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const careLines = doc.splitTextToSize(rx.care || "", 170);
    doc.text(careLines, margin, y);
    y += careLines.length * 6 + 12;

    const meds = (rx.medicines || []).filter(Boolean);
    if (meds.length > 0) {
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, 190, y);
        y += 10;

        doc.setFillColor(240, 253, 250);
        doc.roundedRect(margin, y, 170, 8, 2, 2, "F");
        doc.setTextColor(15, 118, 110);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("PRESCRIBED MEDICINES", margin + 4, y + 5.5);
        y += 14;

        meds.forEach((med, i) => {
            if (i % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(margin, y - 5, 170, 10, 2, 2, "F");
            }
            doc.setFillColor(15, 118, 110);
            doc.circle(margin + 5, y + 0.5, 3.5, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.text(String(i + 1), margin + 3.5, y + 2);

            doc.setTextColor(30, 41, 59);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(med, margin + 13, y + 1.5);
            y += 13;
        });
        y += 4;
    }

    if (consultation.diabetes || consultation.allergies || consultation.others) {
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, 190, y);
        y += 10;

        doc.setTextColor(15, 118, 110);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("FAMILY & MEDICAL HISTORY", margin, y);
        y += 7;

        doc.setTextColor(51, 65, 85);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        if (consultation.diabetes) {
            doc.text(`Diabetes Status : ${consultation.diabetes}`, margin, y);
            y += 6;
        }
        if (consultation.allergies) {
            doc.text(`Allergies       : ${consultation.allergies}`, margin, y);
            y += 6;
        }
        if (consultation.others) {
            const otherLines = doc.splitTextToSize(`Others : ${consultation.others}`, 170);
            doc.text(otherLines, margin, y);
            y += otherLines.length * 5;
        }
        y += 6;
    }

    y = Math.max(y + 10, 245);
    doc.setDrawColor(180, 200, 200);
    doc.line(130, y, 190, y);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text("Doctor's Signature", 138, y + 5);

    const footerY = 278;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, footerY, 210, 20, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(0, footerY, 210, footerY);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
        "Digitally generated by MediConsult. Follow doctor's advice carefully.",
        margin, footerY + 8
    );
    doc.setFont("helvetica", "normal");
    doc.text(
        `Generated: ${new Date().toLocaleString("en-IN")}`,
        margin, footerY + 14
    );

    const fileName = `prescription_${(consultation.patientId.name || "patient").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    doc.save(fileName);
    return fileName;
}