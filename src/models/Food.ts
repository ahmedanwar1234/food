import mongoose,{Document,Schema} from "mongoose";


export interface FoodDoc extends Document{
    vandorId:string;
    name:string;
    description:string;
    category:string;
    foodType:string;
    readTime:number;
    price:number;
    ratring:number;
    images:[string]

}



const FoodsShema=new Schema({
    vandorId:{type:String,required:true},
    name:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String},
    foodType:{type:String,required:[true,"the fucker foodType is required"]},
    readTime:{type:Number},
    price:{type:Number,required:true},
    rating:{type:Number},
    images:{type:[String]},



},{
    toJSON:{
        transform(doc,ret){
            delete ret._v,
            delete ret.createdAt,
            delete ret.updatedAT
        }

    },
    
    timestamps:true})


    const Food =mongoose.model<FoodDoc>('food',FoodsShema)
    export  {Food};