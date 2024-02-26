


import {IsEmail,IsEmpty,IsOptional,Length, isEmpty}from 'class-validator'
export class CreateCustomerInputs{
    @IsEmail()
    email:string;

    @Length(6,20)
    phone:string

    @Length(6,20)
    password:string

}
export class UserLoginInputs{
    @IsEmail()
    email:string;
    
    @Length(6,20)
    password:string
    
}
export class EditCustomerProfileInputs{

    
    @IsOptional()
    @Length(3,20)
    firstName?:string;
    
  @IsOptional()
    @Length(3,20)
    lastName?:string;

    
  @IsOptional()
    @Length(3,20)
    address?:string


}

export interface CustomerPayload{
    _id:string;
    email:string;
    verified:boolean
}