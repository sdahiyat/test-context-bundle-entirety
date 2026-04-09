import OpenAI from 'openai';

// Singleton OpenAI client for use across the application
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
