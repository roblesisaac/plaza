import { http } from "@ampt/sdk";

export default async (req, res) => {
    if (req.accepts('html')) {
        const stream = await http.node.readStaticFile('index.html');
        res.status(200).type('html');
        stream.pipe(res);
        return;
    }
    
    if (req.accepts('json')) {
        return res.status(404).json({ message: 'Not found' });
    }
    
    if (req.accepts('txt')) {
        return res.status(404).type('txt').send('Not found')
    }

    res.status(404).end()
}