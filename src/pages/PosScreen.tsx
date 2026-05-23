import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string;
  description?: string;
}

interface CartItem extends Product {
  qty: number;
}

type UserRole = "Admin" | "Manager" | "Staff";

// CORS এবং অরিজিন কনফ্লিক্ট এড়াতে localhost ব্যবহার করা হলো
const API_BASE = "http://localhost:8000/api";

export default function PosScreen() {
  const [userRole, setUserRole] = useState<UserRole>("Manager");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOutlet, setSelectedOutlet] = useState<string>("Dhanmondi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  useEffect(() => {
    // ব্যাকএন্ড লেআউটের গ্লোবাল বডি স্ক্রোলবার ওভাররাইড বা হাইড করার ট্রিক
    document.body.style.overflow = "hidden";
    
    axios.get(`${API_BASE}/pos-data`)
      .then(res => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch(() => {
        // Fallback Premium Mock Data 
        setProducts([
          { id: 1, name: "Classic Chicken Burger", price: 180, category: "Burger", description: "It is a long established fact that a reader will be distracted by the readable.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
          { id: 2, name: "Chicken Pizza", price: 450, category: "Pizza", description: "It is a long established fact that a reader will be distracted by the readable.", image: "https://images.unsplash.com/photo-1548365328-9f547fb0953d?w=500" },
          { id: 3, name: "Chicken Mashroom Pizza", price: 480, category: "Pizza", description: "It is a long established fact that a reader will be distracted by the readable.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
          { id: 4, name: "Double Chicken Cheese Burger", price: 240, category: "Burger", description: "It is a long established fact that a reader will be distracted by the readable.", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
          { id: 5, name: "Triple Scope Ice-Cream", price: 150, category: "Ice Cream", description: "It is a long established fact that a reader will be distracted by the readable.", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500" },
          { id: 6, name: "Orange Juice", price: 120, category: "Juice", description: "It is a long established fact that a reader will be distracted by the readable.", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500" }
        ]);
      });

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const filteredProducts = products.filter(p =>
    (selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase()) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const exist = cart.find(i => i.id === product.id);
    if (exist) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (item.qty === 1) {
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i));
    }
  };

  const subTotal = cart.reduce((t, i) => t + i.price * i.qty, 0);
  const tax = subTotal * 0.10; // 10% VAT
  const grandTotal = subTotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Your order cart is empty!");
    setIsSubmitting(true);

    // লারাভেল ১২ ভ্যালিডেশনের সাথে ম্যাচ করতে grand_total-কে total_amount করা হলো
    const orderPayload = {
      outlet_name: selectedOutlet,
      subtotal: subTotal,
      tax: tax,
      total_amount: grandTotal, 
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        price: item.price,
        total: item.price * item.qty
      }))
    };

    axios.post(`${API_BASE}/place-order`, orderPayload)
      .then(res => {
        if (res.data.success) {
          alert(res.data.message || "Order saved successfully in MySQL DB!");
          setCart([]);
          setShowMobileCart(false);
        } else {
          alert("Failed to save: " + res.data.message);
        }
      })
      .catch((error) => {
        console.error("Order Submit Error Log:", error.response?.data);
        // যদি কোনো ফিল্ড মিসিং থাকে তার ডিটেইল এরর মেসেজ দেখাবে
        const validationError = error.response?.data?.message || "Server Error! Check Laravel Log.";
        alert(validationError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const isAdminOrManager = userRole === "Admin" || userRole === "Manager";

  return (
    <div className="d-flex bg-light vh-100 vw-100 position-fixed top-0 start-0 w-100 h-100 m-0 p-0 overflow-hidden" style={{ color: "#2c3e50", zIndex: 1050 }}>
      
      {/* 1. SIDEBAR PANEL */}
      {isAdminOrManager && (
        <div className="bg-white border-end d-none d-xl-flex flex-column p-4 m-0 h-100" style={{ width: "260px", flexShrink: 0 }}>
          <div className="mb-4 py-2">
            <h4 className="fw-extrabold tracking-tight mb-0" style={{ color: "#0e4a60" }}>
              POS<span className="text-info">.COM</span>
            </h4>
            <span className="badge text-uppercase font-monospace mt-1 px-2" style={{ fontSize: '10px', backgroundColor: "#0e4a60" }}>
              {userRole} Mode
            </span>
          </div>
          <div className="d-flex flex-column gap-1">
            <button className="btn btn-light text-start border-0 py-3 px-3 text-muted w-100 fw-medium rounded-3">📊 Dashboard</button>
            <button className="btn text-white text-start border-0 py-3 px-3 w-100 fw-bold rounded-3 shadow-sm" style={{ backgroundColor: "#0e4a60" }}>🏠 Home Counter</button>
            <button className="btn btn-light text-start border-0 py-3 px-3 text-muted w-100 fw-medium rounded-3">🛍️ Order</button>
            <button className="btn btn-light text-start border-0 py-3 px-3 text-muted w-100 fw-medium rounded-3">💳 Payment</button>
            <button className="btn btn-light text-start border-0 py-3 px-3 text-muted w-100 fw-medium rounded-3">📦 Inventory</button>
            <button className="btn btn-light text-start border-0 py-3 px-3 text-muted w-100 fw-medium rounded-3">⚙️ Settings</button>
          </div>

          <div className="mt-auto bg-light p-2 rounded-3 border text-center">
            <small className="text-muted font-monospace d-block mb-1 text-xs">SIMULATE ROLE:</small>
            <div className="btn-group btn-group-sm w-100">
              <button className={`btn py-1 ${userRole === 'Manager' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setUserRole('Manager')}>Manager</button>
              <button className={`btn py-1 ${userRole === 'Staff' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setUserRole('Staff')}>Staff</button>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE FRAME */}
      <div className="d-flex flex-column flex-lg-row flex-grow-1 overflow-hidden m-0 p-0 h-100">
        
        {/* 2. CENTER PRODUCT WORKSPACE */}
        <div className="p-3 p-md-4 flex-grow-1 overflow-auto d-flex flex-column h-100 m-0 position-relative" style={{ backgroundColor: "#f8fafd" }}>
          
          {/* Top Search Toolbar */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm border border-light" style={{ flexShrink: 0 }}>
            <div className="input-group border rounded-3 bg-light flex-grow-1" style={{ maxWidth: "550px" }}>
              <span className="input-group-text bg-transparent border-0 text-muted">🔍</span>
              <input
                className="form-control bg-transparent border-0 ps-0 py-2.5"
                placeholder="Search items here..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            {isAdminOrManager && (
              <div className="d-flex align-items-center gap-2">
                <select 
                  className="form-select border-0 bg-light fw-bold text-dark rounded-3 py-2 px-3"
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  style={{ width: "160px" }}
                >
                  <option value="Dhanmondi">Dhanmondi</option>
                  <option value="Mirpur">Mirpur</option>
                  <option value="Uttara">Uttara</option>
                </select>
              </div>
            )}
          </div>

          {/* Horizontally Scrollable Category Filter Chips */}
          <div className="d-flex gap-3 mb-5 overflow-auto pb-2" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', flexShrink: 0 }}>
            {["All", "Burger", "Pizza", "Ice Cream", "Juice"].map(cat => (
              <button
                key={cat}
                className="btn d-flex flex-column align-items-center justify-content-center px-4 py-3 rounded-4 bg-white shadow-sm transition-all border"
                style={{
                  minWidth: "100px",
                  borderColor: selectedCategory === cat ? "#0dcaf0" : "transparent",
                  color: selectedCategory === cat ? "#0dcaf0" : "#8a99a7",
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                <span className="fs-2 mb-1">
                  {cat === "All" && "📋"}
                  {cat === "Burger" && "🍔"}
                  {cat === "Pizza" && "🍕"}
                  {cat === "Ice Cream" && "🍦"}
                  {cat === "Juice" && "🍹"}
                </span>
                <span className="fw-bold" style={{ fontSize: "12px" }}>{cat}</span>
              </button>
            ))}
          </div>

          <h4 className="fw-bold mb-4 text-dark text-start" style={{ flexShrink: 0 }}>Choose Items</h4>

          {/* FLUID RESPONSIVE CARD MATRIX */}
          <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-xxl-4 g-3 g-md-4 align-content-start mx-0">
            {filteredProducts.map(p => (
              <div className="col" key={p.id} style={{ marginBottom: "25px" }}>
                <div className="card h-100 border rounded-4 bg-white p-3 shadow-sm d-flex flex-column align-items-center text-center position-relative border-0"
                     style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.015)" }}>
                  
                  {/* Floating Circular Image Masking Frame */}
                  <div className="mb-2 rounded-circle shadow-sm bg-light border border-4 border-white overflow-hidden" 
                       style={{ width: "100px", height: "100px", marginTop: "-45px", flexShrink: 0 }}>
                    <img 
                      src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"} 
                      className="w-100 h-100 object-fit-cover" 
                      alt={p.name}
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300"; }}
                    />
                  </div>

                  <div className="card-body p-0 d-flex flex-column justify-content-between w-100 mt-2">
                    <div>
                      <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: "14px" }}>{p.name}</h6>
                      <p className="text-muted px-1 text-center mb-3 line-clamp-3" style={{ fontSize: "11px", lineHeight: "1.4", height: "45px" }}>
                        {p.description}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-light">
                      <span className="fw-extrabold text-dark font-monospace fs-5">৳{p.price}</span>
                      <button 
                        className="btn rounded-3 px-2.5 py-1.5 text-white d-flex align-items-center justify-content-center shadow-sm border-0"
                        style={{ backgroundColor: "#0e4a60" }}
                        onClick={() => addToCart(p)}
                      >
                        <span className="fw-bold">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. RIGHT SIDEBAR INVOICE */}
        <div className="bg-white border-start p-4 d-none d-lg-flex flex-column h-100 m-0" style={{ width: "380px", minWidth: "380px", flexShrink: 0 }}>
          <h4 className="fw-bold text-dark mb-4">Bills</h4>

          {/* Cart Items Stream wrapper */}
          <div className="flex-grow-1 overflow-auto pe-1" style={{ scrollbarWidth: 'thin' }}>
            {cart.length === 0 ? (
              <div className="text-center my-5 py-5 text-muted opacity-50">
                <div className="fs-1">📋</div>
                <p className="mt-2 fw-medium mb-0">No entries inside active invoice</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between align-items-center bg-white border-0 border-bottom mb-3 pb-3">
                  <div className="d-flex align-items-center gap-3" style={{ maxWidth: "65%" }}>
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} 
                      className="rounded-3 object-fit-cover shadow-sm" 
                      style={{ width: "45px", height: "45px" }} 
                      alt={item.name}
                    />
                    <div className="text-start">
                      <div className="fw-bold text-dark text-truncate mb-0" style={{ fontSize: "13px" }}>{item.name}</div>
                      <span className="text-muted font-monospace fw-bold" style={{ fontSize: "12px" }}>৳{item.price}</span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2">
                    <button onClick={() => addToCart(item)} className="btn btn-sm btn-light text-success border rounded-circle p-0 fw-bold d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>+</button>
                    <span className="fw-bold font-monospace text-dark text-center" style={{ minWidth: "18px" }}>{item.qty < 10 ? `0${item.qty}` : item.qty}</span>
                    <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-light text-danger border rounded-circle p-0 fw-bold d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>-</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Ledger Footer */}
          <div className="mt-auto border-top border-light pt-3" style={{ flexShrink: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: "13px" }}>
              <span className="text-muted fw-medium">Sub Total</span>
              <span className="font-monospace fw-bold text-dark">৳{subTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: "13px" }}>
              <span className="text-muted fw-medium">Tax 10% (VAT Included)</span>
              <span className="font-monospace fw-bold text-dark">৳{tax.toFixed(2)}</span>
            </div>
            
            <hr className="my-3 opacity-20" style={{ borderStyle: "dashed" }} />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-dark fw-bold fs-5">Total</span>
              <span className="fs-3 fw-extrabold text-success font-monospace">৳{grandTotal.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn w-100 btn-lg py-3 fw-bold text-white text-uppercase shadow rounded-3 border-0"
              style={{ backgroundColor: "#0e4a60", fontSize: "14px", letterSpacing: "0.5px" }}
              disabled={cart.length === 0 || isSubmitting}
              onClick={handleCheckout}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>

        {/* 4. MOBILE FLOATING ACTION FOOTER BAR */}
        {cart.length > 0 && (
          <div className="d-lg-none fixed-bottom bg-white shadow-lg border-top p-3 d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px", bottom: 0, zIndex: 1060 }}>
            <div onClick={() => setShowMobileCart(true)} className="cursor-pointer">
              <span className="badge bg-info rounded-pill font-monospace mb-1">{cart.reduce((s, i) => s + i.qty, 0)} Items Added</span>
              <div className="fw-extrabold fs-4 text-dark font-monospace">৳{grandTotal.toFixed(2)} <span className="fs-6 text-muted font-normal">▼</span></div>
            </div>
            <button className="btn px-4 py-2.5 text-white fw-bold rounded-3 border-0 shadow" style={{ backgroundColor: "#0e4a60" }} disabled={isSubmitting} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}

        {/* 5. PORTABLE OVERLAY EXPANSION DRAWER MODAL */}
        {showMobileCart && (
          <div className="fixed-top w-100 h-100 d-lg-none" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1070 }}>
            <div className="position-absolute bottom-0 start-0 w-100 bg-white p-4 overflow-auto" style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px", maxHeight: "85vh" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Active Invoice Items</h5>
                <button className="btn btn-light rounded-circle fw-bold" onClick={() => setShowMobileCart(false)}>✕</button>
              </div>

              <div className="mb-4">
                {cart.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center py-2.5 border-bottom">
                    <div>
                      <span className="fw-bold text-dark d-block text-sm">{item.name}</span>
                      <small className="text-muted font-monospace">৳{item.price}</small>
                    </div>
                    <div className="d-flex align-items-center gap-2 border rounded bg-light p-1">
                      <button onClick={() => addToCart(item)} className="btn btn-xs bg-white text-success rounded-circle border p-0 fw-bold" style={{ width: "24px", height: "24px" }}>+</button>
                      <span className="fw-bold px-1.5 font-monospace">{item.qty}</span>
                      <button onClick={() => removeFromCart(item.id)} className="btn btn-xs bg-white text-danger rounded-circle border p-0 fw-bold" style={{ width: "24px", height: "24px" }}>-</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-light p-3 rounded-3 mb-3 font-monospace text-sm">
                <div className="d-flex justify-content-between mb-1"><span>Subtotal:</span><span>৳{subTotal}</span></div>
                <div className="d-flex justify-content-between mb-1"><span>VAT (10%):</span><span>৳{tax}</span></div>
                <div className="d-flex justify-content-between mt-2 pt-2 border-top fw-bold text-success fs-5"><span>Total Amount:</span><span>৳{grandTotal}</span></div>
              </div>

              <button className="btn btn-lg w-100 text-white fw-bold py-3 border-0 rounded-3 shadow" style={{ backgroundColor: "#0e4a60" }} disabled={isSubmitting} onClick={handleCheckout}>
                Confirm Sale
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}