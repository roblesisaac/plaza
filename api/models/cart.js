import AmptModel from 'ampt-model';

const Cart = AmptModel(['cart', 'userid'], {
    userid: String,
    total: Number,
    items: [
        {
            _id: String,
            title: String,
            price: Number,
            qty: Number,
            saveForLater: Boolean,
            coverPhoto: String,
            productsInListing: [{
                sku: String,
                qty: Number
            }]
        },
    ],
    label1: 'total'
});

export default Cart;