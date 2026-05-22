# Spring Boot 3 Backend - Quick Start Guide

This guide will help you get the Hospital Management System backend running locally.

## Prerequisites

Before starting, ensure you have:
- **Java 17+** installed
- **Gradle Wrapper** is included with the project
- **MongoDB 5.0+** running locally
- **Git** installed

## Step 1: Verify Prerequisites

### Check Java Version
```bash
java -version
```

Should show Java 17 or higher.

### Check Gradle Wrapper Version
```bash
./gradlew --version
```

Should download the wrapper distribution and show Gradle 8.5 or later.

### Check MongoDB Status

**Windows:**
```bash
# In PowerShell (as Administrator)
Get-Service MongoDB
```

**macOS/Linux:**
```bash
brew services list | grep mongodb
```

If MongoDB is not running, start it:

**Windows:**
```bash
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

## Step 2: Set Environment Variables

### Option A: Using System Environment Variables

**Windows (PowerShell as Admin):**
```powershell
[System.Environment]::SetEnvironmentVariable("MONGO_URI", "mongodb://localhost:27017/hospital_db", "User")
[System.Environment]::SetEnvironmentVariable("JWT_SECRET", "your-super-secret-key-change-this", "User")
```

**macOS/Linux:**
```bash
export MONGO_URI="mongodb://localhost:27017/hospital_db"
export JWT_SECRET="your-super-secret-key-change-this"
```

### Option B: Using .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```
   MONGO_URI=mongodb://localhost:27017/hospital_db
   JWT_SECRET=your-super-secret-key-change-this
   ```

3. Create a class to load `.env`:
   ```java
   // Load from .env using io.github.cdimascio:dotenv-java library
   ```

### Step 3: Install Dependencies

Navigate to the backend directory and let the wrapper download dependencies:

```bash
cd hospital-management-system/backend
./gradlew clean build
```

This will download and resolve all required libraries.

## Step 4: Run the Application

### Using Gradle Wrapper
```bash
./gradlew bootRun
```

### Using JAR (after building)
```bash
./gradlew clean bootJar
java -jar build/libs/hospital-management-system-1.0.0.jar
```

### Using IDE
1. Open the project in IntelliJ IDEA or Eclipse
2. Right-click on `HospitalManagementSystemApplication`
3. Click "Run"

## Step 5: Verify Backend is Running

Check the health endpoint:

```bash
curl http://localhost:3001/api/auth/health
```

Expected response:
```json
{
  "success": true,
  "data": "Backend is running",
  "statusCode": 200,
  "timestamp": 1234567890
}
```

## Testing Authentication

### Register a New User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@hospital.com",
    "password": "password123",
    "role": "DOCTOR"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@hospital.com",
      "role": "DOCTOR"
    }
  },
  "statusCode": 201
}
```

### Login with Registered User

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@hospital.com",
    "password": "password123"
  }'
```

### Use Token in Protected Requests

```bash
curl -X GET http://localhost:3001/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Common Issues & Solutions

### Issue: "Connection refused" to MongoDB

**Cause:** MongoDB is not running

**Solution:**
```bash
# Start MongoDB
mongod
```

### Issue: "Port 3001 already in use"

**Cause:** Another service is using port 3001

**Solution:**
```bash
# Find and kill process using port 3001
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Issue: JWT_SECRET environment variable not found

**Cause:** Environment variable not set correctly

**Solution:**
1. Verify environment variable is set:
   ```bash
   echo $JWT_SECRET  # macOS/Linux
   echo %JWT_SECRET%  # Windows CMD
   ```

2. If not set, restart your IDE/terminal after setting the variable

3. Or add to `application.yml` directly (not recommended for production)

### Issue: MongoDB authentication error

**Cause:** Wrong MongoDB URI or credentials

**Solution:**
1. Check MongoDB is running without authentication:
   ```bash
   mongod
   ```

2. Verify URI format: `mongodb://localhost:27017/hospital_db`

## Database Initialization

### Create Database and Collections

The application uses MongoDB and will create collections automatically. However, you can create them manually:

```bash
mongosh
```

```javascript
use hospital_db
db.users.createIndex({ email: 1 }, { unique: true })
```

### Create Demo Users (Optional)

Use MongoDB Compass or mongosh to insert demo users:

```bash
db.users.insertOne({
  name: "Admin User",
  email: "admin@hospital.com",
  passwordHash: "$2a$10$...",  // BCrypt hash of "password"
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date(),
  active: true
})
```

## Connecting Frontend to Backend

In your Next.js frontend, set the API URL:

**`.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## IDE Setup

### IntelliJ IDEA

1. File → Open → Select `backend` folder
2. Wait for Maven to sync
3. Run → Run 'HospitalManagementSystemApplication'

### VS Code

1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack

2. Open folder → Select `backend`

3. Press F5 to run

### Eclipse

1. File → Import → Maven → Existing Maven Projects
2. Select `backend` folder
3. Right-click → Run As → Spring Boot App

## Useful Maven Commands

```bash
# Clean build
mvn clean

# Install dependencies
mvn install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package

# Skip tests during build
mvn clean package -DskipTests

# Check for dependency updates
mvn versions:display-dependency-updates
```

## Accessing MongoDB

### Using MongoDB Compass (GUI)

1. Download MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. View databases and collections

### Using mongosh (CLI)

```bash
mongosh
```

### View Collections

```javascript
use hospital_db
show collections
db.users.find().pretty()
```

## Logs & Debugging

### Check Application Logs

Logs are printed to console. Configure log level in `application.yml`:

```yaml
logging:
  level:
    com.hospital: DEBUG
    org.springframework.security: DEBUG
```

### Enable Debug Mode

Start with debug flag:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

## Next Steps

1. ✅ Backend is running
2. ⏭️ Connect the Next.js frontend
3. ⏭️ Test full authentication flow
4. ⏭️ Implement additional features

## Support

For more details, see `README.md` in the backend directory.
