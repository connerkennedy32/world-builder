export async function POST(req: any) {
    const { prompt } = await req.json();

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: "When the user provides text input, respond only with bullet points of suggested alternative phrasings. Each bullet point should be a complete rephrasing that maintains the original tone and intent. Format in markdown using only bullet points." },
                    { role: 'user', content: prompt },
                ],
            }),
        });


        const data = await response.json();

        return Response.json(data.choices[0].message.content, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Error calling OpenAI API' }, { status: 500 });
    }
}