# 🧩 Mini Trello - Task Management App

A lightweight Trello-style task management web application built using **Spring Boot microservices**, **React (Vite + Material UI)**, and **MySQL**. This app allows users to manage projects and tasks efficiently with JWT authentication, Eureka service discovery, and API Gateway routing.

## 🚀 Features

### ✅ Backend (Spring Boot Microservices)
- **User Service**: Registration, login with JWT, role-based access (User/Admin).
- **Project Service**: Create and manage projects.
- **Task Service**: Assign and manage tasks per project.
- **API Gateway**: Central routing for all services.
- **Eureka Server**: Service registry for discovery and load balancing.

### 🎨 Frontend (React + Vite + MUI)
- Clean, responsive UI
- Authentication flow (login, register)
- Create and manage Projects & Tasks
- Role-based navigation and access control

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Cloud Gateway
- Eureka Server
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React
- Vite
- Material UI
- Axios
- React Router

---

## ⚙️ Microservices Structure
mini-trello/
├── api-gateway/
├── eureka-server/
├── user-service/
├── project-service/
├── task-service/
└── mini-trello/ (React + Vite)


---

## 🔐 Authentication & Roles

- JWT-based login for users
- Roles: `USER`, `ADMIN`
- Secure endpoints with role-based access
- Auth flow via API Gateway

---

## 🧪 Running the App Locally

### 1. Prerequisites
- Java 17+
- Node.js (v16+ recommended)
- MySQL
- Maven

### 2. Clone the Repository

```bash
git clone https://github.com/Tinashe40/mini-trello.git
cd mini-trello
```
### 3. Setup MySQL
Create the following databases:

```
CREATE DATABASE user_db;
CREATE DATABASE project_db;
CREATE DATABASE task_db;
```

### Start the Backend
  #### Start each service:
    cd eureka-server
      ./mvnw spring-boot:run

    cd ../api-gateway
      ./mvnw spring-boot:run

    cd ../user-service
      ./mvnw spring-boot:run

    cd ../project-service
      ./mvnw spring-boot:run

    cd ../task-service
      ./mvnw spring-boot:run

### Start the FrontEnd
cd mini-trello
npm install
npm run dev
The frontend should now be available at http://localhost:5173.

### 📬 API Endpoints (Via API Gateway)
/auth/register - Register User
/auth/login - Login
/projects/ - CRUD for Projects
/tasks/ - CRUD for Tasks
Note: All routes are secured and need a JWT token in Authorization header.

### 🧳 Deployment
- Containerization with Docker (optional)
- Can be deployed on VPS or cloud (e.g., AWS, Heroku, DigitalOcean)

# ✍️ Author
Tinashe Mutero, Junior Software Developer

Passionate about building scalable, impactful software for Africa 🌍

# 📄 License
    This project is open-source and available under the MIT License.