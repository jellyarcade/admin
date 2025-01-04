"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Toplam Satış",
    value: "₺124,592",
    change: "+14%",
    icon: TrendingUp,
  },
  {
    title: "Aktif Müşteriler",
    value: "2,345",
    change: "+5.2%",
    icon: Users,
  },
  {
    title: "Yeni Siparişler",
    value: "456",
    change: "+12%",
    icon: ShoppingBag,
  },
  {
    title: "Ortalama Sipariş",
    value: "₺245",
    change: "+2.3%",
    icon: DollarSign,
  },
];

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-green-500">{stat.change}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}