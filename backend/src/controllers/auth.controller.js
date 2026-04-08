import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt.js";

export const signup = async (req, res) => {

    const{fullName, email, passsword} = req.body
    try{
        if(!fullName || !email || !passsword){
            return res.status(400).json({message: "Debes de llenar todos los campos"})
        }

        if(passsword.length < 6){
            return res.status(400).json({message: "La contraseña debe tener al menos seis carácteres."})
        }


        //revisar si el correo es válido
        const emailRegex = /^[^\s@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({message:"El formato del correo es inválido"})
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"Utilice otro correo"})

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passsword, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            // generateToken(newUser._id, res);
            // await newUser.save(); //permite guardarlo en la base de datos

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });

        }else{
            res.status(400).json({message:"Información del usuario invalida"});
        }

    }catch(error){
        console.log("Error en el controller de crear cuenta", error);
        res.status(500).json({message:"Error de servidor interno"});
    }
};