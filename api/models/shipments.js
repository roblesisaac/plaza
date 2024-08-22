import AmptModel from 'ampt-model';

const shipments = AmptModel('shipments', {
    from: String,
    to: String,
    status: String
});

export default shipments;