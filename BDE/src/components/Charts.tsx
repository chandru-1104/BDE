import { Lead } from '../lib/supabase';

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 capitalize">
                {item.label}
              </span>
              <span className="text-sm font-bold text-slate-900">{item.value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = 0;
  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="flex items-center gap-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {segments.map((segment, index) => {
              const radius = 40;
              const centerX = 50;
              const centerY = 50;

              const startAngle = (segment.startAngle * Math.PI) / 180;
              const endAngle = (segment.endAngle * Math.PI) / 180;

              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              const largeArc = segment.percentage > 50 ? 1 : 0;

              const pathData =
                segment.percentage === 100
                  ? `M ${centerX},${centerY} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
                  : `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

              const colorMap: { [key: string]: string } = {
                'bg-blue-500': '#3b82f6',
                'bg-yellow-500': '#eab308',
                'bg-emerald-500': '#10b981',
                'bg-orange-500': '#f97316',
                'bg-green-500': '#22c55e',
                'bg-red-500': '#ef4444',
              };

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colorMap[segment.color] || '#94a3b8'}
                  className="hover:opacity-80 transition-opacity"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex-1 space-y-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {segment.label}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">{segment.value}</div>
                <div className="text-xs text-slate-500">
                  {segment.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { month: string; revenue: number; leads: number }[];
  title: string;
}

export function LineChart({ data, title }: LineChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const maxLeads = Math.max(...data.map((d) => d.leads), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-emerald-600">Revenue</span>
            <span className="text-sm text-slate-500">
              ${(data.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(0)}K Total
            </span>
          </div>
          <div className="relative h-24">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 rounded-t-lg flex items-end" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">Leads</span>
            <span className="text-sm text-slate-500">
              {data.reduce((sum, d) => sum + d.leads, 0)} Total
            </span>
          </div>
          <div className="relative h-24">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 rounded-t-lg flex items-end" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(item.leads / maxLeads) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function getLeadsByStatus(leads: Lead[]) {
  return [
    {
      label: 'new',
      value: leads.filter((l) => l.status === 'new').length,
      color: 'bg-blue-500',
    },
    {
      label: 'contacted',
      value: leads.filter((l) => l.status === 'contacted').length,
      color: 'bg-yellow-500',
    },
    {
      label: 'qualified',
      value: leads.filter((l) => l.status === 'qualified').length,
      color: 'bg-emerald-500',
    },
    {
      label: 'negotiating',
      value: leads.filter((l) => l.status === 'negotiating').length,
      color: 'bg-orange-500',
    },
    {
      label: 'won',
      value: leads.filter((l) => l.status === 'won').length,
      color: 'bg-green-500',
    },
    {
      label: 'lost',
      value: leads.filter((l) => l.status === 'lost').length,
      color: 'bg-red-500',
    },
  ];
}

export function getLeadsBySource(leads: Lead[]) {
  const sources = [...new Set(leads.map((l) => l.lead_source))];
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'];

  return sources.map((source, index) => ({
    label: source,
    value: leads.filter((l) => l.lead_source === source).length,
    color: colors[index % colors.length],
  }));
}
