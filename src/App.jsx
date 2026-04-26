import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/home";
import DoctorLogin from "./components/Doctor/DoctorLogin";
import PatientLogin from "./components/Patient/patientLogin";
import DoctorsList from "./components/Doctor/DoctorList";
import ConsultationForm from "./components/Consultation/DoctorConsultationForm";
import DoctorProfile from "./components/Doctor/DoctorProfile";
import PrescriptionPanel from "./components/Doctor/DoctorPrescriptionPanel";
import PatientProfile from "./components/Patient/PatientProfile";

function App() {
    return (
        <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/home" element={<Home />} />
            <Route path="/patientlogin" element={<PatientLogin />} />
            <Route path="/doctorlogin" element={<DoctorLogin />} />
            <Route path="/doctorsList" element={<DoctorsList />} />
            <Route path="/consultationForm/:doctorId" element={<ConsultationForm />} />
            <Route path="/doctorProfile" element={<DoctorProfile />} />
            <Route path="/patientProfile" element={<PatientProfile />} />
            <Route path="/prescriptionPanel" element={<PrescriptionPanel />} />

            {/* 404 not Found */}
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    );
}

export default App;