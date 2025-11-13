# 🌿 AyurWell — Ayurvedic Diet Management System

> **Bridging traditional Ayurvedic wisdom with modern nutritional science.**  
> A clinical-grade platform designed for Ayurvedic hospitals and practitioners to digitize, personalize, and scale patient diet management.

## Overview

**AyurWell** is an enterprise-grade digital platform that modernizes Ayurvedic dietary management by integrating classical Ayurvedic principles (*Rasa, Virya, Vipaka, Dosha*) with modern nutritional science.  
It enables practitioners to design, monitor, and analyze patient-specific diet plans with machine learning and data-driven precision.

## 🚧 Current Development Status

- User authentication & authorization  
- Patient management with Dosha profiling  
- Expandable food database  
- RESTful API integration  
- Responsive React frontend  
- Docker containerization
- Recipe management & auto-nutrition calculation  
- Diet chart builder

## Key Features

### Clinical Management
- **Patient Profiling:** Ayurvedic *Prakriti* assessment  
- **Dosha Categorization:** Automatic food suitability detection  
- **Progress Tracking:** Monitors weight, compliance, and outcomes  
- **BMI & Metrics:** Integrated health calculations  

### Food Database
- 8,000+ foods across Indian and global cuisines  
- Nutritional profiles (macros & micros)  
- Ayurvedic attributes (*Rasa, Virya, Vipaka, Guna*)  
- Multi-criteria search and CSV-based data import  

### Diet Chart Builder
- AI-powered personalized diet chart generation  
- Rasa balance validation  
- Recipe integration with auto-calculated nutrition  
- Exportable PDF diet charts  

### Security & Compliance 
- Role-based access control  
- Secure JWT authentication  
- Complete audit logging  


## 🧠 Further Development (AI & ML Focus)

AyurWell is evolving into an **intelligent Ayurvedic recommendation ecosystem** powered by modern machine learning techniques.

**Planned ML Components:**
- **Personalized Diet Recommendation Engine:**  
  Uses **collaborative filtering** and **content-based models** to predict suitable foods based on Dosha type, previous patient data, and nutritional history.
- **Dosha Imbalance Detection:**  
  Classification models trained on patient symptoms and dietary data to predict potential Dosha imbalances.
- **Predictive Analytics:**  
  Regression-based models to forecast patient progress (weight, health scores) based on dietary adherence.
- **NLP-driven Food Recognition:**  
  Natural Language Processing models to parse unstructured text or voice inputs (e.g., “had khichdi with ghee”) into structured food data.
- **Explainable AI (XAI):**  
  To make ML recommendations interpretable for practitioners, ensuring transparency in decision support.
- **Data Visualization Dashboards:**  
  Real-time patient analytics and dietary trends using Recharts and D3.js.


**Highlights**
- Modular, microservices-ready design  
- Redis caching for performance  
- JWT-based stateless authentication  
- Docker-based deployment  
- Separate FastAPI ML microservice for scalable model inference  


## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Backend** | Node.js, Express.js, TypeScript, MongoDB, Redis | REST API, business logic, caching |
| **Frontend** | React, TypeScript, Tailwind CSS, Axios | Client UI and interaction layer |
| **DevOps** | Docker, Nginx, GitHub Actions | Deployment, CI/CD pipeline |


### Prerequisites
- Node.js ≥ 18  
- npm ≥ 9  
- Docker & Docker Compose  
- MongoDB Atlas account  

