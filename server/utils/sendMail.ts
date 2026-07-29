require('dotenv').config();
import nodemailer,{transporter} from "nodemailer";
import ejs from "ejs";
import path from "path";


interface Emailoptions {
    email: string;
    subject: string;
    template: string;
    data:{key: string, value: any}[];
}
const sendEmail = async (options: Emailoptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL || process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const {email, subject, template, data} = options;
    //get the path of the email template file
    const templatePath = path.join(__dirname, `../controllers/mails/${template}.ejs`);
    //render the email template with the ejs
    const templateData = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {} as Record<string, any>);

    const html = await ejs.renderFile(templatePath, templateData);
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: subject,
        html: html,
    };
    await transporter.sendMail(mailOptions);
}
export default sendEmail;