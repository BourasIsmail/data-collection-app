"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Center } from "@/types/center";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users, Building } from "lucide-react";
import { regions } from "@/lib/morocco-data";

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
      // Silently handle permission errors
      console.warn("Stats fetch error (expected if Firestore not configured):", error.code);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalCenters = centers.length;
  const uniqueRegions = new Set(centers.map(c => c.region)).size;
  const uniqueProvinces = new Set(centers.map(c => c.province)).size;
  const urbanCenters = centers.filter(c => c.environment === "حضري").length;

  const stats = [
    {
      title: "إجمالي المراكز",
      value: loading ? "-" : totalCenters,
      icon: Building2,
      description: "مركز مسجل"
    },
    {
      title: "الجهات المغطاة",
      value: loading ? "-" : `${uniqueRegions}/${regions.length}`,
      icon: MapPin,
      description: "جهة"
    },
    {
      title: "الأقاليم المغطاة",
      value: loading ? "-" : uniqueProvinces,
      icon: Users,
      description: "إقليم"
    },
    {
      title: "المراكز الحضرية",
      value: loading ? "-" : urbanCenters,
      icon: Building,
      description: `من ${totalCenters} مركز`
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
