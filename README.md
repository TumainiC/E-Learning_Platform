# Mini E-Learning Platform

A modern e-learning platform built with FastAPI and MongoDB.

## Features

- User authentication and authorization
- Course management
- Enrollment system
- Lesson tracking
- RESTful API

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Package Manager**: UV

## Setup Instructions

### Prerequisites

- Python 3.12+
- UV package manager
- MongoDB Atlas account

### Step 1: Clone and Navigate

```bash
cd mini_elearining_platform
```

### Step 2: Install Dependencies

Using UV (recommended):
```bash
uv sync
```

Or using pip:
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
   - **MongoDB URI**: Get from MongoDB Atlas cluster
   - **JWT Secret**: Generate a strong random string
   - **Other settings**: Adjust as needed

### Step 4: Set Up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address
4. Get the connection string
5. Update `MONGODB_URI` in `.env`

### Step 5: Run the Application

Using UV:
```bash
uv run python main.py
```

Or directly:
```bash
python main.py
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
mini_elearining_platform/
├── backend/
│   ├── __init__.py
│   ├── config.py       # Configuration management
│   └── database.py     # MongoDB connection utility
├── main.py             # Application entry point
├── requirements.txt    # Python dependencies
├── pyproject.toml      # UV project configuration
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
└── README.md           # This file
```

## Development

### Activate Virtual Environment

UV automatically manages the virtual environment. To activate manually:

```bash
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```

### Testing the Connection

Visit `http://localhost:8000/health` to check if the database connection is working.

## Next Steps

- Add authentication endpoints
- Create course models and routes
- Implement enrollment system
- Add lesson management
- Create frontend interface

## License

MIT