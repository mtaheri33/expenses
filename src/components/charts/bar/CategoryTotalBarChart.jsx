// This is a component for a category total amount bar chart.

import styles from './CategoryTotalBarChart.module.css';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  totalsByCategory,
  formatAmountForDisplay,
} from '../../../../utilities';

export default function CategoryTotalBarChart({ expenses }) {
  /*
  expenses required array [object]
  */
  function buildChartData(expenses) {
    const totals = totalsByCategory(expenses);
    return Object.entries(totals)
      .sort(([, firstTotal], [, secondTotal]) => secondTotal - firstTotal)
      .map(([category, total]) => {
        return {
          category,
          total,
        };
      });
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    return (
      <div className={`chartTooltip ${styles.chartTooltip}`}>
        <div className={`chartTooltipLabel ${styles.chartTooltipLabel}`}>{label}</div>
        <div className={styles.tooltipValue}>{formatAmountForDisplay(payload[0].value)}</div>
      </div>
    );
  }

  function CustomBar(props) {
    return (
      <Rectangle
        {...props}
        fill={props.payload.total < 0 ? '#b47846' : 'steelblue'}
      />
    );
  }

  const chartData = buildChartData(expenses);
  const chartDataTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <section className={`CategoryTotalBarChart chartCard ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Category totals</h1>
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
            <BarChart
              data={chartData}
              layout='vertical'
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' horizontal={false} />
              <XAxis
                type='number'
                tickFormatter={formatAmountForDisplay}
                tickLine={false}
                height={40}
              />
              <YAxis
                dataKey='category'
                type='category'
                interval={0}
                tick={{ fontSize: '.75vw' }}
                tickLine={false}
                width={160}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(70, 130, 180, 0.08)' }} />
              <ReferenceLine x={0} stroke='#8ba3b9' />
              <Bar dataKey='total' barSize={24} radius={[0, 8, 8, 0]} shape={CustomBar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
    </section>
  );
}
