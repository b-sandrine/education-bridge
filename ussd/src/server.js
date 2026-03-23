import express from 'express';
import dotenv from 'dotenv';
import { handleUSSDRequest } from './handlers/ussdHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.USSD_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// USSD endpoint - compatible with Twilio, Africa's Talking, or other USSD gateways
app.post('/ussd', async (req, res) => {
  try {
    const { phoneNumber, text: userInput, sessionId } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    // Detect language from session data or default
    const language = req.body.language || 'en';

    // Handle USSD request
    const response = await handleUSSDRequest(phoneNumber, userInput, language);

    // Response format varies by gateway, but generally:
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    console.error('USSD error:', error);
    res.status(500).send('Service temporarily unavailable. Please try again later.');
  }
});

// Alternative endpoint for Africa's Talking format
app.get('/ussd', async (req, res) => {
  try {
    const { phoneNumber, text: userInput, sessionId } = req.query;

    if (!phoneNumber) {
      return res.status(400).send('CON Phone number required');
    }

    const language = req.query.language || 'en';
    const response = await handleUSSDRequest(phoneNumber, userInput, language);

    res.set('Content-Type', 'text/plain');
    res.send(`CON ${response}`);
  } catch (error) {
    console.error('USSD error:', error);
    res.status(500).send('CON Service temporarily unavailable');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ussd-gateway' });
});

app.listen(PORT, () => {
  console.log(`USSD Gateway running on port ${PORT}`);
});

export default app;
