import AmptModel from 'ampt-model';

const ZipCodes = AmptModel('zipcodes', {
    zipCode: (_, { item }) =>  item.zipCode || item.postal_code,
    city: {
        type: String,
        lowercase: true
    },
    state: {
        type: String,
        lowercase: true
    },
    label1: 'zipCode',
    label2: 'city',
    label3: 'state',
    label4: {
        name: 'state_city',
        concat: ['state', 'city']
    }
});

export default ZipCodes;