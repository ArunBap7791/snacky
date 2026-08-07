'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

export async function createRazorpayOrder(amountInPaise: number) {
  try {
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };
    
    // Check if we are running with mock credentials and skip actual API call
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'mock_key_id' || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      return { id: `order_mock_${Date.now()}`, amount: options.amount, currency: options.currency };
    }
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  // Mock verification bypass
  if (razorpayOrderId.startsWith('order_mock_')) {
    return true;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');

  if (digest === razorpaySignature) {
    return true;
  }
  return false;
}
