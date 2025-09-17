# My Store
A full-stack Angular application with a backend and database.

---

## Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v22+ recommended)
- [npm](https://www.npmjs.com/)
- [Bun](https://bun.sh/) (for running internal scripts)
- [Docker](https://www.docker.com/) (for the database container)

---

## Getting Started

### 1. Clone the repository
If you're not using a local copy, you can clone the repository from GitHub:
```bash
git clone https://github.com/ahmadnasriya/mystore.git
cd mystore
```

### 2. Install Bun
```bash
npm install -g bun
```
This is used to run internal scripts.

### 3. Initialize the project & install dependencies
```bash
npm run init
```

### 4. Configure the project
Edit the configs.ts file with your desired configurations (database, ports, credentials, etc.).

### 5. Generate environment variables
```bash
npm run build:env
```
This will generate the `.env` files based on your configurations.

### 6. Build the database container (Optional)
```bash
npm run build:container
```
This will pull the required Docker image and create a container using the configurations from [step 3](#3-configure-the-project).



---

## Running the Application
Start the server with:
```bash
npm start
```