import  { kafka } from "./client.js";
import { io } from '../index.js';
import { find } from '../repository/user.js';
const group = process.env.KAFKA_GROUP;
const topic = process.env.KAFKA_TOPIC;

export const startKafkaConsumer = async (io) => {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: [topic], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        // console.log(`${group}: [${topic}]:`, message.value.toString());
        const user = await find(message.key.toString());
        if(user.connected){
          io.to(message.key.toString()).emit(topic,  { message: message.value.toString() });
        }else{
          console.log(user.email, " is not connected");
        }
      } catch (error) {
        console.error("Error processing message in Kafka: ", error);
      }
    },
  });
}
