// "use strict";

// require('dotenv').config();

const nodemailer = require("nodemailer");
const { read } = require("fs");

var hbs = require('nodemailer-express-handlebars-plaintext-inline-ccs');

// async..await is not allowed in global scope, must use a wrapper

/**
 * This function will send 'Welcome email'. 
 * To provided EMAIL adress. 
 * With showed to user LOGIN and PASSWORD.
 * @param {string} EMAIL user email
 * @param {string} LOGIN user login
 * @param {string} PASSWORD user password
 */
const sendRegisterWelcomeMail = async (EMAIL, LOGIN, PASSWORD) => {
    // create account
    let account = {
        user: 'ur-mail@example.com',
        pass: 'password'
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "ur-host.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: account.user,
            pass: account.pass,
        },
    });

    const views = 'app/middleware/email/views'

    const options = {
        templatesDir: views,
        plaintextOptions: {
            uppercaseHeadings: false
        }
    }

    transporter.use('compile', hbs(options));

    let mailOptions = {
        from: '"YOU" <email@example.com>',
        to: EMAIL, // list of receivers
        subject: 'APP REGISTRATION WELCOME EMAIL',
        text: '',
        template: 'registration',
        context: {
            name: LOGIN,
            login: LOGIN,
            password: PASSWORD
        }
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error: ', err);
        } else {
            console.log('Mail sent');
        }
    });
}

module.exports = {
    sendRegisterWelcomeMail
};

// Possible way of invoking:
//  sendRegisterWelcomeMail().catch(console.error);