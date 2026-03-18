"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Center } from "@/types/center";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, CheckCircle, AlertTriangle } from "lucide-react";

export function StatsCards() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "centers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const centersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Center[];
      setCenters(centersData);
      setLoading(false);
    }, (error) => {
      console.warn("Stats fetch error:", error.code);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalCenters = centers.length;
  const uniqueProvinces = new Set(centers.map(c => c.province)).size;
  const operationalCenters = centers.filter(c => c.currentStatus === "مستغل").length;
  const needsRehabilitation = centers.filter(c => 
    c.currentStatus === "يحتاج تأهيل" || c.generalCondition === "متدهورة"
  ).length;

  const stats = [
    {
      title: "إجمالي البنايات",
      value: loading ? "-" : totalCenters,
      icon: Building2,
      description: "بناية مسجلة"
    },
    {
      title: "الأقاليم المغطاة",
      value: loading ? "-" : uniqueProvinces,
      icon: MapPin,
      description: "إقليم"
    },
    {
      title: "البنايات المستغلة",
      value: loading ? "-" : operationalCenters,
      icon: CheckCircle,
      description: `من ${totalCenters} بناية`
    },
    {
      title: "تحتاج تأهيل",
      value: loading ? "-" : needsRehabilitation,
      icon: AlertTriangle,
      description: "بناية"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
