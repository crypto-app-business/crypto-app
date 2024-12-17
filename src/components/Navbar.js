'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">My App</h1>
      <div>
        {isLoggedIn ? (
          <button className="bg-red-500 px-4 py-2 rounded" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="mr-4 bg-blue-500 px-4 py-2 rounded">
              Login
            </Link>
            <Link href="/register" className="bg-green-500 px-4 py-2 rounded">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}