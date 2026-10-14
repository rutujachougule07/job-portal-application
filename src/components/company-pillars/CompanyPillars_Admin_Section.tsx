import React from "react";
import { Plus, Trash2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CompanyPillar, PILLAR_ICONS } from "./types";

interface CompanyPillarsAdminProps {
  pillars: CompanyPillar[];
  onChange: (pillars: CompanyPillar[]) => void;
}

/**
 * Company Pillars Admin Section Component
 * Allows Sub-Admin / Super-Admin to:
 * 1. Add new pillar cards (+ Add Pillar Card)
 * 2. Delete unwanted cards (Remove)
 * 3. Edit Title and Description dynamically
 */
export const CompanyPillarsAdminSection: React.FC<CompanyPillarsAdminProps> = ({
  pillars,
  onChange,
}) => {
  const handleAddCard = () => {
    const iconKeys = Object.keys(PILLAR_ICONS);
    const nextIcon = iconKeys[pillars.length % iconKeys.length] || "Star";
    
    const newCard: CompanyPillar = {
      id: `pillar_${Date.now()}`,
      title: `Pillar ${pillars.length + 1}`,
      description: "Enter card description here...",
      iconName: nextIcon,
    };

    onChange([...pillars, newCard]);
    toast.success("New pillar card added!");
  };

  const handleRemoveCard = (index: number) => {
    const updated = [...pillars];
    updated.splice(index, 1);
    onChange(updated);
    toast.success("Pillar card removed!");
  };

  const handleUpdateField = (
    index: number,
    field: "title" | "description",
    val: string
  ) => {
    const updated = [...pillars];
    updated[index] = { ...updated[index]!, [field]: val };
    onChange(updated);
  };

  return (
    <div className="mt-8 border-t border-[#E0E8F5] pt-6">
      {/* Section Header with Add Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-black text-[#063B78]">
            Company Pillars (Our Mission, Our Vision, Our Values, Our Belief)
          </h4>
          <p className="text-[11px] text-[#5B6B7F] mt-0.5">
            Add, remove or edit Title and Description for cards displayed on the landing page.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed border-[#063B78]/30 text-[#063B78] font-bold text-xs hover:bg-[#063B78]/5 flex items-center gap-1.5"
          onClick={handleAddCard}
        >
          <Plus className="size-3.5" />
          + Add Pillar Card
        </Button>
      </div>

      {/* Cards List or Empty State */}
      {pillars.length === 0 ? (
        <div className="text-center py-8 bg-[#F8FAFF] border border-dashed border-[#DCE5F0] rounded-2xl">
          <p className="text-xs text-[#5B6B7F] font-semibold mb-3">
            No pillar cards added yet.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={handleAddCard}
            className="bg-[#063B78] text-white text-xs font-bold px-3 py-1.5 h-8 rounded-xl"
          >
            <Plus className="size-3.5 mr-1" />
            Add First Card
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => {
            const IconComponent = PILLAR_ICONS[pillar.iconName] || Target;

            return (
              <div
                key={pillar.id || i}
                className="p-5 bg-[#F8FAFF] border border-[#DCE5F0] rounded-2xl space-y-3"
              >
                {/* Card Icon & Header with Remove button */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E0E8F5]">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-white shadow-2xs">
                      <IconComponent className="size-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-black text-[#082F63] tracking-wide uppercase">
                      {pillar.title || `Card ${i + 1}`}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-7 px-2.5 text-[11px] font-bold flex items-center gap-1 rounded-lg"
                    onClick={() => handleRemoveCard(i)}
                  >
                    <Trash2 className="size-3" />
                    Remove
                  </Button>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs font-bold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    value={pillar.title}
                    onChange={(e) =>
                      handleUpdateField(i, "title", e.target.value)
                    }
                    placeholder="e.g. Our Mission"
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-[10px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-2.5 bg-white border border-[#DCE5F0] rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none leading-relaxed"
                    value={pillar.description}
                    onChange={(e) =>
                      handleUpdateField(i, "description", e.target.value)
                    }
                    placeholder="Enter card description..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
