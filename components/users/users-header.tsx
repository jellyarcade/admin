"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { NewUserModal } from "./new-user-modal";

export function UsersHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Kullanıcılar</h1>
        <p className="text-gray-500 mt-2">Sistemdeki tüm kullanıcıları yönetin.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input className="pl-10 w-[300px]" placeholder="Kullanıcı ara..." />
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </div>
      <NewUserModal open={open} onOpenChange={setOpen} />
    </div>
  );
}