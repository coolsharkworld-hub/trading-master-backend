# Trading Master Backend

A comprehensive trading analysis backend API built with TypeScript, Express, and multiple database integrations (PostgreSQL, MongoDB, Redis). This system provides advanced technical analysis tools for stock market trading strategies including Opening Range Breakout (ORB), Inside Bar (IB), and Gap Analysis.

## 🚀 Features

- **Opening Range Breakout (ORB) Analysis**: Analyze opening range breakout patterns with configurable time windows
- **Inside Bar (IB) Analysis**: Identify and analyze inside bar patterns for trading opportunities
- **Gap Analysis**: Detect and analyze price gaps in stock data
- **Real-time Market Data**: Integration with Polygon.io API for live and historical market data
- **User Authentication**: JWT-based authentication system with role-based access control
- **Ticker Management**: Comprehensive ticker database with CRUD operations
- **Redis Caching**: Fast data retrieval with Redis caching layer
- **Multi-Database Support**: PostgreSQL for relational data, MongoDB for flexible document storage

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- MongoDB (v4 or higher)
- Redis (v6 or higher)
- Polygon.io API Key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SilverDigitalBus-LLC/trading-master-backend.git
   cd trading-master-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3003
   
   # PostgreSQL Configuration
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=trading_master
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://127.0.0.1:27017/trading_master
   
   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   REDIS_PASSWORD=
   REDIS_TTL=3600
   
   # Polygon.io API
   POLYGON_API_KEY=your_polygon_api_key
   
   # JWT Configuration
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Frontend
   FRONTEND_BUCKET=frontend/build
   ```

4. **Database Setup**
   
   Run PostgreSQL migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
   
   Seed the database with demo tickers:
   ```bash
   npx sequelize-cli db:seed:all
   ```

5. **Sync Tickers**
   ```bash
   npm run sync-tickers
   ```

6. **Create Admin User**
   ```bash
   npm run create-admin
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run sync-tickers` - Synchronize ticker data
- `npm run create-admin` - Create an admin user

## 📚 API Documentation

### Interactive Swagger Documentation

This project includes comprehensive interactive API documentation using Swagger/OpenAPI 3.0.

**Access Swagger UI**: `http://localhost:3003/api-docs`

The Swagger UI provides:
- 📖 Complete API endpoint documentation
- 🧪 Interactive testing of all endpoints
- 📝 Request/response schemas with examples
- 🔐 Built-in authentication support

For detailed information, see [SWAGGER.md](./SWAGGER.md).

### Quick Start with Swagger

1. Start the server: `npm run dev`
2. Open your browser to: `http://localhost:3003/api-docs`
3. Register/Login to get a JWT token
4. Click "Authorize" and enter: `Bearer YOUR_TOKEN`
5. Test any endpoint directly from the UI

---

Base URL: `http://localhost:3003/api`

### Health Check

```http
GET /api/health
```

Returns the health status of all services.

### Authentication

#### Register User
```http
POST /api/user/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Opening Range Breakout (ORB)

#### Analyze ORB
```http
GET /api/orb/analyze?symbol=SPY&from=2025-10-01&to=2025-10-29&orMinutes=15
Authorization: Bearer <token>
```

**Query Parameters:**
- `symbol` - Stock ticker symbol (e.g., SPY, AAPL, QQQ)
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)
- `orMinutes` - Opening range minutes (default: 15)

### Inside Bar (IB)

#### Analyze IB
```http
GET /api/ib/analyze?symbol=AAPL&from=2025-10-01&to=2025-10-29
Authorization: Bearer <token>
```

**Query Parameters:**
- `symbol` - Stock ticker symbol
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)

### Gap Analysis

#### Analyze Gaps
```http
GET /api/gap/analyze?symbol=AMZN&from=2025-10-01&to=2025-10-29
Authorization: Bearer <token>
```

**Query Parameters:**
- `symbol` - Stock ticker symbol
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)

### Tickers

#### Get All Tickers
```http
GET /api/ticker/list
Authorization: Bearer <token>
```

#### Get Ticker by Symbol
```http
GET /api/ticker/:symbol
Authorization: Bearer <token>
```

#### Create Ticker
```http
POST /api/ticker
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "TSLA",
  "name": "Tesla Inc",
  "market": "stocks",
  "active": true
}
```

#### Update Ticker
```http
PUT /api/ticker/:symbol
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tesla, Inc.",
  "active": true
}
```

#### Delete Ticker
```http
DELETE /api/ticker/:symbol
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
trading-master-backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── gap.ts
│   │   ├── ib.ts
│   │   ├── orb.ts
│   │   ├── ticker.ts
│   │   └── user.ts
│   ├── database/         # Database configuration and migrations
│   │   ├── config.js
│   │   ├── migrations/
│   │   └── seeders/
│   ├── middleware/       # Express middleware
│   │   └── auth.ts
│   ├── models/          # Database models
│   │   ├── ticker.ts
│   │   └── user.ts
│   ├── routes/          # API routes
│   │   ├── gap.ts
│   │   ├── ib.ts
│   │   ├── orb.ts
│   │   ├── ticker.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── scripts/         # Utility scripts
│   │   ├── create-admin.ts
│   │   └── sync-tickers.ts
│   ├── services/        # Business logic
│   │   ├── gap.ts
│   │   ├── ib.ts
│   │   ├── orb.ts
│   │   ├── polygon.ts
│   │   ├── redis.ts
│   │   ├── ticker.ts
│   │   └── user.ts
│   ├── system/          # System configuration
│   │   ├── config.ts
│   │   ├── express.ts
│   │   ├── mongo.ts
│   │   ├── postgres.ts
│   │   └── redis.ts
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── data/                # Sample data files
├── output/              # Analysis output files
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 24 hours by default. Refresh tokens are valid for 7 days.

## 📊 Analysis Algorithms

### Opening Range Breakout (ORB)
Analyzes the first N minutes of trading to identify potential breakout opportunities. The algorithm:
1. Calculates the high and low of the opening range
2. Identifies when price breaks above/below the range
3. Tracks breakout performance and statistics

### Inside Bar (IB)
Identifies inside bar patterns where the current bar's range is completely within the previous bar's range. Useful for:
- Consolidation patterns
- Breakout setups
- Risk management

### Gap Analysis
Detects and analyzes price gaps between trading sessions:
- Gap up patterns
- Gap down patterns
- Gap fill analysis
- Statistical gap behavior

## 🗄️ Database Schema

### PostgreSQL Tables
- `tickers` - Stock ticker information
- `users` - User authentication and profile data

### MongoDB Collections
- Flexible document storage for analysis results
- Historical data caching

### Redis Cache
- Market data caching
- Session management
- Rate limiting

## 🧪 Testing

Import the Postman collection from `src/postman/postman_auth_collection.json` for API testing.

## 📝 Development Guidelines

1. **Code Style**: Follow TypeScript best practices and use ESLint/Prettier
2. **Commits**: Use conventional commit messages
3. **Branches**: Create feature branches from `main`
4. **Testing**: Test all endpoints before committing

## 🔄 Data Flow

1. Client sends request to API endpoint
2. Authentication middleware validates JWT token
3. Controller validates request parameters
4. Service layer checks Redis cache
5. If cache miss, fetch from Polygon.io API
6. Process data through analysis algorithms
7. Cache results in Redis
8. Store results in database
9. Return response to client

## 🌐 Timezone

All timestamps are handled in America/New_York timezone for consistent market hours analysis.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by SilverDigitalBus LLC.

## 👥 Authors

- **SilverDigitalBus LLC** - [GitHub](https://github.com/SilverDigitalBus-LLC)

## 📞 Support

For support, email support@silverdigitalbus.com or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Polygon.io](https://polygon.io/) for market data API
- Express.js community
- TypeScript community

---

**Note**: This is a financial analysis tool for educational and research purposes. Always conduct your own research before making trading decisions.
