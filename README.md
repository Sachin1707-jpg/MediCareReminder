# MediCare Reminder

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

MediCare Reminder is a modern, full-stack MERN application designed to help users manage their medications, receive timely browser notifications, monitor health vitals, and track their adherence through beautiful Apple/Notion-inspired analytics dashboards.

## 🚀 Features
- **Robust Authentication**: Secure JWT-based login, registration, and password reset flows via HttpOnly cookies.
- **Medicine Management**: Full CRUD capabilities for prescriptions, frequencies, and priority labeling.
- **Dashboard Analytics**: Real-time stats engine calculating completion percentages and categorizing upcoming vs. missed medications.
- **Push Notifications**: Integrated Service Workers and Web Push API to deliver native browser alerts.
- **Health Tracking**: Comprehensive logging for Water Intake, BMI, Steps, Blood Pressure, and Sleep Hours.
- **Data Visualization**: Stunning Chart.js integration for historical adherence and health trending.

## 🛠 Tech Stack
**Frontend:**
- React 19 (Vite)
- Tailwind CSS
- React Router DOM
- TanStack Query (React Query)
- React Hook Form
- Framer Motion
- Chart.js (react-chartjs-2)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT & bcryptjs
- Zod Validation
- Node-cron (Scheduler)
- Web-Push

## 📂 Repository Structure
```text
/
├── medicare-frontend/       # Vite React application
│   ├── public/              # Static assets and Service Worker (sw.js)
│   ├── src/
│   │   ├── components/      # Reusable UI (Buttons, Modals)
│   │   ├── features/        # Domain logic (auth, medicines, dashboard)
│   │   ├── hooks/           # Global custom hooks
│   │   ├── layouts/         # Page wrappers (DashboardLayout)
│   │   └── routes/          # Protected and Public route definitions
├── medicare-backend/        # Node.js Express server
│   ├── src/
│   │   ├── controllers/     # HTTP Request handlers
│   │   ├── middlewares/     # JWT Protection, Global Error Handler
│   │   ├── models/          # Mongoose Schemas (User, Medicine, AdherenceLog)
│   │   └── routes/          # API endpoint definitions
│   └── server.js            # Entry point
└── docs/                    # Architecture, Deployment, and Security guidelines
```

## 💻 Installation & Local Development

1. **Clone the repository**
2. **Setup Backend:**
   ```bash
   cd medicare-backend
   npm install
   cp .env.example .env
   # Update the .env file with your local MongoDB URI and JWT secrets
   npm run dev
   ```
3. **Setup Frontend:**
   ```bash
   cd medicare-frontend
   npm install
   cp .env.example .env
   # Update the .env file with the backend API URL
   npm run dev
   ```

## 🔮 Future Scope
- **AI Health Insights**: Integration with LLMs to provide personalized health tips based on tracked vitals.
- **Doctor/Patient Portal**: Allow users to securely share adherence logs with healthcare providers.
- **Mobile App**: Wrapping the responsive PWA into a native iOS/Android shell using React Native.
- **Wearable Integration**: Syncing Steps and Heart Rate directly from Apple HealthKit and Google Fit.
