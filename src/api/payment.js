// Midtrans payment service
const API_URL = 'http://localhost:3000/api';

export const createTransaction = async ({
  orderId,
  amount,
  customerName,
  customerEmail,
  description,
  serviceId
}) => {
  try {
    const response = await fetch(`${API_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        customer_details: {
          first_name: customerName,
          email: customerEmail
        },
        item_details: [{
          id: serviceId,
          price: amount,
          quantity: 1,
          name: description
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create transaction');
    }

    const data = await response.json();
    
    // Load Midtrans Snap
    window.snap.pay(data.token, {
      onSuccess: function(result) {
        console.log('Payment success:', result);
        return { success: true, data: result };
      },
      onPending: function(result) {
        console.log('Payment pending:', result);
        return { success: true, data: result, status: 'pending' };
      },
      onError: function(result) {
        console.error('Payment error:', result);
        throw new Error('Payment failed');
      },
      onClose: function() {
        console.log('Customer closed the popup without finishing the payment');
        throw new Error('Payment cancelled');
      }
    });

    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const checkTransactionStatus = async (orderId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/payment/status/${orderId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to check transaction status');
    }

    return response.json();
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
}; 