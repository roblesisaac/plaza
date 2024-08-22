import AmptModel from 'ampt-model';

const Products = AmptModel('products', {
    sku: String,
    line: String,
    images: [String],
    application: String,
    price: Number,
    inventory: Number,
    notes: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        weight: Number
    },
    label1: 'sku',
    label2: 'line'
});

export default Products;