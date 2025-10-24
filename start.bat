@echo off
echo 🚀 Starting Smart Travel Companion Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install backend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    npm install
)

REM Install frontend dependencies if client/node_modules doesn't exist
if not exist "client\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd client
    npm install
    cd ..
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating environment configuration...
    (
        echo MONGODB_URI=mongodb://localhost:27017/smart-travel-companion
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NODE_ENV=development
        echo PORT=5000
        echo WEATHER_API_KEY=your-weather-api-key
        echo MAPS_API_KEY=your-maps-api-key
    ) > .env
    echo ✅ Created .env file. Please update the configuration as needed.
)

REM Create client .env file if it doesn't exist
if not exist "client\.env" (
    echo ⚙️ Creating client environment configuration...
    echo REACT_APP_API_URL=http://localhost:5000 > client\.env
    echo ✅ Created client/.env file.
)

echo.
echo 🎯 Starting the application...
echo    Backend will run on: http://localhost:5000
echo    Frontend will run on: http://localhost:3000
echo.
echo 📝 Make sure MongoDB is running before starting the application!
echo.

REM Start the application
npm run dev

pause
