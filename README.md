# RPE Training App

A full-stack application for tracking your lifts and calculating one-rep maxes using RPE (Rate of Perceived Exertion). Built with Node.js, Express, SQLite, and React.

## Features

- 🔐 User authentication (register/login)
- 💪 Record and track your lifts
- 🧮 Calculate one-rep maxes using RPE
- 📊 View your lifting history and progress
- 📱 Responsive design for all devices

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- JWT Authentication

### Frontend
- React
- TypeScript
- Material-UI
- Vite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/asingh756/rpe-training-app.git
cd rpe-training-app
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration:
```
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

## Running the Application

1. Start the backend server:
```bash
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Lifts
- `POST /api/lifts` - Record a new lift
- `GET /api/lifts` - Get user's lift history

### One Rep Max
- `POST /api/one-rep-max` - Calculate one rep max
- `GET /api/one-rep-max/history` - Get one rep max history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- RPE multipliers based on research and standard training practices
- Brzycki formula for one-rep max calculations 