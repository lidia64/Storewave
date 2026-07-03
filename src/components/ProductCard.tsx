import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0]?.url;
  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            🛍️
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category?.name && (
          <span className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2 text-sm">{product.name}</h3>
        {product.brand && <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              product.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}
