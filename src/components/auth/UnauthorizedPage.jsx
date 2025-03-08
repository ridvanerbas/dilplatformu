import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="rounded-full bg-yellow-100 p-6 mb-6">
          <ShieldAlert className="h-12 w-12 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Erişim Reddedildi</h1>
        <p className="text-muted-foreground mb-6">
          Bu sayfaya erişim izniniz yok. Bunun bir hata olduğunu düşünüyorsanız
          lütfen yöneticinizle iletişime geçin.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/")} variant="default">
            Panele Git
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline">
            Geri Dön
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
