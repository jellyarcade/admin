"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye, Share2 } from "lucide-react";

const stats = [
  {
    title: "Toplam Rapor",
    value: "125",
    icon: FileText,
    change: "+12%",
  },
  {
    title: "İndirmeler",
    value: "843",
    icon: Download,
    change: "+8%",
  },
  {
    title: "Görüntülenme",
    value: "2,451",
    icon: Eye,
    change: "+18%",
  },
  {
    title: "Paylaşımlar",
    value: "45",
    icon: Share2,
    change: "+7%",
  },
];

export function ReportsOverview() {
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