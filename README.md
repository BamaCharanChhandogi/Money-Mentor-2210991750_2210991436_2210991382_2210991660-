# Money Mentor

## Team Members
| Roll Number  | Name                  |
|--------------|-----------------------|
| 2210991750   | Karandeep Kaur        |
| 2210991436   | Bama Charan Chhandogi |
| 2210991382   | Aryan Kaushal         |
| 2210991660   | Himanshu Joshi        |

## Project Type
Research

## Description
Money Mentor is a full-stack financial management web application that helps users track expenses, analyze spending patterns, and make better financial decisions. It features real-time budget tracking, a dynamic financial health score, categorized expense reports, investment portfolio insights, AI-powered financial advice (via Google Gemini), and family expense sharing — all through an interactive, personalized dashboard.

## Tech Stack
- **Frontend:** React.js (Vite) + Tailwind CSS
- **Backend:** Node.js / Express.js
- **Database:** MongoDB (Mongoose)
- **AI:** Google Generative AI (Gemini)
- **Banking:** Plaid API
- **Real-time:** Socket.io

## Folder Structure
```
Money-Mentor/
├── IPR Submission Proof/   # IPR proof documents (PDF + screenshots)
├── Report and PPT/         # Final report and presentation
├── Source code/             # Application source code
│   ├── client/             #   React frontend
│   └── server/             #   Express backend
└── README.md
```

## How to Run

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB instance (local or Atlas)

### Backend (Server)
```bash
cd "Source code/server"
npm install
# Create a .env file with: PORT, CLIENT_URL, MONGO_URI, JWT_SECRET,
# EMAIL, EMAIL_PASSWORD, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV,
# PLAID_PRODUCTS, PLAID_COUNTRY_CODE, GEMINI_API_KEY
npm start
```
Server runs on `http://localhost:5000`

### Frontend (Client)
```bash
cd "Source code/client"
npm install
npm run dev
```
Client runs on `http://localhost:5173`

## Current Status
✅ Completed

## Deployment
🔗 [https://money-mentor-wheat.vercel.app/](https://money-mentor-wheat.vercel.app/)
