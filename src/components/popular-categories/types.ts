import React from "react";
import {
  Factory,
  HardHat,
  Wrench,
  Truck,
  Zap,
  Shield,
  Briefcase,
  Users,
  Monitor,
  Building2,
  Award,
  Star,
  Sparkles,
} from "lucide-react";

export interface JobCategory {
  id?: string;
  label: string;
  iconName: string;
  theme?: string;
  gradient?: string;
  iconBg?: string;
}

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Factory,
  HardHat,
  Wrench,
  Truck,
  Zap,
  Shield,
  Briefcase,
  Users,
  Monitor,
  Building2,
  Award,
  Star,
  Sparkles,
};

export const DEFAULT_JOB_CATEGORIES: JobCategory[] = [
  { id: "factory", label: "Factory Worker", iconName: "Factory", theme: "blue" },
  { id: "construction", label: "Construction", iconName: "HardHat", theme: "yellow" },
  { id: "technical", label: "Technical Staff", iconName: "Wrench", theme: "purple" },
  { id: "logistics", label: "Transport & Logistics", iconName: "Truck", theme: "green" },
  { id: "electrician", label: "Electrician", iconName: "Zap", theme: "orange" },
  { id: "security", label: "Security Guard", iconName: "Shield", theme: "red" },
  { id: "office", label: "Office Staff", iconName: "Briefcase", theme: "blue" },
];

export const CATEGORY_PALETTES = [
  { gradient: "from-blue-500/20 to-transparent", iconBg: "bg-blue-600 text-white" },
  { gradient: "from-amber-500/20 to-transparent", iconBg: "bg-amber-600 text-white" },
  { gradient: "from-purple-500/20 to-transparent", iconBg: "bg-purple-600 text-white" },
  { gradient: "from-emerald-500/20 to-transparent", iconBg: "bg-emerald-600 text-white" },
  { gradient: "from-orange-500/20 to-transparent", iconBg: "bg-orange-600 text-white" },
  { gradient: "from-rose-500/20 to-transparent", iconBg: "bg-rose-600 text-white" },
  { gradient: "from-cyan-500/20 to-transparent", iconBg: "bg-cyan-600 text-white" },
  { gradient: "from-indigo-500/20 to-transparent", iconBg: "bg-indigo-600 text-white" },
];
