## Healthcare React Frontend

A React-based frontend for a healthcare management system branded as **MediConsult**. It provides separate portals for doctors and patients — supporting registration, login, consultation booking, prescription management, and PDF generation/email delivery.

---

## Table of Contents

- Tech Stack
- Project Structure
- Getting Started
- Environment Variables
- Application Routes
- Pages & Components
- PDF Generation
- Deployment

-------------------------------------------------------------------------------------

## Tech Stack

- Framework :- React 19 (ESM, Vite)
- Routing :- React Router DOM v7
- HTTP Client :- Axios
- Styling :- Tailwind CSS v4
- Animations :- Framer Motion
- Notifications :- react-hot-toast
- PDF Generation :- jsPDF
- Build Tool :- Vite v8
- Linting :- ESLint v10

-------------------------------------------------------------------------------------

## Project Structure

react_frontend/
├── public/
│   ├── _redirects              # Netlify SPA redirect rule
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx                # App entry point (BrowserRouter + Toaster)
│   ├── App.jsx                 # Route definitions
│   ├── App.css
│   ├── index.css               # Global styles
│   ├── assets/
│   │   ├── healthcareIcon.png  # App logo
│   │   ├── hero.png
│   │   └── react.svg
│   ├── config/
│   │   └── apiConfig.jsx       # Axios instance with base URL
│   ├── components/
│   │   ├── Home/
│   │   │   └── Home.jsx               # Landing page
│   │   ├── Doctor/
│   │   │   ├── DoctorLogin.jsx        # Doctor sign-in / register
│   │   │   ├── DoctorList.jsx         # Browse all doctors (patient view)
│   │   │   ├── DoctorProfile.jsx      # Doctor's own profile
│   │   │   └── DoctorPrescriptionPanel.jsx  # Manage consultations & prescriptions
│   │   ├── Patient/
│   │   │   ├── patientLogin.jsx       # Patient sign-in / register
│   │   │   ├── PatientProfile.jsx     # Patient's own profile
│   │   │   └── SendToPatient.jsx      # Send prescription email modal
│   │   └── Consultation/
│   │       └── DoctorConsultationForm.jsx   # 3-step consultation booking
│   └── utils/
│       └── generatePDF.js             # Client-side jsPDF prescription generator
├── dist/                       # Production build output
├── .env
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── package.json

-------------------------------------------------------------------------------------

## Getting Started

### Prerequisites

- Node.js :- 22.19.0
- Backend server running (`https://healthcare-react-backend.onrender.com`)

-------------------------------------------------------------------------------------

### Installation

# Clone the repository
git clone (https://github.com/Maya142000/healthcare_react.git)

# Install dependencies
npm install

# Configure environment variables
.env

# Edit .env with your backend URL
https://healthcare-react-backend.onrender.com/api/v1/

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

The dev server runs on `http://localhost:5173` by default.

-------------------------------------------------------------------------------------

## Environment Variables

Create a .env file in the root directory:

# Backend API base URL
VITE_AI_BACKEND=http://localhost:5000/api/v1/

# For production:
# VITE_AI_BACKEND=https://healthcare-react-backend.onrender.com/api/v1/

-------------------------------------------------------------------------------------

## Application Routes

All routes are defined in src/App.jsx using React Router v7.

- /patientlogin                 ==> PatientLogin
- /doctorlogin                  ==> DoctorLogin      
- /doctorsList                  ==> DoctorList      
- /consultationForm/:doctorId   ==> ConsultationForm 
- /doctorProfile                ==> DoctorProfile  
- /patientProfile               ==> PatientProfile 
- /prescriptionPanel            ==> PrescriptionPanel

-------------------------------------------------------------------------------------

## Pages & Components

# DoctorLogin.jsx — Doctor Auth Portal
Tabbed interface with [Sign In] and [Register] modes.

---Sign In fields---
- Email, Password

---Register fields---
- Name, Email, Password, Specialty, Mobile Number, Years of Experience, Profile Photo (uploaded via multipart to `/doctor/uploaddoctorImage`)

On successful login, stores `userid`, `doctorName`, and token in `localStorage` and navigates to `/prescriptionPanel`.


# patientLogin.jsx — Patient Auth Portal
Tabbed interface with [Sign In] and [Register] modes.

---Sign In fields---
- Email, Password

---Register fields---
- Name, Age, Email, Password, Mobile Number, History of Surgery, History of Illness (comma-separated tags), Profile Photo (uploaded via multipart to `/patient/uploadpatientImage`)

On successful login, stores `userid` and token in `localStorage` and navigates to `/doctorsList`.


# DoctorList.jsx — Find a Doctor
Displays a card grid of all registered doctors fetched from the backend. Each card shows the doctor's name, specialty, experience, and a Book Consultation button that navigates to `/consultationForm/:doctorId`. Includes a My Profile link and Sign Out button in the nav.

# DoctorConsultationForm.jsx — Consultation Booking (3-Step)

A multi-step form for patients to book a consultation with a selected doctor.

| Step | Title           | Fields                                                                 |
|------|-----------------|------------------------------------------------------------------------|
| 1    | Illness Info    | Current Illness History (required), Recent Surgery                     |
| 2    | Family History  | Diabetes status (Diabetic/Non-Diabetic), Allergies, Other notes        |
| 3    | Payment         | Transaction ID (required), Payment Status auto-set to `"SUCCESS"`      |

On submission, posts to `/consultation/saveConsultation` with `doctorId` and `patientId` from `localStorage`, then navigates back to `/doctorsList`.


# DoctorProfile.jsx — Doctor Profile Page
Fetches and displays the logged-in doctor's profile using `userid` from `localStorage`. Shows a gradient profile card with avatar (initials fallback), name, specialty, experience, email, and mobile number. Includes a Prescription Panel CTA button.


# PatientProfile.jsx — Patient Profile Page
Fetches and displays the logged-in patient's profile. Shows name, email, phone, and age in a card grid. Includes a back link to `/doctorsList`.


# DoctorPrescriptionPanel.jsx — Prescription Dashboard
The primary doctor workspace. Fetches all consultations assigned to the logged-in doctor. For each consultation, the doctor can:

- View patient details (name, illness, surgery history, diabetes, allergies)
- Write care instructions and add/remove medicines
- Save a new prescription (`/prescription/addPrescription`)
- Update an existing prescription (`/prescription/updatePrescription`)
- Download PDF of the prescription (client-side via `generatePrescriptionPDF`)
- Send email the prescription to the patient (via `SendToPatient` component)


# SendToPatient.jsx — Send Prescription Modal
A reusable component rendered inside the Prescription Panel. Displays a Send email / Resend email button. On click, shows a confirmation modal, then posts to `/prescription/sendPrescriptionToPatient` to trigger the backend email with PDF attachment.


## PDF Generation

Client-side prescription PDFs are generated in `src/utils/generatePDF.js` using jsPDF.

The PDF can be downloaded directly from the browser (no server call required). The backend also independently generates a server-side PDF via PDFKit when emailing the prescription.

-------------------------------------------------------------------------------------

## Deployment

The frontend is deployed on Netlify. The `public/_redirects` file ensures all routes resolve to `index.html` for client-side routing:

/*    /index.html   200

# Local URLs:
- Frontend: 
    `http://localhost:5173/doctorlogin`
    `http://localhost:5173/patientlogin`
- Backend: `http://localhost:5000/api/v1/`

# Production URLs:
- Frontend: 
    `https://healthcare-react-6e4e.onrender.com/doctorlogin`
    `https://healthcare-react-6e4e.onrender.com/patientlogin`
- Backend: `https://healthcare-react-backend.onrender.com`

# Build
npm run build

# Output: dist/
Deploy the `dist/` folder to Netlify (drag-and-drop or via Netlify CLI).
