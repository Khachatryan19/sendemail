"use strict";

const dotenv = require("dotenv");

dotenv.config();

const {
    KAFKA_CLIENT_ID,
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_SECURITY_PROTOCOL,
    KAFKA_SASL_MECHANISMS,
    KAFKA_SASL_USERNAME,
    KAFKA_SASL_PASSWORD,
    KAFKA_CONSUMER_GROUP_ID,
    KAFKA_CONSUME_TOPIC,
    KAFKA_PRODUCE_NOTIFICATION_TOPIC,
    KAFKA_PRODUCER_DEBUG,
    KAFKA_CONSUMER_DEBUG,
} = process.env

const transporter = {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "b7de42f5505448",
        pass: "1e9a61619bfa66"
    }
};

const consumer = {
    "client.id": KAFKA_CLIENT_ID || "action-tracker-app",
    "bootstrap.servers": KAFKA_BOOTSTRAP_SERVERS.split(","),
    "group.id": KAFKA_CONSUMER_GROUP_ID,
    "allow.auto.create.topics": false,
    "socket.keepalive.enable": true,
    "session.timeout.ms": 60000,
    "enable.auto.commit": false
};

if (KAFKA_SECURITY_PROTOCOL) {
    const security = {
        "sasl.username": KAFKA_SASL_USERNAME,
        "sasl.password": KAFKA_SASL_PASSWORD,
        "security.protocol": KAFKA_SECURITY_PROTOCOL,
        "sasl.mechanisms": KAFKA_SASL_MECHANISMS,
    };

    Object.assign(consumer, security);
}

module.exports = {
    transporter,
    consumer,
};