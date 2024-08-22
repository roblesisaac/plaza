import cart from '../controllers/cartControllers';

export default (api) => {
    api.get('/cart', cart.getCart);
    api.post('/cart', cart.saveCart);
}