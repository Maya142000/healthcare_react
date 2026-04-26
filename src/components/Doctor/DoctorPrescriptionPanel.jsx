import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../config/apiConfig";
import { generatePrescriptionPDF } from "../../utils/generatePDF";
import SendToPatient from "../Patient/SendToPatient";

export default function PrescriptionPanel() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [activeId, setActiveId]           = useState(null);
    const [prescriptions, setPrescriptions] = useState({});
    const navigate   = useNavigate();
    const doctorName = localStorage.getItem("doctorName") || "";

    useEffect(() => { fetchConsultations(); }, []);

    // ── FETCH ─────────────────────────────────────────────────────
    const fetchConsultations = async () => {
        try {
            const doctorId = localStorage.getItem("userid");
            const response = await api.get(`/consultation/getConsultationById/${doctorId}`);
            const result   = response.data;
            if (result?.status === true) {
                setConsultations(result.Data);
                const map = {};
                result.Data.forEach((c) => {
                    if (c.prescription) {
                        map[c._id] = {
                            care:      c.prescription.care,
                            medicines: c.prescription.medicines?.length
                                ? c.prescription.medicines
                                : [""],
                        };
                    }
                });
                setPrescriptions(map);
            }
        } catch {
            toast.error("Failed to load consultations");
        } finally {
            setLoading(false);
        }
    };

    // ── RX HELPERS ────────────────────────────────────────────────
    const getRx = (id) => prescriptions[id] || { care: "", medicines: [""] };

    const updateRx = (id, field, value) =>
        setPrescriptions((prev) => ({
            ...prev,
            [id]: { ...getRx(id), [field]: value },
        }));

    const addMedicine = (id) =>
        updateRx(id, "medicines", [...getRx(id).medicines, ""]);

    const updateMedicine = (id, idx, val) =>
        updateRx(
            id, "medicines",
            getRx(id).medicines.map((m, i) => (i === idx ? val : m))
        );

    const removeMedicine = (id, idx) => {
        if (getRx(id).medicines.length === 1) return;
        updateRx(id, "medicines", getRx(id).medicines.filter((_, i) => i !== idx));
    };

    // ── SUBMIT (save / update) ────────────────────────────────────
    const handleSubmit = async (consultation, resend = false) => {
        const rx = getRx(consultation._id);
        if (!rx.care.trim()) { toast.error("Care to be taken is required"); return; }

        try {
            const payload  = {
                consultationId: consultation._id,
                patientId:      consultation.patientId._id,
                care:           rx.care,
                medicines:      rx.medicines.filter(Boolean),
            };
            const endpoint = resend ? "/prescription/updatePrescription" : "/prescription/addPrescription";
            const response = await api.post(endpoint, payload);
            const result   = response.data;

            if (result?.status === true) {
                toast.success(resend ? "Prescription updated!" : "Prescription saved!");
                generatePrescriptionPDF(consultation, rx, doctorName);
                fetchConsultations();
                setActiveId(null);
            } else {
                toast.error(result?.message || "Failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    };

    // ── RENDER ────────────────────────────────────────────────────
    return (
        <div className="bg-slate-50 min-h-screen font-sans">

            {/* NAV */}
            <nav className="bg-white border-b border-slate-200 px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <span className="text-[17px] font-semibold text-slate-900">MediConsult</span>
                </div>
                <button
                    onClick={() => navigate("/doctorProfile")}
                    className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[13px] font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    ← My Profile
                </button>
            </nav>

            {/* PAGE */}
            <div className="px-6 py-8 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/doctorProfile")}
                    className="flex items-center gap-1 text-[13px] text-slate-500 mb-6 bg-transparent border-none cursor-pointer hover:text-slate-800 transition-colors"
                >
                    ← Back to Home
                </button>
                <div className="mb-8">
                    <h1 className="text-[1.8rem] font-extrabold font-serif text-slate-900">
                        Prescription Panel
                    </h1>
                    <p className="text-[14px] text-slate-500 mt-1">
                        Review consultations and write prescriptions
                    </p>
                </div>

                {/* STATES */}
                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-[14px]">
                        Loading consultations...
                    </div>
                ) : consultations.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
                        <div className="text-slate-300 text-5xl mb-3">📋</div>
                        <p className="text-[15px] font-medium text-slate-500">No consultations yet</p>
                        <p className="text-[13px] text-slate-400 mt-1">
                            Patient consultations will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {consultations.map((c) => {
                            const rx = getRx(c._id);
                            const isOpen = activeId === c._id;
                            const hasPrescription = !!c.prescription;

                            return (
                                <div
                                    key={c._id}
                                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                                >
                                    {/* ── CARD HEADER ── */}
                                    <div className="p-5 flex items-start justify-between gap-4 flex-wrap">
                                        {/* Patient info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center text-teal-700 font-bold text-[16px] shrink-0">
                                                {c.patientId?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-semibold text-slate-900">
                                                    {c.patientId?.name}
                                                </h3>
                                                <p className="text-[12px] text-slate-400 mt-0.5">
                                                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Status badge */}
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                                                hasPrescription
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}>
                                                {hasPrescription ? "✓ Prescribed" : "Pending"}
                                            </span>

                                            {/* Write / Edit toggle */}
                                            <button
                                                onClick={() => setActiveId(isOpen ? null : c._id)}
                                                className="px-4 py-1.5 border border-teal-200 text-teal-700 rounded-lg text-[12px] font-medium cursor-pointer hover:bg-teal-50 transition-colors"
                                            >
                                                {isOpen ? "Close" : hasPrescription ? "Edit" : "Write Rx"}
                                            </button>

                                            {/* PDF + Send — only when prescription exists */}
                                            {hasPrescription && (
                                                <>
                                                    {/* ↓ PDF — calls generatePDF util directly */}
                                                    <button
                                                        onClick={() =>
                                                            generatePrescriptionPDF(c, rx, doctorName)
                                                        }
                                                        className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[12px] font-medium cursor-pointer hover:bg-slate-200 transition-colors"
                                                    >
                                                        ↓ PDF
                                                    </button>

                                                    {/* ✉ Send — SendToPatient component */}
                                                    <SendToPatient
                                                        consultation={c}
                                                        rx={rx}
                                                        onSent={fetchConsultations}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* ── CONSULTATION DETAILS ── */}
                                    <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <Detail label="Illness"        value={c.current_illness} />
                                        <Detail label="Recent Surgery" value={c.recent_surgery || "None"} />
                                        <Detail label="Diabetes"       value={c.diabetes} />
                                        {c.allergies && <Detail label="Allergies"      value={c.allergies} />}
                                        {c.others    && <Detail label="Others"         value={c.others} />}
                                        <Detail label="Transaction ID" value={c.transactionId} />
                                    </div>

                                    {/* ── PRESCRIPTION FORM (inline expand) ── */}
                                    {isOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                                            <h4 className="text-[14px] font-semibold text-slate-800 mb-4">
                                                {hasPrescription ? "Edit Prescription" : "Write Prescription"}
                                            </h4>

                                            {/* Care to be taken */}
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                                    Care to be Taken{" "}
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={rx.care}
                                                    onChange={(e) =>
                                                        updateRx(c._id, "care", e.target.value)
                                                    }
                                                    placeholder="Instructions: rest, diet, activity restrictions..."
                                                    rows={3}
                                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-white resize-none"
                                                />
                                            </div>

                                            {/* Medicines */}
                                            <div className="mb-4">
                                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                                    Medicines
                                                </label>
                                                <div className="space-y-2">
                                                    {rx.medicines.map((med, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={med}
                                                                onChange={(e) =>
                                                                    updateMedicine(c._id, idx, e.target.value)
                                                                }
                                                                placeholder={`Medicine ${idx + 1} — name, dosage, frequency`}
                                                                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-white"
                                                            />
                                                            <button
                                                                onClick={() => removeMedicine(c._id, idx)}
                                                                disabled={rx.medicines.length === 1}
                                                                className="px-3 py-2 bg-red-50 text-red-500 border border-red-100 rounded-lg text-[13px] cursor-pointer hover:bg-red-100 transition-colors disabled:opacity-30"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => addMedicine(c._id)}
                                                    className="mt-2 flex items-center gap-1.5 text-[13px] text-teal-700 font-medium bg-transparent border-none cursor-pointer hover:text-teal-800 transition-colors"
                                                >
                                                    + Add Medicine
                                                </button>
                                            </div>

                                            {/* Save / Update */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleSubmit(c, hasPrescription)}
                                                    className="flex-1 py-2.5 bg-teal-700 text-white rounded-xl text-[14px] font-semibold cursor-pointer hover:bg-teal-800 transition-colors"
                                                >
                                                    {hasPrescription
                                                        ? "Update & Download PDF"
                                                        : "Save & Download PDF"}
                                                </button>
                                                <button
                                                    onClick={() => setActiveId(null)}
                                                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[14px] font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── DETAIL CHIP ───────────────────────────────────────────────────
function Detail({ label, value }) {
    return (
        <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                {label}
            </div>
            <div className="text-[13px] font-medium text-slate-700 truncate">
                {value || "—"}
            </div>
        </div>
    );
}