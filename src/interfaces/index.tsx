
// ১. প্রোডাক্টের সিঙ্গেল আইটেমের স্ট্রাকচার
export interface Product {
    id: number;
    name: string;
    price: number;
    image: string | null;
    created_at?: string;
    updated_at?: string;
}

// ২. কার্টে যোগ হওয়া প্রোডাক্টের স্ট্রাকচার (প্রোডাক্টের সব ডেটা + কোয়ান্টিটি)
export interface CartItem extends Product {
    qty: number;
}

// ৩. ড্যাশবোর্ডের আউটলেট ভিত্তিক লাইভ সেলস সামারি
export interface SalesSummary {
    dhanmondi: number;
    mirpur: number;
    uttara: number;
    [key: string]: number; // অপশনাল: ভবিষ্যতে নতুন কোনো আউটলেট যোগ হলে যেন এরর না দেয়
}

// ৪. লারাভেল ব্যাকএন্ড এপিআই থেকে টোটাল যে রেসপন্সটা আসবে
export interface ApiResponse {
    products: Product[];
    sales_summary: SalesSummary;
}