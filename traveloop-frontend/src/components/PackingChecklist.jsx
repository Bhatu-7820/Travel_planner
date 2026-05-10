import { FiPlus, FiSave, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { groupByCategory } from '@/utils/helpers';

const categories = ['clothing', 'documents', 'electronics', 'other'];

export default function PackingChecklist({ items, newItem, setNewItem, newCategory, setNewCategory, onAdd, onToggle, onDelete, onReset, onSave }) {
  const grouped = groupByCategory(items || []);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a packing item"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-white shadow-soft">
          <FiPlus /> Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <FiRotateCcw /> Reset all
        </button>
        <button onClick={onSave} className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-soft">
          <FiSave /> Save changes
        </button>
      </div>

      <div className="grid gap-5">
        {categories.map((category) => (
          <section key={category} className="rounded-3xl border border-white/20 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-base font-semibold capitalize">{category}</h3>
            <div className="grid gap-2">
              {(grouped[category] || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.isPacked}
                      onChange={() => onToggle(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className={item.isPacked ? 'line-through text-slate-400' : ''}>{item.item}</span>
                  </label>
                  <button onClick={() => onDelete(item.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              {!grouped[category]?.length && (
                <p className="text-sm text-slate-500">No items in this category.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
