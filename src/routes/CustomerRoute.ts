import express from 'express';
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from '../controllers';
import { Authonticate } from '../middlewares';

const router=express.Router();


/**---------------- Signup /Create Customer ----------*/ 

router.post('/signup',CustomerSignup)

/**---------------- Loging ---------------- */ 

router.post('/login',CustomerLogin)

// authontication
router.use(Authonticate)

/**---------------- Verigy Customer Account ---------------- */ 

router.patch('/verify',CustomerVerify)

/**---------------- OTP / Requesting OTP ---------------- */ 

router.get('/otp',RequestOtp)

/**---------------- Profile---------------- */ 

router.get('/profile',GetCustomerProfile)
router.patch('/profile',EditCustomerProfile)





//Cart 
//Order
//Payment


export {router as CustomerRoute}