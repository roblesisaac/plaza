export function throwError(err) {
    console.error('Error occurred:', err);
    throw new Error(err);
}

export function sendError(res, err='') {    
    console.error(err);
    return res.status(500).json(err.message || err);
}