import { EditVandorInputs, VandorLoginInputs } from "../dto"
import { AuthPayload } from "../dto/Auth.dto";
import { CreateFoodInputs } from "../dto/foood.dto";
import { Food } from "../models/Food";
import { GeneratePassword, GenerateSingature, ValidatePassword } from "../utility";
import { findVandor } from "./AdminController"
import { Request,Response,NextFunction } from "express"


export const VandorLogin=async(req:Request,res:Response,next:NextFunction)=>{
const {email,password}=<VandorLoginInputs>req.body;

const existingVandor=await findVandor('',email);

if(existingVandor!==null){
// validation adn give access4

const validation=await ValidatePassword(password,existingVandor.password,existingVandor.salt);
if(validation){

    const signature=GenerateSingature({
        _id:existingVandor.id,
        email:existingVandor.email,
        foodTypes:existingVandor.foodType,
        name:existingVandor.name
    })

return res.json(signature)
}else{
    return res.json({"message":"password is not valid"})
}
}


return res.json({"message":"Login cerdential not valid"})
}

export const GetVandorProfile=async(req:Request,res:Response,next:NextFunction)=>{

const user=req.user;
if(user){
    const existingVandor=await findVandor(user._id)
    return res.json(existingVandor)
}

return res.json({message:"vandor information not found"})

}
export const UpdateVandorProfile=async(req:Request,res:Response,next:NextFunction)=>{

    const {foodType,name,address,phone}=<EditVandorInputs>req.body;
    const user=req.user;
    if(user){
        const existingVandor=await findVandor(user._id)
           if(existingVandor!==null){
            existingVandor.name=(name?name:existingVandor.name);
            existingVandor.phone=phone;
            existingVandor.foodType=foodType;
            existingVandor.address=address;

            const savedResult=await existingVandor.save();
            return res.json(savedResult)
           }
        return res.json(existingVandor)
    }
    
    return res.json({message:"vandor information not found"})
    


}
export const UpdateVandorCoverImage=async(req:Request,res:Response,next:NextFunction)=>{

    const user=req.user;
    if(user){

        const vandor=await  findVandor(user._id)
        if(vandor!==null){

            const files=req.files as [Express.Multer.File];
console.log(req.files)
            const images=files?.map((file:Express.Multer.File)=>{
              return  file.filename
            })
            ;
            
            vandor.coverImages.push(...images)
            // add relation food in vandor mongoose add _id food to vandor automaticly
            const result=await vandor.save();

            return res.json(result)

        }
    }
    
    return res.json({message:"somthing went wrong with add food"})
    



}
export const UpdateVandorServices=async(req:Request,res:Response,next:NextFunction)=>{

    const user=req.user;
    if(user){
        const existingVandor=await findVandor(user._id)
           if(existingVandor!==null){

            existingVandor.serviceAvailable= !existingVandor.serviceAvailable;
            const savedResult=await existingVandor.save();
            return res.json(savedResult)
           }
        return res.json(existingVandor)
    }
    
    return res.json({message:"vandor information not found"})
    

}
export const AddFood=async(req:Request,res:Response,next:NextFunction)=>{

    const user=req.user;
    if(user){

        const {name,description,category,foodType,readTime,price}=<CreateFoodInputs>req.body;
        const vandor=await  findVandor(user._id)
        if(vandor!==null){

            const files=req.files as [Express.Multer.File];

            const images=files.map((file:Express.Multer.File)=>{
              return  file.filename
            })
            console.log(images)
            const createFood=await Food.create({
            
                vandorId:vandor._id,
                name,
                category,
                description,
                foodType,
                images:images,
                rating:0,
                price,
                readTime
            })
            // add relation food in vandor mongoose add _id food to vandor automaticly
            vandor.foods.push(createFood);
            const result=await vandor.save();

            return res.json(result)

        }
    }
    
    return res.json({message:"somthing went wrong with add food"})
    

}


export const GetFoods=async(req:Request,res:Response,next:NextFunction)=>{

    const user=req.user;
    if(user){

        const foods=await Food.find({vandorId:user._id})
        
if(foods!==null){

    return res.json(foods)

}    }
    
    return res.json({message:"foods information not found"})
    

}


