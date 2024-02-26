
import express, { NextFunction, Request, Response } from 'express'
import { Vandor } from '../models';
import { FoodDoc } from '../models/Food';


export const GetFoodAvailability=async(req:Request,res:Response,next:NextFunction)=>{


    const {pincode}=req.params;
    const result= await Vandor.find({pincode,serviceAvailable:true}).sort([['rating','descending']]).populate('foods')

    if(result.length>0){
       return res.status(200).json(result);
    }

  return res.status(400).json({message:"Data Not Found"})
  
}

export const GetTopRestaurants=async(req:Request,res:Response,next:NextFunction)=>{
    
        const {pincode}=req.params;
        const result= await Vandor.find({pincode,serviceAvailable:false}).sort([['rating','descending']]).limit(3)
    
        if(result.length>0){
           return res.status(200).json(result);
        }
    
      return res.status(400).json({message:"Data Not Found"})
    
    }
    
    export const GetFoodsIn30Min=async(req:Request,res:Response,next:NextFunction)=>{
        
            const {pincode}=req.params;
            const result= await Vandor.find({pincode,serviceAvailable:true}).populate('foods')
            if(result.length>0){
                let foodReslut:any=[{fucker:"asdfa"}];
                result.map((vandor)=>{
                   
                    const foods=vandor.foods as [FoodDoc];
                    foodReslut.push(...foods.filter(food=>{
                       return  food.readTime<30&&food
                        }))
                })
               return res.status(200).json(foodReslut);
            }
        
          return res.status(400).json({message:"Data Not Found"})
        
        
}

export const SearchFoods=async(req:Request,res:Response,next:NextFunction)=>{

    

    const {pincode}=req.params;
    const result= await Vandor.find({pincode,serviceAvailable:true}).populate('foods')

    if(result.length>0){

const foods:any=[] 
        result.map(food=>{
foods.push(...food.foods)
        })

       return res.status(200).json(foods);
    }

  return res.status(400).json({message:"Data Not Found"})
  
}

export const RestaurantById=async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.params;
    const result= await Vandor.findById(id).sort([['rating','descending']]).populate('foods')

    if(result){
       return res.status(200).json(result);
    }

  return res.status(400).json({message:"Data Not Found"})
  
}