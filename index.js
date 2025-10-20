
import Fastify from 'fastify';
import { Jimp } from "jimp";
import fetch from 'node-fetch';

const fastify = Fastify({ logger: true });

async function getDiscordAvatar(userId) {
    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                'Authorization': `Bot MTQyODg1NTA0MTU2MDk0MDU3NQ.GnND9g.JUoXchr6FrwyPILz81dax-ctGMfah-NtZkQxzY`
            }
        });
        
        if (!response.ok) {
            throw new Error('Usuário não encontrado');
        }
        
        const user = await response.json();
        const avatarHash = user.avatar;
        const extension = avatarHash?.startsWith('a_') ? 'gif' : 'png';
        
        if (avatarHash) {
            return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=256`;
        } else {
            const defaultAvatarNumber = parseInt(user.discriminator) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        }
    } catch (error) {
        console.error(`Erro ao buscar avatar do usuário ${userId}:`, error);
        return 'https://cdn.discordapp.com/embed/avatars/0.png';
    }
}

fastify.get('/', async (request, reply) => {
    return reply.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API de Ranking - Documentação</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    padding: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                h1 {
                    color: #667eea;
                    margin-bottom: 10px;
                    font-size: 2.5em;
                }
                .subtitle {
                    color: #666;
                    margin-bottom: 30px;
                    font-size: 1.1em;
                }
                h2 {
                    color: #764ba2;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 10px;
                }
                .endpoint {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 4px solid #667eea;
                }
                .method {
                    display: inline-block;
                    background: #667eea;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 4px;
                    font-weight: bold;
                    margin-right: 10px;
                }
                .path {
                    font-family: 'Courier New', monospace;
                    color: #333;
                    font-size: 1.1em;
                }
                pre {
                    background: #2d2d2d;
                    color: #f8f8f2;
                    padding: 20px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 15px 0;
                }
                code {
                    font-family: 'Courier New', monospace;
                }
                .badge {
                    display: inline-block;
                    background: #e74c3c;
                    color: white;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 0.85em;
                    margin-left: 10px;
                }
                .success { background: #27ae60; }
                .info { background: #3498db; }
                ul {
                    margin-left: 30px;
                    margin-top: 10px;
                    line-height: 1.8;
                }
                .note {
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏆 API de Ranking</h1>
                <p class="subtitle">Gere imagens de ranking personalizadas com avatares do Discord</p>

                <h2>📋 Endpoints</h2>

                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/</span>
                    <p style="margin-top: 10px; color: #666;">Retorna esta documentação</p>
                </div>

                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/health</span>
                    <p style="margin-top: 10px; color: #666;">Verifica o status da API</p>
                </div>

                <div class="endpoint">
                    <span class="method">POST</span>
                    <span class="path">/rank</span>
                    <span class="badge">Principal</span>
                    <p style="margin-top: 10px; color: #666;">Gera uma imagem de ranking</p>
                </div>

                <h2>🚀 Como Usar</h2>

                <p><strong>Endpoint:</strong> <code>POST /rank</code></p>

                <p style="margin-top: 15px;"><strong>Body (JSON):</strong></p>
                <pre><code>{
  "idusers": ["142885504156094057", "123456789012345678", "987654321098765432"],
  "moedas": ["5000", "3500", "2000"]
}</code></pre>

                <p style="margin-top: 15px;"><strong>Resposta:</strong> Imagem PNG do ranking</p>

                <h2>📝 Parâmetros</h2>

                <ul>
                    <li><strong>idusers</strong> (array de strings): IDs dos usuários do Discord (máximo 5)</li>
                    <li><strong>moedas</strong> (array de strings): Quantidade de moedas de cada usuário</li>
                </ul>

                <div class="note">
                    <strong>⚠️ Importante:</strong>
                    <ul style="margin-top: 10px;">
                        <li>Máximo de <strong>5 usuários</strong> por requisição</li>
                        <li>Os arrays <code>idusers</code> e <code>moedas</code> devem ter o <strong>mesmo tamanho</strong></li>
                        <li>Os IDs devem ser válidos do Discord</li>
                        <li>O ranking é ordenado automaticamente por quantidade de moedas (maior → menor)</li>
                    </ul>
                </div>

                <h2>💡 Exemplos de Integração</h2>

                <p><strong>JavaScript (fetch):</strong></p>
                <pre><code>const response = await fetch('https://seu-repl-url.replit.dev/rank', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idusers: ['142885504156094057', '123456789012345678'],
    moedas: ['1000', '750']
  })
});

const imageBlob = await response.blob();</code></pre>

                <p style="margin-top: 20px;"><strong>Discord.js:</strong></p>
                <pre><code>const axios = require('axios');
const { AttachmentBuilder } = require('discord.js');

const response = await axios.post('https://seu-repl-url.replit.dev/rank', {
  idusers: ['123456789', '987654321'],
  moedas: ['2500', '1800']
}, { responseType: 'arraybuffer' });

const attachment = new AttachmentBuilder(response.data, { name: 'ranking.png' });
await message.reply({ files: [attachment] });</code></pre>

                <p style="margin-top: 20px;"><strong>Python (requests):</strong></p>
                <pre><code>import requests

response = requests.post('https://seu-repl-url.replit.dev/rank', json={
    'idusers': ['123456789', '987654321'],
    'moedas': ['1500', '1200']
})

with open('ranking.png', 'wb') as f:
    f.write(response.content)</code></pre>

                <h2>🎨 Personalização</h2>
                <p>A imagem de fundo pode ser customizada substituindo o arquivo <code>assets/background.jpeg</code></p>

                <h2>📊 Status Codes</h2>
                <ul>
                    <li><span class="badge success">200</span> Imagem gerada com sucesso</li>
                    <li><span class="badge">400</span> Parâmetros inválidos</li>
                    <li><span class="badge">500</span> Erro interno do servidor</li>
                </ul>
            </div>
        </body>
        </html>
    `);
});

fastify.post('/rank', async (request, reply) => {
    try {
        const { idusers, moedas } = request.body;

        if (!idusers || !Array.isArray(idusers)) {
            return reply.code(400).send({ error: 'idusers deve ser um array' });
        }

        if (!moedas || !Array.isArray(moedas)) {
            return reply.code(400).send({ error: 'moedas deve ser um array' });
        }

        if (idusers.length > 5) {
            return reply.code(400).send({ error: 'Máximo de 5 usuários permitidos' });
        }

        if (idusers.length !== moedas.length) {
            return reply.code(400).send({ error: 'idusers e moedas devem ter o mesmo tamanho' });
        }

        const ranking = idusers.map((id, index) => ({
            id: id,
            moedas: parseFloat(moedas[index]) || 0
        }));

        ranking.sort((a, b) => b.moedas - a.moedas);

        const background = await Jimp.read('./assets/background.jpeg');

        const xPosition = 10;
        let yPosition = 15;
        const spacing = 120;

        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        for (let i = 0; i < ranking.length; i++) {
            const user = ranking[i];
            
            try {
                const avatarUrl = await getDiscordAvatar(user.id);
                const avatar = await Jimp.read(avatarUrl);
                
                avatar.resize({ w: 100, h: 100 });
                avatar.circle();
                
                background.composite(avatar, xPosition, yPosition, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 1,
                    opacityDest: 1
                });

                const rankText = `#${i + 1} ID: ${user.id}`;
                const moedasText = `${user.moedas} moedas`;
                
                background.print({ font, x: xPosition + 110, y: yPosition + 10, text: rankText });
                background.print({ font, x: xPosition + 110, y: yPosition + 50, text: moedasText });
                
            } catch (error) {
                console.error(`Erro ao buscar usuário ${user.id}:`, error);
                background.print({ 
                    font, 
                    x: xPosition + 110, 
                    y: yPosition + 30, 
                    text: `#${i + 1} ID: ${user.id} - ${user.moedas} moedas` 
                });
            }
            
            yPosition += spacing;
        }

        const buffer = await background.getBuffer("image/png");

        reply
            .header('Content-Type', 'image/png')
            .send(buffer);

    } catch (error) {
        console.error('Erro ao gerar ranking:', error);
        reply.code(500).send({ error: 'Erro ao gerar imagem de ranking' });
    }
});

fastify.get('/health', async (request, reply) => {
    return { 
        status: 'ok', 
        message: 'API de Ranking funcionando!',
        endpoints: {
            'GET /': 'Documentação da API',
            'POST /rank': 'Gera imagem de ranking',
            'GET /health': 'Status da API'
        }
    };
});

export default fastify;
