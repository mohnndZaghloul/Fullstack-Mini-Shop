import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import KPICard from '../components/KPICard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { DashboardStats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStart = today.toISOString();
      const todayEnd = new Date(today.getTime() + 86400000).toISOString();
      const eightDaysAgo = new Date(today);
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);

      const [ordersTodayRes, revenueTodayRes, activeProductsRes, ordersPerDayRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', todayStart).lt('created_at', todayEnd),
        supabase.from('orders').select('total_amount').gte('created_at', todayStart).lt('created_at', todayEnd),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('created_at').gte('created_at', eightDaysAgo.toISOString()),
      ]);

      const revenueToday = (revenueTodayRes.data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);

      const localDateStr = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const ordersPerDay: { date: string; count: number }[] = [];
      const dayCounts: Record<string, number> = {};
      (ordersPerDayRes.data || []).forEach((o) => {
        const key = localDateStr(new Date(o.created_at));
        dayCounts[key] = (dayCounts[key] || 0) + 1;
      });
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        ordersPerDay.push({ date: localDateStr(d), count: dayCounts[localDateStr(d)] || 0 });
      }

      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(*))')
        .order('created_at', { ascending: false })
        .limit(5);

      const userIds = [...new Set((recentOrders || []).map((o) => o.user_id))];
      const { data: profiles } = userIds.length > 0
        ? await supabase.from('profiles').select('*').in('id', userIds)
        : { data: [] };
      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

      setStats({
        ordersToday: ordersTodayRes.count || 0,
        revenueToday,
        activeProducts: activeProductsRes.count || 0,
        ordersPerDay,
        recentOrders: (recentOrders || []).map((o) => ({ ...o, profile: profileMap[o.user_id] })) as DashboardStats['recentOrders'],
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Orders Today"
          value={stats?.ordersToday ?? '-'}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="#77ec7a"
          loading={loading}
        />
        <KPICard
          title="Revenue Today"
          value={stats ? `$${stats.revenueToday.toFixed(2)}` : '-'}
          icon={<DollarSign className="h-6 w-6" />}
          color="#10B981"
          loading={loading}
        />
        <KPICard
          title="Active Products"
          value={stats?.activeProducts ?? '-'}
          icon={<Package className="h-6 w-6" />}
          color="#F59E0B"
          loading={loading}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Orders Per Day (Last 7 Days)</h2>
          {loading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.ordersPerDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="count" fill="#77ec7a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Orders</h2>
          {loading ? (
            <LoadingSkeleton variant="table-row" rows={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-medium uppercase text-slate-500">
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 text-slate-900">
                        {order.profile?.name || order.profile?.email || 'N/A'}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        ${order.total_amount?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
