// This is a component for an amount histogram.

import styles from './AmountHistogram.module.css';
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
import { countsByAmountBin, formatAmountForDisplay } from '../../../../utilities';

export default function AmountHistogram({ expenses }) {
  /*
  expenses required array [object]
  */
  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const count = payload[0].value;
    return (
      <div className={`chartTooltip ${styles.chartTooltip}`}>
        <div className={`chartTooltipLabel ${styles.chartTooltipLabel}`}>{label}</div>
        <div className={styles.tooltipValue}>
          {formatAmountForDisplay(count)} {count === 1 ? 'expense' : 'expenses'}
        </div>
      </div>
    );
  }

  function CustomBar(props) {
    return (
      <Rectangle
        {...props}
        fill={props.payload.upperBound === 0 ? '#b47846' : 'steelblue'}
      />
    );
  }

  const chartData = countsByAmountBin(expenses);

  return (
    <section className={`AmountHistogram chartCard ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Expense amount counts</h1>
        </div>
        <div className={styles.totalContainer}>
          <div className={styles.totalLabel}>Total count</div>
          <div className={styles.totalValue}>{formatAmountForDisplay(expenses.length)}</div>
        </div>
      </div>
      {expenses.length === 0 ?
        <div className={`chartEmpty ${styles.chartEmpty}`}>No expenses available yet</div>
        : <div className={styles.chartContainer}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='range'
                type='category'
                interval={0}
                angle={-30}
                height={100}
                textAnchor='end'
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                width={70}
                label={{
                  value: 'Expense count',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 15,
                  textAnchor: 'middle',
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(70, 130, 180, 0.08)' }} />
              <ReferenceLine y={0} stroke='#8ba3b9' />
              <Bar dataKey='count' name='Expenses' radius={[8, 8, 0, 0]} shape={CustomBar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
    </section>
  );
}
