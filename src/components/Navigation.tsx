'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <span className="text-xl font-semibold text-gray-900">Fruit Store</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-3 rounded-md text-base font-medium min-h-[44px] min-w-[44px] 
                flex items-center justify-center ${
                pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Store
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-3 rounded-md text-base font-medium min-h-[44px] min-w-[44px]
                flex items-center justify-center ${
                pathname === '/admin'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 