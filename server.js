const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const cors = require("cors")

const session = require("express-session")
const { createClient } = require("redis")
const RedisStore = require("connect-redis").default

// Initialize Redis client
let redisClient = createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT,
    }
})

// Handle Redis connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis successfully')
})

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err)
})

redisClient.connect().catch(console.error)

const app = express()
app.use(cors({}))

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    return mongoose.connect(MONGO_URI)
        .then(() => console.log("Connected to MongoDB successfully"))
        .catch((err) => {
            console.error("Failed to connect to MongoDB", err)
            setTimeout(connectWithRetry, 3000)
        })
}
connectWithRetry()

app.enable("trust proxy") // if we need access the real IP of the client (for some sort of rate limiting or logging)

// Session configuration - MUST be before routes
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    name: 'sessionId', // Optional: custom session name
    resave: false,
    saveUninitialized: true, // Changed to true to send cookies immediately
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60, // 1 min
        sameSite: 'lax' // Added for better cookie handling
    }
}))

// Middleware to parse JSON (should be after session)
app.use(express.json())

// Routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/post", postRoutes)
app.use("/api/v1", (req, res) => {
    res.send("<h1>Welcome to the API!!!</h1>")
    console.log("Welcome to the API!!!") // to check proper load balancing
})

// Handle 404 errors
app.use((req, res) => {
    console.log("Route not found:", req.originalUrl)
    res.status(404).json({
        status: "fail",
        message: "Route Not Found"
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => { 
    console.log(`Server is running on port ${port}...`)
    console.log(`Test the session at: http://localhost:${port}/test-session`)
})