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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: 'white',
  border: '1px solid hsl(240 6% 92%)',
  borderRadius: '8px',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)',
};

const axisStyle = {
  stroke: 'hsl(240 4% 70%)',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

// ===== Activity Area Chart =====
export function ActivityChart() {
  const data = [
    { date: 'Feb 17', value: 4500, secondary: 2300 },
    { date: 'Feb 24', value: 5200, secondary: 2800 },
    { date: 'Mar 1', value: 4800, secondary: 2500 },
    { date: 'Mar 8', value: 6100, secondary: 3200 },
    { date: 'Mar 15', value: 5500, secondary: 2900 },
    { date: 'Mar 22', value: 7200, secondary: 3800 },
    { date: 'Mar 29', value: 8500, secondary: 4200 },
    { date: 'Apr 5', value: 6800, secondary: 3500 },
    { date: 'Apr 11', value: 7500, secondary: 3900 },
    { date: 'Apr 18', value: 8200, secondary: 4100 },
    { date: 'Apr 24', value: 6500, secondary: 3300 },
    { date: 'May 1', value: 7800, secondary: 4000 },
    { date: 'May 7', value: 8500, secondary: 4300 },
    { date: 'May 15', value: 9200, secondary: 4600 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(240 10% 4%)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="hsl(240 10% 4%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 92%)" vertical={false} />
        <XAxis dataKey="date" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'hsl(240 6% 86%)', strokeDasharray: 3 }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(240 10% 4%)"
          strokeWidth={2}
          fill="url(#colorPrimary)"
          name="Active"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== Performance Bar Chart =====
export function PerformanceChart() {
  const data = [
    { subject: 'DSA', score: 85 },
    { subject: 'DBMS', score: 92 },
    { subject: 'OS', score: 78 },
    { subject: 'CN', score: 88 },
    { subject: 'SE', score: 95 },
    { subject: 'AI', score: 82 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 92%)" vertical={false} />
        <XAxis dataKey="subject" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 5% 96%)' }} />
        <Bar dataKey="score" fill="hsl(240 10% 4%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ===== Test Trends Line Chart =====
export function TestTrendsChart() {
  const data = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 75 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 85 },
    { month: 'Jun', score: 88 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 92%)" vertical={false} />
        <XAxis dataKey="month" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="hsl(240 10% 4%)"
          strokeWidth={2}
          dot={{ fill: 'hsl(240 10% 4%)', r: 3, strokeWidth: 2, stroke: 'white' }}
          activeDot={{ r: 5, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ===== Subject Distribution Pie Chart =====
export function SubjectDistribution() {
  const data = [
    { name: 'DSA', value: 25 },
    { name: 'DBMS', value: 20 },
    { name: 'OS', value: 18 },
    { name: 'CN', value: 15 },
    { name: 'SE', value: 12 },
    { name: 'AI', value: 10 },
  ];

  const colors = ['hsl(240 10% 4%)', 'hsl(240 6% 25%)', 'hsl(240 5% 45%)', 'hsl(240 4% 65%)', 'hsl(240 4% 80%)', 'hsl(240 6% 92%)'];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} stroke="white" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ===== Mini Sparkline =====
export function MiniSparkline({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(240 10% 4%)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="hsl(240 10% 4%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(240 10% 4%)"
          strokeWidth={1.5}
          fill="url(#sparkGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== Assignment Status (for admin) =====
export function AssignmentStatusChart() {
  const data = [
    { class: 'A', overdue: 8, pending: 12, submitted: 25 },
    { class: 'B', overdue: 5, pending: 15, submitted: 22 },
    { class: 'C', overdue: 10, pending: 8, submitted: 28 },
    { class: 'D', overdue: 6, pending: 18, submitted: 20 },
    { class: 'E', overdue: 4, pending: 10, submitted: 30 },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 92%)" vertical={false} />
        <XAxis dataKey="class" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 5% 96%)' }} />
        <Bar dataKey="submitted" fill="hsl(240 10% 4%)" radius={[3, 3, 0, 0]} stackId="a" />
        <Bar dataKey="pending" fill="hsl(240 4% 65%)" radius={[0, 0, 0, 0]} stackId="a" />
        <Bar dataKey="overdue" fill="hsl(240 6% 92%)" radius={[0, 0, 3, 3]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
