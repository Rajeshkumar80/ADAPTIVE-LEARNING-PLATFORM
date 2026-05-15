'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ===== Area Chart =====
export function StudyHoursChart() {
  const data = [
    { day: 'Mon', hours: 4.5, target: 5 },
    { day: 'Tue', hours: 5.2, target: 5 },
    { day: 'Wed', hours: 3.8, target: 5 },
    { day: 'Thu', hours: 6.1, target: 5 },
    { day: 'Fri', hours: 5.5, target: 5 },
    { day: 'Sat', hours: 7.2, target: 5 },
    { day: 'Sun', hours: 4.0, target: 5 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#6366f1"
          fillOpacity={1}
          fill="url(#colorHours)"
          strokeWidth={2}
          name="Study Hours"
        />
        <Area
          type="monotone"
          dataKey="target"
          stroke="#a855f7"
          fillOpacity={1}
          fill="url(#colorTarget)"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Target"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== Performance Bar Chart =====
export function PerformanceChart() {
  const data = [
    { subject: 'DSA', score: 85, average: 75 },
    { subject: 'DBMS', score: 92, average: 78 },
    { subject: 'OS', score: 78, average: 72 },
    { subject: 'CN', score: 88, average: 76 },
    { subject: 'SE', score: 95, average: 80 },
    { subject: 'AI', score: 82, average: 74 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} name="Your Score" />
        <Bar dataKey="average" fill="#e0e7ff" radius={[8, 8, 0, 0]} name="Class Average" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ===== Test Trends Line Chart =====
export function TestTrendsChart() {
  const data = [
    { month: 'Jan', tests: 4, score: 72 },
    { month: 'Feb', tests: 6, score: 75 },
    { month: 'Mar', tests: 8, score: 78 },
    { month: 'Apr', tests: 10, score: 82 },
    { month: 'May', tests: 12, score: 85 },
    { month: 'Jun', tests: 15, score: 88 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
        <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="tests"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: '#6366f1', r: 4 }}
          activeDot={{ r: 6 }}
          name="Tests Taken"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="score"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Avg Score"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ===== Subject Distribution Pie Chart =====
export function SubjectDistribution() {
  const data = [
    { name: 'DSA', value: 25, color: '#6366f1' },
    { name: 'DBMS', value: 20, color: '#8b5cf6' },
    { name: 'OS', value: 18, color: '#ec4899' },
    { name: 'CN', value: 15, color: '#f59e0b' },
    { name: 'SE', value: 12, color: '#10b981' },
    { name: 'AI', value: 10, color: '#06b6d4' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ===== Progress Radial Chart =====
export function ProgressRadial() {
  const data = [
    { name: 'Completed', value: 78, fill: '#6366f1' },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data} startAngle={180} endAngle={0}>
        <RadialBar background dataKey="value" cornerRadius={10} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-900">
          78%
        </text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">
          Course Progress
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

// ===== Mini Sparkline =====
export function MiniSparkline({ data, color = '#6366f1' }: { data: number[]; color?: string }) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.5} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#sparkline-${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
