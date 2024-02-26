
// Email

//notifications

//OTP
export const GenerateOtp=()=>{
    const otp=Math.floor(100000 +Math.random()*900000)

    let expiry=new Date()
    expiry.setTime(new Date().getTime()+(30*60*1000))

    return {otp,expiry}
}

export const onRequestOTP=async(otp:number,toPhoneNumber:string)=>{

    const accountSid="AC24df383d44e5e66b803396d470304b65"
    const authToken="abf14299857d3afbf4cc6b07e0782904"

    const client=require('twilio')(accountSid,authToken)
    const response=await client.messages.create({body:`Your OTP is ${otp}`,from:'+16059888745',to:`+2${toPhoneNumber}`})

    return response
}