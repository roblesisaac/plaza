import AmptModel from 'ampt-model';

const addressSchema = {
    label: String, // work, home, etc
    street: String,
    city: String,
    zip: String,
    phone: Number,
    notes: String,
    country: String,
    isVerified: String
};

export default AmptModel(['addresses', 'userid'], addressSchema);