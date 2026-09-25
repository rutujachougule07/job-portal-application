import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  PhoneCall,
  Send,
  Star,
  User,
  Wallet,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export type Worker = {
  id: string;
  name: string;
  profession: string;
  marathiProfession: string;
  location: string;
  experience: string;
  expectedSalary: string;
  availability: "Available Now" | "1 Week Notice" | "Immediate";
  rating: number;
  reviewsCount: number;
  verified: boolean;
  skills: string[];
  photoUrl: string;
  phone: string;
  age: number;
  languages: string[];
  about: string;
};

export const workersList: Worker[] = [
  {
    id: "worker-1",
    name: "Ramesh Pawar",
    profession: "Senior Electrician",
    marathiProfession: "वरिष्ठ इलेक्ट्रीशियन",
    location: "Pune, Maharashtra",
    experience: "7 Years",
    expectedSalary: "₹25,000 / month",
    availability: "Available Now",
    rating: 4.9,
    reviewsCount: 38,
    verified: true,
    skills: ["Industrial Wiring", "Panel Maintenance", "PLC Basics", "Solar Installation"],
    photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98230 11223",
    age: 32,
    languages: ["Marathi", "Hindi", "English"],
    about: "Certified ITI electrician with 7 years of industrial & commercial building wiring experience.",
  },
  {
    id: "worker-2",
    name: "Ganesh Patil",
    profession: "CNC Machine Operator",
    marathiProfession: "CNC मशीन ऑपरेटर",
    location: "Chakan, Pune",
    experience: "5 Years",
    expectedSalary: "₹28,000 / month",
    availability: "Available Now",
    rating: 4.8,
    reviewsCount: 24,
    verified: true,
    skills: ["Fanuc Control", "VMC Operating", "Quality Inspection", "Micrometer"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    phone: "+91 97654 44321",
    age: 28,
    languages: ["Marathi", "Hindi"],
    about: "Specialized in auto-component machining, Fanuc CNC turning and VMC setting.",
  },
  {
    id: "worker-3",
    name: "Sunil Shinde",
    profession: "Heavy Commercial Driver",
    marathiProfession: "अवजड वाहन चालक (ड्रायव्हर)",
    location: "Thane, Mumbai",
    experience: "9 Years",
    expectedSalary: "₹30,000 / month",
    availability: "Immediate",
    rating: 4.9,
    reviewsCount: 52,
    verified: true,
    skills: ["Heavy Badge License", "Container Truck", "Interstate Driving", "GPS Navigation"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98901 22334",
    age: 36,
    languages: ["Marathi", "Hindi"],
    about: "Clean driving record, experienced in long-haul multi-axle trucks and container transport.",
  },
  {
    id: "worker-4",
    name: "Prakash Jadhav",
    profession: "ARC & TIG Welder",
    marathiProfession: "वेल्डर (ARC / TIG)",
    location: "Aurangabad / Chhatrapati Sambhajinagar",
    experience: "6 Years",
    expectedSalary: "₹24,000 / month",
    availability: "Available Now",
    rating: 4.7,
    reviewsCount: 19,
    verified: true,
    skills: ["6G Welding", "Structure Welding", "SS Pipe Welding", "Safety Norms"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    phone: "+91 94221 88776",
    age: 30,
    languages: ["Marathi", "Hindi"],
    about: "Certified structural and pressure vessel welder with 6G certification.",
  },
  {
    id: "worker-5",
    name: "Santosh More",
    profession: "Head Mason & Construction Supervisor",
    marathiProfession: "मुख्य गवंडी (Mason)",
    location: "Nagpur, Maharashtra",
    experience: "12 Years",
    expectedSalary: "₹35,000 / month",
    availability: "1 Week Notice",
    rating: 5.0,
    reviewsCount: 61,
    verified: true,
    skills: ["Brickwork", "Plastering", "Tile Laying", "Site Supervision"],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98220 99887",
    age: 42,
    languages: ["Marathi", "Hindi"],
    about: "Experienced building contractor mason leading site teams of up to 25 workers.",
  },
  {
    id: "worker-6",
    name: "Sachin Kadam",
    profession: "Plumbing & Maintenance Specialist",
    marathiProfession: "प्लंबर व मेंटेनन्स",
    location: "Navi Mumbai, Maharashtra",
    experience: "4 Years",
    expectedSalary: "₹22,000 / month",
    availability: "Available Now",
    rating: 4.8,
    reviewsCount: 31,
    verified: true,
    skills: ["CPVC Fitting", "Drainage Systems", "Water Pump Repair", "Leak Detection"],
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    phone: "+91 97300 55443",
    age: 26,
    languages: ["Marathi", "Hindi", "English"],
    about: "Residential and commercial plumbing specialist skilled in pump automation.",
  },
];

export function WorkerCard({ worker }: { worker: Worker }) {
  const [requested, setRequested] = useState(false);

  const handleHireRequest = () => {
    setRequested(true);
    toast.success(`Hire request sent to ${worker.name}! They will contact you shortly.`);
  };

  return (
    <div className="card-realjob p-5 flex flex-col justify-between h-full group">
      <div>
        {/* Top Header: Photo, Name, Verified Badge */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={worker.photoUrl}
              alt={worker.name}
              className="size-16 rounded-full object-cover border-2 border-[#063B78] shadow-sm"
            />
            {worker.verified && (
              <BadgeCheck className="size-5 text-[#FFC400] fill-[#063B78] absolute -bottom-1 -right-1" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#10233F] truncate group-hover:text-[#063B78] transition-colors">
                {worker.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#082F63] bg-[#FFC400] px-2 py-0.5 rounded-full">
                <Star className="size-3 fill-[#082F63]" />
                {worker.rating}
              </span>
            </div>

            <p className="text-xs font-extrabold text-[#063B78] truncate">
              {worker.profession}
            </p>
            <p className="text-[11px] font-bold text-[#125BB5]">
              {worker.marathiProfession}
            </p>

            <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#5B6B7F]">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-[#125BB5]" />
                {worker.location}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row: Experience, Salary, Availability */}
        <div className="mt-4 grid grid-cols-2 gap-2 bg-[#F5F8FC] p-2.5 rounded-lg border border-[#DCE5F0]">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#5B6B7F] block">अनुभव (Exp)</span>
            <span className="text-xs font-extrabold text-[#10233F]">{worker.experience}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#5B6B7F] block">अपेक्षित पगार</span>
            <span className="text-xs font-black text-[#063B78]">{worker.expectedSalary}</span>
          </div>
        </div>

        {/* Skills Badges */}
        <div className="mt-3">
          <span className="text-[10px] font-bold uppercase text-[#5B6B7F] block mb-1.5">प्रमुख कौशल्ये (Skills)</span>
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10.5px] font-bold bg-[#EBF1F8] text-[#063B78] border-0">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-[#DCE5F0] flex items-center gap-2">
        <Link
          to={`/workers/${worker.id}`}
          className="flex-1 text-center py-2 px-3 rounded-lg border border-[#063B78] text-[#063B78] font-extrabold text-xs hover:bg-[#063B78] hover:text-white transition-colors"
        >
          प्रोफाइल पहा
        </Link>

        <Button
          onClick={handleHireRequest}
          disabled={requested}
          size="sm"
          className="btn-yellow text-xs font-black px-4 py-2"
        >
          {requested ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-[#082F63]" />
              संपर्क पाठवला
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <PhoneCall className="size-3.5 text-[#082F63]" />
              कामगार हवा
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
