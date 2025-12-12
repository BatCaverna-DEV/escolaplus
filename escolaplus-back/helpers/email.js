// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()

// Cria o transporter com base nas variáveis de ambiente
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,      // ex: smtp.gmail.com
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export function mascararEmail(email) {
    const [usuario, dominio] = email.split('@');

    // Mantém os 2 primeiros caracteres, o resto vira "*"
    const usuarioMasc = usuario.slice(0, 2) + '*'.repeat(Math.max(usuario.length - 2, 1));

    // Mascara o domínio, mantendo apenas a primeira letra
    const partesDominio = dominio.split('.');
    const dominioMasc = partesDominio[0].slice(0, 1) + '***.' + partesDominio[1];

    return `${usuarioMasc}@${dominioMasc}`;
}


/**
 * Envia um e-mail
 * @param {Object} options
 * @param {string} options.to - Destinatário
 * @param {string} options.subject - Assunto
 * @param {string} [options.text] - Texto puro
 * @param {string} [options.html] - Versão HTML
 */
export async function enviarMensagem({ to, subject, text, html }) {
    if (!to) throw new Error('Campo "to" é obrigatório');
    if (!subject) throw new Error('Campo "subject" é obrigatório');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
    return info;
}

