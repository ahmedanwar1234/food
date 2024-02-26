import App from './services/ExpressApp'
import express from 'express';
import dbConnection from './services/Database'
import { GeneratePassword, GenerateSalt, ValidatePassword } from './utility';
import { PORT } from './config';


const StartServer=async()=>{
// E5_65.q.NqBybZP
const app=express();
    app.get('/test',async(req,res,next)=>{

        const salt=await GenerateSalt();
        const passwordbc=await GeneratePassword("password",salt)
        console.log(salt);
        return res.json({salt,passwordbc})
    })
    app.get('/test2',async(req,res,next)=>{

      
        const validatepassowrd=await ValidatePassword("password","$2b$10$gnZshKMoK1tyjjagJeCD/OhQtKXrLYnNCtG/QH7EzoNavIkBFObZG","$2b$10$gnZshKMoK1tyjjagJeCD/O")
        
        return res.json({validatepassowrd})
    })

    await dbConnection();
    await App(app)
    
    app.listen(PORT,()=>{
        console.log(`Listengin to port ${PORT}`)
    })
}
StartServer();