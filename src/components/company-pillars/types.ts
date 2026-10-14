import React from "react";
import {
  Target,
  Eye,
  Users,
  Handshake,
  Star,
  Shield,
  Sparkles,
  TrendingUp,
  Building2,
  Award,
  CheckCircle2,
  Heart,
  Crown,
} from "lucide-react";

export interface CompanyPillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const defaultCompanyPillars: CompanyPillar[] = [
  {
    id: "mission",
    title: "Our Mission",
    description: "To provide the right employment opportunity to everyone.",
    iconName: "Target",
  },
  {
    id: "vision",
    title: "Our Vision",
    description: "To become the most trusted employment portal in India.",
    iconName: "Eye",
  },
  {
    id: "values",
    title: "Our Values",
    description: "Trust, transparency, quality, and consistent service.",
    iconName: "Users",
  },
  {
    id: "belief",
    title: "Our Belief",
    description: "Right Person\nRight Job\nRight Opportunity",
    iconName: "Handshake",
  },
];

export const PILLAR_ICONS: Record<string, React.ElementType> = {
  Target,
  Eye,
  Users,
  Handshake,
  Star,
  Shield,
  Sparkles,
  TrendingUp,
  Building2,
  Award,
  CheckCircle2,
  Heart,
  Crown,
};
