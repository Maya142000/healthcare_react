import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../config/apiConfig";

export default function DoctorLogin() {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        specialty: "",
        mobileNo: "",
        experience: "",
        doctor_image: ""
    });
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState("signin");
    const [photo, setPhoto] = useState(null);
    const fileRef = useRef();
    const navigate = useNavigate();

    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("doctorImage", file)

            const response = await api.post("/doctor/uploaddoctorImage", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            console.log("...response...",response)
            if (response.data?.status) {
                setPhoto(response.data.filePath); 
                toast.success("Image uploaded successfully ");
            } else {
                toast.error("Upload failed");
            }
        } catch (error) {
            toast.error("Image upload failed, Please try again later");
        }
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;

        setUserData((prev) => ({ 
            ...prev, 
            [name]: value ?? "" 
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;

        setRegisterData((prev) => ({
            ...prev,
            [name]: value ?? ""
        }));
    };


    const registerValidation = () => {
        let newErrors = {};

        if (!registerData.name.trim()) {
            newErrors.name = "Name is required...!";
        }

        if (!registerData.email.trim()) {
            newErrors.email = "Email is required...!";
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!registerData.password.trim()) {
            newErrors.password = "Password is required...!";
        } else if (registerData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!registerData.specialty.trim()) {
            newErrors.specialty = "Specialty is required...!";
        }

        if (!registerData.phone.trim()) {
            newErrors.phone = "Phone is required...!";
        } else if (registerData.phone.length < 10) {
            newErrors.phone = "Enter valid phone number";
        }

        if (!registerData.experience) {
            newErrors.experience = "Experience is required...!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const loginValidation = () => {
        let newErrors = {};

        if (!userData.email.trim()) {
            newErrors.email = "Email is required...!";
        }

        if (!userData.password.trim()) {
            newErrors.password = "Password is required...!";
        } else if (userData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleRegisterClick = async () => {
        try {
            const payload = {
                ...registerData,
                doctor_image: photo,
            };

            const response = await api.post("doctor/doctorsignUp", payload);

            const result = response.data;

            if (result?.status === true) {
                toast.success("Account created successfully!");
                setTab("signin");   
            } else {
                toast.error(result?.message || "Registration failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    };

    const handleLoginClick = async (e) => {
        e.preventDefault();

        const validate = loginValidation();
        if (!validate) {
            toast.error("Please fill all required...!");
            return;
        }

        try {
            const response = await api.post("doctor/doctorlogin", {
                email: userData.email,
                password: userData.password,
            });

            const result = response.data;

            if (result?.status === true) {
                toast.success(result?.message);

                localStorage.setItem("userid", result?.id || "");
                localStorage.setItem("token", result?.token || "");
                localStorage.setItem(
                    "refreshToken",
                    result?.refreshToken || ""
                );
                navigate("/doctorProfile");
            } else {
                toast.error("Login failed, Please try again later...");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong...!"
            );
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <nav className="bg-white border-b border-slate-200 px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="white"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <span className="text-[17px] font-semibold text-slate-900">
                        MediConsult
                    </span>
                </div>
                <div className="flex gap-3">
                    {/* <button
                        onClick={() => navigate("/doctorlogin")}
                        className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[13px] font-medium text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        Doctor Portal
                    </button>
                    <button
                        onClick={() => navigate("/patientlogin")}
                        className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[13px] font-medium text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        Patient Portal
                    </button> */}
                </div>
            </nav>

            <div className="px-4 py-30">
                {/* <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-1 text-[13px] text-slate-500 mb-6 bg-transparent border-none cursor-pointer hover:text-slate-800 transition-colors"
                >
                    ← Back to Home
                </button> */}

                <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-[560px]  mx-auto shadow-sm">
                    <h1 className="font-serif font-extrabold text-[2rem] text-slate-900 mb-1">
                        Doctor Portal
                    </h1>
                    <p className="text-[14px] text-slate-500 mb-6">
                        Sign in to manage your consultations
                    </p>

                    {/* TABS */}
                    <div className="flex bg-slate-50 rounded-lg p-1 mb-6">
                        <button
                            onClick={() => setTab("signin")}
                            className={`flex-1 py-2 text-[13px] rounded-md border-none cursor-pointer transition-all ${
                                tab === "signin"
                                    ? "bg-white font-semibold text-slate-900 shadow-sm"
                                    : "bg-transparent font-normal text-slate-500"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setTab("signup")}
                            className={`flex-1 py-2 text-[13px] rounded-md border-none cursor-pointer transition-all ${
                                tab === "signup"
                                    ? "bg-white font-semibold text-slate-900 shadow-sm"
                                    : "bg-transparent font-normal text-slate-500"
                            }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {tab === "signin" ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email || ""}
                                    onChange={handleLoginChange}
                                    placeholder="doctor@example.com"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password || ""}
                                    onChange={handleLoginChange}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                />
                            </div>

                            <button
                                onClick={handleLoginClick}
                                className="w-full py-3 bg-teal-700 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer mt-1 hover:bg-teal-800 transition-colors"
                            >
                                Sign In
                            </button>
                            <p className="text-center text-[13px] text-slate-500 mt-4">
                                Demo: use any registered email + password "demo"
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-5">
                                <div
                                    onClick={() => fileRef.current.click()}
                                    className="w-16 h-16 rounded-full bg-teal-50 border-2 border-dashed border-teal-400 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 text-[12px] text-teal-700 font-medium text-center leading-tight"
                                >
                                    {photo ? (
                                        <img
                                            src={photo}
                                            className="w-full h-full object-cover rounded-full"
                                            alt="profile"
                                        />
                                    ) : (
                                        <span>+ Photo</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileRef}
                                    className="hidden"
                                    onChange={handlePhoto}
                                />
                                <div>
                                    <div className="text-[13px] font-medium text-slate-700">
                                        Profile Photo
                                    </div>
                                    <div className="text-[12px] text-slate-400 mt-0.5">
                                        Click to upload
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                        Full Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={registerData.name || ""}
                                        onChange={handleRegisterChange}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                        Specialty{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        name="specialty"
                                        value={registerData.specialty || ""}
                                        onChange={handleRegisterChange}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Cardiologist">Cardiologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Orthopedic">Orthopedic</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="General Physician">General Physician</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email || ""}
                                    onChange={handleRegisterChange}
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={registerData.password || ""}
                                    onChange={handleRegisterChange}
                                    placeholder="Min 6 characters"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                        Phone{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobileNo"
                                        value={registerData.mobileNo || ""}
                                        onChange={handleRegisterChange}
                                        placeholder="+91 XXXXXXXX"
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                                        Years of Experience{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={registerData.experience || ""}
                                        onChange={handleRegisterChange}
                                        placeholder="e.g. 1.5"
                                        step="0.5"
                                        min="0"
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[14px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleRegisterClick}
                                className="w-full py-3 bg-teal-700 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer mt-1 hover:bg-teal-800 transition-colors"
                            >
                                Create Account
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
