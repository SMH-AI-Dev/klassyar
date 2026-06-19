import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCards({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="clay-element bg-white/60 border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} clay-element flex items-center justify-center`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
