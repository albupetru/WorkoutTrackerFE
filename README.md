# Workout Tracker

A full-stack workout tracking application built with React TypeScript frontend and .NET Core backend API.

## Project Structure

- **Frontend**: React + TypeScript + Vite
- **Backend**: .NET Core Web API
- **Database**: SQLite
- **Authentication**: JWT with Google OAuth integration

## Features

- User authentication (Google OAuth)
- Exercise library management
- Workout program creation and tracking
- Protected routes and session management
- Responsive UI with SCSS styling

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [.NET 6 SDK or higher](https://dotnet.microsoft.com/download)
- A modern web browser

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workout-tracker
```

### 2. Backend Setup (.NET API)

Navigate to the backend directory:

```bash
cd "Workout Tracker BE/workoutTrackerAPI"
```

Restore NuGet packages:

```bash
dotnet restore
```

Build the project:

```bash
dotnet build
```

Create/Update the database using Entity Framework migrations:

```bash
dotnet ef database update
```

**Note**: If you don't have the Entity Framework CLI tools installed, install them first:

```bash
dotnet tool install --global dotnet-ef
```

Run the API:

```bash
dotnet run
```

The API will start on `https://localhost:7164`

### 3. Frontend Setup (React App)

Open a new terminal and navigate to the frontend directory:

```bash
cd "workoutTrackerClientApp_TS/workoutTrackerClientApp"
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port)

## Available Scripts

### Frontend Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality

### Backend Scripts

- `dotnet run` - Start the API server
- `dotnet build` - Build the project
- `dotnet ef database update` - Create/update the database using migrations
- `dotnet ef migrations add <name>` - Create a new migration
- `dotnet test` - Run tests (if available)

## Configuration

### Backend Configuration

The backend uses configuration files located in `workoutTrackerAPI/`:

- `appsettings.json` - Production configuration
- `appsettings.Development.json` - Development configuration

Key configuration sections:

- **SQLDatabaseSettings**: Database connection string
- **ApplicationSecrets**: JWT security key
- **GoogleSecrets**: Google OAuth credentials
- **AllowedOrigins**: CORS settings for frontend

### Frontend Configuration

The frontend connects to the backend API at `https://localhost:7164`. If you change the backend port, update the API URL in the frontend code accordingly.

## Development Workflow

1. Start the backend API first (`dotnet run`)
2. Start the frontend development server (`npm run dev`)
3. Access the application at `http://localhost:5173`
4. The frontend will proxy API requests to the backend

## Authentication

The application uses Google OAuth for authentication. Make sure you have valid Google OAuth credentials configured in the backend `appsettings.Development.json` file.

## Database

The application uses SQLite as the database with Entity Framework Core for data access. The database file (`WorkoutTrackerDatabase.db`) will be created in the API project directory when you run the `dotnet ef database update` command.

### Database Migrations

To create or update the database schema:

```bash
cd "Workout Tracker BE/workoutTrackerAPI"
dotnet ef database update
```

To create a new migration (when you modify entity models):

```bash
dotnet ef migrations add <MigrationName>
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running and the frontend URL is included in the `AllowedOrigins` configuration
2. **Database Issues**: 
   - If you encounter database errors, try running `dotnet ef database update` again
   - To completely reset the database, delete the SQLite database file and run `dotnet ef database update`
3. **Port Conflicts**: Check if the default ports (7164 for backend, 5173 for frontend) are available
4. **Entity Framework Issues**: Make sure you have the EF CLI tools installed (`dotnet tool install --global dotnet-ef`)

### Port Configuration

- Backend API: `https://localhost:7164`
- Frontend Dev Server: `http://localhost:5173`

If you need to use different ports, update the configuration accordingly in both frontend and backend.
