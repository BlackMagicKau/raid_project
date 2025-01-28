'use client';

import { useEffect, useState } from 'react';
import { Order, Fruit } from '@/types';

interface DailySales {
  date: string;
  total: number;
}

interface FruitSales {
  fruitName: string;
  fruitId: number;
  totalQuantity: number;
  totalSales: number;
}

interface Analytics {
  dailySales: DailySales[];
  fruitSales: FruitSales[];
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [newFruit, setNewFruit] = useState({ name: '', price: '', stock: '' });
  const [fruits, setFruits] = useState<Fruit[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
    fetchFruits();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data);
  };

  const fetchAnalytics = async () => {
    const response = await fetch('/api/analytics');
    const data = await response.json();
    setAnalytics(data);
  };

  const fetchFruits = async () => {
    const response = await fetch('/api/fruits');
    const data = await response.json();
    setFruits(data);
  };

  const handleAddFruit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/fruits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFruit.name,
          price: parseFloat(newFruit.price),
          stock: parseInt(newFruit.stock)
        })
      });

      if (response.ok) {
        setNewFruit({ name: '', price: '', stock: '' });
        fetchFruits();
      }
    } catch (error) {
      console.error('Failed to add fruit:', error);
    }
  };

  const handleUpdateStock = async (fruitId: number, newStock: number) => {
    try {
      const response = await fetch('/api/fruits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fruitId, stock: newStock })
      });

      if (response.ok) {
        fetchFruits();
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Analytics Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Store Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Daily Sales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Daily Sales</h3>
            <div className="space-y-4">
              {analytics?.dailySales.map(day => (
                <div key={day.date} className="flex justify-between">
                  <span>{new Date(day.date).toLocaleDateString()}</span>
                  <span className="font-medium">${day.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fruit Sales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Sales by Fruit</h3>
            <div className="space-y-4">
              {analytics?.fruitSales.map(fruit => (
                <div key={fruit.fruitId} className="flex justify-between">
                  <span>{fruit.fruitName}</span>
                  <div>
                    <span className="mr-4">{fruit.totalQuantity} sold</span>
                    <span className="font-medium">${fruit.totalSales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Inventory Management</h2>
        
        {/* Add New Fruit */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Fruit</h3>
          <form onSubmit={handleAddFruit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={newFruit.name}
                onChange={(e) => setNewFruit(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Fruit Name"
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                value={newFruit.price}
                onChange={(e) => setNewFruit(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Price"
                step="0.01"
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                value={newFruit.stock}
                onChange={(e) => setNewFruit(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="Initial Stock"
                className="px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Fruit
            </button>
          </form>
        </div>

        {/* Update Stock */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Update Stock</h3>
          <div className="space-y-4">
            {fruits.map(fruit => (
              <div key={fruit.id} className="flex items-center justify-between">
                <span>{fruit.name}</span>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={fruit.stock}
                    onChange={(e) => handleUpdateStock(fruit.id, parseInt(e.target.value))}
                    className="px-4 py-2 border rounded-lg w-24"
                    min="0"
                  />
                  <span>in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage all customer orders
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders found</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1 text-sm text-gray-900">{order.customerName}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Order Items</h3>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {order.items.map(item => (
                        <li key={item.fruitId} className="py-2 flex justify-between">
                          <span className="text-sm text-gray-900">
                            {item.quantity}x {item.fruitId}
                          </span>
                          <span className="text-sm text-gray-500">
                            ${item.priceAtPurchase} each
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-end">
                    <p className="text-lg font-semibold text-gray-900">
                      Total: ${order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 