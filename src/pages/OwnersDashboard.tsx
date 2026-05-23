import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SalesSummary, ApiResponse } from '../interfaces';

const API_BASE = "http://127.0.0.1:8000/api";

export default function OwnersDashboard() {
    const [sales, setSales] = useState<SalesSummary>({ dhanmondi: 0, mirpur: 0, uttara: 0 });

    useEffect(() => {
        const fetchSalesData = () => {
            axios.get<ApiResponse>(`${API_BASE}/pos-data`)
                .then(res => setSales(res.data.sales_summary))
                .catch(err => console.error("Dashboard error", err));
        };
        
        fetchSalesData();
        const interval = setInterval(fetchSalesData, 3000); // প্রতি ৩ সেকেন্ডে অটো আপডেট হবে
        return () => clearInterval(interval);
    }, []);

    const totalNetworkSales = Number(sales.dhanmondi) + Number(sales.mirpur) + Number(sales.uttara);

    return (
        <div className="min-vh-screen bg-dark text-white p-4 font-sans">
            <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-4">
                <div>
                    <h3 className="fw-bold text-success mb-0">M/S MASUM BANIJJALAYA</h3>
                    <small className="text-muted">লাইভ মাল্টি-আউটলেট মনিটরিং প্যানেল</small>
                </div>
                <span className="badge bg-success px-3 py-2 text-uppercase rounded-pill animate-pulse">● LIVE</span>
            </div>

            {/* Total Sales Banner */}
            <div className="card text-white bg-gradient border-0 mb-4 p-4 shadow-sm" style={{ background: 'linear-gradient(45deg, #198754, #0dcaf0)' }}>
                <small className="text-uppercase opacity-75 fw-bold">আজকের মোট নেটওয়ার্ক বিক্রি (সব দোকান মিলে)</small>
                <h1 className="fw-bold display-5 mt-1">৳{totalNetworkSales.toLocaleString()}</h1>
            </div>

            {/* Outlet Wise Cards */}
            <h5 className="text-muted mb-3 fw-bold">আউটলেট ভিত্তিক লাইভ সেলস</h5>
            <div className="row g-3">
                {(Object.keys(sales) as Array<keyof SalesSummary>).map((key) => (
                    <div className="col-12 col-md-4" key={key}>
                        <div className="card bg-secondary bg-opacity-25 text-white border-secondary p-3 h-100 shadow-sm">
                            <span className="text-muted text-uppercase fw-bold">{key} শপ</span>
                            <h2 className="fw-bold text-success mt-2">৳{Number(sales[key]).toLocaleString()}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}