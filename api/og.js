export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      const fallbackHtml = await fetch(`https://${req.headers.host}/index.html`).then(r => r.text());
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(fallbackHtml);
    }

    // 1. Obtener los datos del negocio desde Supabase REST API
    const supabaseUrl = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
    const supabaseKey = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';
    
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/businesses?id=eq.${id}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const data = await dbResponse.json();
    const business = data && data.length > 0 ? data[0] : null;

    // 2. Obtener el HTML original de la app
    const htmlResponse = await fetch(`https://${req.headers.host}/index.html`);
    let html = await htmlResponse.text();

    // 3. Si el negocio existe, inyectar sus meta etiquetas (SEO / Open Graph)
    if (business) {
      const title = `${business.name} - DirectorioPY`;
      const description = `Encuentra a ${business.name} en DirectorioPY. ${business.description ? business.description.substring(0, 120) + '...' : ''}`;
      const image = business.image;
      
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      html = html.replace(/<meta name="title" content=".*?"\s*\/?>/i, `<meta name="title" content="${title}" />`);
      html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);
      html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
      html = html.replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${image}" />`);
      html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/?>/i, `<meta property="twitter:title" content="${title}" />`);
      html = html.replace(/<meta property="twitter:description" content=".*?"\s*\/?>/i, `<meta property="twitter:description" content="${description}" />`);
    }

    // 4. Devolver el HTML modificado al navegador/red social
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cachear por 1 minuto
    res.status(200).send(html);
  } catch (error) {
    console.error('OG API Error:', error);
    try {
      const fallbackHtml = await fetch(`https://${req.headers.host}/index.html`).then(r => r.text());
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(fallbackHtml);
    } catch(e) {
      res.status(500).send('Internal Server Error');
    }
  }
}
