"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Award, LogOut } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Stats } from "../types/stats";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardView({ data }: { data: Stats }) {
  const { user, logout } = useAuth();
  const categoryData = [
    { name: "AWS", value: data.welders_aws },
    { name: "IPC", value: data.welders_ipc },
    { name: "Custom", value: data.welders_custom },
  ];

  console.log(data);

  // Bar colors for each category
  const barColors = ["#6366f1", "#10b981", "#f59e42"];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Resumen de soldadores y certificaciones
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Bienvenido</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Soldadores
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total_welders}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Soldadores Activos
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {data.welders_active}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Soldadores Inactivos
                </CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {data.welders_inactive}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certificaciones Totales
                </CardTitle>
                <Award className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {data.welders_aws + data.welders_ipc + data.welders_custom}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--background, #fff)",
                        color: "var(--foreground, #222)",
                        borderRadius: 8,
                        border: "1px solid var(--border, #e5e7eb)",
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                      }}
                      wrapperStyle={{ zIndex: 50 }}
                      labelStyle={{
                        color: "var(--foreground, #222)",
                        fontWeight: 600,
                      }}
                      itemStyle={{ color: "var(--foreground, #222)" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {categoryData.map((entry, idx) => (
                        <Cell
                          key={entry.name}
                          fill={barColors[idx % barColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
