const express = require('express')
const app = express()
require('dotenv').config()
const cors = require("cors")
const PORT = 3001
const http=require("http")


const dbConnect = require('./Config/dbConfigration')
dbConnect.dbConnect()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is allowed, or set it to '*' to allow all origins
    const allowedOrigins = ['http://localhost:5173', 'https://sevensky-c0lek8c8t-irfaans-projects.vercel.app'];
                                                      
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
}));


const adminRoutes = require('./Routes/adminRoute')
app.use('/admin', adminRoutes)

const userRoute = require('./Routes/userRoute')
app.use('/', userRoute)
const partnerRoutes = require('./Routes/partnerRoute')
app.use('/partner', partnerRoutes)

const chatRouter = require('./Routes/chatRoute')
app.use('/chat', chatRouter)

const messageRoute = require('./Routes/messageRoute')
const socketConnection = require('./socket')


app.use('/message', messageRoute)
 

const server = http.createServer(app)
socketConnection(server)
server.listen(PORT,()=>{ 
  console.log(`server running on port http://localhost:${PORT}`);
});