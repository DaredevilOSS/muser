export async function GET() {
  return Response.json({
    models: [
      'GPT-4o',
      'Claude 3 Opus',
      'Gemini 1.5 Pro',
      'Llama-3 70B',
      'Mistral Large'
    ]
  });
}
