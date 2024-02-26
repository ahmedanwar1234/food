import express,{Request,Response,NextFunction}from 'express'
import { CreateVandor, GetVandorById, GetVandors } from '../controllers';

const router=express.Router();

router.post('/vandor',CreateVandor).
get('/vandors',GetVandors)
.get('/vandor/:id',GetVandorById)



router.get('/',(req:Request,res:Response,next:NextFunction)=>{

    res.json({message:"hello fucker mother admin router"})
})

export { router as AdminRoute}