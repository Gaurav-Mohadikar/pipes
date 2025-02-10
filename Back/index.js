const express = require ('express')
const connectDB = require ('./db')
const cors = require ('cors')
const userRoutes = require ('./routes/userRoutes')
require('dotenv').config();


const app = express()
const port = 3000

connectDB()
app.use(express.json());
app.use(cors());



app.use('/api/user',userRoutes)

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
    
})