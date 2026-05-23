import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, CartItem, ApiResponse } from '../interfaces';

const API_BASE = "http://127.0.0.1:8000/api"; 

export default function PosScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<string>('Dhanmondi');

    // লারাভেল ব্যাকএন্ড থেকে প্রোডাক্ট ডেটা লোড করা
    useEffect(() => {
        axios.get<ApiResponse>(`${API_BASE}/pos-data`)
            .then(res => setProducts(res.data.products))
            .catch(err => console.error("Data loading failed", err));
    }, []);

    // কার্টে প্রোডাক্ট যোগ করা
    const addToCart = (product: Product) => {
        const exist = cart.find(item => item.id === product.id);
        if (exist) {
            setCart(cart.map(item => item.id === product.id ? { ...exist, qty: exist.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    // কার্ট থেকে প্রোডাক্ট কমানো বা রিমুভ করা
    const removeFromCart = (productId: number) => {
        const exist = cart.find(item => item.id === productId);
        if (!exist) return;
        
        if (exist.qty === 1) {
            setCart(cart.filter(item => item.id !== productId));
        } else {
            setCart(cart.map(item => item.id === productId ? { ...exist, qty: exist.qty - 1 } : item));
        }
    };

    // মোট বিল ক্যালকুলেশন
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.qty), 0);

    // লারাভেলে অর্ডার প্লেস করা
    const handleCheckout = () => {
        if (cart.length === 0) return alert("কার্ট খালি!");

        axios.post(`${API_BASE}/place-order`, {
            outlet_name: selectedOutlet,
            total_amount: totalAmount
        }).then(res => {
            if (res.data.success) {
                alert(`অর্ডার সফল! ${selectedOutlet} আউটলেটের বিল প্রিন্ট রেডি।`);
                setCart([]);
            }
        }).catch(err => {
            console.error(err);
            alert("অর্ডার প্লেস করতে সমস্যা হয়েছে।");
        });
    };

    return (
        <div className="bg-light min-vh-screen d-flex flex-column font-sans">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm d-flex justify-content-between">
                <span className="navbar-brand mb-0 h1 fw-bold">MASUM BANIJJALAYA POS</span>
                <div className="d-flex align-items-center gap-2">
                    <span className="text-white text-sm">আউটলেট:</span>
                    <select 
                        value={selectedOutlet} 
                        onChange={(e) => setSelectedOutlet(e.target.value)} 
                        className="form-select form-select-sm bg-secondary text-white border-0" 
                        style={{ width: '150px' }}
                    >
                        <option value="Dhanmondi">ধানমণ্ডি</option>
                        <option value="Mirpur">মিরপুর</option>
                        <option value="Uttara">উত্তরা</option>
                    </select>
                </div>
            </nav>

            {/* Main Section */}
            <div className="d-flex flex-grow-1 overflow-hidden" style={{ height: 'calc(100vh - 70px)' }}>
                {/* Product Grid */}
                <div className="p-4 overflow-auto" style={{ flex: '2' }}>
                    <h5 className="fw-bold text-secondary mb-3">মেনু আইটেমসমূহ</h5>
                    <div className="row row-cols-1 row-cols-md-3 g-3">
                        {products.map(product => (
                            <div key={product.id} className="col">
                                <div 
                                    className="card h-100 shadow-sm border-0 border-top border-success border-3 p-3 d-flex flex-column justify-content-between" 
                                    onClick={() => addToCart(product)} 
                                    style={{ cursor: 'pointer', minHeight: '130px' }}
                                >
                                    <div className="fw-bold text-dark fs-5">{product.name}</div>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="text-success fw-bolder fs-4">৳{product.price}</span>
                                        <span className="badge bg-light text-secondary border">+ যোগ করুন</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="bg-white border-start shadow-sm d-flex flex-column" style={{ flex: '1', minWidth: '350px' }}>
                    <div className="p-3 overflow-auto flex-grow-1">
                        <h5 className="fw-bold text-secondary pb-2 mb-3 border-bottom">চলতি কার্ট (Cart)</h5>
                        {cart.length === 0 ? (
                            <p className="text-muted text-center my-5">কোনো আইটেম সিলেক্ট করা হয়নি</p>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center bg-light p-2 rounded border mb-2">
                                    <div>
                                        <div className="fw-bold text-sm">{item.name}</div>
                                        <small className="text-muted">৳{item.price} x {item.qty}</small>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-outline-danger py-0 px-2 fw-bold">-</button>
                                        <span className="fw-bold px-1">{item.qty}</span>
                                        <button onClick={() => addToCart(item)} className="btn btn-sm btn-outline-success py-0 px-2 fw-bold">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 bg-light border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">সর্বমোট বিল:</span>
                            <span className="fs-3 fw-bold text-dark">৳{totalAmount}</span>
                        </div>
                        <button onClick={handleCheckout} className="btn btn-success w-100 btn-lg py-3 fw-bold shadow">
                            অর্ডার প্লেস করুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}