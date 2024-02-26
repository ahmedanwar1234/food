console.time('reallyExpensiveFunction');
import { Application, } from "express";
import {AdminRoute,VandorRoute,ShoppingRoute,CustomerRoute}from '../routes'
import path from 'path'

const express=require("express");


export default async(app:Application)=>{
// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/images',express.static(path.join(__dirname,'images')))

app.use('/admin',AdminRoute);
app.use('/vandor',VandorRoute);
app.use('/customer',CustomerRoute);
app.use('/',ShoppingRoute);

return app
}
