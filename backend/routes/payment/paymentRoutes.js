const express = require('express');
const router = express.Router();
const midtransClient = require('midtrans-client');

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY
});

// Create transaction
router.post('/create', async (req, res) => {
  try {
    console.log('Creating transaction:', req.body);
    
    const {
      transaction_details,
      customer_details,
      item_details
    } = req.body;

    const parameter = {
      transaction_details: {
        order_id: transaction_details.order_id,
        gross_amount: transaction_details.gross_amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: customer_details.first_name,
        email: customer_details.email
      },
      item_details: item_details
    };

    console.log('Midtrans parameter:', parameter);

    const transaction = await snap.createTransaction(parameter);
    console.log('Transaction created:', transaction);
    
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Handle notification from Midtrans
router.post('/notification', async (req, res) => {
  try {
    const notification = await snap.transaction.notification(req.body);
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}`);
    console.log(`Transaction status: ${transactionStatus}`);
    console.log(`Fraud status: ${fraudStatus}`);

    // Sample transaction status handling
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        // TODO: handle challenge transaction
        console.log('Transaction challenged');
      } else if (fraudStatus === 'accept') {
        // TODO: handle successful transaction
        console.log('Transaction successful');
      }
    } else if (transactionStatus === 'settlement') {
      // TODO: handle successful transaction
      console.log('Transaction settled');
    } else if (transactionStatus === 'cancel' ||
               transactionStatus === 'deny' ||
               transactionStatus === 'expire') {
      // TODO: handle failed transaction
      console.log('Transaction failed');
    } else if (transactionStatus === 'pending') {
      // TODO: handle pending transaction
      console.log('Transaction pending');
    }

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Check transaction status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const transactionStatus = await snap.transaction.status(orderId);
    res.json(transactionStatus);
  } catch (error) {
    console.error('Error checking transaction status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router; 