# AuraHealth Premium Telemetry — Backend API

Production-grade RESTful API backend for the **AuraHealth Premium Wellness & Bodybuilding Mobile Tracker**. Built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## 🚀 Key Highlights & Architecture

* **Modular Clean Architecture**: Organized into `config/`, `models/`, `controllers/`, `routes/`, `middleware/`, and `utils/`.
* **Database Resilience**: Configured with smart fallback handling. If MongoDB is not yet running or credentials are not yet set, the server runs gracefully in offline/mock mode without crashing and automatically connects as soon as your MongoDB instance becomes active.
* **JWT Authentication & Security**: Secure user registration, login, biometric tokens, hashed passwords with `bcryptjs`, `helmet` protection, and CORS support.
* **Bodybuilding Nutrition Engine**: Complete endpoints for calories, macronutrients (Protein, Carbs, Fats), and micronutrients (Fiber, Sodium, Potassium), meal categories, supplement tracking, and server-side natural language meal parsing.
* **Full Health Telemetry**: Endpoints for Vitals (HR, HRV, BP, Glucose, SpO2, Temp, ECG records), Sleep Architecture, Activity/Strain, Hydration, and Breathwork.
* **Mobile Offline-First Cloud Sync**: Dedicated `/api/sync/push` and `/api/sync/pull` endpoints to synchronize the mobile app's local offline records to cloud MongoDB.

---

## 📁 Project Structure

```
my app backend/
├── .env                  # Environment configuration
├── .env.example          # Template environment file
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── server.js         # Express app entry point
    ├── config/
    │   └── db.js         # Mongoose connection & graceful retry
    ├── middleware/
    │   ├── auth.js       # JWT protection & role authorization
    │   ├── errorHandler.js # Centralized error handler
    │   └── validate.js   # Request validation middleware
    ├── models/
    │   ├── User.js       # User auth & health profile
    │   ├── NutritionLog.js # Meals, macros, micros & supplements
    │   ├── VitalLog.js   # Vitals & manual ECG assessments
    │   ├── SleepLog.js   # Sleep duration, score & hypnogram stages
    │   ├── ActivityLog.js# Workouts, strain score & calories
    │   ├── HydrationLog.js # Daily water entries & target
    │   └── MindfulnessLog.js # Guided breathwork & meditation
    ├── controllers/
    │   ├── authController.js
    │   ├── nutritionController.js
    │   ├── vitalsController.js
    │   ├── sleepController.js
    │   ├── activityController.js
    │   ├── hydrationController.js
    │   ├── mindfulnessController.js
    │   └── syncController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── nutritionRoutes.js
    │   ├── vitalsRoutes.js
    │   ├── sleepRoutes.js
    │   ├── activityRoutes.js
    │   ├── hydrationRoutes.js
    │   ├── mindfulnessRoutes.js
    │   └── syncRoutes.js
    └── utils/
        └── nutritionDatabase.js # 120+ offline food database & NLP parser
```

---

## 🛠️ Quick Start

### 1. Install Dependencies
Open your terminal inside this folder (`my app backend`):
```bash
npm install
```

### 2. Configure Environment (`.env`)
The `.env` file is already created. You can customize the settings if needed:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/aurahealth
JWT_SECRET=aurahealth_hyper_secure_jwt_secret_token_2026_biometrics_key
JWT_EXPIRE=30d
CLIENT_URL=*
```

### 3. Connect MongoDB (Whenever You Are Ready)

#### Option A: Local MongoDB
If you have MongoDB installed on your computer:
1. Start the MongoDB service:
   ```bash
   mongod
   ```
2. Your connection string in `.env` is already configured:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/aurahealth
   ```

#### Option B: Free Cloud Database (MongoDB Atlas)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** -> **Drivers** (Node.js) and copy the URI.
5. Paste it in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aurahealth?retryWrites=true&w=majority
   ```

> **Note:** The server works immediately even if MongoDB is not connected yet! It will automatically connect as soon as you provide the connection string or start your database.

### 4. Run the Server

* **Development mode (with auto-restart)**:
  ```bash
  npm run dev
  ```
* **Production mode**:
  ```bash
  npm start
  ```

Once started, test it in your browser or Postman at:
`http://localhost:5000/api/health`

---

## 📚 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login with email & password | No |
| `POST` | `/api/auth/demo` | 1-Tap instant demo login | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes (`Bearer token`) |
| `PUT` | `/api/auth/profile` | Update user height, weight & goals | Yes (`Bearer token`) |

### 🥗 Nutrition & Bodybuilder Macros (`/api/nutrition`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/nutrition` | Get daily meals, macros & supplements | Yes |
| `POST` | `/api/nutrition/food` | Add a food item to meal category | Yes |
| `POST` | `/api/nutrition/foods/bulk` | Bulk add multiple foods to meal | Yes |
| `DELETE` | `/api/nutrition/food/:id`| Remove food item by ID | Yes |
| `PUT` | `/api/nutrition/targets` | Update daily calories, macros & phase | Yes |
| `PUT` | `/api/nutrition/supplements/:id` | Toggle supplement taken/untaken | Yes |
| `POST` | `/api/nutrition/analyze-meal`| Parse natural text (e.g. "200g chicken") | No |
| `GET` | `/api/nutrition/foods/search`| Search 120+ food database | No |

### 💓 Vitals & ECG (`/api/vitals`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/vitals` | Get heart rate, HRV, BP, Glucose, ECGs | Yes |
| `POST` | `/api/vitals/:vitalType` | Log HR, BP, Glucose, SpO2, or Temp | Yes |
| `POST` | `/api/vitals/ecg/record` | Add manual single-lead ECG assessment | Yes |
| `DELETE` | `/api/vitals/ecg/:id` | Delete ECG record | Yes |

### 🌙 Sleep Architecture (`/api/sleep`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/sleep` | Get sleep score, duration & hypnogram | Yes |
| `POST` | `/api/sleep` | Log sleep session, bed/wake time | Yes |

### ⚡ Activity & Strain (`/api/activity`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/activity` | Get daily strain, workouts & calories | Yes |
| `POST` | `/api/activity/workout` | Log workout session | Yes |
| `DELETE` | `/api/activity/workout/:id` | Delete workout session | Yes |

### 💧 Hydration (`/api/hydration`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/hydration` | Get daily water intake & progress | Yes |
| `POST` | `/api/hydration/log` | Add water entry (e.g. 250ml, 500ml) | Yes |
| `PUT` | `/api/hydration/target` | Update daily hydration target (ml) | Yes |

### 🧘 Mindfulness & Breathwork (`/api/mindfulness`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/mindfulness` | Get completed breathwork sessions | Yes |
| `POST` | `/api/mindfulness/session` | Log breathwork (Box Breathing, etc.) | Yes |

### 🔄 Offline-First Cloud Sync (`/api/sync`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/sync/push` | Push mobile AsyncStorage state to MongoDB | Yes |
| `GET` | `/api/sync/pull` | Download full cloud telemetry | Yes |

