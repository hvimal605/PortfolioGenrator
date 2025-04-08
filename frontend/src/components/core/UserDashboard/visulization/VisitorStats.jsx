import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const VisitorStats = ({ stats }) => {
  if (!stats || !stats.dailyBreakdown) return null;

  const { totalVisitors, uniqueVisitors, last7DaysCount, dailyBreakdown } = stats;

  const monthlyCounts = {};

  Object.entries(dailyBreakdown).forEach(([date, count]) => {
    const parsed = dayjs(date);
    if (parsed.year() === dayjs().year()) {
      const month = parsed.format("MMM");
      monthlyCounts[month] = (monthlyCounts[month] || 0) + count;
    }
  });

  const thisMonth = dayjs().month();
  const chartData = MONTHS.slice(0, thisMonth + 1).map((month) => ({
    month,
    count: monthlyCounts[month] || 0,
  }));

  return (
    <div className="w-full  backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl mx-auto mt-3">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 ">
        📈 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">Visitor Statistics</span>
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Visitors" value={totalVisitors} from="blue" />
        <StatCard label="Unique Visitors" value={uniqueVisitors} from="green" />
        <StatCard label="Last 7 Days" value={last7DaysCount} from="purple" />
      </div>

      {/* Chart Title */}
      <h3 className="text-lg md:text-xl font-semibold text-white mb-5">
        Monthly Visitors in {dayjs().year()}
      </h3>

      {/* Chart */}
      <div className="h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, from }) => (
    <div
      className={`relative bg-gradient-to-br from-${from}-200 to-${from}-100 text-white px-6 py-6 rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-md hover:scale-[1.04] transition-transform duration-300 group overflow-hidden`}
    >
      {/* Soft Glow Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-[2px] opacity-25 group-hover:opacity-40 transition duration-300 pointer-events-none"></div>
  
      {/* Subtle inner glow */}
      <div className="absolute -inset-1 rounded-3xl bg-white opacity-[0.015] blur-2xl pointer-events-none"></div>
  
      {/* Light accent shine */}
      <div className="absolute top-1/3 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl rotate-45 group-hover:translate-x-4 transition duration-500 ease-in-out"></div>
  
      {/* Content */}
      <p className="text-xs sm:text-sm font-medium text-white/60 tracking-wider mb-1 uppercase">
        {label}
      </p>
      <h3 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-sm">
        {value}
      </h3>
    </div>
  );
  
  

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-black p-3 rounded-lg shadow-lg border border-gray-200 text-xs">
        <p className="font-semibold">{label}</p>
        <p>Visitors: <span className="font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default VisitorStats;
