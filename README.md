# 🎓 Student Resources Hub

**Student Resources Hub** is a web-based educational platform designed to provide students with all their academic resources in one centralized place.

The platform helps students easily access **Notes, Previous Year Questions (PYQs), Syllabus, E-Books, and AI-generated Practice Question Papers** without searching across multiple platforms.

## 📌 About the Project

Students often face difficulty finding study materials because notes, previous year papers, books, and syllabus documents are scattered across different websites, messaging groups, and storage platforms.

**Student Resources Hub** solves this problem by creating a single organized platform where students can search and access academic resources according to their **Branch, Semester, Subject, and Category**.

The project also includes an **Admin Panel** through which authorized administrators can upload and manage resources.

An **AI Question Paper Generator** is also included to help students create practice question papers based on selected subjects, topics, difficulty levels, and number of questions.

---

## ✨ Main Features

### 👨‍🎓 Student Features

* 📚 **Notes** – Access subject-wise and semester-wise study notes.
* 📝 **PYQs** – Access Previous Year Question Papers for exam preparation.
* 📖 **Syllabus** – Find semester and subject-wise syllabus.
* 📕 **E-Books** – Access useful academic books and study resources.
* 🔎 **Search & Filter** – Quickly find required resources.
* ⬇️ **View/Download Resources** – Access available study materials.
* 🤖 **AI Question Paper Generator** – Generate practice question papers using AI.

### 👨‍💼 Admin Features

* 🔐 Secure Admin Login
* 📤 Upload Resources
* 🗂️ Manage Resource Information
* 📚 Organize resources by category, semester and subject
* ☁️ Cloud-based file storage
* 🛠️ Manage the academic resource repository

---

## 🤖 AI Question Paper Generator

The AI module is one of the major features of the project.

Students can provide information such as:

* Subject
* Topics/Units
* Difficulty Level
* Number of Questions

The AI system then generates a **practice question paper** according to the selected requirements.

This makes the project more than a simple document repository and provides an additional intelligent learning feature.

---

## 🏗️ System Architecture

```text
                 👨‍🎓 Student / 👨‍💼 Admin
                           |
                           ↓
                  🖥️ React Frontend
                           |
                           ↓
                     🔗 REST API
                           |
                           ↓
                 ⚙️ Node.js + Express
                     /            \
                    /              \
                   ↓                ↓
             🗄️ MongoDB       ☁️ Cloudinary
             Database          File Storage
                    \
                     \
                      ↓
                 🤖 AI Service
```

---

## 🔄 Project Working

### Student Workflow

```text
Open Website
     ↓
Login / Register
     ↓
Select Resource
     ↓
Search / Filter
     ↓
View / Download
     ↓
Study
```

### Admin Workflow

```text
Admin Login
     ↓
Authentication
     ↓
Admin Panel
     ↓
Select File
     ↓
Upload Resource
     ↓
Cloud Storage
     ↓
Save Resource Metadata
     ↓
Resource Available to Students
```

---

## 🛠️ Technology Stack

### Frontend

* **React** – User interface development
* **TypeScript** – Type-safe and maintainable code
* **Tailwind CSS** – Responsive UI and styling
* **Vite** – Development server and build tool
* **HTML/JSX** – UI structure
* **CSS** – Styling

### Backend

* **Node.js** – Server-side JavaScript runtime
* **Express.js** – Backend framework and REST APIs
* **Mongoose** – MongoDB integration
* **JWT** – Authentication and authorization
* **Multer** – File upload handling
* **dotenv** – Environment variable management
* **CORS** – Frontend-backend communication

### Database & Storage

* **MongoDB** – User and resource metadata
* **MongoDB Atlas** – Cloud database hosting
* **Cloudinary** – Cloud file storage

### AI

* **AI API/Model** – Practice question paper generation

---

## 🗃️ Resource Structure

Each resource can contain information such as:

```text
Resource
├── Title
├── Semester
├── Subject
├── Category
├── Filename
└── Filepath
```

### Resource Categories

```text
📚 Notes
📝 PYQ
📖 Syllabus
📕 E-Books
```

---

## 🔐 Security

The project uses authentication mechanisms to protect restricted operations.

### JWT Authentication

```text
User Login
     ↓
Credentials Verification
     ↓
JWT Token
     ↓
Authenticated Request
     ↓
Protected API
```

Sensitive information such as database credentials, JWT secrets, cloud credentials, and AI API keys should be stored using **environment variables** instead of directly writing them in the source code.

> ⚠️ Never upload your `.env` file or secret API keys to GitHub.

---

## 📁 Project Structure

```text
Student-Resources-Hub/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎯 Project Objectives

* Centralize academic resources.
* Reduce the time required to find study materials.
* Organize resources properly.
* Provide easy access to study materials.
* Provide secure resource management.
* Help administrators manage academic files.
* Introduce AI-powered practice question generation.

---

## 🚀 Future Scope

The project can be further improved by adding:

* 📱 Android/iOS mobile application
* 🤖 AI Study Assistant
* 🎯 Personalized resource recommendations
* 🧠 Online MCQ and Quiz System
* 📊 Student Progress Tracking
* 🔔 Notifications for new resources
* 👨‍🏫 Teacher Dashboard
* 📈 Learning Analytics

---

## 👥 Project Team

**Project Name:** Student Resources Hub

**Domain:** Education Technology / Web Development / Artificial Intelligence

### Team Members

```text
1. Your Name – Developer
2. Team Member – Developer
3. Team Member – Developer
4. Team Member – Developer
```

---

## 🎓 Purpose

This project is developed as an **academic/educational project** to demonstrate the practical implementation of modern web technologies, database management, authentication, cloud storage, file management, and AI integration.

---

## ⭐ Project Highlights

> **One Platform → Organized Resources → Easy Access → Smarter Preparation**

**Student Resources Hub** aims to make academic resource management simple, organized, and accessible while adding AI-powered features for better exam preparation.
