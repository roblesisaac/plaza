import contact from '../controllers/contactControllers';
import checkIfHuman from '../middlewares/checkIfHuman';

export default (api) => {
    api.post(`/contact-form`, checkIfHuman, contact.sendContactEmail);
}