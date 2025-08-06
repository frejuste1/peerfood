import axios from 'axios';
import Payment from '../Models/Payment.js';
import Order from '../Models/Order.js';
import logger from '../Utils/Logger.js';

class PaymentService {
    constructor() {
        this.providers = {
            'MTN MoMo': {
                apiUrl: process.env.MTN_MOMO_API_URL,
                apiKey: process.env.MTN_MOMO_API_KEY,
                subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY
            },
            'Orange Money': {
                apiUrl: process.env.ORANGE_MONEY_API_URL,
                apiKey: process.env.ORANGE_MONEY_API_KEY,
                merchantId: process.env.ORANGE_MONEY_MERCHANT_ID
            },
            'Wave': {
                apiUrl: process.env.WAVE_API_URL || 'https://api.wave.com/v1',
                apiKey: process.env.WAVE_API_KEY
            }
        };
    }

    /**
     * Initier un paiement mobile money
     * @param {Object} paymentData - Données du paiement
     * @returns {Promise<Object>} Résultat de l'initiation du paiement
     */
    async initiatePayment(paymentData) {
        const { method, amount, phone, orderId } = paymentData;
        
        try {
            // Générer un code de paiement unique
            const paymentCount = await Payment.Count();
            const payCode = `PAY${(paymentCount + 1).toString().padStart(4, '0')}`;

            // Créer l'enregistrement de paiement
            const payment = {
                payCode,
                orderId,
                method,
                amount,
                statut: 'Waiting'
            };

            await Payment.Create(payment);

            let result;
            switch (method) {
                case 'MTN MoMo':
                    result = await this.initiateMTNPayment(payCode, amount, phone);
                    break;
                case 'Orange Money':
                    result = await this.initiateOrangePayment(payCode, amount, phone);
                    break;
                case 'Wave':
                    result = await this.initiateWavePayment(payCode, amount, phone);
                    break;
                default:
                    throw new Error('Méthode de paiement non supportée');
            }

            // Mettre à jour le paiement avec les informations de la transaction
            await Payment.Update(payCode, {
                transactionNumber: result.transactionId,
                statut: result.status || 'Waiting'
            });

            return {
                payCode,
                transactionId: result.transactionId,
                status: result.status,
                message: result.message
            };

        } catch (error) {
            logger.error('Erreur lors de l\'initiation du paiement:', error);
            throw error;
        }
    }

    /**
     * Initier un paiement MTN Mobile Money
     */
    async initiateMTNPayment(payCode, amount, phone) {
        const provider = this.providers['MTN MoMo'];
        
        try {
            const response = await axios.post(`${provider.apiUrl}/collection/v1_0/requesttopay`, {
                amount: amount.toString(),
                currency: 'XOF',
                externalId: payCode,
                payer: {
                    partyIdType: 'MSISDN',
                    partyId: phone
                },
                payerMessage: 'Paiement commande PeerFood',
                payeeNote: `Commande ${payCode}`
            }, {
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'X-Reference-Id': payCode,
                    'X-Target-Environment': process.env.MTN_ENVIRONMENT || 'sandbox',
                    'Ocp-Apim-Subscription-Key': provider.subscriptionKey,
                    'Content-Type': 'application/json'
                }
            });

            return {
                transactionId: payCode,
                status: 'Waiting',
                message: 'Paiement initié avec succès'
            };
        } catch (error) {
            logger.error('Erreur MTN MoMo:', error.response?.data || error.message);
            throw new Error('Erreur lors de l\'initiation du paiement MTN MoMo');
        }
    }

    /**
     * Initier un paiement Orange Money
     */
    async initiateOrangePayment(payCode, amount, phone) {
        const provider = this.providers['Orange Money'];
        
        try {
            const response = await axios.post(`${provider.apiUrl}/orange-money-webpay/dev/v1/webpayment`, {
                merchant_key: provider.merchantId,
                currency: 'XOF',
                order_id: payCode,
                amount: amount,
                return_url: `${process.env.FRONTEND_URL}/payment/success`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/error`,
                notif_url: `${process.env.BACKEND_URL}/api/payments/webhook/orange`,
                lang: 'fr',
                reference: payCode
            }, {
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                transactionId: response.data.pay_token,
                status: 'Waiting',
                message: 'Paiement initié avec succès',
                paymentUrl: response.data.payment_url
            };
        } catch (error) {
            logger.error('Erreur Orange Money:', error.response?.data || error.message);
            throw new Error('Erreur lors de l\'initiation du paiement Orange Money');
        }
    }

    /**
     * Initier un paiement Wave
     */
    async initiateWavePayment(payCode, amount, phone) {
        const provider = this.providers['Wave'];
        
        try {
            const response = await axios.post(`${provider.apiUrl}/checkout/sessions`, {
                amount: amount.toString(),
                currency: 'XOF',
                error_url: `${process.env.FRONTEND_URL}/payment/error`,
                success_url: `${process.env.FRONTEND_URL}/payment/success`,
                metadata: {
                    order_id: payCode,
                    customer_phone: phone
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                transactionId: response.data.id,
                status: 'Waiting',
                message: 'Paiement initié avec succès',
                paymentUrl: response.data.wave_launch_url
            };
        } catch (error) {
            logger.error('Erreur Wave:', error.response?.data || error.message);
            throw new Error('Erreur lors de l\'initiation du paiement Wave');
        }
    }

    /**
     * Vérifier le statut d'un paiement
     * @param {string} payCode - Code du paiement
     * @returns {Promise<Object>} Statut du paiement
     */
    async checkPaymentStatus(payCode) {
        try {
            const payment = await Payment.findById(payCode);
            if (!payment) {
                throw new Error('Paiement non trouvé');
            }

            let status;
            switch (payment.method) {
                case 'MTN MoMo':
                    status = await this.checkMTNStatus(payment.transactionNumber);
                    break;
                case 'Orange Money':
                    status = await this.checkOrangeStatus(payment.transactionNumber);
                    break;
                case 'Wave':
                    status = await this.checkWaveStatus(payment.transactionNumber);
                    break;
                default:
                    throw new Error('Méthode de paiement non supportée');
            }

            // Mettre à jour le statut du paiement si nécessaire
            if (status.status !== payment.statut) {
                await Payment.Update(payCode, {
                    statut: status.status,
                    paymentDate: status.status === 'Completed' ? new Date() : null
                });

                // Mettre à jour le statut de la commande si le paiement est complété
                if (status.status === 'Completed') {
                    await Order.Update(payment.orderId, { statut: 'Paid' });
                }
            }

            return status;
        } catch (error) {
            logger.error('Erreur lors de la vérification du statut:', error);
            throw error;
        }
    }

    /**
     * Vérifier le statut MTN MoMo
     */
    async checkMTNStatus(transactionId) {
        const provider = this.providers['MTN MoMo'];
        
        try {
            const response = await axios.get(`${provider.apiUrl}/collection/v1_0/requesttopay/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'X-Target-Environment': process.env.MTN_ENVIRONMENT || 'sandbox',
                    'Ocp-Apim-Subscription-Key': provider.subscriptionKey
                }
            });

            const mtnStatus = response.data.status;
            let status;
            
            switch (mtnStatus) {
                case 'SUCCESSFUL':
                    status = 'Completed';
                    break;
                case 'FAILED':
                    status = 'Failed';
                    break;
                default:
                    status = 'Waiting';
            }

            return { status, details: response.data };
        } catch (error) {
            logger.error('Erreur vérification MTN:', error.response?.data || error.message);
            return { status: 'Failed', error: error.message };
        }
    }

    /**
     * Vérifier le statut Orange Money
     */
    async checkOrangeStatus(transactionId) {
        const provider = this.providers['Orange Money'];
        
        try {
            const response = await axios.get(`${provider.apiUrl}/orange-money-webpay/dev/v1/transactionstatus`, {
                params: {
                    order_id: transactionId,
                    amount: '', // À remplir selon l'API Orange
                    pay_token: transactionId
                },
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const orangeStatus = response.data.status;
            let status;
            
            switch (orangeStatus) {
                case 'SUCCESS':
                    status = 'Completed';
                    break;
                case 'FAILED':
                    status = 'Failed';
                    break;
                default:
                    status = 'Waiting';
            }

            return { status, details: response.data };
        } catch (error) {
            logger.error('Erreur vérification Orange:', error.response?.data || error.message);
            return { status: 'Failed', error: error.message };
        }
    }

    /**
     * Vérifier le statut Wave
     */
    async checkWaveStatus(transactionId) {
        const provider = this.providers['Wave'];
        
        try {
            const response = await axios.get(`${provider.apiUrl}/checkout/sessions/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${provider.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const waveStatus = response.data.status;
            let status;
            
            switch (waveStatus) {
                case 'complete':
                    status = 'Completed';
                    break;
                case 'cancelled':
                case 'failed':
                    status = 'Failed';
                    break;
                default:
                    status = 'Waiting';
            }

            return { status, details: response.data };
        } catch (error) {
            logger.error('Erreur vérification Wave:', error.response?.data || error.message);
            return { status: 'Failed', error: error.message };
        }
    }

    /**
     * Traiter les webhooks de paiement
     * @param {string} provider - Fournisseur de paiement
     * @param {Object} webhookData - Données du webhook
     */
    async handleWebhook(provider, webhookData) {
        try {
            logger.info(`Webhook reçu de ${provider}:`, webhookData);

            let payCode, status;

            switch (provider) {
                case 'mtn':
                    payCode = webhookData.externalId;
                    status = webhookData.status === 'SUCCESSFUL' ? 'Completed' : 'Failed';
                    break;
                case 'orange':
                    payCode = webhookData.order_id;
                    status = webhookData.status === 'SUCCESS' ? 'Completed' : 'Failed';
                    break;
                case 'wave':
                    payCode = webhookData.metadata?.order_id;
                    status = webhookData.status === 'complete' ? 'Completed' : 'Failed';
                    break;
                default:
                    throw new Error('Fournisseur de webhook non reconnu');
            }

            if (!payCode) {
                throw new Error('Code de paiement manquant dans le webhook');
            }

            // Mettre à jour le paiement
            await Payment.Update(payCode, {
                statut: status,
                paymentDate: status === 'Completed' ? new Date() : null,
                transactionNumber: webhookData.transactionId || webhookData.id
            });

            // Mettre à jour la commande si le paiement est complété
            if (status === 'Completed') {
                const payment = await Payment.findById(payCode);
                if (payment) {
                    await Order.Update(payment.orderId, { statut: 'Paid' });
                }
            }

            logger.info(`Paiement ${payCode} mis à jour: ${status}`);
            return { success: true, payCode, status };

        } catch (error) {
            logger.error('Erreur lors du traitement du webhook:', error);
            throw error;
        }
    }

    /**
     * Obtenir les statistiques de paiement
     * @param {Object} filters - Filtres pour les statistiques
     * @returns {Promise<Object>} Statistiques de paiement
     */
    async getPaymentStats(filters = {}) {
        try {
            const { startDate, endDate, method } = filters;
            
            // Ici vous pourriez implémenter des requêtes SQL complexes
            // pour obtenir des statistiques détaillées
            
            const stats = {
                totalPayments: await Payment.Count(),
                completedPayments: 0, // À implémenter avec une requête SQL
                failedPayments: 0,    // À implémenter avec une requête SQL
                totalAmount: 0,       // À implémenter avec une requête SQL
                byMethod: {
                    'MTN MoMo': 0,
                    'Orange Money': 0,
                    'Wave': 0
                }
            };

            return stats;
        } catch (error) {
            logger.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }

    /**
     * Relancer un paiement échoué
     * @param {string} payCode - Code du paiement
     * @returns {Promise<Object>} Résultat de la relance
     */
    async retryPayment(payCode) {
        try {
            const payment = await Payment.findById(payCode);
            if (!payment) {
                throw new Error('Paiement non trouvé');
            }

            if (payment.statut === 'Completed') {
                throw new Error('Le paiement a déjà été complété');
            }

            // Réinitier le paiement avec les mêmes paramètres
            const order = await Order.findById(payment.orderId);
            if (!order) {
                throw new Error('Commande associée non trouvée');
            }

            return await this.initiatePayment({
                method: payment.method,
                amount: payment.amount,
                phone: order.paymentPhone,
                orderId: payment.orderId
            });

        } catch (error) {
            logger.error('Erreur lors de la relance du paiement:', error);
            throw error;
        }
    }
}

export default PaymentService;