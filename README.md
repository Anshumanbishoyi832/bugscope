# 🐛 BugScope

BugScope is a powerful, developer-friendly error monitoring and debugging platform. It helps you track, analyze, and resolve application errors in real time using a lightweight client SDK and a comprehensive dashboard.

## 🌟 Key Features

- **Real-time Error Tracking**: Instantly captures JavaScript exceptions, unhandled promise rejections, resource load failures, and network errors.
- **Detailed Error Context**: Records detailed stack traces, HTTP statuses, URLs, resource tags, and user agent info to help you pinpoint the exact cause of an error.
- **Client SDK**: A zero-dependency, lightweight vanilla JavaScript SDK (`bugscope.js`) that is easy to install in any web application.
- **Interactive Dashboard**: A responsive frontend built with React, Vite, and Tailwind CSS. Provides visualizations, project management, and error status tracking (Active vs. Resolved).
- **Project Structure**: Organize your application errors seamlessly by grouping them into projects using unique API keys.
- **Rate-Limiting & Security**: Built-in rate limiting protects your API endpoints from spam, and payload limits prevent excessively large error reports.

## 🏗️ Architecture Overview

BugScope is divided into three main components:

### 1. Backend (Node.js & Express)
Located in `backend/`, serving as the API and ingestion server.
- **Database**: MongoDB (using Mongoose) stores `User`, `Project`, and `Errorlog` documents.
- **API Routes**:
  - `/api/auth`: Handles user registration, login, and JWT-based authentication.
  - `/api/projects`: Manages project creation and API key generation.
  - `/api/errors`: The ingestion endpoint where the Client SDK sends error logs. Includes custom CORS handling so any origin can securely report an error.
- **Rate Limiting**: Protects auth routes (max 20 requests / 15 min) and SDK ingest routes (max 200 SDK error reports / min).

### 2. Frontend Dashboard (React + Vite)
Located in `bugscope-frontend/`.
- **Tech Stack**: React 19, React Router v7, Redux Toolkit (state management), Tailwind CSS (styling), Recharts (data visualization), and Framer Motion (animations).
- **Core Pages**: Dashboard (overview metrics), Projects (manage API keys), and Errors (detailed error feed and resolution toggling).

### 3. Client SDK (`bugscope.js`)
Located in `backend/sdk/`.
- Auto-detects the backend URL or accepts a custom `endpoint`.
- Intercepts global errors via `window.addEventListener("error")` & `"unhandledrejection"`.
- Patches `window.fetch` to seamlessly catch failed network requests.
- Captures broken images/scripts via resource event capturing.
- Exposes a `BugScope.captureException(error)` method for manual error logging.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection URI string

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```
*(The backend will run on http://localhost:5000 and serve the SDK at http://localhost:5000/sdk/bugscope.js)*

### 2. Frontend Setup
```bash
cd bugscope-frontend
npm install
```
Start the frontend dev server:
```bash
npm run dev
```
*(The dashboard will be available at http://localhost:5173)*

---

## 🛠️ SDK Usage & Integration Guide

Integrating BugScope into your own application is easy. Include the SDK script in your project and initialize it with your Project's API Key.

### Step 1: Get an API Key
1. Start the BugScope platform locally.
2. Sign up / Log in to the Dashboard.
3. Navigate to **Projects** and create a new project.
4. Copy the generated **API Key**.

### Step 2: Add the SDK to your Web App
Include the script tag inside the `<head>` of your HTML document (before other scripts):

```html
<!-- Import BugScope SDK -->
<script src="http://localhost:5000/sdk/bugscope.js"></script>

<script>
  // Initialize BugScope SDK
  if (window.BugScope) {
    window.BugScope.init({ 
      apiKey: "YOUR_PROJECT_API_KEY",
      // endpoint: "http://localhost:5000/api/errors" // Optional: specify if hosting backend elsewhere
    });
  }
</script>
```

### What does it capture?
Once initialized, BugScope automatically starts listening for:
1. **Global Exceptions:** E.g., `ReferenceError` when calling an undefined function.
2. **Unhandled Promise Rejections:** Failing async operations not caught by a `.catch()` block.
3. **Resource Failures:** Broken `<img>`, `<script>`, or `<link>` tags (e.g. 404 Not Found on static assets).
4. **Network Failures:** Failing `fetch()` API calls (HTTP 4xx or 5xx responses).

#### Manual Error Logging
You can also manually log handled errors inside your code via `try...catch` blocks:
```javascript
try {
  // Attempt a risky operation
  throw new Error("Something unexpectedly went wrong!");
} catch (error) {
  if (window.BugScope) {
    window.BugScope.captureException(error);
  }
}
```

### Try it out!
A designated simulation environment is provided in the root directory: `test.html`.
Simply open `test.html` in your browser (ensure your backend server is running) and click the "Simulate Errors" buttons. Watch the generated errors populate instantly on your BugScope dashboard!

---
*Built with ❤️ for better application stability.*
