import fs from 'fs';

export default function base64Logo() {
    const png = fs.readFileSync('./public/logo.png', 'binary');
    const base64 = Buffer.from(png, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
}