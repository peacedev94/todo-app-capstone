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
      FRONTEND_URL=http://localhost

---

## Frontend Service

- **Tech Stack:** React
- **Port:** 80
- **Environment:** Configured via `frontend/.env`
- **Proxy:** Forwards API requests to backend at `http://localhost:5000`

### Frontend Dockerfile

[Frontend Dockerfile eaxample](./frontend/Dockerfile)


### Sample frontend/.env

`REACT_APP_API_URL=http://localhost:5000`

---

## Network Configuration

### Creating VPC

Open the Amazon VPC console at https://console.aws.amazon.com/vpc/

On the VPC Dashboard, choose Launch VPC Wizard.

![vpc-1](https://github.com/user-attachments/assets/90bba467-4449-4645-8755-c07ea223fabd)

On the VPC configuration Dashboard choosing VPC and more automatically launches Private Subnets, Public Subnets, Routing Tables and Subnet Associations, Internet GateWay, Elastic IP, IP CIDR block, Availability Zones and Network Access Translator.

On the Auto-generate input field, write the name of your VPC

![vpc-2](https://github.com/user-attachments/assets/705d94eb-a901-4359-9101-af7c282906fb)

Choose the number of Avalaibility Zones (AZ's) in which to create your IGW GateWay.


## Server Configurtaion


### Create a public EC2 Instance

Navigate to the ec2 console and click on Launch Instance

![ec2-1](https://github.com/user-attachments/assets/072c1501-2f05-456b-9e73-5193c312fd6d)

Write the name of your instances, select the number of instances and use Ubuntu as choice of Linux Distro.

![ec2-2](https://github.com/user-attachments/assets/03dd5856-e11c-4e9b-a93a-45db12db6b38)

Select your key-pair if you dont have a key-pair create one

Next, select the VPC that you previously created, and choose any of the public subnet, Enable the Auto-Assigned Public IP, and finally Create a Security Group keeping the default settings then click on Launch Instance.

![ec2-4](https://github.com/user-attachments/assets/8f628434-a360-4f71-9be7-b5f1d93aeadd)


### Database Configuration


### 1. Create a publicly accessible PostgreSQL database in RDS

We need to create a publicly accessible RDS instance with minimal cost to hold our application data

#### 2. Security Group for PostgreSQL traffic

- On AWS Management Console navigate to `EC2` > `Security Groups` > `Create security group`

- Add an inbound rule for `PostgreSQL` from `Anywhere` (basically Protocol: `TCP`, Port: `5432`, Source: `0.0.0.0/0`)

- Leave everything else as it's and click create

#### 3. Create an RDS Instance

**Please follow this section very carefully to avoid DB problems in the upcoming stages**

- On AWS Management Console navigate to `RDS` > `Databases` > `Create database`

- In the first card choose `Standard Create`, and in **Engine** options choose `PostgreSQL` with the **default** version

  ![db-2](https://github.com/user-attachments/assets/45b039aa-a768-4122-aeed-3ecbcd61c579)

- In **Templates** choose `Free tier`, and you'll see that you're restricted to `Single DB instance` in the next card

  ![db-3](https://github.com/user-attachments/assets/b7687dc3-1249-454d-8ce4-d5f519f51fb1)

- In Settings choose a name for your instance identifier (`todo-app`)

- Under **credentials** choose a username and a password (username: `postgres`, password: Check `Auto generate a password`)

- In **Instance configuration** you can select any available option (`db.t4g.micro`)

![db-4](https://github.com/user-attachments/assets/c640e1c4-3c1f-4db9-8fad-6ea49d429336)

- In Storage make sure to **uncheck** `Enable storage autoscaling`

![db-5](https://github.com/user-attachments/assets/7672ce3d-83e4-4af7-b30f-4f047ff14f1c)

- **Important**: In **Connectivity** make sure you choose the correct values

  - **VPC**: `Default VPC`
  - **Subnet group**: `default`
  - **Public access**: `Yes`
  - **VPC Security Group**: `Choose existing or create new one`
    - **Remove** `default`
    - **Add** the security group created in the previous step (`Public-PostgreSQL-RDS`)
  - **Availability Zone**: `No preference`
  - **Additional configuration**:
    - Database port: `5432`

![db-6](https://github.com/user-attachments/assets/c6d42f34-53a3-4cc1-931c-f1cc2e4f09f3)
![db-7](https://github.com/user-attachments/assets/4e0ce795-9dbb-4f02-aaa4-144ff9ec1d3f)
![db-8](https://github.com/user-attachments/assets/354dd97e-77cd-425f-9757-84959aff8cf0)

- In **Database authentication** choose `Password authentication`

- **Important**: Open the Additional configuration card

  - In Database options set **Initial database name** to a value (`todo_db`)

   ![db-9](https://github.com/user-attachments/assets/97961d0a-d400-4f3d-b09e-5d9afd4f3244)

  - Optional: You can disable **Encryption**, **Backup**, **Monitoring**, and other checked features

- Finally, create a database

If you checked Auto generate password you'll have a prompt with a blue ribbon in the next page

Click on `View credentials settings` and save the username and password in a safe location

![db-10](https://github.com/user-attachments/assets/1eee4261-709b-42c2-a1d2-86dc50c79392)


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
