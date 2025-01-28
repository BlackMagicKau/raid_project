'use client';

import { useEffect, useState } from 'react';
import { Fruit, CartItem } from '@/types';
import { formatPrice } from '@/utils/format';
import { 
  GiAppleSeeds, 
  GiOrangeSlice, 
  GiBanana, 
  GiGrapes, 
  GiPineapple, 
  GiStrawberry,
  GiFruitBowl // default icon for unknown fruits
} from 'react-icons/gi';
import { IconType } from 'react-icons';

// Create a map of fruit names to their icons
const fruitIcons: Record<string, IconType> = {
  'Apple': GiAppleSeeds,
  'Orange': GiOrangeSlice,
  'Banana': GiBanana,
  'Grapes': GiGrapes,
  'Pineapple': GiPineapple,
  'Strawberry': GiStrawberry
};

export default function Home() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    fetchFruits();
  }, []);

  const fetchFruits = async () => {
    const response = await fetch('/api/fruits');
    const data = await response.json();
    setFruits(data);
  };

  const addToCart = (fruit: Fruit) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.fruit.id === fruit.id);
      
      // Check if adding one more would exceed stock
      if (existingItem) {
        if (existingItem.quantity >= fruit.stock) {
          alert(`Sorry, only ${fruit.stock} ${fruit.name}(s) available in stock`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.fruit.id === fruit.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { fruit, quantity: 1 }];
    });
  };

  const updateQuantity = (fruitId: number, quantity: number) => {
    const fruit = fruits.find(f => f.id === fruitId);
    if (!fruit) return;

    // Validate against stock
    if (quantity > fruit.stock) {
      alert(`Sorry, only ${fruit.stock} ${fruit.name}(s) available in stock`);
      quantity = fruit.stock;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.fruit.id === fruitId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const getTotalAmount = () => {
    return formatPrice(
      cart.reduce(
        (total, item) => total + item.fruit.price * item.quantity,
        0
      )
    );
  };

  const submitOrder = async () => {
    if (!customerName || cart.length === 0) return;

    const order = {
      customerName,
      items: cart.map(item => ({
        fruitId: item.fruit.id,
        quantity: item.quantity,
        price: item.fruit.price
      })),
      totalAmount: getTotalAmount()
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        setCart([]);
        setCustomerName('');
        fetchFruits(); // Refresh fruits to update stock
        alert('Order submitted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  const getFruitIcon = (fruitName: string) => {
    const Icon = fruitIcons[fruitName] || GiFruitBowl;
    return <Icon className="w-8 h-8 text-indigo-600" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fruits List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fruits.map(fruit => (
          <div key={fruit.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-4">
              {getFruitIcon(fruit.name)}
              <h2 className="text-xl font-semibold">{fruit.name}</h2>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-indigo-600">
                ${formatPrice(fruit.price)}
              </p>
              <p className={`text-sm ${
                fruit.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {fruit.stock > 0 ? `${fruit.stock} in stock` : 'Out of stock'}
              </p>
              <button
                onClick={() => addToCart(fruit)}
                disabled={fruit.stock === 0}
                className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg
                         hover:bg-indigo-700 disabled:bg-gray-300 
                         disabled:cursor-not-allowed transition-colors"
              >
                {fruit.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>
        {cart.map(item => (
          <div key={item.fruit.id} className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center space-x-3">
              {getFruitIcon(item.fruit.name)}
              <span>{item.fruit.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>${formatPrice(item.fruit.price)} each</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.fruit.id, parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded"
                min="0"
                max={item.fruit.stock}
              />
              <span>${formatPrice(item.fruit.price * item.quantity)}</span>
            </div>
          </div>
        ))}
        
        <div className="mt-6 text-right">
          <p className="text-xl font-semibold">Total: ${getTotalAmount()}</p>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-between mb-6">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              ${getTotalAmount()}
            </span>
          </div>

          <button
            onClick={submitOrder}
            disabled={cart.length === 0 || !customerName}
            className="w-full min-h-[44px] bg-indigo-600 text-white px-6 py-3 rounded-lg
                     text-base font-medium hover:bg-indigo-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 focus:ring-offset-2"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
} 