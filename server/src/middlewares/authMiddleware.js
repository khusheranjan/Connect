import jwt from jsonwebtoken;

const autheticated= (req, res, next)=>{
    const token= req.cookies.jwt;
    if(!token){
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user= decoded;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid token, authorization denied" });
    }
}

export default autheticated;