import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function chat(messages: { role: string; content: string }[]) {
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('OPENAI_API_KEY_MISSING');
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
    });

    const content = completion.choices[0].message.content || '';
    return {
      content,
      code: extractCodeFromMessage(content)
    };
  } catch (error: any) {
    if (error?.error?.code === 'invalid_api_key') {
      throw new Error('INVALID_API_KEY');
    }
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

function extractCodeFromMessage(message: string) {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/;
  const match = message.match(codeBlockRegex);
  return match ? match[1] : null;
}</content>