import { ref } from 'vue';
import useApi from './useApi';
import Braintree from 'braintree-web/client';
import { useUserStore } from '../stores/userStore';
import HostedFields from 'braintree-web/hosted-fields';
import DataCollector from 'braintree-web/data-collector';

const { remove, get, post, put } = useApi();

const allFieldsValid = ref(false);
const clientToken = ref(null);
const clientInstance = ref(null);
const dataCollectorInstance = ref(null);
const hostedFieldsInstance = ref(null);
const savedPaymentMethods = ref([]);
const selectedPaymentMethod = ref(null);
const alreadyLoadedPaymentMethods = ref(false);

export default function() {
    async function chargePayment(transactionId) {
        try {
            await post('payments/capture-transaction', { transactionId });
        } catch (err) {
            console.error('Error charging payment:', err);
            throw new Error('Error charging payment. Please try again.');
        }
    }

    function clearHostedFieldsContainers(fields) {
        Object.values(fields).forEach(field => {
            const container = document.querySelector(field.selector);
            if (container) {
                container.innerHTML = '';
            }
        });
    }

    async function createDataCollector() {
        dataCollectorInstance.value = await DataCollector.create({
            client: clientInstance.value,
            kount: true
        });
    }

    async function deletePaymentMethod(methodId) {
        try {
            await remove(`payments/${methodId}`);
            savedPaymentMethods.value = savedPaymentMethods.value.filter(pm => pm.methodId !== methodId);
        } catch (err) {
            console.error('Error deleting payment method:', err);
            throw new Error('Error deleting payment method. Please try again.');
        }
    }
    
    async function init() {
        await initClientInstance();
        await createDataCollector();
        await loadUserPaymentMethods();
    }
    
    async function initClientInstance() {
        if(clientInstance.value === 'loading...') {
            while(clientInstance.value === 'loading...') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        clientInstance.value = 'loading...';

        try {
            const authorization = await generateClientToken();
            clientInstance.value = await Braintree.create({ authorization });
            
            return clientInstance.value;
        } catch (err) {
            clientInstance.value = false;
            throw new Error(err);
        }
    }

    async function initHostedFields({ styles, fields }) {
        await initClientInstance();
        await tearDownHostedFields(fields);

        hostedFieldsInstance.value = await HostedFields.create({
            client: clientInstance.value,
            styles,
            fields
        });

        setupHostedFieldsValidityListener();
    }
    
    async function generateClientToken() {
        try {
            const userId = useUserStore().userData?._id;
            clientToken.value = await get(`payments/client-token/${userId || ''}`);

            return clientToken.value;
        } catch (err) {
            throw new Error(err);
        }
    }
    
    async function loadUserPaymentMethods() {
        if(alreadyLoadedPaymentMethods.value || useUserStore().isLoggedOut) {
            return savedPaymentMethods.value;
        } 

        try {
            const paymentMethods = await get('payments/get-methods');
            savedPaymentMethods.value = paymentMethods;
            alreadyLoadedPaymentMethods.value = true;
            return paymentMethods;
        } catch (err) {
            console.error('Error loading payment methods:', err);
            throw new Error('Error loading payment methods. Please try again.');
        }
    }

    async function makeDefaultPaymentMethod(methodId) {
        try {
            const paymentMethod = await put('payments/make-default', { methodId });

            savedPaymentMethods.value = savedPaymentMethods.value.map(pm => {
                if (pm.methodId === methodId) {
                    return { ...pm, default: true };
                }
                return { ...pm, default: false };
            });

            return paymentMethod;
        } catch (error) {
            console.error('Error updating payment method:', error);
            throw new Error('Error updating payment method. Please try again.');
        }
    }
    
    async function savePaymentMethodToServer(paymentMethod) {
        try {
            const savedPaymentMethod = await post('payments/save-method', paymentMethod);
            return savedPaymentMethod;
        } catch (error) {
            console.error('Error saving payment method to server:', error);
            throw new Error('Error saving payment method to server. Please try again.');
        }
    }
    
    async function submitPayment(amount, method, { streetAddress, zipCode }) {
        const paymentMethodToken = method.nonce || method.methodId;
        
        if (!paymentMethodToken) {
            throw new Error('Payment method nonce is missing.');
        }
        
        try {
            const payment = await post('/checkout', {
                method: paymentMethodToken,
                deviceData: dataCollectorInstance.value.deviceData,
                streetAddress,
                zipCode,
                amount
            });
            
            return payment;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    async function setupHostedFieldsValidityListener() {
        hostedFieldsInstance.value.on('validityChange', (event) => {
            const { fields } = event;
            const updatedFields = {};

            Object.keys(fields).forEach((field) => {
                updatedFields[field] = fields[field].isValid;
            });

            allFieldsValid.value = Object.values(updatedFields).every(field => field);
        });
    }

    async function tearDownHostedFields(fields) {
        if (!hostedFieldsInstance.value) {
            return;
        }
    
        try {
            clearHostedFieldsContainers(fields);
            await hostedFieldsInstance.value.teardown();
            hostedFieldsInstance.value = null;
        } catch (err) {
            console.error('Error tearing down Braintree Hosted Fields:', err);
        }
    }
    
    async function tokenizePayment(shouldSavePayment) {
        if (!allFieldsValid.value) {
            throw new Error('Please fill out required fields.');
        }


        if (!hostedFieldsInstance.value || !dataCollectorInstance.value) {
            throw new Error('Braintree not fully initialized');
        }
        
        try {
            const { nonce, details } = await hostedFieldsInstance.value.tokenize();

            const tokenizedPaymentMethod = shouldSavePayment
                ? await savePaymentMethodToServer({ nonce })
                : {
                    nonce,
                    brandCode: details.cardType, 
                    last4: details.lastFour, 
                    methodId: null,
                    default: false,
                    expirationMonth: details.expirationMonth, 
                    expirationYear: details.expirationYear
                };
            
            savedPaymentMethods.value.push(tokenizedPaymentMethod);
            selectedPaymentMethod.value = tokenizedPaymentMethod;
            
            return tokenizedPaymentMethod;
        } catch (error) {
            if (error.code === 'HOSTED_FIELDS_FIELDS_EMPTY') {
                throw new Error('Hosted fields incomplete. Please fill out all required fields before continuing.');
            } else {
                console.error('Error in tokenizePayment:', error);
                throw new Error('An error occurred while saving the payment method. Please try again.');
            }
        }
    }
    
    return {
        chargePayment,
        dataCollectorInstance,
        deletePaymentMethod,
        init,
        initHostedFields,
        loadUserPaymentMethods,
        makeDefaultPaymentMethod,
        savedPaymentMethods,
        selectedPaymentMethod,
        submitPayment,
        tokenizePayment
    };
}