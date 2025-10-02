# Frontend Setup and Development Scripts

## Install Dependencies
```bash
cd frontend
npm install
```

## Development
```bash
npm start
```
Server will run on http://localhost:3000

## Build for Production
```bash
npm run build
```

## Environment Variables
Create `.env` in frontend directory:
```
REACT_APP_API_URL=http://localhost:8000
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Project Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.js
│   │   └── ProtectedRoute.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── SignUpPage.js
│   │   └── CoursesPage.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```