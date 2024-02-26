import express,{Request,Response,NextFunction}from 'express'
import { AddFood, GetFoods, GetVandorProfile, UpdateVandorCoverImage, UpdateVandorProfile, UpdateVandorServices, VandorLogin } from '../controllers/VandorController';
import { Authonticate } from '../middlewares';
import multer from 'multer';
import path from 'path'


const router=express.Router();


// const imageStorage = multer.diskStorage({
//     destination: function(req,file, cb){
//         cb(null, 'images')
//     },
//     filename: function(req,file,cb){
//         cb(null, new Date().toISOString()+'_'+file.originalname);
//     }
// })

// const images = multer({ storage: imageStorage}).array('image',10)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images'); // Destination folder
    },
    filename: function (req, file, cb) {
      // Rename the uploaded file (you can customize this as needed)
      cb(null, Date.now().toLocaleString()+'_'+file.originalname);
    }
  });
  
  // Initialize Multer upload middleware
  const upload = multer({ storage: storage });
  
router.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:" hello fuckermother   from vandorRouter"})
})
router.post('/login',VandorLogin)
;
router.use(Authonticate)
router.patch('/profile',UpdateVandorProfile)
router.get('/profile',GetVandorProfile)
router.patch('/service',UpdateVandorServices)
router.patch('/coverimage',upload.array('images',10),UpdateVandorCoverImage)

router.post('/food',upload.array('images',10),AddFood)
router.get('/foods',GetFoods)

export {router as VandorRoute}
