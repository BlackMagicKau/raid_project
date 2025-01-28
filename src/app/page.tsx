'use client';

import { useEffect, useState } from 'react';
import { Fruit, CartItem } from '@/types';

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
      if (existingItem) {
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
    setCart(prevCart =>
      prevCart.map(item =>
        item.fruit.id === fruitId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const getTotalAmount = () => {
    return cart.reduce(
      (total, item) => total + item.fruit.price * item.quantity,
      0
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

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Available Fruits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fruits.map(fruit => (
              <div 
                key={fruit.id} 
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">{fruit.name}</h3>
                <div className="space-y-4">
                  <p className="text-2xl font-semibold text-gray-900">${fruit.price}</p>
                  <p className={`text-base ${fruit.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {fruit.stock > 0 ? `${fruit.stock} in stock` : 'Out of stock'}
                  </p>
                  <button
                    onClick={() => addToCart(fruit)}
                    disabled={fruit.stock === 0}
                    className="w-full min-h-[44px] bg-indigo-600 text-white px-6 py-3 rounded-lg
                             text-base font-medium hover:bg-indigo-700 
                             disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition-colors focus:outline-none focus:ring-2 
                             focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Cart</h2>
            
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 min-h-[44px] text-base border border-gray-300 rounded-lg mb-6
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            {cart.length === 0 ? (
              <p className="text-base text-gray-500 text-center py-6">Your cart is empty</p>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.fruit.id} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{item.fruit.name}</h3>
                      <p className="text-base text-gray-500 mt-1">${item.fruit.price} each</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.fruit.id, parseInt(e.target.value))}
                        min="0"
                        max={item.fruit.stock}
                        className="w-20 px-3 min-h-[44px] text-base border border-gray-300 rounded-lg
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${getTotalAmount().toFixed(2)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 