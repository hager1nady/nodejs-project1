import express from 'express'
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import path from 'path'


import connectionDB from './DB/connectionDB.js'
import userRouter from './src/modules/user/user.routes.js'
import companyRouter from './src/modules/company/company.routes.js'
import jobRouter from './src/modules/jobs/job.routes.js'
import userModel from './DB/models/user.modl.js'
import { globaleResponse } from './src/middleware/error-handling.middleware.js'



if(process.env.NODE_ENV =='dev') {
    config({path:path.resolve('dev.env')})
}
if(process.env.NODE_ENV =='prod') {
    config({path:path.resolve('prod.env')})
}

config()


let port = process.env.PORT
const app = express()
app.use(express.json())
connectionDB()

app.use('/users',userRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)



app.use(globaleResponse)

app.get('/verify/:token',async(req,res)=>{
    jwt.verify(req.params.token,'hager',async(err,payload)=>{
        if(err) return res.json(err)
        await userModel.findOneAndUpdate({email:payload.email},{recoveryEmail:payload.email})
        res.json({message:"SUCCESS",email:payload.email})
    })
  
})



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))