import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/healthcareIcon.png";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#1f2a3a] text-white font-sans">
            {/* Header */}
            <div className="flex justify-between items-center px-10 py-4 bg-white text-black">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0F766E] w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden">
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <h1 className="text-xl font-semibold font-serif">
                        HealthCare
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/doctorlogin")}
                        className="px-8 py-2 border border-black text-black rounded-lg hover:bg-[#0F766E] hover:text-white transition duration-300"
                    >
                        Doctor Portal
                    </button>

                    <button
                        onClick={() => navigate("/patientlogin")}
                        className="px-8 py-2 border border-black text-black rounded-lg hover:bg-[#0F766E] hover:text-white transition duration-300"
                    >
                        Patient Portal
                    </button>
                </div>
            </div>

            {/* Main Section */}
            <div className="flex flex-col items-center justify-center text-center mt-20 px-6">
                <h1 className="text-5xl font-bold mb-4 font-serif">
                    Healthcare at Your Fingertips
                </h1>

                <p className="text-gray-300 max-w-xl mb-12">
                    Connect with certified doctors, get prescriptions, and manage your health — all in one place.
                </p>

                <div className="flex flex-col md:flex-row gap-10">
                    <div onClick={() => navigate("/doctorlogin")} 
                    className="bg-[#2c3a4f] p-10 rounded-2xl w-80 shadow-lg hover:scale-105 transition">
                        <div className="bg-[#9aa3db] w-14 h-14 flex items-center justify-center rounded-xl mx-auto mb-5">
                            ✔
                        </div>
                        <h2 className="text-xl font-semibold mb-2">
                            I'm a Doctor
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Manage consultations and write digital prescriptions
                        </p>
                    </div>

                    <div onClick={() => navigate("/patientlogin")}
                    className="bg-[#2c3a4f] p-10 rounded-2xl w-80 shadow-lg hover:scale-105 transition">
                        <div className="bg-[#9aa3db] w-14 h-14 flex items-center justify-center rounded-xl mx-auto mb-5">
                            👥
                        </div>
                        <h2 className="text-xl font-semibold mb-2">
                            I'm a Patient
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Find doctors, book consultations, get prescriptions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;