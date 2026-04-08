import mongoose from "moongose";

export const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch(error){
        console.error("Error conectando a la base de datos", error);
        process.exit(1); // 1 significa fallo, 0 es éxito, 
    }
}