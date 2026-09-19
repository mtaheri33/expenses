// This is a component for an expense date by amount scatter chart.

import styles from './DateByAmountScatterChart.module.css';
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatDateForDisplay,
  formatAmountForDisplay,
  formatYearMonthForDisplay,
} from '../../../../utilities';

export default function DateByAmountScatterChart({ expenses }) {
  /*
  expenses required array [object]
  */
  function buildChartData(expenses) {
    return expenses.map((expense) => {
      return {
        ...expense,
        timestamp: Date.parse(`${expense.date}T00:00:00.000Z`),
      }
    }).sort((firstExpense, secondExpense) => firstExpense.timestamp - secondExpense.timestamp);
  }

  function formatXAxisTick(timestamp) {
    return formatYearMonthForDisplay(new Date(timestamp).toISOString().slice(0, 7));
  }

  function buildXAxisTicks(chartData) {
    const months = new Set();
    return chartData.reduce((ticks, expense) => {
      const yearMonthKey = expense.date.slice(0, 7);
      if (!months.has(yearMonthKey)) {
        months.add(yearMonthKey);
        ticks.push(expense.timestamp);
      }
      return ticks;
    }, []);
  }

  function buildXAxisDomain([minimum, maximum]) {
    // For a single date, extend the axis by one day on each side to avoid a zero-width range and
    // center the dots.
    const day = 24 * 60 * 60 * 1000;
    return minimum === maximum ? [minimum - day, maximum + day] : [minimum, maximum];
  }

  function CustomTooltip({ active, payload }) {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const expense = payload[0].payload;
    return (
      <div className={`chartTooltip ${styles.chartTooltip}`}>
        <div className={`chartTooltipLabel ${styles.chartTooltipLabel}`}>
          {formatDateForDisplay(expense.date)}
        </div>
        <div className={styles.tooltipDescription}>{expense.description}</div>
        <div className={styles.tooltipValue}>{formatAmountForDisplay(expense.amount)}</div>
        <div className={styles.tooltipCategories}>
          {expense.categories.length > 0 ? expense.categories.join(' | ') : 'Uncategorized'}
        </div>
      </div>
    );
  }

  function CustomDot({ cx, cy, payload }) {
    if (cx == null || cy == null) {
      return null;
    }
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={payload.amount < 0 ? '#b47846' : 'steelblue'}
        fillOpacity={0.65}
      />
    );
  }

  const chartData = buildChartData(expenses);
  const xAxisTicks = buildXAxisTicks(chartData);
  const chartDataTotal = chartData.reduce((sum, data) => sum + data.amount, 0);

  return (
    <section className={`DateByAmountScatterChart chartCard ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Individual expense amounts over time</h1>
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
            <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} syncWithTicks />
              <XAxis
                dataKey='timestamp'
                name='Date'
                type='number'
                scale='utc'
                domain={buildXAxisDomain}
                tickFormatter={formatXAxisTick}
                ticks={xAxisTicks}
                angle={-30}
                height={56}
                textAnchor='end'
                tickLine={false}
                padding={{ left: 8, right: 8 }}
              />
              <YAxis
                dataKey='amount'
                name='Amount'
                type='number'
                tickFormatter={formatAmountForDisplay}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <ReferenceLine y={0} stroke='#8ba3b9' />
              <Scatter name='Expenses' data={chartData} shape={CustomDot} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      }
    </section>
  );
}
