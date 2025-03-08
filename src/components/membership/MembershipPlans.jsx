import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MembershipPlans = () => {
  const plans = [
    {
      id: "free",
      name: "Ücretsiz",
      price: "0 ₺",
      description: "Dil öğrenmeye başlamak için temel özellikler",
      features: [
        { name: "Sınırlı ders erişimi", included: true },
        { name: "Temel kelime dağarcığı", included: true },
        { name: "Günlük pratik limiti", included: true },
        { name: "Reklamsız deneyim", included: false },
        { name: "Çevrimdışı erişim", included: false },
        { name: "Özel öğretmen desteği", included: false },
      ],
      popular: false,
      buttonText: "Mevcut Plan",
      buttonVariant: "outline",
    },
    {
      id: "premium",
      name: "Premium",
      price: "49,90 ₺",
      period: "aylık",
      description: "Dil öğrenme deneyiminizi geliştirin",
      features: [
        { name: "Sınırsız ders erişimi", included: true },
        { name: "Genişletilmiş kelime dağarcığı", included: true },
        { name: "Sınırsız günlük pratik", included: true },
        { name: "Reklamsız deneyim", included: true },
        { name: "Çevrimdışı erişim", included: true },
        { name: "Özel öğretmen desteği", included: false },
      ],
      popular: true,
      buttonText: "Şimdi Yükselt",
      buttonVariant: "default",
    },
    {
      id: "pro",
      name: "Pro",
      price: "99,90 ₺",
      period: "aylık",
      description: "Profesyonel dil öğrenme deneyimi",
      features: [
        { name: "Sınırsız ders erişimi", included: true },
        { name: "Tam kelime dağarcığı erişimi", included: true },
        { name: "Sınırsız günlük pratik", included: true },
        { name: "Reklamsız deneyim", included: true },
        { name: "Çevrimdışı erişim", included: true },
        { name: "Özel öğretmen desteği", included: true },
      ],
      popular: false,
      buttonText: "Şimdi Yükselt",
      buttonVariant: "outline",
    },
  ];

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Üyelik Planları</h1>
          <p className="text-muted-foreground">
            Dil öğrenme yolculuğunuzu hızlandırmak için ihtiyaçlarınıza uygun
            bir plan seçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`overflow-hidden ${plan.popular ? "border-primary shadow-md relative" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-tl-none rounded-br-none">
                    En Popüler
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span
                        className={
                          feature.included ? "" : "text-muted-foreground"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant} className="w-full">
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">
                Üyeliğimi istediğim zaman iptal edebilir miyim?
              </h3>
              <p className="text-muted-foreground">
                Evet, üyeliğinizi dilediğiniz zaman iptal edebilirsiniz. İptal
                işlemi sonrası mevcut ödeme döneminin sonuna kadar premium
                özelliklerden yararlanmaya devam edersiniz.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Ödeme yöntemleri nelerdir?</h3>
              <p className="text-muted-foreground">
                Kredi kartı, banka kartı ve çeşitli online ödeme sistemleri ile
                ödeme yapabilirsiniz.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Yıllık ödeme seçeneği var mı?</h3>
              <p className="text-muted-foreground">
                Evet, yıllık ödeme seçeneğimiz mevcuttur ve %20 indirim
                sunmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
