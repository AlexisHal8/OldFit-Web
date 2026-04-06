import express from "express";

const router = express.Router();

router.get("/send", (req, res) => {
    res.send("Enviar mensaje endpoint")
});

export default router;