import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiSmartphone, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PaymentModal({ isOpen, onClose, amount, onPaid }) {
  const [step, setStep] = useState('options'); // options, scanner, success
  const [method, setMethod] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('scanner');
    setTimeout(() => {
      setStep('success');
      onPaid?.();
      toast.success('Payment successful!');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl dark:bg-slate-900"
      >
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-8 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-widest opacity-80">Secure Checkout</p>
          <h2 className="mt-2 text-4xl font-black">₹{amount}</h2>
        </div>

        <div className="p-8">
          {step === 'options' && (
            <div className="space-y-4">
              <p className="mb-4 text-center text-sm text-slate-500">Choose your payment method</p>
              <button onClick={() => { setMethod('UPI'); handlePay(); }} className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-500/10 text-teal-600">
                  <FiSmartphone className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-bold">UPI (GPay, PhonePe, BHIM)</p>
                  <p className="text-xs text-slate-500">Instant secure transfer</p>
                </div>
              </button>
              <button onClick={() => { setMethod('Card'); handlePay(); }} className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                  <FiCreditCard className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Credit / Debit Card</p>
                  <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
              </button>
              <button onClick={onClose} className="mt-4 w-full text-sm font-medium text-slate-500">Cancel</button>
            </div>
          )}

          {step === 'scanner' && (
            <div className="text-center">
              <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-3xl border-4 border-teal-500/30 p-2">
                <div className="absolute inset-0 z-10 animate-scan border-t-2 border-teal-500 shadow-[0_-10px_20px_-5px_rgba(20,184,166,0.5)]"></div>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=traveloop@upi&pn=Traveloop&am=${amount}&cu=INR`} 
                  alt="Payment QR" 
                  className="h-full w-full opacity-60"
                />
              </div>
              <h3 className="text-lg font-bold">Scanning for Payment...</h3>
              <p className="mt-2 text-sm text-slate-500">Open your GPay, PhonePe or any UPI app and scan the code.</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-teal-600">
                <FiShield /> 256-bit SSL Encrypted Secure Payment
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-4xl text-teal-600"
              >
                <FiCheckCircle />
              </motion.div>
              <h3 className="text-2xl font-black">Success!</h3>
              <p className="mt-2 text-slate-500">Your trip is confirmed. Check your email for details.</p>
              <button onClick={onClose} className="mt-8 rounded-full bg-slate-900 px-8 py-3 font-bold text-white shadow-lg">Done</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
