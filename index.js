"use strict";

const nodemailer = require('nodemailer');
const config = require('./config.js');
const fs = require("fs").promises;
const {createConsumer, onConsumed} = require('./kafka');
const consumerTopic = process.env.KAFKA_CONSUME_TOPIC;
const transporter = nodemailer.createTransport(config.transporter);

async function run() {
    const consumer = await createConsumer(config.consumer);

    consumer.subscribe([consumerTopic])
    consumer.consume(async (err, messages) => {
        if (err) return err;

        try {
            const {key, value, topic, offset, partition} = messages;
            let url = value.toString();
            i = 0;
            users = JSON.parse((await getUsers(url)));
            await send();

            if (url) {
                await onConsumed(
                    consumer,
                    key.toString(),
                    url,
                    {topic, offset, partition}
                );
            }

            return url;
        } catch (e) {
            return e;
        }
    });

    let users = [];
    let i = 0;

    /**
     *
     * @returns {Promise<*>}
     */
    async function send() {
        return await transporter.sendMail({
            from: 'Fred Foo 👻 <foo@example.com>',
            to: users[i].email,
            subject: 'password reset',
            text: '',
            html: "<a href=" + 'http://127.0.0.1:8000/' + users[i].email + ">Reset Password</a>",
        }, (error, info) => {

            if (error) return console.log(error);

            if (++i < users.length) send();
            console.log('Message sent: %s', info.messageId);
        });
    }

    /**
     * @param url
     *
     * @returns {Promise<string|*>}
     */
    async function getUsers(url) {
        try {
            return fs.readFile(
                url,
                {encoding: 'utf8'},
            );
        } catch (err) {
            return err;
        }


    }
}

run().catch((e) => {
    console.log(e);
});
