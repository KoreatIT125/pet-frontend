import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyCount, TypeShare } from '../../lib/dashboardStats'
import { formatEventType } from '../../lib/eventLabels'
import { Card } from '../ui/Card'

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#14b8a6']

function formatDayLabel(yyyyMmDd: string): string {
  const [, m, d] = yyyyMmDd.split('-')
  return `${m}/${d}`
}

export function DashboardCharts({
  daily,
  typeShares,
}: {
  daily: DailyCount[]
  typeShares: TypeShare[]
}) {
  const pieData = typeShares.map((t) => ({
    name: formatEventType(t.name),
    value: t.value,
  }))

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card title="일별 이벤트 수" description="최근 7일간 탐지된 이벤트 추세">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tickFormatter={formatDayLabel} stroke="#64748b" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0)}건`, '이벤트']}
                labelFormatter={(l) => `날짜: ${l}`}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="이벤트 타입 비율" description="유형별 분포(건수 기준)">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${Number(value ?? 0)}건`, String(name ?? '')]}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
