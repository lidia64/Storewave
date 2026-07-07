import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { getProductImage } from '../lib/images';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const image = getProductImage(product);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#a85432]/40 hover:shadow-md"
    >
      <div className="aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3 sm:p-4">
        {product.category?.name && (
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#a85432]">
            {product.category.name}
          </span>
        )}
        <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-stone-900 line-clamp-2">
          {product.name}
        </h3>
        {product.brand && <p className="mt-1 text-xs text-stone-500">{product.brand}</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-black text-[#a85432]">${product.price.toFixed(2)}</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
              product.stock > 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            <ShoppingBag size={12} />
            {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
}
