import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent as required by AI Studio skill
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper function to call Gemini with retry and fallback model
async function callGeminiWithFallback(contents: string, systemInstruction: string, schema: any) {
  if (!ai) throw new Error('Gemini AI client not initialized');

  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.4,
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });

        const text = response.text;
        if (text) {
          return JSON.parse(text);
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt} on model ${model} failed:`, err?.message || err);
        // Short backoff before retrying
        await new Promise((res) => setTimeout(res, 800));
      }
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini after multiple attempts.');
}
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// POST /api/solve - AI Problem Solver endpoint
app.post('/api/solve', async (req: Request, res: Response): Promise<void> => {
  try {
    const { problem, category = 'Other' } = req.body;

    if (!problem || typeof problem !== 'string' || !problem.trim()) {
      res.status(400).json({ error: 'Please describe your problem or challenge.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please ensure GEMINI_API_KEY is configured in your environment or Settings > Secrets panel.',
      });
      return;
    }

    const systemInstruction = `You are LifePilot AI, a pragmatic everyday life problem solver and strategic action planner.
Your goal is to help everyday individuals and communities overcome feeling overwhelmed, indecisive, or disorganised.
Categories include: Study, Work, Personal, Finance, Health & Fitness, Household, Community, Other.

GUIDELINES:
1. Empathy without fluff: Be direct, structured, realistic, and highly practical.
2. Eliminate analysis paralysis: Break tasks down into tangible micro-steps with realistic time estimates.
3. Prioritize ruthlessly: Identify the top 3 highest-leverage priorities.
4. Concrete timeline: Propose a realistic timeline matching the urgency of the problem.
5. Anticipate friction: Provide real solutions to common obstacles (procrastination, burnout, coordination issues, unexpected costs).
6. Next Micro-Action: Give 1 simple 3-5 minute immediate action to break inertia right now.
7. Tone: Encouraging, analytical, and highly actionable. No cheesy slogans.`;

    const prompt = `User's Everyday Problem: "${problem.trim()}"
Selected Category: ${category}

Carefully evaluate the user's situation and generate a structured, personalized, step-by-step game plan.`;

    const parsedData = await callGeminiWithFallback(prompt, systemInstruction, {
      type: Type.OBJECT,
      properties: {
        problemUnderstanding: {
          type: Type.STRING,
          description: "A clear, empathetic, diagnostic breakdown of why this problem feels overwhelming and what is truly at stake."
        },
        keyPriorities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "The 3 highest-leverage focus areas that will deliver 80% of the results."
        },
        actionSteps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING, description: "Concise, actionable task name starting with a strong verb." },
              description: { type: Type.STRING, description: "Clear instructions on exactly what to do and how to accomplish it efficiently." },
              priority: { type: Type.STRING, description: "'High', 'Medium', or 'Low'" },
              estimatedTime: { type: Type.STRING, description: "Realistic time estimate, e.g., '15 mins', '45 mins', '2 hours'" },
              suggestedDeadline: { type: Type.STRING, description: "Suggested deadline, e.g., 'Today', 'Tomorrow morning', 'Within 48 hours'" }
            },
            required: ["id", "name", "description", "priority", "estimatedTime", "suggestedDeadline"]
          },
          description: "4 to 7 step-by-step sequential tasks to completely resolve the problem."
        },
        suggestedTimeline: {
          type: Type.STRING,
          description: "Organized schedule or phases showing when to execute these steps."
        },
        usefulTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 to 4 pragmatic, tested tips to maintain momentum and save time."
        },
        potentialObstacles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              obstacle: { type: Type.STRING, description: "A realistic point of friction or temptation to give up." },
              solution: { type: Type.STRING, description: "A concrete countermeasure to overcome this obstacle." }
            },
            required: ["obstacle", "solution"]
          },
          description: "2 to 3 practical obstacles and their immediate solutions."
        },
        simpleNextAction: {
          type: Type.STRING,
          description: "The single simplest micro-action the user can do within the next 3 to 5 minutes to break inertia right now."
        },
        summary: {
          type: Type.STRING,
          description: "1-2 sentence executive summary of the entire strategic plan."
        }
      },
      required: [
        "problemUnderstanding",
        "keyPriorities",
        "actionSteps",
        "suggestedTimeline",
        "usefulTips",
        "potentialObstacles",
        "simpleNextAction",
        "summary"
      ]
    });

    // Ensure action step IDs are unique
    const sanitizedActionSteps = (parsedData.actionSteps || []).map((step: any, idx: number) => ({
      ...step,
      id: step.id || `step-${Date.now()}-${idx + 1}`,
      priority: ['High', 'Medium', 'Low'].includes(step.priority) ? step.priority : 'Medium',
    }));

    const result = {
      id: `plan-${Date.now()}`,
      problem: problem.trim(),
      category,
      createdAt: new Date().toISOString(),
      ...parsedData,
      actionSteps: sanitizedActionSteps,
    };

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/solve:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while generating the solution plan. Please try again.',
    });
  }
});

// POST /api/follow-up - Interactive AI refinement & conversation
app.post('/api/follow-up', async (req: Request, res: Response): Promise<void> => {
  try {
    const { problem, category = 'Other', plan, messages = [], question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      res.status(400).json({ error: 'Please provide a follow-up question or request.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      res.status(500).json({
        error: 'Gemini API key is not configured on the server.',
      });
      return;
    }

    const systemInstruction = `You are LifePilot AI, assisting a user with refining and executing an everyday problem's action plan.
You have the context of the user's original problem, their generated plan, and conversation history.

Respond directly and pragmatically to their request (e.g., simplifying the plan, reducing steps, answering what to do first, or adjusting to changing circumstances).

If the user asks to modify the tasks (such as "Reduce this to 3 steps", "Make this easier", "Give me a one-day version"), you MUST provide an updated list of suggestedTasks in your structured response so they can update their task planner with one click.
If they just ask for advice or clarification, suggestedTasks can be empty or omitted.`;

    const promptContext = `ORIGINAL PROBLEM: "${problem}"
CATEGORY: ${category}

CURRENT PLAN SUMMARY:
Understanding: ${plan?.problemUnderstanding || 'N/A'}
Priorities: ${JSON.stringify(plan?.keyPriorities || [])}
Current Action Steps: ${JSON.stringify(plan?.actionSteps?.map((s: any) => `${s.name} (${s.estimatedTime})`) || [])}
Current Next Micro Action: ${plan?.simpleNextAction || 'N/A'}

CONVERSATION HISTORY:
${messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER FOLLOW-UP QUERY:
"${question.trim()}"

Provide a clear, direct, insightful answer. If task modifications are requested or logical, supply the updated action steps.`;

    const parsed = await callGeminiWithFallback(promptContext, systemInstruction, {
      type: Type.OBJECT,
      properties: {
        answer: {
          type: Type.STRING,
          description: "Helpful, direct response formatted cleanly with paragraphs or bullet points."
        },
        updatedNextAction: {
          type: Type.STRING,
          description: "The updated micro-action if relevant, or reiteration of immediate next step."
        },
        hasTaskModifications: {
          type: Type.BOOLEAN,
          description: "True if the response provides a revised or replacement set of actionable tasks."
        },
        suggestedTasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING },
              estimatedTime: { type: Type.STRING },
              suggestedDeadline: { type: Type.STRING }
            },
            required: ["id", "name", "description", "priority", "estimatedTime", "suggestedDeadline"]
          },
          description: "List of modified or simplified tasks if requested by user."
        }
      },
      required: ["answer", "hasTaskModifications"]
    });

    res.json({
      answer: parsed.answer,
      updatedNextAction: parsed.updatedNextAction || null,
      suggestedTasks: parsed.hasTaskModifications ? parsed.suggestedTasks : undefined,
    });
  } catch (error: any) {
    console.error('Error in /api/follow-up:', error);
    res.status(500).json({
      error: error.message || 'An error occurred during the follow-up consultation.',
    });
  }
});

// Mount Vite middleware in development or serve built files in production
async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LifePilot AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
