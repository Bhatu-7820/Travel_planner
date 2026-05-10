import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { tripService } from '@/services/tripService';
import BudgetChart from '@/components/BudgetChart';
import { getErrorMessage } from '@/utils/helpers';

export default function BudgetBreakdown() {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const data = await tripService.getBudget(id);
      setBudget(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget();
  }, [id]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Budget Breakdown</h1>
        <p className="text-sm text-slate-500">Stay, meals, transport, and activities are calculated from your trip.</p>
      </div>

      {loading && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">Loading budget...</div>}

      {budget && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
              <p className="text-sm text-slate-500">Total cost</p>
              <p className="mt-2 text-3xl font-black">₹{budget.total.toFixed(0)}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
              <p className="text-sm text-slate-500">Average / day</p>
              <p className="mt-2 text-3xl font-black">₹{budget.averagePerDay.toFixed(0)}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
              <p className="text-sm text-slate-500">Stay</p>
              <p className="mt-2 text-3xl font-black">₹{budget.stay.toFixed(0)}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
              <p className="text-sm text-slate-500">Activities</p>
              <p className="mt-2 text-3xl font-black">₹{budget.activities.toFixed(0)}</p>
            </div>
          </div>

          {budget.daily.some((day) => day.total > budget.averagePerDay * 1.5) && (
            <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
              Warning: one or more days exceed 150% of your average daily cost.
            </div>
          )}

          <BudgetChart budget={budget} />
        </>
      )}
    </motion.div>
  );
}
