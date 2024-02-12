const axios = require('axios');

async function handler(event) {
  const webhookPayload = JSON.parse(event.body);
  const { fileContent, fileName, message } = webhookPayload;

  try {
    await sendToDiscord(fileContent, fileName, message);
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

async function sendToDiscord(fileContent, fileName, message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  try {
    const fileBuffer = Buffer.from(fileContent, 'utf-8');
    const fileBlob = new Blob([fileBuffer]);

    const formData = new FormData();
    formData.append('file', fileBlob, fileName);
    formData.append('content', message);

    await axios.post(webhookUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('File sent successfully!');
  } catch (error) {
    console.error('Error sending file to Discord:', error);
  }
}

exports.handler = handler;
