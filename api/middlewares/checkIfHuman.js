import checkIfHuman from '../services/recaptchaServices';

export default async function({ body }, res, next) {

    const isHuman = await checkIfHuman(body?.recaptchaToken);
    
    if(!isHuman.success) {
        res.json({
            success: false,
            message: isHuman.errorMessage
        });
    }
    
    next();
}