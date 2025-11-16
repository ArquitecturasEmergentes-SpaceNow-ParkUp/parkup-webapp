'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { CartesianGrid as LineCartesianGrid, LabelList, Line, LineChart, XAxis as LineXAxis } from "recharts";
import { Pie, PieChart } from "recharts";
import { 
  ParkingCircle, 
  Car, 
  Clock, 
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashboardPage() {
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = [
    {
      title: "Parkings Activos",
      value: "3",
      description: "Espacios actualmente ocupados",
      icon: Car,
      trend: "+2 desde ayer",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      trendColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Ingresos Totales",
      value: "S/ 1,234",
      description: "Este mes",
      icon: TrendingUp,
      trend: "+12.5% desde el mes pasado",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      trendColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Espacios Disponibles",
      value: "12",
      description: "Listos para reservar",
      icon: ParkingCircle,
      trend: "Actualizado hace 5 min",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      trendColor: "text-muted-foreground",
      trendIcon: RefreshCw as typeof RefreshCw,
    },
    {
      title: "Duración Promedio",
      value: "2.5h",
      description: "Por sesión de estacionamiento",
      icon: Clock,
      trend: "Estable",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      trendColor: "text-muted-foreground",
    },
  ];

  const reservationsChartData = [
    { date: "2024-11-01", reservas: 45, ingresos: 1200 },
    { date: "2024-11-02", reservas: 52, ingresos: 1400 },
    { date: "2024-11-03", reservas: 38, ingresos: 980 },
    { date: "2024-11-04", reservas: 61, ingresos: 1650 },
    { date: "2024-11-05", reservas: 55, ingresos: 1500 },
    { date: "2024-11-06", reservas: 48, ingresos: 1300 },
    { date: "2024-11-07", reservas: 67, ingresos: 1800 },
    { date: "2024-11-08", reservas: 59, ingresos: 1600 },
    { date: "2024-11-09", reservas: 42, ingresos: 1150 },
    { date: "2024-11-10", reservas: 51, ingresos: 1380 },
    { date: "2024-11-11", reservas: 63, ingresos: 1700 },
    { date: "2024-11-12", reservas: 56, ingresos: 1520 },
    { date: "2024-11-13", reservas: 49, ingresos: 1320 },
    { date: "2024-11-14", reservas: 58, ingresos: 1580 },
  ];

  const reservationsChartConfig = {
    reservas: {
      label: "Reservas Diarias",
      color: "var(--chart-2)",
    },
    ingresos: {
      label: "Ingresos (S/)",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const occupancyLineData = [
    { month: "Junio", ocupacion: 72 },
    { month: "Julio", ocupacion: 68 },
    { month: "Agosto", ocupacion: 75 },
    { month: "Septiembre", ocupacion: 81 },
    { month: "Octubre", ocupacion: 79 },
    { month: "Noviembre", ocupacion: 86 },
  ];

  const occupancyChartConfig = {
    ocupacion: {
      label: "Ocupación",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const zonesPieData = [
    { zone: "Centro", reservas: 275, fill: "var(--chart-1)" },
    { zone: "Norte", reservas: 200, fill: "var(--chart-2)" },
    { zone: "Sur", reservas: 187, fill: "var(--chart-3)" },
    { zone: "Este", reservas: 173, fill: "var(--chart-4)" },
    { zone: "Oeste", reservas: 90, fill: "var(--chart-5)" },
  ];

  const zonesPieConfig = {
    reservas: {
      label: "Reservas",
    },
    centro: {
      label: "Zona Centro",
      color: "var(--chart-1)",
    },
    norte: {
      label: "Zona Norte",
      color: "var(--chart-2)",
    },
    sur: {
      label: "Zona Sur",
      color: "var(--chart-3)",
    },
    este: {
      label: "Zona Este",
      color: "var(--chart-4)",
    },
    oeste: {
      label: "Zona Oeste",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] = React.useState<"reservas" | "ingresos">("reservas");

  const totalReservations = React.useMemo(
    () => ({
      reservas: reservationsChartData.reduce((acc, curr) => acc + curr.reservas, 0),
      ingresos: reservationsChartData.reduce((acc, curr) => acc + curr.ingresos, 0),
    }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">{currentDate} - {currentTime}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="action" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const cardConfigs = [
            { borderColor: "border-blue-500/20 hover:border-blue-500/50", shadowColor: "hover:shadow-blue-500/30", gradientFrom: "hover:from-blue-500/10", shimmerColor: "via-blue-400/20", rotate: "hover:rotate-3" },
            { borderColor: "border-emerald-500/20 hover:border-emerald-500/50", shadowColor: "hover:shadow-emerald-500/30", gradientFrom: "hover:from-emerald-500/10", shimmerColor: "via-emerald-400/20", rotate: "hover:rotate-2" },
            { borderColor: "border-purple-500/20 hover:border-purple-500/50", shadowColor: "hover:shadow-purple-500/30", gradientFrom: "hover:from-purple-500/10", shimmerColor: "via-purple-400/20", rotate: "hover:-rotate-2" },
            { borderColor: "border-amber-500/20 hover:border-amber-500/50", shadowColor: "hover:shadow-amber-500/30", gradientFrom: "hover:from-amber-500/10", shimmerColor: "via-amber-400/20", rotate: "hover:rotate-2" },
          ];
          const config = cardConfigs[index] || cardConfigs[0];

          return (
            <div
              key={stat.title}
              className={`p-6 rounded-xl backdrop-blur-lg border ${config.borderColor} bg-gradient-to-tr from-card/60 to-card/40 dark:from-card/80 dark:to-card/60 shadow-lg ${config.shadowColor} transition-all duration-300 ease-out cursor-pointer hover:bg-gradient-to-tr ${config.gradientFrom} hover:to-card/40 dark:hover:to-card/60 group relative overflow-hidden`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent ${config.shimmerColor} to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out`}
              />
              <div className="relative z-10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0 pt-0">
                  <CardTitle className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl ${stat.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/30`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor} drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300`} />
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-foreground transition-colors duration-300">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 group-hover:text-foreground/70 transition-colors duration-300">
                    {stat.description}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {stat.trend.includes('+') && (
                      <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {'trendIcon' in stat && stat.trendIcon && (
                      <stat.trendIcon className="h-3.5 w-3.5 text-muted-foreground animate-spin-slow" />
                    )}
                    <p className={`text-xs font-medium ${stat.trendColor} transition-colors duration-300`}>
                      {stat.trend}
                    </p>
                  </div>
                </CardContent>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 py-0 transition-all duration-300 hover:shadow-lg border-border/50">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row bg-gradient-to-r from-background to-muted/20">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
              <CardTitle className="text-lg font-semibold">Reservas e Ingresos</CardTitle>
              <CardDescription className="text-sm">Últimas 2 semanas de actividad</CardDescription>
            </div>
            <div className="flex">
              {(["reservas", "ingresos"] as const).map((key) => (
                <button
                  key={key}
                  data-active={activeChart === key}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(key)}
                >
                  <span className="text-muted-foreground text-xs">
                    {key === "reservas" ? "Reservas" : "Ingresos (S/)"}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {key === "reservas" 
                      ? totalReservations.reservas.toLocaleString()
                      : `S/ ${totalReservations.ingresos.toLocaleString()}`
                    }
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={reservationsChartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={reservationsChartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" });
                      }}
                    />
                  }
                />
                <Bar dataKey={activeChart} fill={`var(--color-${activeChart === "reservas" ? "reservas" : "ingresos"})`} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg border-border/50">
          <CardHeader className="items-center pb-0 bg-gradient-to-br from-background to-muted/20">
            <CardTitle className="text-lg font-semibold">Distribución por Zonas</CardTitle>
            <CardDescription className="text-sm">Noviembre 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <ChartContainer config={zonesPieConfig} className="mx-auto aspect-square max-h-[200px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={zonesPieData} dataKey="reservas" nameKey="zone" stroke="0" />
              </PieChart>
            </ChartContainer>
            <div className="space-y-2.5 mt-4">
              {zonesPieData.map((item) => (
                <div key={item.zone} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-background" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm font-medium">{item.zone}</span>
                  </div>
                  <span className="font-semibold text-sm bg-muted/50 px-2.5 py-1 rounded-md">{item.reservas}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 transition-all duration-300 hover:shadow-lg border-border/50">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20">
            <CardTitle className="text-lg font-semibold">Ocupación Mensual</CardTitle>
            <CardDescription className="text-sm">Junio - Noviembre 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occupancyChartConfig}>
              <LineChart accessibilityLayer data={occupancyLineData} margin={{ top: 20, left: 12, right: 12 }}>
                <LineCartesianGrid vertical={false} />
                <LineXAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line dataKey="ocupacion" type="natural" stroke="var(--color-ocupacion)" strokeWidth={2} dot={{ fill: "var(--color-ocupacion)" }} activeDot={{ r: 6 }}>
                  <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
            <div className="flex gap-2 leading-none font-medium">
              Aumento del 5.2% este mes <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">Mostrando ocupación promedio por mes</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}