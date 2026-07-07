import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category') ?? '';
  const sort = (searchParams.get('sort') ?? 'default') as SortKey;

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    setSearchParams(p);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, catRes] = await Promise.all([
        categoryId ? productService.getByCategory(categoryId) : productService.getAll(),
        categoryService.getAll(),
      ]);
      const prods = categoryId
        ? (prodRes.data as any).data
        : (prodRes.data as any).data.all;
      setProducts(prods ?? []);
      setCategories(catRes.data.data);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, sort]);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#a85432]">StoreWave catalog</p>
            <h1 className="text-3xl font-black text-stone-900">All products</h1>
          </div>
          <p className="text-sm text-stone-500">{filtered.length} items visible</p>
        </div>

        <div className="mb-8 grid gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(220px,1fr)_220px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="h-11 w-full rounded-lg border border-stone-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a85432]/30"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setParam('category', e.target.value)}
            className="h-11 rounded-lg border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a85432]/30"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-stone-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a85432]/30"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
          {(search || categoryId || sort !== 'default') && (
            <button
              onClick={() => setSearchParams({})}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-600 hover:text-red-600"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {loading && <Spinner message="Loading products..." />}
        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white py-20 text-center text-stone-500">
            <Search className="mx-auto mb-3 text-stone-300" size={42} />
            <p>No products found. Try adjusting your filters.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
