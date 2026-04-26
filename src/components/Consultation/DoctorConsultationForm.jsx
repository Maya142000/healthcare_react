import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../config/apiConfig";

const STEPS = ["Illness Info", "Family History", "Payment"];

export default function ConsultationForm() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const [step1, setStep1] = useState({ illnessHistory: "", recentSurgery: "" });
    const [step2, setStep2] = useState({ diabetes: "Non-Diabetic", allergies: "", others: "" });
    const [step3, setStep3] = useState({ transactionId: "" });
    const [errors, setErrors] = useState({});

    const inputCls = (field) =>
        `w-full px-3 py-2.5 border rounded-lg text-[14px] text-slate-900 outline-none focus:ring-2 transition-all bg-white ${
            errors[field]
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
        }`;

    const validateStep1 = () => {
        const errs = {};
        if (!step1.illnessHistory.trim()) errs.illnessHistory = "Current illness history is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep3 = () => {
        const errs = {};
        if (!step3.transactionId.trim()) errs.transactionId = "Transaction ID is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        setErrors({});
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 3) { handleSubmit(); return; }
        setCurrentStep((s) => s + 1);
    };

    const handleBack = () => {
        setErrors({});
        setCurrentStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep3()) return;
        setSubmitting(true);
        try {
            const payload = {
                doctorId,
                patientId: localStorage.getItem("userid"),
                current_illness: step1.illnessHistory,
                recent_surgery: step1.recentSurgery,
                diabetes: step2.diabetes,
                allergies: step2.allergies,
                others: step2.others,
                transactionId: step3.transactionId,
                paymentStatus: "SUCCESS"
            };
            const response = await api.post("consultation/saveConsultation", payload);
            const result = response.data;
            if (result?.status === true) {
                toast.success("Consultation submitted successfully!");
                navigate("/doctorsList");
            } else {
                toast.error(result?.message || "Submission failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        } finally {
            setSubmitting(false);
        }
    };

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
            </nav>

            <div className="px-4 py-8 max-w-[580px] mx-auto">
                <button
                    onClick={() => navigate("/doctorsList")}
                    className="flex items-center gap-1 text-[13px] text-slate-500 mb-6 bg-transparent border-none cursor-pointer hover:text-slate-800 transition-colors"
                >
                    ← Back to Doctors
                </button>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <h1 className="font-serif font-extrabold text-[1.8rem] text-slate-900 mb-1">Consultation Form</h1>
                    <p className="text-[14px] text-slate-500 mb-8">Fill in your details for the consultation</p>

                    {/* STEP INDICATOR */}
                    <div className="flex items-center mb-8">
                        {STEPS.map((label, i) => {
                            const stepNum = i + 1;
                            const isDone = currentStep > stepNum;
                            const isActive = currentStep === stepNum;
                            return (
                                <div key={label} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all ${
                                            isDone
                                                ? "bg-teal-700 border-teal-700 text-white"
                                                : isActive
                                                ? "border-teal-700 text-teal-700 bg-white"
                                                : "border-slate-200 text-slate-400 bg-white"
                                        }`}>
                                            {isDone ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                            ) : stepNum}
                                        </div>
                                        <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                                            isActive ? "text-teal-700" : isDone ? "text-teal-600" : "text-slate-400"
                                        }`}>{label}</span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-2 mb-5 transition-all ${
                                            currentStep > stepNum ? "bg-teal-700" : "bg-slate-200"
                                        }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── STEP 1 ── */}
                    {currentStep === 1 && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Current Illness History <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={step1.illnessHistory}
                                    onChange={(e) => setStep1({ ...step1, illnessHistory: e.target.value })}
                                    placeholder="Describe your current symptoms and health issues..."
                                    rows={4}
                                    className={`${inputCls("illnessHistory")} resize-none`}
                                />
                                {errors.illnessHistory && (
                                    <p className="text-red-500 text-[11px] mt-1">{errors.illnessHistory}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Recent Surgery
                                    <span className="text-slate-400 font-normal ml-1">(mention time span)</span>
                                </label>
                                <input
                                    type="text"
                                    value={step1.recentSurgery}
                                    onChange={(e) => setStep1({ ...step1, recentSurgery: e.target.value })}
                                    placeholder="e.g. Appendectomy — 3 months ago"
                                    className={inputCls("recentSurgery")}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2 ── */}
                    {currentStep === 2 && (
                        <div>
                            {/* Diabetes Radio */}
                            <div className="mb-5">
                                <label className="block text-[13px] font-medium text-slate-600 mb-3">
                                    Diabetes Status <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    {["Diabetic", "Non-Diabetic"].map((opt) => (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-3 flex-1 border-2 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                                                step2.diabetes === opt
                                                    ? "border-teal-600 bg-teal-50"
                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="diabetes"
                                                value={opt}
                                                checked={step2.diabetes === opt}
                                                onChange={(e) => setStep2({ ...step2, diabetes: e.target.value })}
                                                className="accent-teal-700 w-4 h-4"
                                            />
                                            <span className={`text-[13px] font-medium ${
                                                step2.diabetes === opt ? "text-teal-700" : "text-slate-600"
                                            }`}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Allergies */}
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Any Allergies
                                </label>
                                <input
                                    type="text"
                                    value={step2.allergies}
                                    onChange={(e) => setStep2({ ...step2, allergies: e.target.value })}
                                    placeholder="e.g. Penicillin, Peanuts, Latex"
                                    className={inputCls("allergies")}
                                />
                            </div>

                            {/* Others */}
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Others
                                </label>
                                <textarea
                                    value={step2.others}
                                    onChange={(e) => setStep2({ ...step2, others: e.target.value })}
                                    placeholder="Any other relevant family medical history..."
                                    rows={3}
                                    className={`${inputCls("others")} resize-none`}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3 ── */}
                    {currentStep === 3 && (
                        <div>
                            {/* QR Code */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center mb-5">
                                <p className="text-[13px] font-medium text-slate-600 mb-3">
                                    Scan QR code to pay consultation fee
                                </p>
                                <div className="w-44 h-44 mx-auto bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-3 p-2">
                                    {/* Static QR placeholder — replace src with real QR API */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=medconsult@upi%26pn=MediConsult%26am=500%26cu=INR`}
                                        alt="QR Code"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                </div>
                                <div className="inline-block bg-teal-700 text-white text-[18px] font-bold px-6 py-2 rounded-xl mb-1">
                                    ₹ 500
                                </div>
                                <p className="text-[12px] text-slate-400 mt-1">UPI: medconsult@upi</p>
                            </div>

                            {/* Transaction ID */}
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Transaction ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={step3.transactionId}
                                    onChange={(e) => setStep3({ ...step3, transactionId: e.target.value })}
                                    placeholder="Enter UPI transaction ID"
                                    className={inputCls("transactionId")}
                                />
                                {errors.transactionId && (
                                    <p className="text-red-500 text-[11px] mt-1">{errors.transactionId}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* NAV BUTTONS */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-[14px] font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={submitting}
                            className="flex-1 py-3 bg-teal-700 text-white rounded-xl text-[14px] font-semibold cursor-pointer hover:bg-teal-800 transition-colors disabled:opacity-60"
                        >
                            {currentStep === 3
                                ? submitting ? "Submitting..." : "Submit Consultation"
                                : "Next →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}