import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../config/apiConfig";

export default function DoctorProfile() {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const id = localStorage.getItem("userid");
                const response = await api.get(`doctor/getDoctorById/${id}`);
                const result = response.data;
                console.log("...result...",result.Data)
                if (result?.status === true) setDoctor(result.Data);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-slate-400 text-[14px]">Loading profile...</div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <nav className="bg-white border-b border-slate-200 px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <span className="text-[17px] font-semibold text-slate-900">MediConsult</span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/prescriptionPanel")}
                        className="px-4 py-2 bg-teal-700 rounded-lg text-[13px] font-medium text-white cursor-pointer hover:bg-teal-800 transition-colors"
                    >
                        Prescription Panel →
                    </button>
                    <button
                        onClick={() => { localStorage.clear(); navigate("/doctorlogin"); }}
                        className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-[13px] font-medium text-red-600 cursor-pointer hover:bg-red-100 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <button
                    onClick={() => navigate("/prescriptionPanel")}
                    className="flex items-center gap-1 text-[13px] text-slate-500 mb-6 bg-transparent border-none cursor-pointer hover:text-slate-800 transition-colors"
                >
                    ← Back to Home
                </button>
                <div className="bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-8 flex items-center gap-6 mb-6 shadow-sm">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 bg-teal-50 flex items-center justify-center shrink-0">
                        {doctor?.doctor_image ? (
                            <img src={doctor.doctor_image} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-teal-700">
                                {doctor?.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-2xl leading-tight">{doctor?.name}</h1>
                        <span className="inline-block mt-2 bg-white/20 text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                            {doctor?.specialty}
                        </span>
                        <p className="text-white/70 text-[13px] mt-1">{doctor?.experience} years experience</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                        { label: "Email", value: doctor?.email },
                        { label: "Phone", value: doctor?.mobileNo },
                        { label: "Specialty", value: doctor?.specialty },
                        { label: "Experience", value: `${doctor?.experience} years` },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</div>
                            <div className="text-[14px] font-medium text-slate-800 truncate">{value || "—"}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate("/prescriptionPanel")}
                    className="w-full py-4 bg-teal-700 text-white rounded-2xl text-[15px] font-semibold cursor-pointer hover:bg-teal-800 transition-colors shadow-sm"
                >
                    Go to Prescription Panel →
                </button>
            </div>
        </div>
    );
}