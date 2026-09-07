// This is a component for a daily total amount line chart.

import styles from './DayTotalLineChart.module.css';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  totalsByDay,
  formatDateForDisplay,
  formatAmountForDisplay,
  formatYearMonthForDisplay,
} from '../../../../utilities';

export default function DayTotalLineChart({ expenses }) {
  /*
  expenses required array [object]
  */
  function buildChartData(expenses) {
    const totals = totalsByDay(expenses);
    return Object.entries(totals)
      .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
      .map(([dateKey, total]) => {
        return {
          date: dateKey,
          total,
        };
      });
  }

  function buildXAxisTicks(chartData) {
    const months = new Set();
    return chartData.reduce((ticks, data) => {
      const yearMonthKey = data.date.slice(0, 7);
      if (!months.has(yearMonthKey)) {
        months.add(yearMonthKey);
        ticks.push(data.date);
      }
      return ticks;
    }, []);
  }

  function formatXAxisTick(date) {
    return formatYearMonthForDisplay(date.slice(0, 7));
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    return (
      <div className={`chartTooltip ${styles.chartTooltip}`}>
        <div className={`chartTooltipLabel ${styles.chartTooltipLabel}`}>{formatDateForDisplay(label)}</div>
        <div className={styles.tooltipValue}>{formatAmountForDisplay(payload[0].value)}</div>
      </div>
    );
  }

  const chartData = buildChartData(expenses);
  const xAxisTicks = buildXAxisTicks(chartData);
  const chartDataTotal = chartData.reduce((sum, data) => sum + data.total, 0);

  return (
    <section className={`DayTotalLineChart chartCard ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily totals</h1>
        </div>
        <div className={styles.totalContainer}>
          <div className={styles.totalLabel}>Overall total</div>
          <div className={styles.totalValue}>{formatAmountForDisplay(chartDataTotal)}</div>
        </div>
      </div>
      {chartData.length === 0 ?
        <div className={`chartEmpty ${styles.chartEmpty}`}>No expenses available yet</div>
        : <div className={styles.chartContainer}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='date'
                angle={-30}
                height={56}
                textAnchor='end'
                tickFormatter={formatXAxisTick}
                tickLine={false}
                ticks={xAxisTicks}
              />
              <YAxis tickFormatter={formatAmountForDisplay} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(70, 130, 180, 0.32)' }} />
              <ReferenceLine y={0} stroke='#8ba3b9' />
              <Line
                type='monotone'
                dataKey='total'
                stroke='steelblue'
                strokeWidth={2}
                dot={{ fill: 'white', stroke: 'steelblue', strokeWidth: 2, r: 3 }}
                activeDot={{ fill: 'steelblue', stroke: 'white', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
    </section>
  );
}
