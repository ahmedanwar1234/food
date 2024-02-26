"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const VandorController_1 = require("../controllers/VandorController");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VandorRoute = router;
// const imageStorage = multer.diskStorage({
//     destination: function(req,file, cb){
//         cb(null, 'images')
//     },
//     filename: function(req,file,cb){
//         cb(null, new Date().toISOString()+'_'+file.originalname);
//     }
// })
// const images = multer({ storage: imageStorage}).array('image',10)
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images'); // Destination folder
    },
    filename: function (req, file, cb) {
        // Rename the uploaded file (you can customize this as needed)
        cb(null, Date.now().toLocaleString() + '_' + file.originalname);
    }
});
// Initialize Multer upload middleware
const upload = (0, multer_1.default)({ storage: storage });
router.get('/', (req, res, next) => {
    res.json({ message: " hello fuckermother   from vandorRouter" });
});
router.post('/login', VandorController_1.VandorLogin);
router.use(middlewares_1.Authonticate);
router.patch('/profile', VandorController_1.UpdateVandorProfile);
router.get('/profile', VandorController_1.GetVandorProfile);
router.patch('/service', VandorController_1.UpdateVandorServices);
router.patch('/coverimage', upload.array('images', 10), VandorController_1.UpdateVandorCoverImage);
router.post('/food', upload.array('images', 10), VandorController_1.AddFood);
router.get('/foods', VandorController_1.GetFoods);
//# sourceMappingURL=VandorRoute.js.map