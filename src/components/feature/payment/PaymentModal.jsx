import { useState } from 'react';
import { createTransaction } from '../../../api/payment';

const PaymentModal = ({ isOpen, onClose, orderData }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await createTransaction({
        orderId: orderData.orderId,
        amount: orderData.amount,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        description: orderData.description,
        serviceId: orderData.serviceId
      });

      // Midtrans Snap will handle the rest
      console.log('Payment initiated:', result);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>

          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Order ID</label>
              <div className="text-white">{orderData.orderId}</div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Service</label>
              <div className="text-white">{orderData.description}</div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Amount</label>
              <div className="text-white">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(orderData.amount)}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Customer</label>
              <div className="text-white">{orderData.customerName}</div>
              <div className="text-gray-400 text-sm">{orderData.customerEmail}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePayment}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 