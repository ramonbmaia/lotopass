// netlify/functions/get-lottery-data.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { game } = event.queryStringParameters;
    const officialApiUrl = `https://servicebus2.caixa.gov.br/portaldeloterias/api/${game}`;

    if (!game) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'O parâmetro "game" é obrigatório.' }),
        };
    }

    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        const response = await fetch(officialApiUrl, { headers: headers });
        
        if (!response.ok) {
            throw new Error(`Falha ao buscar dados para o jogo ${game} com status ${response.status}`);
        }
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Erro ao buscar dados da loteria:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Não foi possível buscar os dados da loteria.' }),
        };
    }
};