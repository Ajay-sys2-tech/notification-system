import  { kafka } from "./client.js";
import { io } from '../index.js';
const group = process.env.KAFKA_GROUP;
const topic = process.env.KAFKA_TOPIC;

export const startKafkaConsumer = async (io) => {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: [topic], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        console.log(`${group}: [${topic}]:`, message.value.toString());
        io.to(message.key.toString()).emit(topic,  { message: message.value.toString() });
      } catch (error) {
        console.error("Error processing message in Kafka: ", error);
      }
    },
  });
}
