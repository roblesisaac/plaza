import { http } from '@ampt/sdk';

export async function redirectHtml(req, res) {
    if (req.accepts('html')) {
        res.status(200).set('Content-Type', 'text/html');
        const stream = await http.node.readStaticFile('index.html');
        return stream.pipe(res);
    }
    
    if (req.accepts('txt')) {
        return res.status(404).type('txt').send('Not found')
    }

    res.status(404).end()
}

export async function redirectJson(_, res) {
    res.status(404).json({ 
        success: false,
        message: 'Not found' 
    });
}