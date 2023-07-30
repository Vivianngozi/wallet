import jwt from "jsonwebtoken";

export async function jwtValidator(req, res, next){
    
    try {
    const token = req?.header('Authorization').split('Bearer ')[1];
        
        if(!token) {return res.status(401).json({
            message: "Invalid token"
        });
        return;
    };
        const decoded = jwt.verify(token, process.env.SECRET);

        req.user = decoded.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Invalid Token" });
    }
}