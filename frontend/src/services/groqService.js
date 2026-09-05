import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama3-8b-8192';

/**
 * Generates exactly 15 multiple-choice questions for a given internship
 * based on its required skills.
 *
 * @param {string[]} requiredSkills  - e.g. ['React', 'Node.js', 'MongoDB']
 * @param {string}   role            - e.g. 'Full Stack Developer'
 * @param {string}   companyName     - e.g. 'TechNova'
 * @returns {Promise<Array<{question: string, options: string[], correctAnswer: string}>>}
 */
export async function generateAssessmentQuestions(requiredSkills, role, companyName) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      'VITE_GROQ_API_KEY is not set. Add it to your frontend/.env file.'
    );
  }

  const skillsText = requiredSkills.join(', ');

  const systemPrompt = `You are an expert technical interviewer. Your ONLY job is to output a valid JSON array — no markdown, no explanation, no preamble, no trailing text. Just raw JSON.

Generate exactly 15 multiple-choice questions to assess a candidate's skills for a "${role}" internship at "${companyName}".

The questions MUST cover these required skills: ${skillsText}.

Rules:
- Each question must be clear, concise, and technically accurate.
- Each question must have exactly 4 options labeled "A", "B", "C", "D" (the label is the full option string, e.g. "A. The virtual DOM").
- correctAnswer must be exactly ONE of: "A", "B", "C", or "D" — just the letter.
- Mix difficulty: include beginner, intermediate, and advanced questions.
- Spread questions across all the listed skills proportionally.

Output schema — return ONLY this JSON array with no other text:
[
  {
    "question": "What does the virtual DOM do in React?",
    "options": ["A. Directly manipulates the real DOM", "B. Creates a lightweight copy of the real DOM for diffing", "C. Replaces CSS with JavaScript", "D. Manages server-side rendering"],
    "correctAnswer": "B"
  }
]`;

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Generate the 15 MCQ assessment questions for the ${role} role. Required skills: ${skillsText}. Return ONLY the JSON array.`,
        },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const rawContent = response.data.choices[0]?.message?.content ?? '';

  // Strip any accidental markdown code fences
  const jsonText = rawContent
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  let questions;
  try {
    questions = JSON.parse(jsonText);
  } catch {
    throw new Error('Groq returned invalid JSON. Raw response: ' + rawContent.slice(0, 300));
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Groq returned an empty or invalid question array.');
  }

  // Ensure we have exactly 15 questions
  return questions.slice(0, 15);
}
