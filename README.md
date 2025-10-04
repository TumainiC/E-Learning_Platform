# Mini E-Learning Platform# Mini E-Learning Platform


A fully functional e-learning platform built with modern web technologies, featuring course management, user authentication, progress tracking, and a responsive interface. This platform provides a complete solution for online education with secure user management and intuitive course navigation.A modern e-learning platform built with FastAPI and MongoDB.



## 📋 Table of Contents## Features



- [Features](#features)- User authentication and authorization

- [Technology Stack](#technology-stack)- Course management

- [Project Structure](#project-structure)- Enrollment system

- [Installation](#installation)- Lesson tracking

- [Usage](#usage)- RESTful API

- [API Documentation](#api-documentation)

- [Security Features](#security-features)## Tech Stack

- [License](#license)

- [Contributing](#contributing)- **Backend**: FastAPI (Python)

- **Database**: MongoDB Atlas

## ✨ Features- **Authentication**: JWT tokens

- **Package Manager**: UV

### Core Functionality

- **User Authentication**: Secure JWT-based authentication with 24-hour token expiration## Setup Instructions

- **Course Management**: Create, view, and manage educational courses

- **Module System**: Organize course content into structured modules### Prerequisites

- **Progress Tracking**: Monitor student completion and progress through courses

- **Responsive Design**: Mobile-first design with Tailwind CSS- Python 3.12+

- **Real-time Notifications**: Toast notifications for user feedback- UV package manager

- MongoDB Atlas account

### Security Features

- bcrypt password hashing with 12 salt rounds### Step 1: Clone and Navigate

- JWT token-based authentication

- Protected routes and middleware```bash

- Input validation and sanitizationcd mini_elearining_platform

- Secure session management```



### User Experience### Step 2: Install Dependencies

- Intuitive navigation and clean interface

- Loading states and error handlingUsing UV (recommended):

- Form validation with user feedback```bash

- Responsive design for all devicesuv sync

- Course enrollment and completion tracking```



## 🛠 Technology StackOr using pip:

```bash

### Backendpip install -r requirements.txt

- **FastAPI**: Modern, fast web framework for building APIs```

- **MongoDB**: NoSQL database for flexible data storage

- **PyMongo**: MongoDB driver for Python### Step 3: Configure Environment

- **JWT**: JSON Web Tokens for authentication

- **bcrypt**: Password hashing library1. Copy `.env.example` to `.env`:

- **Pydantic**: Data validation using Python type hints```bash

- **uvicorn**: ASGI server for running FastAPI applicationscp .env.example .env

```

### Frontend

- **React**: JavaScript library for building user interfaces2. Update `.env` with your configuration:

- **React Router**: Declarative routing for React applications   - **MongoDB URI**: Get from MongoDB Atlas cluster

- **Tailwind CSS**: Utility-first CSS framework   - **JWT Secret**: Generate a strong random string

- **React Hot Toast**: Toast notifications for React   - **Other settings**: Adjust as needed

- **Axios**: HTTP client for making API requests

### Step 4: Set Up MongoDB Atlas

### Development Tools

- **uv**: Fast Python package installer and resolver1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

- **Node.js**: JavaScript runtime for frontend development2. Create a database user

- **npm**: Package manager for JavaScript dependencies3. Whitelist your IP address

4. Get the connection string

## 📁 Project Structure5. Update `MONGODB_URI` in `.env`



```### Step 5: Run the Application

mini_elearining_platform/

├── backend/                 # FastAPI backend applicationUsing UV:

│   ├── app.py              # Main application file```bash

│   ├── config.py           # Database and app configurationuv run python main.py

│   ├── models/             # Data models```

│   │   ├── user.py         # User model with authentication

│   │   ├── course.py       # Course and module modelsOr directly:

│   │   └── completion.py   # Progress tracking models```bash

│   ├── routes/             # API route handlerspython main.py

│   │   ├── auth.py         # Authentication routes```

│   │   └── courses.py      # Course management routes

│   ├── utils/              # Utility functionsThe API will be available at: `http://localhost:8000`

│   │   ├── auth.py         # Authentication utilities

│   │   └── db.py           # Database utilities## API Documentation

│   └── middleware/         # Custom middleware

│       └── auth.py         # JWT authentication middlewareOnce running, visit:

├── frontend/               # React frontend application- Swagger UI: `http://localhost:8000/docs`

│   ├── src/- ReDoc: `http://localhost:8000/redoc`

│   │   ├── App.jsx         # Main application component

│   │   ├── components/     # Reusable components## Project Structure

│   │   │   ├── Navbar.jsx  # Navigation component

│   │   │   ├── CourseCard.jsx```

│   │   │   ├── LoadingSpinner.jsxmini_elearining_platform/

│   │   │   └── ProtectedRoute.jsx├── backend/

│   │   ├── pages/          # Page components│   ├── __init__.py

│   │   │   ├── HomePage.jsx│   ├── config.py       # Configuration management

│   │   │   ├── LoginPage.jsx│   └── database.py     # MongoDB connection utility

│   │   │   ├── SignUpPage.jsx├── main.py             # Application entry point

│   │   │   ├── CourseListPage.jsx├── requirements.txt    # Python dependencies

│   │   │   └── CourseDetailPage.jsx├── pyproject.toml      # UV project configuration

│   │   ├── context/        # React context providers├── .env                # Environment variables (not in git)

│   │   │   └── AuthContext.jsx├── .env.example        # Environment template

│   │   └── services/       # API service functions└── README.md           # This file

│   │       └── api.js```

│   ├── public/

│   │   └── index.html## Development

│   └── package.json

├── main.py                 # Application entry point### Activate Virtual Environment

├── requirements.txt        # Python dependencies

├── pyproject.toml         # Project configurationUV automatically manages the virtual environment. To activate manually:

└── README.md              # This file

``````bash

source .venv/bin/activate  # Linux/Mac

## 🚀 Installation.venv\Scripts\activate     # Windows

```

### Prerequisites

- **Python 3.8+**: Required for the backend### Testing the Connection

- **Node.js 16+**: Required for the frontend

- **MongoDB**: Database server (local or cloud)Visit `http://localhost:8000/health` to check if the database connection is working.

- **uv**: Python package manager

## Next Steps

### Install uv (if not already installed)

```bash- Add authentication endpoints

# On macOS and Linux- Create course models and routes

curl -LsSf https://astral.sh/uv/install.sh | sh- Implement enrollment system

- Add lesson management

# On Windows- Create frontend interface

powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

```## License



### 1. Clone the RepositoryMIT
```bash
git clone <repository-url>
cd mini_elearining_platform
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
# Using uv (recommended)
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt

# Alternative using pip
pip install -r requirements.txt
```

#### Configure Database
1. Install and start MongoDB locally, or set up a MongoDB Atlas cloud database
2. Update the MongoDB connection string in `backend/config.py` if needed
3. The application will automatically create necessary database indexes

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## 🎯 Usage

### Starting the Application

#### Method 1: Manual Start (Recommended for Development)

**Start the Backend:**
```bash
# From the project root directory
uv run python main.py
```
The backend will start on `http://localhost:8000`

**Start the Frontend:**
```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

#### Method 2: Using the Startup Script
```bash
# Make the script executable (Linux/macOS)
chmod +x start_app.sh
./start_app.sh

# Windows
start_app.bat
```

### Accessing the Application
1. Open your browser and go to `http://localhost:3000`
2. Create a new account or log in with existing credentials
3. Browse available courses and enroll in courses of interest
4. Track your progress through course modules

### Default Features Available
- **User Registration**: Create new accounts with email validation
- **User Login**: Secure authentication with JWT tokens
- **Course Browsing**: View available courses and their details
- **Course Enrollment**: Enroll in courses to start learning
- **Progress Tracking**: Mark modules as completed and track progress
- **Profile Management**: View user profile and enrolled courses

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and get JWT token
- `GET /auth/profile` - Get current user profile (protected)

### Course Endpoints
- `GET /courses` - Get all available courses
- `GET /courses/{course_id}` - Get specific course details
- `POST /courses/{course_id}/enroll` - Enroll in a course (protected)
- `POST /courses/{course_id}/modules/{module_id}/complete` - Mark module as completed (protected)
- `GET /courses/enrolled` - Get user's enrolled courses (protected)

### API Base URL
- Development: `http://localhost:8000`
- All protected endpoints require JWT token in Authorization header: `Bearer <token>`

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: 24-hour expiration for security
- **Password Hashing**: bcrypt with 12 salt rounds
- **Protected Routes**: Middleware-based route protection
- **Token Validation**: Automatic token verification

### Database Security
- **Input Validation**: Pydantic models for data validation
- **Sanitization**: Automatic input sanitization
- **Indexing**: Optimized database queries with proper indexing

### Frontend Security
- **Token Storage**: Secure localStorage implementation
- **Route Protection**: Protected routes for authenticated users only
- **Form Validation**: Client-side validation with server-side verification

## 🗄 Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "hashed_password": "string",
  "created_at": "datetime",
  "enrolled_courses": ["ObjectId"]
}
```

### Courses Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "instructor": "string",
  "modules": [
    {
      "id": "string",
      "title": "string",
      "content": "string"
    }
  ],
  "created_at": "datetime"
}
```

### Completions Collection
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "course_id": "ObjectId",
  "module_id": "string",
  "completed_at": "datetime"
}
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
uv run pytest

# Frontend tests
cd frontend
npm test
```

### Manual Testing Checklist
1. User registration and login functionality
2. Course browsing and enrollment
3. Module completion and progress tracking
4. Authentication token expiration
5. Protected route access
6. Responsive design on different devices

## 🚀 Deployment

### Production Environment Setup
1. Set up production MongoDB database
2. Configure environment variables for production
3. Build the frontend for production:
   ```bash
   cd frontend
   npm run build
   ```
4. Deploy backend with production ASGI server
5. Set up reverse proxy (nginx) for frontend and API

### Environment Variables
Create a `.env` file in the project root:
```env
MONGODB_URL=mongodb://localhost:27017/elearning
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License

```
MIT License

Copyright (c) 2024 Mini E-Learning Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📞 Support

For support, please create an issue on the GitHub repository or contact the development team.

## 🎉 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for accessible online education platforms
- Community-driven development and open-source principles

---

**Ready to start learning?** Follow the installation guide above and launch your e-learning platform today!