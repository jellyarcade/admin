"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentSales = [
  {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    amount: "₺450",
    status: "Tamamlandı",
    date: "Bugün, 14:30",
  },
  {
    name: "Mehmet Demir",
    email: "mehmet@example.com",
    amount: "₺890",
    status: "Beklemede",
    date: "Dün, 19:20",
  },
  {
    name: "Ayşe Kaya",
    email: "ayse@example.com",
    amount: "₺245",
    status: "Tamamlandı",
    date: "23 Mar, 16:45",
  },
  {
    name: "Fatma Şahin",
    email: "fatma@example.com",
    amount: "₺920",
    status: "Tamamlandı",
    date: "22 Mar, 11:30",
  },
];

export function RecentSales() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Son Satışlar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Müşteri</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">Tutar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale) => (
              <TableRow key={sale.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sale.email}`}
                        alt={sale.name}
                      />
                      <AvatarFallback>
                        {sale.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sale.name}</p>
                      <p className="text-sm text-gray-500">{sale.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      sale.status === "Tamamlandı"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {sale.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500">{sale.date}</TableCell>
                <TableCell className="text-right font-medium">
                  {sale.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}