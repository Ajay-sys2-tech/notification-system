import { kafka } from "./client.js";
const producer = kafka.producer();
try {
  await producer.connect();
} catch (error) {
  console.error("Error connecting producer: ", error);
}

//message is an array of object
export const sendNotificationToKafka = async (topic, message) => {
  try {
    await producer.send({ 
        topic: topic,
        messages: message
    });
  } catch (error) {
    console.error("Error sending message to Kafka: ", error);
  }
}
