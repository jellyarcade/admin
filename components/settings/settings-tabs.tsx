"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="general">Genel</TabsTrigger>
        <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
        <TabsTrigger value="security">Güvenlik</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel Ayarlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Adı</Label>
              <Input id="site-name" defaultValue="Admin Dashboard" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Açıklaması</Label>
              <Input id="site-description" defaultValue="Modern admin dashboard" />
            </div>
            <Button>Kaydet</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bildirim Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">E-posta Bildirimleri</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Bildirimleri</Label>
              <Switch id="push-notifications" />
            </div>
            <Button>Kaydet</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Güvenlik Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mevcut Şifre</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Yeni Şifre</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Şifre Tekrar</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Şifreyi Güncelle</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}