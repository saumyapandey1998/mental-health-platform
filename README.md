# mental-health-system
Mental Health Management System

Building a mental health system

Project Overview

The Mental Health Management System is a comprehensive platform designed to streamline mental health support by providing secure, digitalized tools for patients and therapists. This system aims to bridge the gap between individuals seeking mental health care and professionals offering support, ensuring confidentiality, ease of access, and user-centric features.

The platform empowers users by offering secure authentication, therapist matching, appointment scheduling, real-time communication, and mood tracking. Therapists can seamlessly manage patient records, view progress reports, and provide feedback, fostering an environment of collaborative mental health care.

Let’s work together to create a better, more accessible mental health support platform!

### 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)  
- [npm](https://www.npmjs.com/) (comes with Node)  
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB  
- (Optional) VS Code or your preferred code editor

---

### Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install backend dependencies
npm install

```
### Frontend Setup

```bash
# Open a new terminal and navigate to the frontend
cd ../frontend

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
The frontend will run at: http://localhost:5173
```

### Testing
```bash
# Run unit and integration tests
npm run test

# View test coverage
npm run test:coverage
```

### Load Testing
```bash
artillery run load-tests/load-test.yml

