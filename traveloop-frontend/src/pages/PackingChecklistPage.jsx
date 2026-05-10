import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { tripService } from '@/services/tripService';
import PackingChecklist from '@/components/PackingChecklist';
import { getErrorMessage } from '@/utils/helpers';

export default function PackingChecklistPage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [loading, setLoading] = useState(true);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const trip = await tripService.getTripById(id);
      setItems(trip.packing || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const addItem = () => {
    if (!newItem.trim()) return toast.error('Item name is required');
    setItems((prev) => [
      ...prev,
      { id: `pack_${Date.now()}`, item: newItem.trim(), isPacked: false, category: newCategory },
    ]);
    setNewItem('');
  };

  const toggle = (itemId) => setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, isPacked: !item.isPacked } : item)));
  const remove = (itemId) => setItems((prev) => prev.filter((item) => item.id !== itemId));
  const reset = () => setItems((prev) => prev.map((item) => ({ ...item, isPacked: false })));

  const save = async () => {
    try {
      await tripService.updatePacking(id, items);
      toast.success('Packing list saved');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Packing Checklist</h1>
        <p className="text-sm text-slate-500">Organize items by category and save your checklist.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">Loading packing list...</div>
      ) : (
        <PackingChecklist
          items={items}
          newItem={newItem}
          setNewItem={setNewItem}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          onAdd={addItem}
          onToggle={toggle}
          onDelete={remove}
          onReset={reset}
          onSave={save}
        />
      )}
    </motion.div>
  );
}
