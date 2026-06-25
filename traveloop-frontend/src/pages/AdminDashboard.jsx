import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { getErrorMessage } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('overview');

  const load = async () => {
    try {
      const [statsRes, usersRes, reqRes, tripRes, ticketRes, couponRes, destRes, logRes] = await Promise.all([
        api.get('/api/admin/stats'), 
        api.get('/api/admin/users'),
        api.get('/api/admin/requests'),
        api.get('/api/admin/trips'),
        api.get('/api/support/tickets'),
        api.get('/api/support/coupons'),
        api.get('/api/admin/destinations'),
        api.get('/api/admin/logs')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRequests(reqRes.data);
      setAllTrips(tripRes.data);
      setTickets(ticketRes.data);
      setCoupons(couponRes.data);
      setDestinations(destRes.data);
      setLogs(logRes.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    load();
  }, [user, navigate]);

  const handleRequest = async (id, status) => {
    try {
      await api.put(`/api/admin/requests/${id}`, { status });
      toast.success(`Request ${status}`);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const chartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Users', value: stats.totalUsers },
      { name: 'Trips', value: stats.totalTrips },
      { name: 'Avg Stops', value: Number(stats.averageStopsPerTrip.toFixed(1)) },
    ];
  }, [stats]);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      const usersRes = await api.get('/api/admin/users');
      setUsers(usersRes.data);
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (user?.role !== 'admin') return null;

  const colors = ['#14b8a6', '#3b82f6', '#f97316'];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-hide">
        {['overview', 'users', 'trips', 'requests', 'support', 'coupons', 'destinations', 'logs'].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${tab === t ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {chartData.map((item, i) => (
              <div key={item.name} className="rounded-3xl p-5 glass-panel relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${i===0?'from-teal-500/10':i===1?'from-blue-500/10':'from-orange-400/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <p className="text-sm font-semibold tracking-wide text-slate-500 relative z-10">{item.name.toUpperCase()}</p>
                <p className="mt-2 text-4xl font-black text-slate-800 dark:text-slate-100 relative z-10">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl p-5 glass-panel">
              <h3 className="mb-4 text-xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">System Metrics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{borderRadius: '16px', border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff'}} />
                    <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-3xl p-5 glass-panel">
              <h3 className="mb-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Popular Cities</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.popularCities} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                      {stats.popularCities.map((entry, index) => (
                        <Cell key={entry.name} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff'}} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold">All Registered Users</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-slate-500">{u.email} · {u.tripCount} trips</p>
                </div>
                <button onClick={() => deleteUser(u.id)} className="rounded-full border border-rose-200 p-2 text-rose-600 dark:border-rose-900/50 dark:text-rose-300">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'trips' && (
        <div className="space-y-4">
           <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold">Global Trip Inventory</h3>
            <p className="text-sm text-slate-500">View and manage any itinerary in the system.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allTrips.map(t => (
              <div key={t._id} className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <img src={t.coverImage || t.coverPhoto} loading="lazy" decoding="async" className="h-32 w-full object-cover" alt={t.name} />
                <div className="p-4">
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-xs text-slate-500">By: {t.userId?.name || 'Unknown'}</p>
                  <button onClick={() => navigate(`/trip/${t._id}/builder`)} className="mt-4 w-full rounded-full bg-slate-900 py-2 text-sm font-bold text-white">Plan for User</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'support' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold">Customer Support Tickets</h3>
            <p className="text-sm text-slate-500">Handle user inquiries and technical issues.</p>
          </div>
          <div className="grid gap-4">
            {tickets.map(tk => (
              <div key={tk._id} className="rounded-3xl border border-white/20 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${tk.status === 'Open' ? 'bg-rose-100 text-rose-600' : 'bg-teal-100 text-teal-600'}`}>
                      {tk.status}
                    </span>
                    <h4 className="mt-1 font-bold">{tk.subject}</h4>
                    <p className="text-sm text-slate-500">From: {tk.userId?.name} · Priority: {tk.priority}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => api.put(`/api/support/tickets/${tk._id}`, { status: 'Resolved' }).then(load)} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold dark:bg-slate-800">Resolve</button>
                  </div>
                </div>
                <p className="mt-4 text-sm bg-slate-50 p-4 rounded-2xl dark:bg-slate-950/50">{tk.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <div>
              <h3 className="text-xl font-bold">Promo Codes & Discounts</h3>
              <p className="text-sm text-slate-500">Create and manage active platform coupons.</p>
            </div>
            <button onClick={() => {
              const code = prompt('Enter Coupon Code:');
              const val = prompt('Discount Value (Number):');
              if (code && val) {
                api.post('/api/support/coupons', { code, discountValue: Number(val), expiryDate: new Date(Date.now() + 7*24*60*60*1000) }).then(load);
              }
            }} className="rounded-full bg-teal-500 px-6 py-2 text-sm font-bold text-white shadow-soft">Create Coupon</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map(c => (
              <div key={c._id} className="rounded-3xl border border-dashed border-teal-500/30 bg-white p-6 shadow-soft dark:bg-slate-900">
                <p className="text-2xl font-black text-teal-600 uppercase tracking-tighter">{c.code}</p>
                <p className="text-sm text-slate-500 mt-1">{c.discountType === 'Percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}</p>
                <p className="text-xs text-slate-400 mt-4 uppercase font-bold tracking-widest">Used {c.usedCount} / {c.usageLimit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'destinations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <div>
              <h3 className="text-xl font-bold">Manage Destinations</h3>
              <p className="text-sm text-slate-500">Add or edit cities, activities, and hotel listings.</p>
            </div>
            <button onClick={() => {
              const name = prompt('City Name:');
              const country = prompt('Country:');
              if (name && country) {
                api.post('/api/admin/destinations', { name, country }).then(load);
              }
            }} className="rounded-full bg-teal-500 px-6 py-2 text-sm font-bold text-white shadow-soft">Add City</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map(d => (
              <div key={d._id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <img src={d.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600'} loading="lazy" decoding="async" className="h-32 w-full object-cover" alt={d.name} />
                <div className="p-4">
                  <h4 className="font-bold">{d.name}</h4>
                  <p className="text-sm text-slate-500">{d.country}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="text-xs font-bold text-teal-600 hover:underline">Edit</button>
                    <button onClick={() => {
                      if(window.confirm('Delete this destination?')) {
                        api.delete(`/api/admin/destinations/${d._id}`).then(load);
                      }
                    }} className="text-xs font-bold text-rose-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'logs' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold">Audit Logs & Monitoring</h3>
            <p className="text-sm text-slate-500">Track all administrative actions for security compliance.</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950">
                <tr>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map(l => (
                  <tr key={l._id}>
                    <td className="px-6 py-4 font-medium">{l.adminId?.name || 'System'}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-600 uppercase">{l.action}</span></td>
                    <td className="px-6 py-4 text-slate-500">{l.target}</td>
                    <td className="px-6 py-4 text-slate-500">{l.details}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <h3 className="text-xl font-bold">Pending Planning Requests</h3>
            <p className="text-sm text-slate-500">Respond to users seeking discounts or planning help.</p>
          </div>
          <div className="grid gap-4">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 glass-panel rounded-3xl">No requests yet</div>
            ) : (
              requests.map(r => (
                <div key={r._id} className="rounded-3xl border border-white/20 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${r.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                          {r.status}
                        </span>
                        <h4 className="font-bold">{r.type} Request for "{r.tripId?.name || 'Unknown Trip'}"</h4>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">From: {r.userId?.name} ({r.userId?.email})</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRequest(r._id, 'Approved')} className="rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-white shadow-soft">Approve</button>
                      <button onClick={() => handleRequest(r._id, 'Rejected')} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold dark:border-slate-700">Reject</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
