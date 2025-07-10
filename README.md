# ☕ Team Management Dashboard

Welcome to the **Team Management Dashboard** – a web application built with **Node.js** and **React.js** to manage and monitor your team's operations efficiently.

---

## 📦 Installation Guide

Follow the steps below to set up the project locally on your system.

---

### 🧱 1. Clone the Repository

```bash
git clone https://github.com/madiscoffee/MadisCoffeeDashboard.git
cd MadisCoffeeDashboard
```

### ⚙️ 2. Install Backend Dependencies

npm install

## 🖥️ Running the Node.js Server

To start the backend server, run:

```bash
npm run dev
``` 

This will launch the Node.js server on the configured port.

## 🌐 Running the React Frontend

Navigate to the frontend folder and follow these steps:

### 📁 1. Move to Client Directory

cd Client

### 📦 2. Install Frontend Dependencies

npm install

### 🔑 3. Configure API URL

## Create a file at:

src/config/configuration_keys.json

## Paste the following content:

{
  "REACT_APP_API_URL": "http://localhost:8080"
}

Replace with your actual backend URL if it's deployed somewhere else.

### ▶️ 4. Start the React Development Server

npm start

This will launch the React app locally in development mode at http://localhost:3000.

#### 🛠️ Tech Stack

* Frontend: React.js, MUI Material (or your preferred UI library)
* Backend: Node.js, Express.js
* Authentication: JWT-based Auth
* State Management: Redux Toolkit
* Routing: React Router

#### 🧪 Bonus Features

* ✅ Role-based views (Owner, Manager, Member)
* 🔐 Protected Routes
* ⏳ Loaders and Toast Notifications
* 🔍 Clean and modular folder structure

#### ❓ Support

Facing issues or have suggestions?
Feel free to open an issue on the GitHub Issues Page.

#### 📃 License

Thank you for using Team Management Dashboard! 🙌