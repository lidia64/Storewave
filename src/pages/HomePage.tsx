import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Shop the Future with <span className="text-yellow-300">Ecomus</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Discover thousands of products across every category. Fast, secure, and always fresh.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              to="/categories"
              className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered quickly and reliably.' },
            { icon: '🔒', title: 'Secure Payments', desc: 'JWT-protected checkout with stock-aware ordering.' },
            { icon: '🛍️', title: 'Wide Selection', desc: 'Thousands of products across all categories.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
