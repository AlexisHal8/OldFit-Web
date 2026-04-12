import { resendClient, sender} from "../lib/resend.js"
import {createWelcomeEmailTemplate} from "../emails/emailTemplates.js";


export const sendWelcomeEmail = async (email, name, clientURL) =>{
    const {data, error} = await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to: email,
        subject: "Bienvenido a Old Fit",
        html: createWelcomeEmailTemplate(name, clientURL)
    });


    if(error){
        console.error("Error al mandar el correo: ", error);
        throw new Error("Fallo al enviar el correo");
    }


    console.log("EL correo se ha enviado con éxito: ", data)
};