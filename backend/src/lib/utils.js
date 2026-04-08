import jwt from "jsonwebtoken";

export const generateToken = (userId, res) =>{
    const{JWT_SECRET} = process.env;
    if(!JWT_SECRET){
        throw new Error("JWT_SECRET no está configurada");
    }

    const token = jwt.sign({userId},JWT_SECRET,{
        expiresIn:"7d",
    });    

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //tiempo en milisegundos
        httpOnly:true, //previene los ataques XSS ??
        sameSite:"strict", //atques CSRF
        secure: false,
    });

    return token;
};