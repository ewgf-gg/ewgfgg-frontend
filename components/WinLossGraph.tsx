import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectOption } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for demonstration
const generateMockData = (days: number) => {
  const data = []
  let wins = 0
  let losses = 0
  for (let i = 0; i < days; i++) {
    const dailyWins = Math.floor(Math.random() * 10)
    const dailyLosses = Math.floor(Math.random() * 10)
    wins += dailyWins
    losses += dailyLosses
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      wins: wins,
      losses: losses,
    })
  }
  return data
}

const timeSpans: SelectOption[] = [
  { label: 'Last Week', value: '7' },
  { label: 'Last Month', value: '30' },
  { label: 'Last 3 Months', value: '90' },
  { label: 'All Time', value: '365' },
]

export const WinLossGraph: React.FC = () => {
  const [selectedTimeSpan, setSelectedTimeSpan] = useState(timeSpans[1].value)
  const data = generateMockData(parseInt(selectedTimeSpan))

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Win/Loss Record</CardTitle>
        <Select
          options={timeSpans}
          value={selectedTimeSpan}
          onChange={setSelectedTimeSpan}
          className="w-[180px]"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '4px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line type="monotone" dataKey="wins" stroke="hsl(var(--success))" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="losses" stroke="hsl(var(--destructive))" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}