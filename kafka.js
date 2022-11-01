"use strict"

const kafka = require('node-rdkafka');

function createConsumer(config) {
    const consumer = new kafka.KafkaConsumer(config, { "auto.offset.reset": "earliest" });

    return new Promise((resolve, reject) => {
        consumer
            .on("ready", () => resolve(consumer))
            .on("event.error", (err) => {
                reject(err);
            });

        consumer.connect({}, (err) => {
            if (err) {
                return;
            }

            console.info("Consumer connected.");
        });
    });
}

async function onConsumed(consumer, key, records, {topic, offset, partition}) {
    try {
        offset++;
        consumer.commit({topic, offset, partition});
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    createConsumer,
    onConsumed,
};