import express,{Request,Response,NextFunction} from 'express'
import {plainToClass}from 'class-transformer'
import { CreateCustomerInputs,UserLoginInputs,EditCustomerProfileInputs } from '../dto/Customer.dto'
import {validate}from 'class-validator'
import { Customer, CustomerDoc } from '../models'
import { GeneratePassword, GenerateSalt, GenerateSingature, ValidatePassword } from '../utility'
import { GenerateOtp, onRequestOTP } from '../utility/NotificationUtility'
import { Result } from 'postcss'


export const CustomerSignup=async(req:Request,res:Response,next:NextFunction)=>{

    const customerInputs=plainToClass(CreateCustomerInputs,req.body)

    const inputErrors=await validate(customerInputs,{validationError:{target:true}});

    if(inputErrors.length >0){
        return res.status(400).json(inputErrors);
    }
    const {email,password,phone}=customerInputs;
    const salt=await GenerateSalt();
    const passwordbcrypt=await GeneratePassword(password,salt);
    
    const {otp,expiry}=GenerateOtp();
    const existCustomer=await Customer.findOne({email})

    if(existCustomer !==null){
return res.status(409).json({message:'An user exist with the provide email ID'})
    }

    const result=await Customer.create({
        email
        ,password:passwordbcrypt,
        salt
        ,phone
        ,otp
        ,otp_expiry:expiry,
        firstName:'',
        lastName:'',
        verified:false,
        lat:0,
        lng:0

    }) 
    if(result){
   
         // send the OTP customer
         await onRequestOTP(otp,phone)

         // generate the signature
         const signature=GenerateSingature({_id:result._id,verified:result.verified,email:result.email})

        // send the result to client
        return res.status(201).json({signature,verified:result.verified,email:result.email})
    }

    return res.status(400).json({message:"Error with signup"})

}



export const CustomerLogin=async(req:Request,res:Response,next:NextFunction)=>{

    const loginInputs=plainToClass(UserLoginInputs,req.body);

    const loginErrors=await validate(loginInputs,{validationError:{target:false}})

    if(loginErrors.length>0){
        return res.status(400).json(loginErrors)
    }
    const {email,password}=loginInputs;

    const customer =await Customer.findOne({email})
    if(customer){
        const validation=await ValidatePassword(password,customer.password,customer.salt);
        
        if(validation){
            //generate the signature
            const signature=GenerateSingature({
                _id:customer._id,
                email:customer.email,
                verified:customer.verified
            })
            // send the result to cilent
            return res.status(201).json({signature,verified:customer.verified,email:customer.email})
        }
    }
    return res.status(400).json({message:"Login error"})

}



export const CustomerVerify=async(req:Request,res:Response,next:NextFunction)=>{

    const {otp}=req.body;

    const customer=req.user;

    if(customer){
        const profile=await Customer.findById(customer._id)

        if(profile){
if(profile.otp===parseInt(otp)&&profile.otp_expiry >= new Date()){

    profile.verified=true;
    const updateCustomerResponse=await profile.save();
    const signature=GenerateSingature({_id:updateCustomerResponse._id,verified:updateCustomerResponse.verified,email:updateCustomerResponse.email})

        return res.status(201).json({signature,verified:updateCustomerResponse.verified,email:updateCustomerResponse.email})
}



        }
    }

    return res.status(400).json({message:'Error with OTP VALIDATION'})

}

export const RequestOtp=async(req:Request,res:Response,next:NextFunction)=>{

    const customer=req.user;
    
    if(customer){
        const profile=await Customer.findById(customer._id)
        if(profile){
            const {otp,expiry}=GenerateOtp();
            profile.otp=otp;
            profile.otp_expiry=expiry;

            await profile.save();
            await onRequestOTP(otp,profile.phone);
           return res.status(200).json({message:"OTP sent your registred phone number!"})

        }


    }
    return res.status(200).json({message:"Error with Request OTP"})
}

export const GetCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{
    
    const custoemr=req.user;

  
    if(custoemr){

        const profile:any=await Customer.findById(custoemr._id);

        if(profile){


          return  res.status(200).json(profile)
        }

    }
    return res.status(200).json({message:"Error with Fetch Profile"})


}

export const EditCustomerProfile=async(req:Request,res:Response,next:NextFunction)=>{
 
    const custoemr=req.user;

    const profileInputs=plainToClass(EditCustomerProfileInputs,req.body);

    const profileErrors=await validate(profileInputs,{validationError:{target:true}});
    
    if(profileErrors.length >0){
        return res.status(400).json(profileErrors);
    }
    const {firstName,lastName,address}=profileInputs;
    if(custoemr){

        const profile=await Customer.findById(custoemr._id);

        if(profile){
        { firstName!=null&&(profile.firstName=firstName)};
         {lastName!=null&&(profile.lastName=lastName)};
         {address!=null&&(profile.address=address)};



           const reslut= await profile.save();

            res.status(200).json(reslut)
        }
    
    }
}


