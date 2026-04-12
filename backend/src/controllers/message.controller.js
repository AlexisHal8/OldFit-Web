import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { pool } from "../lib/db.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    
    const query = `
      SELECT id as "_id", full_name as "fullName", email, profile_pic as "profilePic", role 
      FROM users 
      WHERE id != $1
    `;
    const users = await pool.query(query, [loggedInUserId]);

    res.status(200).json(users.rows);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: userToChatId } = req.params;

    const query = `
      SELECT id as "_id", sender_id as "senderId", receiver_id as "receiverId", text, image_url as image, created_at as "createdAt"
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) 
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC;
    `;
    
    const messages = await pool.query(query, [myId, userToChatId]);

    res.status(200).json(messages.rows);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    if (!text && !image) return res.status(400).json({ message: "Text or image is required." });
    if (senderId === receiverId) return res.status(400).json({ message: "Cannot send messages to yourself." });

    // Verificar si el receptor existe
    const receiverCheck = await pool.query("SELECT id FROM users WHERE id = $1", [receiverId]);
    if (receiverCheck.rows.length === 0) return res.status(404).json({ message: "Receiver not found." });

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const insertQuery = `
      INSERT INTO messages (sender_id, receiver_id, text, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id as "_id", sender_id as "senderId", receiver_id as "receiverId", text, image_url as image, created_at as "createdAt";
    `;
    
    const newMessageResult = await pool.query(insertQuery, [senderId, receiverId, text, imageUrl]);
    const newMessage = newMessageResult.rows[0];

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Con SQL, en lugar de mapear arreglos en JavaScript, usamos un JOIN y DISTINCT
    // Esto busca a los usuarios que hayan enviado o recibido un mensaje tuyo.
    const query = `
      SELECT DISTINCT u.id as "_id", u.full_name as "fullName", u.email, u.profile_pic as "profilePic", u.role
      FROM users u
      JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
      WHERE (m.sender_id = $1 OR m.receiver_id = $1) 
        AND u.id != $1;
    `;
    
    const chatPartners = await pool.query(query, [loggedInUserId]);

    res.status(200).json(chatPartners.rows);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};