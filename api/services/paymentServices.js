import braintree from 'braintree';
import Users from '../models/users';
import { decrypt, encrypt } from '../utils/encryption';
import { throwError } from '../utils/errors';
import config from '../config/environment';

class BraintreeService {
    constructor() {
        this.gateway = null;
    }

    initGateway() {
        if (!this.gateway) {
            this.gateway = new braintree.BraintreeGateway({
                environment: braintree.Environment.Sandbox,
                merchantId: config.PAYMENTS.ID,
                publicKey: config.PAYMENTS.PUBLIC_SAND,
                privateKey: config.PAYMENTS.PRIVATE_SAND
            });
        }
    }

    async authorizePayment({ method, amount, streetAddress, postalCode, deviceData, user }) {
        this.initGateway();

        const customer = await this.findOrCreateCustomer(user);
        let nonce = method.nonce;

        if(!nonce) {
            const { paymentMethodNonce } = await this.gateway.paymentMethodNonce.create(method.methodId);
            nonce = paymentMethodNonce.nonce;
        }

        const transactionRequest = {
            amount: amount.toFixed(2),
            paymentMethodNonce: nonce,
            customerId: customer.id,
            options: {
                submitForSettlement: false
            },
            shipping: {
                streetAddress: streetAddress,
                postalCode: postalCode
            }
        };

        if (deviceData) {
            transactionRequest.deviceData = deviceData;
        }

        try {
            const result = await this.gateway.transaction.sale(transactionRequest);
            if (result.success) {
                return result.transaction;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throw new Error(`Transaction authorization failed: ${error.message}`);
        }
    }

    async captureTransaction(transactionId) {
        this.initGateway();

        try {
            const result = await this.gateway.transaction.submitForSettlement(transactionId);
            if (result.success) {
                return result.transaction;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throw new Error(`Transaction capture failed: ${error.message}`);
        }
    }

    async createCustomer(email) {
        if (!email) {
            throwError(`Missing required parameter: email.`);
        }

        this.initGateway();

        try {
            const result = await this.gateway.customer.create({
                email: email
            });

            if (result.success) {
                const customer = result.customer;
                const userUpdates = { 
                    brainId: encrypt(customer.id) 
                };

                const updatedUser = await Users.updateUser(email, userUpdates);

                return customer;
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            throwError(err);
        }
    }

    async deletePaymentMethod(token) {
        this.initGateway();

        try {
            const result = await this.gateway.paymentMethod.delete(token);
            return result;
        } catch (error) {
            throwError(error);
        }
    }

    async findOrCreateCustomer(user) {
        this.initGateway();

        if (!user.brainId) {
            return this.createCustomer(user.email);
        }
        
        try {
            const customerId = decrypt(user.brainId);
            const result = await this.gateway.customer.find(customerId);
            return result;
        } catch (err) {
            throwError(err);
        }
    }

    async generateClientToken() {
        this.initGateway();
        
        try {
            const result = await this.gateway.clientToken.generate();
            return result.clientToken;
        } catch (error) {
            throwError(error);
        }
    }

    async getCustomerPaymentMethods(user) {
        if (!user?.brainId) {
            return [];
        }

        this.initGateway();

        try {
            const customerId = decrypt(user.brainId);
            const customer = await this.gateway.customer.find(customerId);
            
            return customer.paymentMethods.map(method => ({
                brandCode: method.cardType,
                default: method.default,
                expirationMonth: method.expirationMonth,
                expirationYear: method.expirationYear,
                last4: method.last4,
                methodId: method.token
            }));
        } catch (error) {
            throwError(error);
        }
    }

    async makeDefaultPaymentMethod(methodId) {
        this.initGateway();

        try {
            const result = await this.gateway.paymentMethod.update(methodId, {
                options: {
                    makeDefault: true
                }
            });

            if (result.success) {
                const paymentMethod = result.paymentMethod;
                return {
                    methodId: paymentMethod.token,
                    default: result.default,
                    brandCode: paymentMethod.cardType,
                    last4: paymentMethod.last4,
                    expirationMonth: paymentMethod.expirationMonth,
                    expirationYear: paymentMethod.expirationYear
                };
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throwError(error);
        }
    }

    async refundPayment(transactionId, amount = null) {
        this.initGateway();

        try {
            let result;
            if (amount) {
                result = await this.gateway.transaction.refund(transactionId, amount.toFixed(2));
            } else {
                result = await this.gateway.transaction.refund(transactionId);
            }

            if (result.success) {
                return result.transaction;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throw new Error(`Refund failed: ${error.message}`);
        }
    }

    async savePaymentMethod(nonce, user) {
        this.initGateway();

        let customerId;

        if (!user.brainId) {
            const customer = await this.createCustomer(user.email);
            customerId = customer.id;
        } else {
            customerId = decrypt(user.brainId);
        }

        try {
            const result = await this.gateway.paymentMethod.create({
                customerId: customerId,
                paymentMethodNonce: nonce
            });

            if (result.success) {
                const paymentMethod = result.paymentMethod;
                return {
                    methodId: paymentMethod.token,
                    brandCode: paymentMethod.cardType,
                    last4: paymentMethod.last4,
                    expirationMonth: paymentMethod.expirationMonth,
                    expirationYear: paymentMethod.expirationYear
                };
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throwError(error);
        }
    }

    async voidTransaction(transactionId) {
        this.initGateway();

        try {
            const result = await this.gateway.transaction.void(transactionId);

            if (result.success) {
                return result.transaction;
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            throw new Error(`Transaction void failed: ${err.message}`);
        }
    }
}

export default new BraintreeService();