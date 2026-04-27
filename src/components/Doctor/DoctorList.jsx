import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../config/apiConfig";

export default function DoctorsList() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get("doctor/getAllDoctors");
                console.log("..response..",response)
                const result = response.data;
                console.log("..result..",result)
                if (result?.status === true) {
                    setDoctors(result.Data);
                }
            } catch (error) {
                toast.error("Failed to load doctors");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

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
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/patientProfile")}
                        className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[13px] font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        My Profile
                    </button>
                    <button
                        onClick={() => { localStorage.clear(); navigate("/doctorlogin"); }}
                        className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-[13px] font-medium text-red-600 cursor-pointer hover:bg-red-100 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className="px-6 py-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-[1.8rem] font-extrabold font-serif text-slate-900">Find a Doctor</h1>
                    <p className="text-[14px] text-slate-500 mt-1">Browse our specialists and book a consultation</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
                                <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-4" />
                                <div className="h-4 bg-slate-200 rounded mb-2" />
                                <div className="h-3 bg-slate-100 rounded w-2/3 mx-auto mb-4" />
                                <div className="h-9 bg-slate-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                        <p className="text-[15px] font-medium text-slate-500">No doctors available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor._id}
                                doctor={doctor}
                                onConsult={() => navigate(`/consultationForm/${doctor._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DoctorCard({ doctor, onConsult }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-teal-50 border-4 border-teal-100 mb-4 flex items-center justify-center shrink-0">
                {doctor.doctor_image ? (
                    <img src={doctor.doctor_image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-2xl font-bold text-teal-700">
                        {doctor.name?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Name */}
            <h3 className="text-[15px] font-semibold text-slate-900 mb-1 leading-tight">{doctor.name}</h3>

            {/* Specialty badge */}
            <span className="inline-block px-3 py-0.5 bg-teal-50 text-teal-700 text-[11px] font-semibold rounded-full mb-1">
                {doctor.specialty}
            </span>

            {/* Experience */}
            <p className="text-[12px] text-slate-400 mb-4">{doctor.experience} yrs experience</p>

            {/* Consult Button */}
            <button
                onClick={onConsult}
                className="w-full py-2.5 bg-teal-700 text-white rounded-xl text-[13px] font-semibold cursor-pointer hover:bg-teal-800 transition-colors"
            >
                Consult Now
            </button>
        </div>
    );
}