import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCheck,
  Clock,
  Phone,
  Search,
  Send,
  User,
  UserCheck,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({
    meta: [
      { title: "Messages & Employer Chat — REAL JOB" },
      { name: "description", content: "Directly chat with employers and workers on REAL JOB." },
    ],
  }),
  component: MessagesPage,
});

type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  verified: boolean;
  online: boolean;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
};

const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "Tata Auto Components HR",
    role: "Employer",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    verified: true,
    online: true,
    unread: 2,
    lastMessage: "नमस्कार, तुमचे CNC मशीन ऑपरेटरचे प्रोफाईल पाहिले. तुम्ही उद्या मुलाखतीला येऊ शकता का?",
    lastTime: "10:30 AM",
    messages: [
      { id: "m1", sender: "them", text: "नमस्कार रमेशजी, तुमचे CNC मशीन ऑपरेटरचे प्रोफाईल पाहिले.", time: "10:28 AM" },
      { id: "m2", sender: "them", text: "तुम्ही चाकण प्लांटमध्ये उद्या मुलाखतीसाठी येऊ शकता का?", time: "10:30 AM" },
    ],
  },
  {
    id: "c2",
    name: "Ramesh Pawar (Senior Electrician)",
    role: "Worker Candidate",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80",
    verified: true,
    online: false,
    unread: 0,
    lastMessage: "होय सर, मी सोमवारी कामावर येऊ शकतो.",
    lastTime: "Yesterday",
    messages: [
      { id: "m3", sender: "me", text: "नमस्कार रमेशजी, तुमचा ७ वर्षांचा अनुभव पाहिला. पगार रु. २५,००० मान्य आहे का?", time: "Yesterday" },
      { id: "m4", sender: "them", text: "होय सर, मी सोमवारी कामावर येऊ शकतो.", time: "Yesterday" },
    ],
  },
  {
    id: "c3",
    name: "REAL JOB Support Team",
    role: "Official Support",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verified: true,
    online: true,
    unread: 0,
    lastMessage: "Welcome to REAL JOB! How can we assist your hiring today?",
    lastTime: "2 days ago",
    messages: [
      { id: "m5", sender: "them", text: "Welcome to REAL JOB! How can we assist your hiring today?", time: "2 days ago" },
    ],
  },
];

function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState("c1");
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");

  const activeConv = (conversations.find((c) => c.id === selectedId) ?? mockConversations[0])!;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessage: inputText,
            lastTime: newMsg.time,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#DCE5F0] shadow-md grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden min-h-[620px]">
            {/* Left Sidebar: Conversations List */}
            <div className="border-r border-[#DCE5F0] flex flex-col bg-[#F5F8FC]">
              {/* Header & Search */}
              <div className="p-4 border-b border-[#DCE5F0] bg-white space-y-3">
                <h1 className="text-lg font-black text-[#10233F]">संदेश (Messages)</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#5B6B7F]" />
                  <Input
                    placeholder="चॅट शोधा (Search)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold"
                  />
                </div>
              </div>

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#DCE5F0]">
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedId(conv.id)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isSelected ? "bg-white border-l-4 border-[#063B78]" : "hover:bg-white/60"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="size-11 rounded-full object-cover border border-[#DCE5F0]"
                        />
                        {conv.online && (
                          <span className="size-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#10233F] truncate">{conv.name}</span>
                          <span className="text-[10px] font-bold text-[#5B6B7F]">{conv.lastTime}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#125BB5] block">{conv.role}</span>
                        <p className="text-xs text-[#5B6B7F] truncate font-medium mt-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Window */}
            <div className="flex flex-col bg-white">
              {/* Chat Top Header */}
              <div className="p-4 border-b border-[#DCE5F0] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConv.avatar}
                      alt={activeConv.name}
                      className="size-10 rounded-full object-cover border border-[#063B78]"
                    />
                    {activeConv.online && (
                      <span className="size-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#10233F] flex items-center gap-1.5">
                      {activeConv.name}
                      {activeConv.verified && (
                        <BadgeCheck className="size-4 text-[#FFC400] fill-[#063B78]" />
                      )}
                    </h2>
                    <span className="text-[11px] font-bold text-[#125BB5]">
                      {activeConv.online ? "Online Now" : "Offline"} • {activeConv.role}
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="border-[#063B78] text-[#063B78] font-bold text-xs">
                  <Phone className="size-3.5 mr-1" /> डायरेक्ट कॉल
                </Button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F5F8FC]">
                {activeConv.messages.map((msg) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl shadow-xs text-xs font-semibold leading-relaxed ${
                          isMe
                            ? "bg-[#063B78] text-white rounded-br-none"
                            : "bg-white text-[#10233F] border border-[#DCE5F0] rounded-bl-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[9.5px] block text-right mt-1 font-bold ${
                            isMe ? "text-white/70" : "text-[#5B6B7F]"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#DCE5F0] bg-white flex items-center gap-3">
                <Input
                  placeholder="संदेश प्रविष्ट करा (Type your message)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-11 border-[#DCE5F0] bg-[#F5F8FC] text-xs font-bold text-[#10233F]"
                />
                <Button type="submit" className="btn-yellow h-11 px-5 font-black text-xs">
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
