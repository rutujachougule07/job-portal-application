import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Trash2,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Search,
  X,
  FileText,
  User,
  Phone,
  Tag,
} from "lucide-react";
import { formatCurrency } from "@/lib/data-store";

export interface OrderItemDetail {
  id: string;
  name: string;
  qty: number;
  rate: number;
  unit: string;
}

export interface BillOrder {
  id: string;
  orderNumber: string;
  category: "Combo" | "Mix" | "Accessories";
  partyName: string;
  partyPhone: string;
  items: OrderItemDetail[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Cancelled";
  note?: string;
  createdAt: string;
}

interface MyOrdersViewProps {
  onBack: () => void;
  employerId?: string;
  companyName?: string;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({
  onBack,
  employerId = "default",
  companyName = "Green Agro",
}) => {
  const storageKey = `billbook_orders_${employerId}`;

  const [orders, setOrders] = useState<BillOrder[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: BillOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy/sample orders
          const cleaned = parsed.filter(
            (o) =>
              o &&
              o.id &&
              !o.id.startsWith("ord-1") &&
              !o.id.startsWith("ord-2") &&
              !o.id.startsWith("ord-3")
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

  const [selectedCategory, setSelectedCategory] = useState<"All" | "Combo" | "Mix" | "Accessories">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Pending" | "Completed">("ALL");

  // Create Order Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<"Combo" | "Mix" | "Accessories">("Combo");
  const [partyName, setPartyName] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Draft Items inside Create Modal
  const [draftItems, setDraftItems] = useState<OrderItemDetail[]>([]);
  const [inputItemName, setInputItemName] = useState("");
  const [inputItemQty, setInputItemQty] = useState("1");
  const [inputItemRate, setInputItemRate] = useState("");
  const [inputItemUnit, setInputItemUnit] = useState("Pcs");

  // View Slip Modal State
  const [slipOrder, setSlipOrder] = useState<BillOrder | null>(null);

  const saveOrders = (updated: BillOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  };

  const handleAddDraftItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputItemName.trim() || !inputItemRate) return;

    const qty = parseFloat(inputItemQty) || 1;
    const rate = parseFloat(inputItemRate) || 0;

    const newItem: OrderItemDetail = {
      id: `draft-item-${Date.now()}`,
      name: inputItemName.trim(),
      qty,
      rate,
      unit: inputItemUnit,
    };

    setDraftItems([...draftItems, newItem]);
    setInputItemName("");
    setInputItemQty("1");
    setInputItemRate("");
  };

  const handleRemoveDraftItem = (id: string) => {
    setDraftItems(draftItems.filter((i) => i.id !== id));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftItems.length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }

    const total = draftItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const newOrder: BillOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: modalCategory,
      partyName: partyName.trim() || "Walk-in Customer",
      partyPhone: partyPhone.trim(),
      items: draftItems,
      totalAmount: total,
      status: "Pending",
      note: orderNote.trim(),
      createdAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...orders]);
    setIsCreateOpen(false);
    // Reset Form
    setPartyName("");
    setPartyPhone("");
    setOrderNote("");
    setDraftItems([]);
  };

  const handleToggleStatus = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const nextStatus = o.status === "Pending" ? "Completed" : "Pending";
        return { ...o, status: nextStatus as "Pending" | "Completed" };
      }
      return o;
    });
    saveOrders(updated);
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to delete order ${orderNumber}?`)) {
      saveOrders(orders.filter((o) => o.id !== orderId));
    }
  };

  const handleShareWhatsApp = (order: BillOrder) => {
    const itemsText = order.items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.name}* x ${i.qty} ${i.unit} = ${formatCurrency(i.qty * i.rate)}`
      )
      .join("\n");

    const whatsappMessage =
      `📦 *${companyName} - Order Receipt*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `*Order No:* ${order.orderNumber}\n` +
      `*Type:* ${order.category}\n` +
      `*Customer:* ${order.partyName} ${order.partyPhone ? `(${order.partyPhone})` : ""}\n` +
      `*Date:* ${new Date(order.createdAt).toLocaleDateString("en-IN")}\n` +
      `*Status:* ${order.status === "Completed" ? "Completed / Delivered" : "Pending"}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `*Items:*\n${itemsText}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `*Total Amount:* *${formatCurrency(order.totalAmount)}*\n` +
      `${order.note ? `\n*Note:* ${order.note}\n` : ""}` +
      `\nThank you! 🙏`;

    const url = `https://wa.me/${order.partyPhone ? `91${order.partyPhone.replace(/\D/g, "")}` : ""}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedCategory !== "All" && o.category !== selectedCategory) return false;
      if (statusFilter !== "ALL" && o.status !== statusFilter) return false;

      const q = searchQuery.toLowerCase();
      if (
        !o.orderNumber.toLowerCase().includes(q) &&
        !o.partyName.toLowerCase().includes(q) &&
        !o.partyPhone.toLowerCase().includes(q) &&
        !o.items.some((i) => i.name.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [orders, selectedCategory, statusFilter, searchQuery]);

  // Summary Metrics
  const pendingCount = useMemo(() => orders.filter((o) => o.status === "Pending").length, [orders]);
  const completedCount = useMemo(() => orders.filter((o) => o.status === "Completed").length, [orders]);
  const totalOrdersValue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300 w-full max-w-5xl lg:max-w-6xl mx-auto px-2 sm:px-4">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg">
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
                <ShoppingBag className="w-5 h-5 text-pink-200" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  My Orders
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-pink-100 font-medium">
                {companyName} • Combo, Mix &amp; Accessories Order Management
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setDraftItems([]);
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-purple-900 hover:bg-pink-50 active:scale-95 font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create Order</span>
          </button>
        </div>

        {/* 3 Categories Selector Banner (Matching Android MyOrderActivity) */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center ${
              selectedCategory === "All"
                ? "bg-white text-purple-900 shadow-md scale-[1.02]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>All ({orders.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory("Combo")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center ${
              selectedCategory === "Combo"
                ? "bg-white text-purple-900 shadow-md scale-[1.02]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>Combo ({orders.filter((o) => o.category === "Combo").length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory("Mix")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center ${
              selectedCategory === "Mix"
                ? "bg-white text-purple-900 shadow-md scale-[1.02]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Tag className="w-4 h-4 mb-0.5" />
            <span>Mix ({orders.filter((o) => o.category === "Mix").length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory("Accessories")}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center ${
              selectedCategory === "Accessories"
                ? "bg-white text-purple-900 shadow-md scale-[1.02]"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span>Accessories ({orders.filter((o) => o.category === "Accessories").length})</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-500 font-semibold block">Total Orders Value</span>
          <span className="text-base sm:text-lg font-black text-purple-700">
            {formatCurrency(totalOrdersValue)}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Orders
          </span>
          <span className="text-base sm:text-lg font-black text-amber-700">{pendingCount}</span>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed Orders
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-700">{completedCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order number, customer name, or item..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === "ALL"
                ? "bg-purple-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === "Pending"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === "Completed"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No customer orders recorded yet. Click '+ Create Order' to create your first order slip.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create First Order</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === "Completed";

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-800 text-sm sm:text-base">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          order.category === "Combo"
                            ? "bg-purple-100 text-purple-700"
                            : order.category === "Mix"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {order.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {order.partyName}
                      </span>
                      {order.partyPhone && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Phone className="w-3 h-3" />
                          {order.partyPhone}
                        </span>
                      )}
                      <span className="text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Status Toggle Badge */}
                  <button
                    onClick={() => handleToggleStatus(order.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                    title="Click to toggle status"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Pending
                      </>
                    )}
                  </button>
                </div>

                {/* Items Summary Pills */}
                <div className="bg-slate-50 rounded-xl p-2.5 space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Items List ({order.items.length} items)</span>
                    <span>Amount</span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-slate-700 font-medium"
                    >
                      <span>
                        • {item.name} × {item.qty} {item.unit}
                      </span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(item.qty * item.rate)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between font-black text-sm">
                    <span className="text-slate-700">Order Total:</span>
                    <span className="text-purple-700">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                {order.note && (
                  <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    Note: {order.note}
                  </p>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleShareWhatsApp(order)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Receipt</span>
                  </button>

                  <button
                    onClick={() => setSlipOrder(order)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Slip</span>
                  </button>

                  <button
                    onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Order Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-200" />
                <h3 className="font-black text-base sm:text-lg">Create New Order</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Category picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Order Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Combo", "Mix", "Accessories"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setModalCategory(cat)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                        modalCategory === cat
                          ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer / Supplier Name *
                  </label>
                  <input
                    type="text"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="e.g. Ramesh Pawar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value)}
                    placeholder="e.g. 9822334455"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Add item to draft inline form */}
              <div className="bg-purple-50/60 rounded-2xl p-3.5 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-900 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    Add Product Item to Order
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={inputItemName}
                    onChange={(e) => setInputItemName(e.target.value)}
                    placeholder="Product name (e.g. Fertilizer Bag)"
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="number"
                      step="any"
                      value={inputItemQty}
                      onChange={(e) => setInputItemQty(e.target.value)}
                      placeholder="Qty"
                      className="w-full px-2 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white text-center font-bold"
                    />
                    <select
                      value={inputItemUnit}
                      onChange={(e) => setInputItemUnit(e.target.value)}
                      className="w-full px-1 py-2 rounded-xl border border-purple-200 text-xs bg-white font-medium"
                    >
                      <option value="Pcs">Pcs</option>
                      <option value="Bag">Bag</option>
                      <option value="Kg">Kg</option>
                      <option value="Litre">Litre</option>
                      <option value="Bundle">Bundle</option>
                    </select>
                    <input
                      type="number"
                      step="any"
                      value={inputItemRate}
                      onChange={(e) => setInputItemRate(e.target.value)}
                      placeholder="Rate ₹"
                      className="w-full px-2 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white text-center font-bold text-purple-700"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddDraftItem}
                  className="w-full py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Item to List</span>
                </button>
              </div>

              {/* Added Items Table */}
              {draftItems.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Added Items ({draftItems.length})
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {draftItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">
                            {idx + 1}. {item.name}
                          </span>
                          <span className="text-slate-400 ml-2">
                            ({item.qty} {item.unit} × {formatCurrency(item.rate)})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-purple-700">
                            {formatCurrency(item.qty * item.rate)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDraftItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="p-2.5 bg-purple-50/50 flex items-center justify-between text-xs font-black">
                      <span>Order Total:</span>
                      <span className="text-purple-700 text-sm">
                        {formatCurrency(
                          draftItems.reduce((sum, item) => sum + item.qty * item.rate, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery / Order Notes (Optional)
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Cash payment on delivery, morning slot..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateOrder}
                  className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 active:scale-95 shadow-md transition-all"
                >
                  ✓ Save Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Slip View Modal */}
      {slipOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-sm sm:text-base">Order Slip Preview</h3>
              </div>
              <button
                onClick={() => setSlipOrder(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="text-center border-b pb-3 space-y-1">
                <h2 className="text-base font-black text-slate-800 font-sans">{companyName}</h2>
                <p className="text-slate-500">Official Order Slip</p>
                <p className="text-slate-400">{new Date(slipOrder.createdAt).toLocaleString("en-IN")}</p>
              </div>

              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Order No:</span>
                  <span className="font-bold">{slipOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold">{slipOrder.partyName}</span>
                </div>
                {slipOrder.partyPhone && (
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span>{slipOrder.partyPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-bold">{slipOrder.category}</span>
                </div>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                {slipOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.name} ({i.qty} {i.unit})
                    </span>
                    <span>{formatCurrency(i.qty * i.rate)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Amount:</span>
                <span>{formatCurrency(slipOrder.totalAmount)}</span>
              </div>

              {slipOrder.note && (
                <p className="text-[11px] text-slate-500 border-t pt-2 italic">
                  Note: {slipOrder.note}
                </p>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 rounded-xl bg-purple-700 text-white font-sans font-bold text-xs hover:bg-purple-800 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Slip
                </button>
                <button
                  onClick={() => {
                    handleShareWhatsApp(slipOrder);
                    setSlipOrder(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-sans font-bold text-xs hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
