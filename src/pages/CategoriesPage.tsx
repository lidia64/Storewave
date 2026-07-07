import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Tags } from 'lucide-react';
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
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#a85432]">Departments</p>
          <h1 className="text-3xl font-black text-stone-900">Categories</h1>
        </div>

        {loading && <Spinner message="Loading categories..." />}
        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && categories.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white py-20 text-center text-stone-500">
            <FolderOpen className="mx-auto mb-3 text-stone-300" size={42} />
            <p>No categories found.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-[#a85432]/50 hover:shadow-md"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-[#a85432]/10 text-[#a85432]">
                  <Tags size={21} />
                </span>
                <h3 className="font-bold text-stone-900 group-hover:text-[#a85432]">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1 text-xs leading-5 text-stone-500 line-clamp-2">{cat.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
