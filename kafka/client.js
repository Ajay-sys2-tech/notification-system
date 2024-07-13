import  { Kafka } from "kafkajs";
import 'dotenv/config';

export const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER]
  })
  