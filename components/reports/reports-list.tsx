"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Aylık Satış Raporu",
    type: "PDF",
    size: "2.4 MB",
    date: "01.04.2024",
    downloads: 45,
  },
  {
    id: 2,
    name: "Müşteri Analizi",
    type: "XLSX",
    size: "1.8 MB",
    date: "28.03.2024",
    downloads: 32,
  },
  {
    id: 3,
    name: "Stok Durumu",
    type: "PDF",
    size: "3.1 MB",
    date: "25.03.2024",
    downloads: 28,
  },
];

export function ReportsList() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rapor Adı</TableHead>
            <TableHead>Tür</TableHead>
            <TableHead>Boyut</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>İndirme</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.name}</TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>{report.size}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.downloads}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}