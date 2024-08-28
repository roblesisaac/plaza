import AmptModel from '../utils/amptModel';
import { generateRandomNumber } from '../utils/tools';
import { encrypt, encryptWithKey } from '../utils/encryption';

const orderSchema = {
    orderId: {
        set: () => generateRandomNumber()
    },
    userid: String,
    orderItems: [
        {
            productsInListing: [{
                sku: String,
                qty: Number
            }],
            qty: Number,
            title: String,
            _id: String
        }
    ],
    shippingAddress: {
        customerName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    totalPrice: num => Number(num).toFixed(2),
    contactEmail: String,
    notes: String,
    purchasedLabelUrl: String,
    trackingUrl: String,
    status: {
        type: String,
        enum: [ 'PENDING', 'ON_HOLD', 'CANCELLED', 'SHIPPED', 'DELIVERED', 'RETURNED' ]
    },
    cancellationReason: String,
    paymentTransactionId: {
        set: (transactionId, { item }) => {
            const { encryptionKey } = item.user;
            const userEncryption = encryptWithKey(transactionId, encryptionKey);

            return encrypt(userEncryption);
        }
    },
    paymentStatus: {
        type: String,
        enum: ['AUTHORIZED', 'VOIDED', 'CAPTURED', 'REFUNDED', 'PARTIALLY_REFUNDED']
    },
    paidAt: String,
    deliveredAt: String,
    shippingCost: Number,
    label1: 'userid',
    label2: 'orderId',
    label3: 'status',
    label4: {
        name: 'address',
        computed: item => item.shippingAddress.street
    }
}

export default AmptModel('orders', orderSchema);