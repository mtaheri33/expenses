// This is a component for a yearly total amount stacked by quarter bar chart.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  totalsByYearQuarter,
  formatAmountForDisplay,
} from '../../../../utilities';
import styles from './YearlyTotalQuarterStackedBarChart.module.css';

export default function YearlyTotalQuarterStackedBarChart({ expenses }) {
  /*
  expenses required array [object]
  */
  const quarters = [
    { key: 'q1', label: 'Q1 (Jan-Mar)', color: 'steelblue' },
    { key: 'q2', label: 'Q2 (Apr-Jun)', color: '#af46b4' },
    { key: 'q3', label: 'Q3 (Jul-Sep)', color: '#b47846' },
    { key: 'q4', label: 'Q4 (Oct-Dec)', color: '#4bb446' },
  ];

  function buildChartData(expenses) {
    const totals = totalsByYearQuarter(expenses);
    return Object.entries(totals)
      .sort(([firstYear], [secondYear]) => firstYear.localeCompare(secondYear))
      .map(([year, quarterTotals]) => {
        return {
          year,
          ...quarterTotals,
          total: Object.values(quarterTotals).reduce((sum, total) => sum + total, 0),
        };
      });
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const yearData = payload[0].payload;
    return (
      <div className={`chartTooltip ${styles.chartTooltip}`}>
        <div className={`chartTooltipLabel ${styles.chartTooltipLabel}`}>{label}</div>
        {quarters.map((quarter) => (
          <div key={quarter.key} className={styles.tooltipRow}>
            <span className={styles.quarterLabel}>
              <span className={styles.quarterColor} style={{ backgroundColor: quarter.color }} />
              {quarter.label}
            </span>
            <span>{formatAmountForDisplay(yearData[quarter.key])}</span>
          </div>
        ))}
        <div className={`chartTooltipLabel ${styles.tooltipRow} ${styles.tooltipTotal}`}>
          <span>Year total</span>
          <span>{formatAmountForDisplay(yearData.total)}</span>
        </div>
      </div>
    );
  }

  const chartData = buildChartData(expenses);
  const chartDataTotal = chartData.reduce((sum, data) => sum + data.total, 0);

  return (
    <section className={`YearlyTotalQuarterStackedBarChart chartCard ${styles.chartCard}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Yearly totals by quarter</h1>
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
              stackOffset='sign'
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='year' tickLine={false} height={40} />
              <YAxis tickFormatter={formatAmountForDisplay} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(70, 130, 180, 0.08)' }} />
              <Legend iconType='square' />
              <ReferenceLine y={0} stroke='#8ba3b9' />
              {quarters.map((quarter) => (
                <Bar
                  key={quarter.key}
                  dataKey={quarter.key}
                  name={quarter.label}
                  stackId='year'
                  fill={quarter.color}
                  maxBarSize={100}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
    </section>
  );
}
