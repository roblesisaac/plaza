import AmptModel from 'ampt-model';

const boxes = AmptModel('boxes', {
    name: String,
    length: Number,
    width: Number,
    height: Number,
    suppliers: [
        {
            companyName: String,
            cost: Number,
            isDefault: Boolean,
            url: String,
            phone: Number
        }
    ]
});

export default boxes;