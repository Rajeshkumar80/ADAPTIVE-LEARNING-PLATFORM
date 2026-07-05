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
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#fffdf9',
  border: '1px solid hsl(40 10% 88%)',
  borderRadius: '8px',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.04)',
};

const axisStyle = {
  stroke: 'hsl(240 4% 70%)',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

// ===== Student Engagement Chart (replaces stock-like activity) =====
export function ActivityChart({ data: propData }: { data?: { week: string; studyHours: number; aiQueries: number; testsTaken: number }[] }) {
  const data = propData || [
    { week: 'W1', studyHours: 28, aiQueries: 12, testsTaken: 3 },
    { week: 'W2', studyHours: 32, aiQueries: 18, testsTaken: 4 },
    { week: 'W3', studyHours: 35, aiQueries: 22, testsTaken: 5 },
    { week: 'W4', studyHours: 38, aiQueries: 28, testsTaken: 4 },
    { week: 'W5', studyHours: 42, aiQueries: 35, testsTaken: 6 },
    { week: 'W6', studyHours: 40, aiQueries: 32, testsTaken: 5 },
    { week: 'W7', studyHours: 45, aiQueries: 38, testsTaken: 7 },
    { week: 'W8', studyHours: 48, aiQueries: 42, testsTaken: 6 },
    { week: 'W9', studyHours: 52, aiQueries: 45, testsTaken: 8 },
    { week: 'W10', studyHours: 50, aiQueries: 48, testsTaken: 7 },
    { week: 'W11', studyHours: 55, aiQueries: 52, testsTaken: 9 },
    { week: 'W12', studyHours: 58, aiQueries: 56, testsTaken: 8 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b8f71" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#6b8f71" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b8956b" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#b8956b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 10% 88%)" vertical={false} />
        <XAxis dataKey="week" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={6} />
        <Area type="monotone" dataKey="studyHours" stroke="#6b8f71" strokeWidth={2} fill="url(#hoursGrad)" name="Study hours" />
        <Area type="monotone" dataKey="aiQueries" stroke="#b8956b" strokeWidth={1.5} fill="url(#aiGrad)" name="AI queries" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== Subject Mastery Radar (NEW for AI education) =====
export function SubjectMasteryRadar({ data: propData }: { data?: { subject: string; mastery: number; classAvg: number }[] }) {
  const data = propData || [
    { subject: 'DSA', mastery: 85, classAvg: 75 },
    { subject: 'DBMS', mastery: 92, classAvg: 78 },
    { subject: 'OS', mastery: 78, classAvg: 72 },
    { subject: 'CN', mastery: 88, classAvg: 76 },
    { subject: 'SE', mastery: 95, classAvg: 80 },
    { subject: 'AI', mastery: 82, classAvg: 74 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="hsl(240 6% 92%)" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(240 4% 46%)' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(240 4% 60%)' }} stroke="hsl(240 6% 92%)" />
        <Radar name="Class avg" dataKey="classAvg" stroke="hsl(240 4% 65%)" fill="hsl(240 4% 65%)" fillOpacity={0.15} strokeWidth={1.5} />
        <Radar name="Top performer" dataKey="mastery" stroke="hsl(240 10% 4%)" fill="hsl(240 10% 4%)" fillOpacity={0.25} strokeWidth={2} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={6} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ===== Performance Distribution (replaces stock bars) =====
export function PerformanceChart({ data: propData }: { data?: { subject: string; score: number }[] }) {
  const data = propData || [
    { subject: 'DSA', score: 85 },
    { subject: 'DBMS', score: 92 },
    { subject: 'OS', score: 78 },
    { subject: 'CN', score: 88 },
    { subject: 'SE', score: 95 },
    { subject: 'AI', score: 82 },
  ];

  const barColors = ['#6b8f71', '#8faa91', '#7c9a82', '#5c7f63', '#9ab89e', '#4a6e50'];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 10% 88%)" vertical={false} />
        <XAxis dataKey="subject" {...axisStyle} />
        <YAxis {...axisStyle} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(40 12% 93%)' }} />
        <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={barColors[i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ===== Score Distribution (Grade Distribution) =====
export function GradeDistribution() {
  const data = [
    { grade: 'A+', count: 23, color: 'hsl(142 70% 45%)' },
    { grade: 'A', count: 38, color: 'hsl(142 60% 55%)' },
    { grade: 'B+', count: 45, color: 'hsl(45 80% 55%)' },
    { grade: 'B', count: 28, color: 'hsl(35 85% 55%)' },
    { grade: 'C', count: 15, color: 'hsl(15 80% 60%)' },
    { grade: 'F', count: 7, color: 'hsl(0 70% 55%)' },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 92%)" vertical={false} />
        <XAxis dataKey="grade" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 5% 96%)' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ===== Test Score Trend =====
export function TestTrendsChart({ data: propData }: { data?: { month: string; score: number }[] }) {
  const data = propData || [
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
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 10% 88%)" vertical={false} />
        <XAxis dataKey="month" {...axisStyle} />
        <YAxis {...axisStyle} domain={[60, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#5c7f63"
          strokeWidth={2.5}
          dot={{ fill: '#5c7f63', r: 4, strokeWidth: 2, stroke: 'white' }}
          activeDot={{ r: 6, strokeWidth: 2, fill: '#4a6e50' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ===== Topic Distribution =====
export function SubjectDistribution({ data: propData }: { data?: { name: string; value: number; hours: string }[] }) {
  const data = propData || [
    { name: 'DSA', value: 25, hours: '62h' },
    { name: 'DBMS', value: 20, hours: '50h' },
    { name: 'OS', value: 18, hours: '45h' },
    { name: 'CN', value: 15, hours: '38h' },
    { name: 'SE', value: 12, hours: '30h' },
    { name: 'AI', value: 10, hours: '25h' },
  ];

  const colors = ['#5c7f63', '#8faa91', '#b8956b', '#d4a574', '#7c9a82', '#a3c4a8'];

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="55%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={2} dataKey="value">
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index]} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i] }} />
            <div className="flex-1 flex items-center justify-between">
              <span className="text-xs font-medium">{item.name}</span>
              <span className="text-[11px] text-muted-foreground">{item.hours}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
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
        <Area type="monotone" dataKey="value" stroke="hsl(240 10% 4%)" strokeWidth={1.5} fill="url(#sparkGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ===== Class Engagement Heatmap (visual representation) =====
export function EngagementHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];

  // intensity 0-4
  const data = [
    [1, 2, 3, 4, 3, 2, 1],
    [2, 3, 4, 4, 4, 3, 2],
    [2, 3, 4, 4, 3, 2, 1],
    [3, 4, 4, 3, 4, 3, 2],
    [3, 4, 4, 4, 3, 2, 1],
    [1, 2, 2, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 0, 0],
  ];

  const intensityColors = [
    'hsl(240 6% 96%)',
    'hsl(240 6% 85%)',
    'hsl(240 6% 65%)',
    'hsl(240 6% 35%)',
    'hsl(240 10% 4%)',
  ];

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 gap-1 text-[10px]" style={{ minWidth: 320 }}>
        <div></div>
        {hours.map(h => (
          <div key={h} className="text-center text-muted-foreground pb-1">{h}</div>
        ))}
        {days.map((day, di) => (
          <>
            <div key={day} className="text-muted-foreground pr-2 text-right py-1.5">{day}</div>
            {data[di].map((intensity, hi) => (
              <div
                key={`${di}-${hi}`}
                className="rounded-sm aspect-square hover:ring-2 hover:ring-foreground/20 transition-all cursor-pointer"
                style={{ backgroundColor: intensityColors[intensity] }}
                title={`${day} ${hours[hi]}: ${intensity * 25} students active`}
              />
            ))}
          </>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted-foreground">
        <span>Less</span>
        {intensityColors.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ===== Assignment Status Stack (kept for compatibility) =====
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
