// netlify/edge-functions/get-lottery-data-edge.js
export default async (request, context) => {
    try {
        const url = new URL(request.url);
        const game = url.searchParams.get('game');

        if (!game) {
            return new Response(JSON.stringify({ error: 'O parâmetro "game" é obrigatório.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const officialApiUrl = `https://servicebus2.caixa.gov.br/portaldeloterias/api/${game}`;
        
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.loteriasonline.caixa.gov.br/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        const response = await fetch(officialApiUrl, { headers });

        if (!response.ok) {
            // Apenas logamos o erro no console do Netlify, sem expor detalhes ao usuário.
            console.error(`Falha ao buscar dados para o jogo ${game} com status ${response.status}`);
            throw new Error('Falha na API da Caixa');
        }
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });

    } catch (error) {
        console.error('Erro na Edge Function:', error.message);
        return new Response(JSON.stringify({ error: 'Não foi possível buscar os dados da loteria.' }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
    }
};

export const config = {
    path: "/.netlify/functions/get-lottery-data"
};