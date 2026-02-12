import apiClient from './axiosApi';

const API_URL = '/api/payments';

export const initiatePayment = async ({ amount, phone, operator, transaction_id, description }) => {
  const response = await apiClient.post(`${API_URL}/initiate`, {
    amount,
    phone,
    operator,
    transaction_id,
    description
  });
  return response.data;
};

export const verifyPayment = async (transaction_id) => {
  const response = await apiClient.post(`${API_URL}/verify`, { transaction_id });
  return response.data;
};

export const paymentWebhook = async (paymentData) => {
  const response = await apiClient.post(`${API_URL}/webhook`, paymentData);
  return response.data;
};
