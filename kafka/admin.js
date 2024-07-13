import  { kafka } from "./client.js";
import 'dotenv/config';

async function init() {
  const admin = kafka.admin();

  try {
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: process.env.KAFKA_TOPIC,
          numPartitions: process.env.KAFKA_NOTIFICATION_PARTITIONS,
        },
      ],
    });  
  } catch (error) {
    console.error("Error creating topic ", error);
  }finally {
    await admin.disconnect();
  }
}

init();
