import OpenAI from 'openai';
import { config } from '../config';

let openaiClient: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }
  return openaiClient;
};

export const analyzeWithAI = async (
  prompt: string,
  systemMessage?: string
): Promise<string> => {
  try {
    const client = getOpenAIClient();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await client.chat.completions.create({
      model: config.openai.model,
      messages,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze with AI');
  }
};

export const analyzeTenderRisk = async (tenderData: any): Promise<any> => {
  const systemMessage = `You are an expert tender analyst specializing in risk assessment for construction and contracting projects.`;

  const prompt = `Analyze the following tender and identify potential risks:

Tender Details:
${JSON.stringify(tenderData, null, 2)}

Please provide:
1. Risk Score (0-100, where 100 is highest risk)
2. Key risks identified
3. Risk mitigation recommendations

Format your response as JSON with the following structure:
{
  "riskScore": <number>,
  "risks": [{"category": "<category>", "description": "<description>", "severity": "<low|medium|high>"}],
  "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}`;

  const result = await analyzeWithAI(prompt, systemMessage);
  return JSON.parse(result);
};

export const analyzeBidDecision = async (tenderData: any): Promise<any> => {
  const systemMessage = `You are an expert in bid/no-bid decision making for construction and contracting businesses.`;

  const prompt = `Analyze the following tender and provide a bid/no-bid recommendation:

Tender Details:
${JSON.stringify(tenderData, null, 2)}

Please provide:
1. Win Probability (0-100%)
2. Recommendation (bid, no_bid, or conditional)
3. Key factors influencing the decision
4. Conditions (if recommendation is conditional)

Format your response as JSON with the following structure:
{
  "winProbability": <number>,
  "recommendation": "<bid|no_bid|conditional>",
  "factors": ["<factor 1>", "<factor 2>"],
  "conditions": ["<condition 1>"],
  "reasoning": "<detailed reasoning>"
}`;

  const result = await analyzeWithAI(prompt, systemMessage);
  return JSON.parse(result);
};

export const extractLineItems = async (documentText: string): Promise<any[]> => {
  const systemMessage = `You are an expert at extracting bill of quantities (BOQ) and line items from tender documents.`;

  const prompt = `Extract all line items, quantities, and pricing information from the following text:

${documentText}

Format your response as JSON array with the following structure:
[
  {
    "item": "<item name>",
    "description": "<description>",
    "quantity": <number>,
    "unit": "<unit>",
    "unitPrice": <number or null>,
    "category": "<category>"
  }
]`;

  const result = await analyzeWithAI(prompt, systemMessage);
  return JSON.parse(result);
};
