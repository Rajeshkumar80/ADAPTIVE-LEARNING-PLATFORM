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

// ===== Activity Area Chart (like the reference) =====
export function ActivityChart() {
  const data = [
    { date: 'Feb 17', active: 4500, new: 2300, returning: 1200 },
    { date: 'Feb 24', active: 5200, new: 2800, returning: 1400 },
    { date: 'Mar 1', active: 4800, new: 2500, returning: 1300 },
    { date: 'Mar 8', active: 6100, new: 3200, returning: 1800 },
    { date: 'Mar 15', active: 5500, new: 2900, returning: 1600 },
    { date: 'Mar 22', active: 7200, new: 3800, returning: 2100 },
    { date: 'Mar 29', active: 8500, new: 4200, returning: 2400 },
    { date: 'Apr 5', active: 6800, new: 3500, returning: 1900 },
    { date: 'Apr 11', active: 7500, new: 3900, returning: 2200 },
    { date: 'Apr 18', active: 8200, new: 4100, returning: 2300 },
    { date: 'Apr 24', active: 6500, new: 3300, returning: 1800 },
    { date: 'May 1', active: 7800, new: 4000, returning: 2200 },
    { date: 'May 7', active: 8500, new: 4300, returning: 2400 },
    { date: 'May 15', active: 9200, new: 4600, returning: 2600 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#171717" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#171717" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#737373" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#737373" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="date" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Area type="monotone" dataKey="active" stroke="#171717" strokeWidth={2} fill="url(#colorActive)" name="Active" />
        <Area type="monotone" dataKey="new" stroke="#737373" strokeWidth={2} fill="url(#colorNew)" name="New" />
        <Area type="monotone" dataKey="returning" stroke="#a3a3a3" strokeWidth={2} fill="url(#colorReturning)" name="Returning" />
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
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="subject" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="score" fill="#171717" radius={[4, 4, 0, 0]} name="Your Score" />
        <Bar dataKey="average" fill="#d4d4d4" radius={[4, 4, 0, 0]} name="Class Average" />
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
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="month" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Line type="monotone" dataKey="tests" stroke="#171717" strokeWidth={2} dot={{ fill: '#171717', r: 3 }} />
        <Line type="monotone" dataKey="score" stroke="#737373" strokeWidth={2} dot={{ fill: '#737373', r: 3 }} />
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

  const colors = ['#171717', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4'];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={90}
          fill="#171717"
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ===== Progress Radial Chart =====
export function ProgressRadial() {
  const data = [
    { name: 'Completed', value: 78, fill: '#171717' },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" data={data} startAngle={180} endAngle={0}>
        <RadialBar background={{ fill: '#f5f5f5' }} dataKey="value" cornerRadius={10} />
        <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-900">
          78%
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500">
          Course Progress
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

// ===== Mini Sparkline =====
export function MiniSparkline({ data, positive = true }: { data: number[]; positive?: boolean }) {
  const chartData = data.map((value, index) => ({ index, value }));
  const color = positive ? '#16a34a' : '#dc2626';

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${positive ? 'green' : 'red'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${positive ? 'green' : 'red'})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== Bar chart for assignment status =====
export function AssignmentStatusChart() {
  const data = [
    { class: 'G11A', overdue: 8, pending: 12, submitted: 25 },
    { class: 'G11B', overdue: 5, pending: 15, submitted: 22 },
    { class: 'G11C', overdue: 10, pending: 8, submitted: 28 },
    { class: 'G11D', overdue: 6, pending: 18, submitted: 20 },
    { class: 'G11E', overdue: 4, pending: 10, submitted: 30 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="class" stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        <Bar dataKey="overdue" fill="#171717" name="Overdue" />
        <Bar dataKey="pending" fill="#737373" name="Pending" />
        <Bar dataKey="submitted" fill="#d4d4d4" name="Submitted" />
      </BarChart>
    </ResponsiveContainer>
  );
}
