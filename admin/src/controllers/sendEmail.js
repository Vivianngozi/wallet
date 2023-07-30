import nodemailer from "nodemailer";

export async function sendEmail (email, subj, text) {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: '"hello.com"<me.me>',
            to: email,
            subject: subj,
            text: text
        });

        console.log("email sent successfully");
    } catch(error){
        console.log(error)
    }
}