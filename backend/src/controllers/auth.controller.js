import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import { pool } from "../lib/db.js"; 
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";


//endpoint de registro
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Ingrese todos los campos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener 6 carácteres como mínimo" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato invalido de correo" });
    }

    // Se consulta si el usuario está en la base de datos
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) return res.status(400).json({ message: "Credenciales invalidas" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertamos el nuevo usuario y usamos RETURNING * para obtener los datos insertados
    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, full_name, email, profile_pic, role;
    `;
    const newUserResult = await pool.query(insertQuery, [fullName, email, hashedPassword]);
    const savedUser = newUserResult.rows[0];

    generateToken(savedUser.id, res); //el .id es por postgres

    res.status(201).json({
      _id: savedUser.id, //Está en la respuesta por si más adelante se ocupa en el front
      fullName: savedUser.full_name,
      email: savedUser.email,
      profilePic: savedUser.profile_pic,
      role: savedUser.role,
    });

    try {
      await sendWelcomeEmail(savedUser.email, savedUser.full_name, ENV.CLIENT_URL);
    } catch (error) {
      console.error("Error al enviar correo de bienvenida:", error);
    }
  } catch (error) {
    console.log("Error en el controlller de registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


//endpoint de login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "LLene todos los campos" });
  }

  try {
    // Buscamos al usuario
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });
    
    const user = userResult.rows[0];

    // Comparamos el password con el hash guardado (password_hash)
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user.id, res);

    res.status(200).json({
      _id: user.id,
      fullName: user.full_name,
      email: user.email,
      profilePic: user.profile_pic,
      role: user.role,
    });
  } catch (error) {
    console.error("Error en el controller de login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//endpoint para cerrar sesión
export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Cierre de sesión de forma exitosa" });
};

//endpoint para actualizar la foto de perfil
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user.id; 

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Actualizamos el perfil usando SQL
    const updateQuery = `
      UPDATE users 
      SET profile_pic = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING id, full_name, email, profile_pic, role;
    `;
    const updatedUserResult = await pool.query(updateQuery, [uploadResponse.secure_url, userId]);
    const updatedUser = updatedUserResult.rows[0];

    res.status(200).json({
      _id: updatedUser.id,
      fullName: updatedUser.full_name,
      email: updatedUser.email,
      profilePic: updatedUser.profile_pic,
      role: updatedUser.role,
    });
  } catch (error) {
    console.log("Error al actualizar la foto de perfil: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};