import './globals.css';

export const metadata = {
  title: 'FD Photography Portfolio - Fashion Design Lookbook',
  description: 'Curated collection of contemporary fashion design photography and styling',
  keywords: 'fashion design, photography, portfolio, lookbook',
  authors: [{ name: 'Fashion Design Student' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">FD Lookbook</h1>
              </div>
              <div className="flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-gray-900">Gallery</a>
                <a href="/credits" className="text-gray-700 hover:text-gray-900">Credits</a>
                <a href="/signup" className="text-gray-700 hover:text-gray-900">Sign up</a>
                <a href="/login" className="text-gray-700 hover:text-gray-900">Log in</a>
                <a href="/admin" className="text-gray-700 hover:text-gray-900">Admin</a>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 FD Photography Portfolio. All rights reserved.</p>
              <p className="mt-2 text-sm">Fashion Design Exhibition</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
