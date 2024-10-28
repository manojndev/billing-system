export interface OrderItem {
    customQuantity: string;
    id: string;
    name: string;
    price: number;
    qty: number;
    taxPercentage: number;
    unit: string;
  }
  
  export interface Order {
    date: string; // Format: DD/MM/YYYY
    items: OrderItem[];
    orderNumber: number;
    totalAmount: string;
  }
  
  export interface Orders {
    [key: string]: Order;
  }