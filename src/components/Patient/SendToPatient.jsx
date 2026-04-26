import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/apiConfig";

export default function SendToPatient({ consultation, rx, onSent }) {
    const [sending, setSending]   = useState(false);
    const [sent, setSent]         = useState(!!consultation?.prescription?.sent);
    const [showConfirm, setShow]  = useState(false);

    const handleSend = async () => {
        setSending(true);
        try {
            const response = await api.post("prescription/sendPrescriptionToPatient", {
                consultationId: consultation._id,
                patientId:      consultation.patientId,
            });
            const result = response.data;
            if (result?.status === true) {
                toast.success("Prescription sent to patient!");
                setSent(true);
                setShow(false);
                onSent?.();
            } else {
                toast.error(result?.message || "Failed to send");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setShow(true)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-colors ${
                    sent
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                        : "bg-teal-700 text-white hover:bg-teal-800"
                }`}
            >
                {sent ? "✓ Resend ✉" : "Send ✉"}
            </button>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden">

                        {/* Modal Header */}
                        <div className="bg-teal-700 px-6 py-5">
                            <h3 className="text-white font-semibold text-[16px]">
                                {sent ? "Resend Prescription?" : "Send Prescription?"}
                            </h3>
                            <p className="text-teal-200 text-[12px] mt-1">
                                {sent
                                    ? "A prescription was already sent. Sending again will notify the patient."
                                    : "This will notify the patient via email."}
                            </p>
                        </div>

                        {/* Patient Info */}
                        <div className="px-6 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center text-teal-700 font-bold text-[16px] shrink-0">
                                    {consultation.patientId.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[14px] font-semibold text-slate-900">
                                        {consultation.patientId.name}
                                    </p>
                                    <p className="text-[12px] text-slate-400 mt-0.5">
                                        {consultation.patientId.email || "No email on file"}
                                    </p>
                                </div>
                            </div>

                            {/* Rx Summary */}
                            <div className="mt-4 bg-slate-50 rounded-xl p-4 space-y-2">
                                <div>
                                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wide mb-1">
                                        Care to be Taken
                                    </p>
                                    <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-2">
                                        {rx?.care || "—"}
                                    </p>
                                </div>
                                {rx?.medicines?.filter(Boolean).length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wide mb-1">
                                            Medicines
                                        </p>
                                        <p className="text-[13px] text-slate-700">
                                            {rx.medicines.filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 py-4 flex gap-3">
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="flex-1 py-2.5 bg-teal-700 text-white rounded-xl text-[14px] font-semibold cursor-pointer hover:bg-teal-800 transition-colors disabled:opacity-60"
                            >
                                {sending ? "Sending..." : sent ? "Resend" : "Confirm Send"}
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-[14px] font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}