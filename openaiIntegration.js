const fetch = require('node-fetch');

async function queryChatGPT(parsedData, apiKey, apiUrl) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: parsedData,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        throw new Error(`OpenAI API Error: ${error.message}`);
    }
}

module.exports = queryChatGPT;
