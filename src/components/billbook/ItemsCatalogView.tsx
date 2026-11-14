import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  X,
  Plus,
  Package,
  Share2,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { formatCurrency } from "@/lib/data-store";

export interface CatalogProduct {
  id: string;
  name: string;
  type: "PRODUCT" | "SERVICE";
  price: number;
  purchasePrice: number;
  unit: string;
  stockQuantity: number;
  lowStockThreshold: number;
  description: string;
  taxIncluded?: boolean;
  createdAt: string;
}

interface ItemsCatalogViewProps {
  onBack: () => void;
  employerId?: string;
  companyName?: string;
}

export const ItemsCatalogView: React.FC<ItemsCatalogViewProps> = ({
  onBack,
  employerId = "default",
  companyName = "Green Agro",
}) => {
  const storageKey = `billbook_items_${employerId}`;

  const [products, setProducts] = useState<CatalogProduct[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: CatalogProduct[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy/mock items
          const cleaned = parsed.filter(
            (p) =>
              p &&
              p.id &&
              !p.id.startsWith("item-1") &&
              !p.id.startsWith("item-2") &&
              !p.id.startsWith("item-3") &&
              !p.id.startsWith("item-4") &&
              !p.id.startsWith("item-5") &&
              !p.id.startsWith("item-6")
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(storageKey, JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "IN_STOCK" | "LOW_STOCK">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogProduct | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [formPrice, setFormPrice] = useState("");
  const [formPurchasePrice, setFormPurchasePrice] = useState("");
  const [formUnit, setFormUnit] = useState("Pcs");
  const [formStock, setFormStock] = useState("");
  const [formThreshold, setFormThreshold] = useState("5");
  const [formDesc, setFormDesc] = useState("");

  const saveProducts = (updated: CatalogProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save products", e);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormType("PRODUCT");
    setFormPrice("");
    setFormPurchasePrice("");
    setFormUnit("Pcs");
    setFormStock("");
    setFormThreshold("5");
    setFormDesc("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: CatalogProduct) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormType(item.type);
    setFormPrice(item.price.toString());
    setFormPurchasePrice(item.purchasePrice ? item.purchasePrice.toString() : "");
    setFormUnit(item.unit || "Pcs");
    setFormStock(item.stockQuantity.toString());
    setFormThreshold(item.lowStockThreshold?.toString() || "5");
    setFormDesc(item.description || "");
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const priceNum = parseFloat(formPrice) || 0;
    const purchaseNum = parseFloat(formPurchasePrice) || 0;
    const stockNum = parseInt(formStock, 10) || 0;
    const thresholdNum = parseInt(formThreshold, 10) || 5;

    if (editingItem) {
      const updated = products.map((p) =>
        p.id === editingItem.id
          ? {
              ...p,
              name: formName.trim(),
              type: formType,
              price: priceNum,
              purchasePrice: purchaseNum,
              unit: formUnit,
              stockQuantity: stockNum,
              lowStockThreshold: thresholdNum,
              description: formDesc.trim(),
            }
          : p
      );
      saveProducts(updated);
    } else {
      const newItem: CatalogProduct = {
        id: `item-${Date.now()}`,
        name: formName.trim(),
        type: formType,
        price: priceNum,
        purchasePrice: purchaseNum,
        unit: formUnit,
        stockQuantity: stockNum,
        lowStockThreshold: thresholdNum,
        description: formDesc.trim(),
        createdAt: new Date().toISOString(),
      };
      saveProducts([newItem, ...products]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
    }
  };

  const handleShareProduct = (item: CatalogProduct) => {
    const shareMessage = `🛍️ *${companyName}* - Product Details:\n\n*Item:* ${item.name}\n*Price:* ${formatCurrency(item.price)} / ${item.unit}\n*In Stock:* ${item.stockQuantity} ${item.unit}\n${item.description ? `*Details:* ${item.description}\n` : ""}\nContact us to place an order!`;
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank");
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterMode === "IN_STOCK") {
        return p.stockQuantity > 0;
      }
      if (filterMode === "LOW_STOCK") {
        return p.stockQuantity <= p.lowStockThreshold;
      }
      return true;
    });
  }, [products, searchQuery, filterMode]);

  // Stock Stats
  const totalStockValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;
  }, [products]);

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300 w-full max-w-5xl lg:max-w-6xl mx-auto px-2 sm:px-4">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
              title="Back to Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-200" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Items Catalog
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                {companyName} • {products.length} Products Registered
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Product</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[11px] text-emerald-100 font-medium block">Total Items</span>
            <span className="text-lg font-black">{products.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[11px] text-emerald-100 font-medium block">Stock Value</span>
            <span className="text-lg font-black">{formatCurrency(totalStockValuation)}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[11px] text-amber-200 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Low Stock Alert
            </span>
            <span className="text-lg font-black text-amber-300">{lowStockCount}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product name, unit, or description..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filterMode === "ALL"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterMode("IN_STOCK")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filterMode === "IN_STOCK"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            In Stock ({products.filter((p) => p.stockQuantity > 0).length})
          </button>
          <button
            onClick={() => setFilterMode("LOW_STOCK")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              filterMode === "LOW_STOCK"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Low Stock ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Products Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your items catalog is empty. Click '+ Add Product' to register your inventory items.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map((item) => {
            const isLowStock = item.stockQuantity <= item.lowStockThreshold;
            const isOutOfStock = item.stockQuantity <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top line: Unit & Stock Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {item.unit}
                    </span>

                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Low: {item.stockQuantity} {item.unit}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Stock: {item.stockQuantity} {item.unit}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2 mb-1">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Pricing info */}
                  <div className="bg-slate-50 rounded-xl p-2.5 mb-3 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Sale Price:</span>
                      <span className="text-base font-black text-emerald-600">
                        {formatCurrency(item.price)}
                        <span className="text-[11px] font-normal text-slate-400 ml-0.5">/{item.unit}</span>
                      </span>
                    </div>
                    {item.purchasePrice > 0 && (
                      <div className="flex items-baseline justify-between text-xs text-slate-400">
                        <span>Purchase Price:</span>
                        <span>{formatCurrency(item.purchasePrice)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Share WhatsApp, Edit, Delete */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => handleShareProduct(item)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-200" />
                <h3 className="font-black text-base sm:text-lg">
                  {editingItem ? "Edit Product Details" : "Add New Product"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. DAP Fertilizer (50kg Bag) or Item Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 1350"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Purchase Price (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formPurchasePrice}
                    onChange={(e) => setFormPurchasePrice(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Bag">Bag</option>
                    <option value="Kg">Kg</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Litre">Litre</option>
                    <option value="Box">Box</option>
                    <option value="Bundle">Bundle</option>
                    <option value="Mtr">Meter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Quality, brand, batch number or other notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 shadow-md transition-all"
                >
                  {editingItem ? "Save Changes" : "+ Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
