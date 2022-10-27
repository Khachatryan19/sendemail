"use strict";

let express = require('express');
let app = express();
let nodemailer = require('nodemailer');
let config = require('./config.js');
const fs = require("fs");
const {createConsumer} = require('./kafka');
const kafkaFile = '/var/www/your_domain/U-Team/Account/storage/app/1data.json';

async function getUrl() {
    const consumer = await createConsumer(config.consumer);
    consumer.subscribe(['u-craft-topic'])
    consumer.consume((err, messages) => {
        if (err) console.error("error", err);

        try {
            const {key, value, topic, offset, partition} = messages;
            const records = JSON.parse(value.toString());
            console.log(records);
        } catch (err) {
            console.error("error", err);
        }
    })
}
getUrl()
    .then()
    .catch((e)=>console.log(e))

app.get('/send-mail', (req, res) => {
    async function example() {

        try {
            return JSON.parse(await fs.promises.readFile(
                await getUrl(),
                {encoding: 'utf8'},
                function (user) {
                    send(user).catch(console.error);
                }));
        } catch (err) {
            return err;
        }
    }

    example().then(function (users) {
        users.map((user) => {
            send(user).catch(console.error);
            res.send('mails sent').ok;
        })
    })
});

async function send(user) {
    let transporter = nodemailer.createTransport(config.transporter);
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: user.email,
        subject: 'password reset',
        text: '',
        html: "<a href=" + 'http://127.0.0.1:8000/api/' + user.token + ">Reset Password</a>",
    })
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}


app.listen(3000);