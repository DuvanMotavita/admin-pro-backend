const jwt = require('jsonwebtoken');

const validateJWT = (req,res,next)=>{
    
    //Reading token
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'Token is missing on request'
        });
    } 

    try {
        
        const {uid} = jwt.verify(token,process.env.JWT_SECRET);
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token isnt correct'
        });
    }

   
}

module.exports = {
    validateJWT
}