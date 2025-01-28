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
import CartLayout from '@/components/CartLayout';

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

  // For display purposes - returns formatted string
  const getFormattedTotal = () => {
    return formatPrice(
      cart.reduce(
        (total, item) => total + item.fruit.price * item.quantity,
        0
      )
    );
  };

  // For calculations - returns number
  const getTotalAmount = () => {
    return cart.reduce(
      (total, item) => total + item.fruit.price * item.quantity,
      0
    );
  };

  const submitOrder = async () => {
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const order = {
      customerName: customerName.trim(),
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

      const data = await response.json();

      if (response.ok) {
        setCart([]);
        setCustomerName('');
        fetchFruits();
        alert('Order submitted successfully!');
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit order. Please try again.');
    }
  };

  const getFruitIcon = (fruitName: string) => {
    const Icon = fruitIcons[fruitName] || GiFruitBowl;
    return <Icon className="w-8 h-8 text-indigo-600" />;
  };

  return (
    <CartLayout>
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
        
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 py-6">Your cart is empty</p>
        ) : (
          <>
            {/* Cart items */}
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
            
            {/* Total */}
            <div className="mt-6 text-right">
              <p className="text-xl font-semibold">Total: ${getFormattedTotal()}</p>
            </div>
            
            {/* Customer Name Input and Order Button */}
            <div className="mt-8 space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <button
                onClick={submitOrder}
                disabled={cart.length === 0 || !customerName.trim()}
                className="w-full min-h-[44px] bg-indigo-600 text-white px-6 py-3 rounded-lg
                         text-base font-medium hover:bg-indigo-700 
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-colors focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 focus:ring-offset-2"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </CartLayout>
  );
} 