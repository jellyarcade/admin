"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm, UserFormValues } from "./user-form";

interface NewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewUserModal({ open, onOpenChange }: NewUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    try {
      // Burada API çağrısı yapılacak
      console.log(values);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}