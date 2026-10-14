import React from "react";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobCategory, CATEGORY_ICONS } from "./types";

interface PopularJobCategoriesAdminProps {
  categories: JobCategory[];
  onChange: (categories: JobCategory[]) => void;
}

/**
 * Popular Job Categories Admin Editor Component
 * 
 * Allows Super Admin & Sub Admin to:
 * 1. Add new job categories (+ Add Category)
 * 2. Select an icon for each category from a dropdown list
 * 3. Edit the category display name
 * 4. Remove/Delete any unwanted category
 */
export const PopularJobCategoriesAdminSection: React.FC<PopularJobCategoriesAdminProps> = ({
  categories,
  onChange,
}) => {
  const handleAddCategory = () => {
    const iconKeys = Object.keys(CATEGORY_ICONS);
    const nextIcon = iconKeys[categories.length % iconKeys.length] || "Briefcase";

    const newCategory: JobCategory = {
      id: `cat_${Date.now()}`,
      label: `New Category ${categories.length + 1}`,
      iconName: nextIcon,
      theme: "blue",
    };

    onChange([...categories, newCategory]);
    toast.success("New category added! Click 'Save Changes' to apply.");
  };

  const handleRemoveCategory = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    onChange(updated);
    toast.success("Category removed! Click 'Save Changes' to apply.");
  };

  const handleUpdateLabel = (index: number, label: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index]!, label };
    onChange(updated);
  };

  const handleUpdateIcon = (index: number, iconName: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index]!, iconName };
    onChange(updated);
  };

  return (
    <div className="mt-8 border-t border-[#E0E8F5] pt-6">
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-black text-[#063B78]">Popular Job Categories</h4>
          <p className="text-[11px] text-[#5B6B7F] mt-0.5">
            Add, remove, or edit job categories shown in the scrolling marquee on the landing page.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed border-[#063B78]/30 text-[#063B78] font-bold text-xs hover:bg-[#063B78]/5 flex items-center gap-1.5"
          onClick={handleAddCategory}
        >
          <Plus className="size-3.5" />
          + Add Category
        </Button>
      </div>

      {/* Categories List or Empty State */}
      {categories.length === 0 ? (
        <div className="text-center py-6 bg-[#F8FAFF] border border-dashed border-[#DCE5F0] rounded-2xl">
          <p className="text-xs text-[#5B6B7F] font-semibold mb-2">
            No categories added yet.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onChange([
                { id: `cat_${Date.now()}`, label: "Factory Worker", iconName: "Factory", theme: "blue" },
              ]);
            }}
            className="bg-[#063B78] text-white text-xs font-bold px-3 py-1.5 h-8 rounded-xl"
          >
            <Plus className="size-3.5 mr-1" />
            Add First Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat, i) => {
            const IconComponent = CATEGORY_ICONS[cat.iconName] || Briefcase;

            return (
              <div
                key={cat.id || i}
                className="p-3 bg-[#F8FAFF] border border-[#DCE5F0] rounded-xl flex items-center gap-2.5"
              >
                {/* Icon Selector / Preview */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="size-9 rounded-lg bg-white border border-[#DCE5F0] flex items-center justify-center text-[#063B78] shadow-2xs">
                    <IconComponent className="size-4 text-[#D4AF37]" />
                  </div>
                  <select
                    className="text-[9px] font-bold bg-transparent border-0 text-gray-500 cursor-pointer focus:outline-none"
                    value={cat.iconName || "Briefcase"}
                    onChange={(e) => handleUpdateIcon(i, e.target.value)}
                    title="Change Icon"
                  >
                    {Object.keys(CATEGORY_ICONS).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>
                        {iconKey}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Label Input */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-black text-[#5B6B7F] uppercase tracking-wider mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-8 px-2.5 bg-white border border-[#DCE5F0] rounded-lg text-xs font-bold text-[#063B78] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    value={cat.label}
                    onChange={(e) => handleUpdateLabel(i, e.target.value)}
                    placeholder="e.g. Electrician"
                  />
                </div>

                {/* Remove Button */}
                <div className="shrink-0 self-center pt-3">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2 text-[11px] font-bold rounded-lg flex items-center gap-1"
                    onClick={() => handleRemoveCategory(i)}
                    title="Remove category"
                  >
                    <Trash2 className="size-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
