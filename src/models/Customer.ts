import mongoose,{Schema,Document,Model}from 'mongoose'

export interface CustomerDoc extends Document{
    email:string;
    password:string;
    phone:string;
    salt:string;
    firstName:string;
    lastName:string;
    address:string;
    
    verified:boolean;
    otp:number;
    otp_expiry:Date;
    lat:number;
    lng:number;
}

const CustomerSchema=new Schema({
   
    email:{type:String,required:true,unique:true,
        validate: {
            validator: function(v: string) {
              // Custom email validation logic
              return /\S+@\S+\.\S+/.test(v);
            },
            message: (props: { value: string; }) => `${props.value} is not a valid email address!`
          }},
    password:{type:String,required:true},
    salt:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String},
    address:{type:String},
    phone:{type:String,required:true},
    verified:{type:String,required:true},
    otp:{type:Number,required:true},
    otp_expiry:{type:Date,required:true},
    lat:{type:Number},
     lng:{type:Number}
},
{
    toJSON:{
transform(doc,ret){
    delete ret.password;
    delete ret.salt;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
}
    },
    timestamps:true
}
)

const Customer=mongoose.model<CustomerDoc>('customer',CustomerSchema)
export {Customer}