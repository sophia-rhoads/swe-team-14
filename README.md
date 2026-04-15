# 🎬 Cinema E-Booking System

A full-stack **Cinema E-Booking System** that allows users to browse movies and manage theatre bookings through a modern web interface backed by a RESTful API.

This project was developed as part of a Software Engineering course deliverable and demonstrates full-stack application design using Angular and Spring Boot.

---

## 📌 Project Overview

The Cinema E-Booking System provides a platform for managing movie listings and theatre booking operations. The system follows a **client–server architecture**:

* **Frontend:** Angular-based web application for user interaction
* **Backend:** Spring Boot REST API handling business logic and database operations
* **Database:** MySQL for persistent storage

The application enables movie data management and provides APIs that can be extended to support booking workflows.

---

## 🧰 Tech Stack

### Frontend

* Angular (v21)
* TypeScript
* PrimeNG UI Components
* PrimeFlex & PrimeIcons
* RxJS

### Backend

* Java 17
* Spring Boot
* Spring Web MVC
* Spring Data JPA
* Gradle Build System

### Database

* MySQL

---

## 📁 Project Structure

```
Cinema_E-Booking_System/
│
├── FrontEndDev/
│   └── movie-theatre/        # Angular frontend application
│
└── BackEndDev/
    └── theatreBooking/       # Spring Boot backend API
```

---

## ⚙️ Prerequisites

Make sure the following are installed:

* Node.js (v18+ recommended)
* npm
* Angular CLI
* Java JDK 17
* Gradle (or use included wrapper)
* MySQL Server

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd Cinema_E-Booking_System
```

---

## 🖥️ Running the Backend (Spring Boot)

Navigate to the backend directory:

```bash
cd BackEndDev/theatreBooking
```

### Configure Database

Update the database credentials in:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Run the Application

Using Gradle wrapper:

```bash
./gradlew bootRun
```

(or on Windows)

```bash
gradlew.bat bootRun
```

The backend server will start at:

```
http://localhost:8080
```

---

## 🌐 Running the Frontend (Angular)

Navigate to the frontend directory:

```bash
cd FrontEndDev/movie-theatre
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The application will run at:

```
http://localhost:4200
```

---

## 🔌 Backend API Overview

The backend exposes REST endpoints for movie management through:

* `MovieController`
* `MovieService`
* `MovieRepo`

Typical operations include:

* Retrieve movie listings
* Add or manage movie records
* Database persistence via JPA

(API endpoints can be extended for seat selection, bookings, payments, etc.)

---

## 🧪 Running Tests

### Backend Tests

```bash
./gradlew test
```

### Frontend Tests

```bash
npm test
```

---

## ✨ Features

* Full-stack architecture (Angular + Spring Boot)
* RESTful API design
* Database integration using JPA
* Modular service and controller layers
* Modern responsive UI using PrimeNG

---

## 🔮 Future Improvements

* User authentication & authorization
* Seat selection system
* Booking and payment integration
* Admin dashboard
* Deployment with Docker or cloud hosting

## 📄 License

This project is created for educational purposes.
You may modify and reuse it according to your course or personal project needs.

---

## ✅ Notes Before Pushing to GitHub

Recommended additions:

* Add `.gitignore` entries for:

  * `node_modules/`
  * `build/`
  * `.gradle/`
  * `.DS_Store`
* Do **not** commit compiled files or dependency folders.

---

⭐ If you found this project useful, consider giving it a star!