import { Router } from "express";
import userController from "../Controller/userController.js";
import multer from "multer";
import auth from "../Utils/auth.js";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const userRoute = Router();
const UserController = new userController();

userRoute.post("/register", (req, res) => UserController.register(req, res));
userRoute.post("/login", (req, res) => UserController.login(req, res));
userRoute.post("/upload", auth, upload.single('upload'), (req, res, next) => {
    UserController.upload(req, res).catch(next);
});
userRoute.get("/download/:id", auth, (req, res) => UserController.downloadFile(req, res));

userRoute.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message, success: false });
    } else if (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", success: false });
    }
    next();
});

export default userRoute;
