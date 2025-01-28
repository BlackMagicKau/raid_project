export interface Fruit {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  fruit: Fruit;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed';
  createdAt: Date;
}

export interface OrderItem {
  fruitId: number;
  quantity: number;
  priceAtPurchase: number;
} 