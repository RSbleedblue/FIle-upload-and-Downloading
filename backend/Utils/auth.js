import jwt from 'jsonwebtoken';
const auth = (req,res,next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if(!token){
            return res.status(400).json({message : "Unauthorised, Header missing", success : false})
        }
        const decoder = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = decoder;
        next();
    }
    catch(err){
        return res.status(400).json({message : "UnAuthorised", success : false});
    }
}
export default auth;