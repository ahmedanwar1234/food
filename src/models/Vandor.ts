import mongoose,{Schema,Document,Model}from 'mongoose'

interface VandorDoc extends Document{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    serviceAvailable:boolean;
    coverImages:[string];
    rating:number;
     foods:any
}

const VandorSchema=new Schema({
    name:{type:String,required:true,
    },
    ownerName:{type:String,required:true},
    foodType:{type:[String]},
    pincode:{type:String,required:true},
    address:{type:String,required:[true,"the fucker address is required"]},
    phone:{type:String,required:true},
    email:{type:String,required:true,
        validate: {
            validator: function(v: string) {
              // Custom email validation logic
              return /\S+@\S+\.\S+/.test(v);
            },
            message: (props: { value: string; }) => `${props.value} is not a valid email address!`
          }},
    password:{type:String,required:true},
    salt:{type:String,required:true},
    serviceAvailable:{type:Boolean},
    coverImages:{type:[String]},
    erating:{type:Number},
     foods:[{type:mongoose.SchemaTypes.ObjectId,ref:'food'}]
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

const Vandor=mongoose.model<VandorDoc>('vandor',VandorSchema)
export {Vandor}