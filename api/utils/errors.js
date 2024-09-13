export function throwError(err) {
    console.error('Error occurred:', err);
    throw new Error(err);
}

export function sendError(res, err='') {
    return res.status(500).json({
        success: false,
        message: err.message || err
    });
}