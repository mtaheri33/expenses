// This is a component for a monthly total amount bar chart.

import styles from './MonthlyTotalBarChart.module.css';
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
  totalsByMonth,
  formatYearMonthForDisplay,
  formatAmountForDisplay,
} from '../../../../utilities';

export default function MonthlyTotalBarChart({ expenses }) {
  /*
  expenses required array [object]
  */
  function buildChartData(expenses) {
    const totals = totalsByMonth(expenses);
    return Object.entries(totals)
      .sort(([firstMonth], [secondMonth]) => firstMonth.localeCompare(secondMonth))
      .map(([yearMonthKey, total]) => {
        return {
          yearMonth: formatYearMonthForDisplay(yearMonthKey),
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
  const chartDataTotal = chartData.reduce((sum, data) => sum + data.total, 0);

  return (
    <section className={`MonthlyTotalBarChart chartCard ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Monthly totals</h1>
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
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='yearMonth'
                angle={-30}
                height={56}
                textAnchor='end'
                tickLine={false}
              />
              <YAxis tickFormatter={formatAmountForDisplay} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(70, 130, 180, 0.08)' }} />
              <ReferenceLine y={0} stroke='#8ba3b9' />
              <Bar dataKey='total' radius={[8, 8, 0, 0]} shape={CustomBar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
    </section>
  );
}
