import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck, Tags } from 'lucide-react';
import { categoryService } from '../services/category.service';
import type { Category } from '../types';
import Spinner from '../components/ui/Spinner';
import { heroImage } from '../lib/images';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => setCategories(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src={heroImage} alt="Warm retail store display" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/75 to-stone-950/20" />
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
              marketplace freshness
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              StoreWave
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-100 sm:text-lg">
              Browse clear product photos, find categories fast, and checkout through protected account flows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-[#a85432] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#8f4328]"
              >
                Shop products
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                View categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: PackageCheck, title: 'Visible products', desc: 'Large images with reliable fallbacks.' },
            { icon: ShieldCheck, title: 'Protected checkout', desc: 'JWT authentication for carts and orders.' },
            { icon: BadgeCheck, title: 'Fresh catalog', desc: 'Live products and categories from the API.' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#a85432]/10 text-[#a85432]">
                <item.icon size={20} />
              </span>
              <div>
                <h3 className="font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#a85432]">Departments</p>
              <h2 className="text-2xl font-black text-stone-900">Shop by category</h2>
            </div>
            <Link to="/products" className="hidden text-sm font-semibold text-[#a85432] hover:underline sm:inline">
              See all products
            </Link>
          </div>
          {loading ? (
            <Spinner message="Loading categories..." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-[#a85432]/50 hover:shadow-md sm:p-5"
                >
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-[#a85432]/10 text-[#a85432]">
                    <Tags size={21} />
                  </span>
                  <h3 className="font-bold text-stone-900 group-hover:text-[#a85432]">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-1 text-xs leading-5 text-stone-500 line-clamp-2">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
