"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Center } from "@/types/center";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Handshake, HomeIcon } from "lucide-react";

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
  
  // Count centers by management type
  const directManagement = centers.filter(c => c.centerManagement === "تدبير مباشر من التعاون الوطني").length;
  const delegatedManagement = centers.filter(c => c.centerManagement === "تدبير مفوض لجمعية").length;
  const sharedManagement = centers.filter(c => c.centerManagement === "تدبير مشترك مع الجمعية").length;

  const stats = [
    {
      title: "إجمالي المراكز",
      value: loading ? "-" : totalCenters,
      icon: Building2,
      description: "مركز مسجل في المنصة",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "تدبير مباشر",
      value: loading ? "-" : directManagement,
      icon: HomeIcon,
      description: "من طرف التعاون الوطني",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "تدبير مفوض",
      value: loading ? "-" : delegatedManagement,
      icon: Handshake,
      description: "لجمعيات المجتمع المدني",
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "تدبير مشترك",
      value: loading ? "-" : sharedManagement,
      icon: Users,
      description: "بشراكة مع الجمعيات",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50 bg-card/80 hover:bg-card transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{stat.description}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
