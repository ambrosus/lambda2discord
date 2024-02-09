const axios = require('axios'); // You can install axios using npm or yarn

async function handler(event) {
  const webhookPayload = JSON.parse(event.body);
  const { logsUrl } = webhookPayload;

  try {
    await sendToDiscord(logsUrl);
  } catch (error) {
    console.error(error)
    return {
      statusCode: 400,
      body: `Cannot process event: ${error}`,
    }
  }

  return {
    statusCode: 200, // default value
    body: JSON.stringify({
      received: true,
    }),
  };
}


async function sendToDiscord(logsUrl) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  await axios.post(webhookUrl, { content: logsUrl });
}

exports.handler = handler;
