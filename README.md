# Todo App – Dockerized 2-Tier Web Apps with GitHub CI/CD

This repository contains a full-stack Todo application, featuring a React frontend and a Node.js/Express backend, both containerized with Docker and orchestrated using Docker Compose. The project also includes a robust CI/CD pipeline powered by GitHub Actions for automated testing, building, and deployment.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Docker Compose Setup](#docker-compose-setup)
- [Backend Service](#backend-service)
- [Frontend Service](#frontend-service)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## High Level Architectural Diagram 

![Blank diagram (1)](https://github.com/user-attachments/assets/0e338e3d-708a-472a-b986-76f64e1c2f3f)

## Project Structure


    ├── LICENSE
    ├── README.md
    ├── backend
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── server.js
    │   └── src
    │       ├── app.js
    │       ├── config
    │       │   └── database.js
    │       ├── controllers
    │       │   ├── authController.js
    │       │   └── todoController.js
    │       ├── middleware
    │       │   └── auth.js
    │       ├── models
    │       │   ├── Todo.js
    │       │   └── User.js
    │       └── routes
    │           ├── auth.js
    │           └── todos.js
    ├── docker-compose.yml
    ├── frontend
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   │   └── index.html
    │   └── src
    │       ├── App.css
    │       ├── App.js
    │       ├── components
    │       │   ├── Auth
    │       │   │   ├── Login.js
    │       │   │   └── Register.js
    │       │   ├── Layout
    │       │   │   └── Header.js
    │       │   └── Todo
    │       │       ├── TodoItem.js
    │       │       └── TodoList.js
    │       ├── context
    │       │   └── AuthContext.js
    │       ├── index.css
    │       ├── index.js
    │       └── services
    │           └── api.js
    └── package-lock.json

---

## Docker Compose Setup

The `docker-compose.yml` file orchestrates both the backend and frontend services, ensuring they run in isolated containers and communicate via a custom bridge network.

[docker-compose.yml example](docker-compose.yml)

---

## Backend Service

- **Tech Stack:** Node.js, Express, PostgreSQL
- **Port:** 5000
- **Environment:** Configured via `backend/.env`
- **Features:** User authentication (JWT), CRUD for todos, security best practices

[Backend Dockerfile eaxample](./backend/Dockerfile)

### Sample backend/.env

      DB_HOST=your-db-host
      DB_PORT=5432
      DB_NAME=your-db-name
      DB_USER=your-db-user
      DB_PASSWORD=your-db-password
      DB_SSL=true
      JWT_SECRET=your-super-secret-jwt-key
      NODE_ENV=development
      PORT=5000
      FRONTEND_URL=http://localhost:3000

---

## Frontend Service

- **Tech Stack:** React
- **Port:** 3000
- **Environment:** Configured via `frontend/.env`
- **Proxy:** Forwards API requests to backend at `http://localhost:5000`

### Frontend Dockerfile

[Frontend Dockerfile eaxample](./frontend/Dockerfile)


### Sample frontend/.env

`REACT_APP_API_URL=http://localhost:5000`

---

## Running the Application

### 1. Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) installed
- A running PostgreSQL instance (cloud or local)

### 2. Setup Environment Files

- Copy and edit `.env` files for both backend and frontend as shown above.

### 3. Build and Start Containers

From the project root:

`docker-compose up --build`


- The backend will be available at `http://localhost:5000`
- The frontend will be available at `http://localhost:3000`

### 4. Stopping the Application

`docker-compose down`

---

## API Endpoints

### Authentication

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and receive JWT
- `GET /api/auth/profile` – Get current user profile (requires JWT)

### Todos

- `GET /api/todos` – List all todos (auth required)
- `POST /api/todos` – Create a new todo (auth required)
- `PUT /api/todos/:id` – Update a todo (auth required)
- `DELETE /api/todos/:id` – Delete a todo (auth required)

---

## CI/CD with GitHub Actions

### Overview

This repository uses **GitHub Actions** to automate the build, test, Docker image publishing, and deployment process. The workflow is triggered on every push to the `main` branch.

### Workflow Steps

1. **Build Backend**
   - Installs dependencies
   - Builds and pushes the backend Docker image to Docker Hub

2. **Build Frontend**
   - Installs dependencies
   - Builds and pushes the frontend Docker image to Docker Hub

3. **Deploy**
   - Connects to your EC2 server via SSH
   - Copies the latest `docker-compose.yml`
   - Deploys the updated containers

[Example Workflow File](./.github/workflows/docker-image.yml)

### Required GitHub Secrets

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token
- `BACKEND_CONTAINER_NAME`: Docker image name for backend
- `FRONTEND_CONTAINER_NAME`: Docker image name for frontend
- `PRIVATE_KEY`: SSH private key for your server
- `SSH_USER`: SSH username for your server
- `SSH_HOST`: Host/IP of your server
- `SSH_PORT`: SSH port (default: 22)

---

## Troubleshooting

- **Database connection errors:** Ensure your PostgreSQL instance is accessible and credentials are correct.
- **Port conflicts:** Ensure ports 3000 and 5000 are free on your host.
- **Environment variables:** Double-check `.env` files for typos or missing values.
- **CI/CD failures:** Review GitHub Actions logs for details; ensure all required secrets are set.

---

## References

[https://aws.amazon.com/rds/postgresql/](https://aws.amazon.com/rds/postgresql/)

[https://aws.amazon.com/vpc/](https://aws.amazon.com/vpc/)

[https://aws.amazon.com/ec2/features/](https://aws.amazon.com/ec2/features/)
