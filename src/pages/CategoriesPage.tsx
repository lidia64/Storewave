import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/category.service';
import type { Category } from '../types';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data.data))
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categories</h1>

      {loading && <Spinner message="Loading categories…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && categories.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📂</p>
          <p>No categories found.</p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-center group"
            >
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
