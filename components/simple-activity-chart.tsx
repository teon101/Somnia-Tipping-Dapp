"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { Transaction } from "@/lib/contract"

interface SimpleActivityChartProps {
  transactions: Transaction[]
}

export default function SimpleActivityChart({ transactions }: SimpleActivityChartProps) {
  // Process transactions into chart data
  // We'll create a simplified view showing the last 5 transactions
  const chartData = useMemo(() => {
    // Take up to the last 5 transactions
    const recentTransactions = [...transactions].slice(0, 5).reverse()

    return recentTransactions.map((tx, index) => ({
      index,
      amount: Number.parseFloat(tx.amount),
      type: tx.type,
    }))
  }, [transactions])

  return (
    <div className="h-[120px] w-full">
      {transactions.length > 1 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="index" hide={true} />
            <YAxis hide={true} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorAmount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          Not enough data
        </div>
      )}
    </div>
  )
}
