import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ইনলাইন ইন্টারফেস
export interface SalesSummary {
    dhanmondi: number;
    mirpur: number;
    uttara: number;
    [key: string]: number; 
}

export interface ApiResponse {
    products: any[];
    sales_summary: SalesSummary;
}

const API_BASE = "http://localhost:8000/api";

export default function OwnersDashboard() {
    const [sales, setSales] = useState<SalesSummary>({ dhanmondi: 0, mirpur: 0, uttara: 0 });
    const [isDarkMode, setIsDarkMode] = useState(false); // 🌟 থিম স্টেট ট্র্যাকার

    useEffect(() => {
        const fetchSalesData = () => {
            axios.get<ApiResponse>(`${API_BASE}/pos-data`)
                .then(res => {
                    if (res.data && res.data.sales_summary) {
                        setSales(res.data.sales_summary);
                    }
                })
                .catch(err => console.error("Dashboard network fetch error", err));
        };
        
        fetchSalesData();
        const interval = setInterval(fetchSalesData, 3000); 
        return () => clearInterval(interval);
    }, []);

    const totalNetworkSales = Number(sales.dhanmondi || 0) + Number(sales.mirpur || 0) + Number(sales.uttara || 0);

    const outlets: Array<{ id: keyof SalesSummary; label: string; icon: string; manager: string; color: string; darkColor: string }> = [
        { id: 'dhanmondi', label: 'Dhanmondi Branch', icon: '🍏', manager: 'Rahat Khan', color: '#e8f5e9', darkColor: '#1e291b' },
        { id: 'mirpur', label: 'Mirpur Branch', icon: '💎', manager: 'Asif Mahmud', color: '#e3f2fd', darkColor: '#1a2536' },
        { id: 'uttara', label: 'Uttara Branch', icon: '🍊', manager: 'Sabbir Ahmed', color: '#fff3e0', darkColor: '#2e2216' }
    ];

    // থিম ভিত্তিক কন্ডিশনাল স্টাইল ডাইনামিক ভ্যারিয়েবলস
    const themeBg = isDarkMode ? "#0f111a" : "#f4f7fc";
    const cardBg = isDarkMode ? "#161925" : "#ffffff";
    const textColor = isDarkMode ? "text-white" : "text-dark";
    const subTextColor = isDarkMode ? "text-muted" : "text-secondary";
    const borderTheme = isDarkMode ? "border-secondary border-opacity-10" : "border-light-subtle";

    return (
        <div className={`min-vh-100 p-3 p-md-4 font-sans transition-all`} style={{ backgroundColor: themeBg, color: isDarkMode ? '#ffffff' : '#212529' }}>
            
            {/* ১. টপ প্রিমিয়াম হেডার বার ও লাইভ থিম টগল */}
            <div className={`d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom ${borderTheme} pb-3 mb-4 gap-3`}>
                <div className="text-start">
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 text-uppercase font-monospace mb-2" style={{ fontSize: '10px' }}>
                        Enterprise Control Room
                    </span>
                    <h3 className="fw-extrabold mb-1 tracking-tight" style={{ fontSize: '24px', color: isDarkMode ? '#ffffff' : '#0e4a60' }}>
                        M/S MASUM BANIJJALAYA
                    </h3>
                    <div className="d-flex align-items-center gap-2">
                        <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '8px', height: '8px', animationDuration: '1.2s' }}></span>
                        <small className={subTextColor}>HQ Multi-Outlet Audit System</small>
                    </div>
                </div>

                {/* ইন্টারঅ্যাক্টিভ লাইট/ডার্ক মোড টগল বাটন */}
                <div className="d-flex align-items-center gap-3 justify-content-start justify-content-sm-end">
                    <div className="form-check form-switch bg-white bg-opacity-10 border rounded-3 px-3 py-1.5 shadow-sm d-flex align-items-center gap-2 m-0" style={{ borderColor: isDarkMode ? '#333' : '#ddd' }}>
                        <input 
                            className="form-check-input cursor-pointer ms-0" 
                            type="checkbox" 
                            id="themeToggle"
                            checked={isDarkMode}
                            onChange={() => setIsDarkMode(!isDarkMode)}
                            style={{ width: '40px', height: '20px' }}
                        />
                        <label className={`form-check-label fw-bold font-monospace cursor-pointer user-select-none ${textColor}`} htmlFor="themeToggle" style={{ fontSize: '12px' }}>
                            {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                        </label>
                    </div>
                    <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 text-uppercase font-monospace rounded-pill shadow-sm d-none d-md-inline-block" style={{ fontSize: '11px' }}>
                        ● System Synced
                    </span>
                </div>
            </div>

            {/* ২. মেইন রেভিনিউ ব্যানার ও গ্রিড ম্যাট্রিক্স */}
            <div className="row g-3 mb-4">
                {/* গ্রেডিয়েন্ট রেভিনিউ ব্যানার (সবসময় কালারফুল থাকবে) */}
                <div className="col-12 col-xl-6">
                    <div className="card border-0 p-4 h-100 shadow-sm position-relative rounded-4 overflow-hidden text-white" 
                         style={{ background: 'linear-gradient(135deg, #0f5132 0%, #087990 100%)', minHeight: '160px' }}>
                        <div className="position-relative" style={{ zIndex: 2 }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-uppercase tracking-wider fw-bold opacity-75 font-monospace" style={{ fontSize: '11px' }}>
                                    Gross Network Revenue (All Outlets Combined)
                                </small>
                                <span className="badge bg-white bg-opacity-20 text-white px-2 py-1" style={{ fontSize: '10px' }}>+14.2% MoM</span>
                            </div>
                            <h1 className="fw-extrabold display-5 mt-2 mb-2 font-monospace">
                                ৳{totalNetworkSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h1>
                            <small className="opacity-75">Real-time live transactions synced via database logs</small>
                        </div>
                        <div className="position-absolute end-0 bottom-0 bg-white opacity-10 rounded-circle" style={{ width: '200px', height: '200px', marginRight: '-60px', marginBottom: '-60px' }}></div>
                    </div>
                </div>

                {/* মোট ইনভয়েস কার্ড (সফট স্কাই ব্লু থিম) */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 p-4 h-100 rounded-4 shadow-sm" style={{ backgroundColor: isDarkMode ? cardBg : "#e3f2fd", color: isDarkMode ? '#fff' : '#0d47a1' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <small className={`${isDarkMode ? 'text-muted' : 'text-primary'} text-uppercase font-monospace fw-bold`} style={{ fontSize: '11px' }}>Total Invoices Today</small>
                                <h2 className="fw-extrabold mt-2 mb-1 font-monospace">1,482</h2>
                            </div>
                            <span className="fs-3">📦</span>
                        </div>
                        <small className={`mt-2 d-block ${isDarkMode ? 'text-success' : 'text-primary fw-medium'}`}>✔ 99.4% Fulfillment Rate</small>
                    </div>
                </div>

                {/* আনুমানিক প্রফিট মার্জিন কার্ড (সফট প্যাস্টেল অরেঞ্জ থিম) */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 p-4 h-100 rounded-4 shadow-sm" style={{ backgroundColor: isDarkMode ? cardBg : "#fff3e0", color: isDarkMode ? '#fff' : '#e65100' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <small className={`${isDarkMode ? 'text-muted' : 'text-warning'} text-uppercase font-monospace fw-bold`} style={{ fontSize: '11px' }}>Est. Net Profit Margin</small>
                                <h2 className="fw-extrabold mt-2 mb-1 font-monospace">৳{(totalNetworkSales * 0.22).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h2>
                            </div>
                            <span className="fs-3">📈</span>
                        </div>
                        <small className={subTextColor} style={{ fontSize: '12px' }}>Fixed index profile margin at <span className="fw-bold">22%</span></small>
                    </div>
                </div>
            </div>

            {/* ৩. আউটলেট ভিত্তিক কালারফুল ভাইব্রেন্ট ফিড */}
            <div className="mb-5 text-start">
                <h6 className={`mb-3 text-uppercase tracking-widest fw-bold font-monospace ${subTextColor}`} style={{ fontSize: '11px' }}>
                    Live Branch Feed Matrix
                </h6>
                <div className="row g-3">
                    {outlets.map((outlet) => (
                        <div className="col-12 col-md-4" key={outlet.id}>
                            <div className="card border-0 p-4 h-100 shadow-sm rounded-4"
                                 style={{ 
                                     backgroundColor: isDarkMode ? cardBg : outlet.color, 
                                     borderLeft: `5px solid ${isDarkMode ? '#0dcaf0' : '#198754'}`,
                                     color: isDarkMode ? '#ffffff' : '#212529'
                                 }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <span className="fw-extrabold d-block" style={{ fontSize: '16px' }}>
                                            {outlet.label}
                                        </span>
                                        <small className={subTextColor}>Manager: {outlet.manager}</small>
                                    </div>
                                    <span style={{ fontSize: '24px' }}>{outlet.icon}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-end mt-4">
                                    <h3 className="fw-extrabold mb-0 font-monospace text-success">
                                        ৳{Number(sales[outlet.id] || 0).toLocaleString('en-IN')}
                                    </h3>
                                    <span className="badge bg-success bg-opacity-10 text-success font-monospace" style={{ fontSize: '10px' }}>Active Counter</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ৪. রিসেন্ট ট্রানজেকশন লগ এবং টপ সেলিং প্রোডাক্টস */}
            <div className="row g-4 text-start">
                {/* ট্রানজেকশন লক টেবিল */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 p-4 rounded-4 shadow-sm h-100" style={{ backgroundColor: cardBg }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className={`fw-bold mb-0 ${textColor}`}>System Audit Trail (Recent Logs)</h5>
                            <span className="badge bg-light text-dark font-monospace border">Auto-refreshing</span>
                        </div>
                        <div className="table-responsive">
                            <table className={`table ${isDarkMode ? 'table-dark' : 'table-light'} table-hover align-middle mb-0`}>
                                <thead className="text-muted" style={{ fontSize: '11px' }}>
                                    <tr>
                                        <th className="py-3 border-0 bg-transparent">INVOICE ID</th>
                                        <th className="py-3 border-0 bg-transparent">BRANCH</th>
                                        <th className="py-3 border-0 bg-transparent">ITEMS COUNTER</th>
                                        <th className="py-3 border-0 bg-transparent">STATUS</th>
                                        <th className="py-3 border-0 bg-transparent text-end">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: '13px' }}>
                                    <tr className="border-bottom border-light-subtle">
                                        <td className="py-3 font-monospace border-0 bg-transparent text-muted">#INV-2026-904</td>
                                        <td className="py-3 border-0 bg-transparent fw-bold">Dhanmondi</td>
                                        <td className="py-3 border-0 bg-transparent text-muted">04 Products</td>
                                        <td className="py-3 border-0 bg-transparent"><span className="badge bg-success bg-opacity-10 text-success">SUCCESS</span></td>
                                        <td className="py-3 border-0 bg-transparent text-end fw-bold font-monospace text-success">৳1,280.00</td>
                                    </tr>
                                    <tr className="border-bottom border-light-subtle">
                                        <td className="py-3 font-monospace border-0 bg-transparent text-muted">#INV-2026-903</td>
                                        <td className="py-3 border-0 bg-transparent fw-bold">Mirpur</td>
                                        <td className="py-3 border-0 bg-transparent text-muted">02 Products</td>
                                        <td className="py-3 border-0 bg-transparent"><span className="badge bg-success bg-opacity-10 text-success">SUCCESS</span></td>
                                        <td className="py-3 border-0 bg-transparent text-end fw-bold font-monospace text-success">৳450.00</td>
                                    </tr>
                                    <tr className="border-bottom border-light-subtle">
                                        <td className="py-3 font-monospace border-0 bg-transparent text-muted">#INV-2026-902</td>
                                        <td className="py-3 border-0 bg-transparent fw-bold">Uttara</td>
                                        <td className="py-3 border-0 bg-transparent text-muted">01 Product</td>
                                        <td className="py-3 border-0 bg-transparent"><span className="badge bg-success bg-opacity-10 text-success">SUCCESS</span></td>
                                        <td className="py-3 border-0 bg-transparent text-end fw-bold font-monospace text-success">৳150.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* টপ ক্যাটাগরি প্যানেল */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 p-4 rounded-4 shadow-sm h-100" style={{ backgroundColor: cardBg }}>
                        <h5 className={`fw-bold mb-4 ${textColor}`}>Top Velocity SKUs</h5>
                        
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafd' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="fs-3">🍔</span>
                                    <div>
                                        <span className={`fw-bold d-block ${textColor}`} style={{ fontSize: '13px' }}>Classic Chicken Burger</span>
                                        <small className="text-muted">412 sales volume</small>
                                    </div>
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success font-monospace">৳74,160</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafd' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="fs-3">🍕</span>
                                    <div>
                                        <span className={`fw-bold d-block ${textColor}`} style={{ fontSize: '13px' }}>Mushroom Pizza</span>
                                        <small className="text-muted">289 sales volume</small>
                                    </div>
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success font-monospace">৳138,720</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}