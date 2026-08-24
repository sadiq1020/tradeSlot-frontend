"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  Send,
  Wrench,
  RotateCcw,
  Sparkles,
  Loader2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import {
  useSendWebchatMessage,
  useCreateCheckout,
} from "@/lib/queries/webchat";
import { ChatMessage, ChatMessageItem } from "./chat-message-item";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "tradeslot_webchat_sender_id";

export function ChatWidget() {
  const [senderId, setSenderId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeCheckoutBookingId, setActiveCheckoutBookingId] = useState<
    string | null
  >(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendWebchatMessage();
  const checkoutMutation = useCreateCheckout();

  // 1. Initialize or load persistent senderId per browser session
  useEffect(() => {
    let storedId = localStorage.getItem(STORAGE_KEY);
    if (!storedId) {
      storedId = `web_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem(STORAGE_KEY, storedId);
    }
    setSenderId(storedId);

    // Initial greeting from bot
    setMessages([
      {
        id: "msg_welcome",
        sender: "bot",
        text: "👋 Hi! Welcome to TradeSlot. I can check available trade slots and book a technician for you. What service do you need and what is your postcode?",
        timestamp: format(new Date(), "HH:mm"),
      },
    ]);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || sendMessageMutation.isPending || !senderId) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: format(new Date(), "HH:mm"),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const response = await sendMessageMutation.mutateAsync({
        senderId,
        message: text,
      });

      const responseData = response.data || (response as any);

      const botReplyText =
        responseData.reply ||
        responseData.message ||
        responseData.text ||
        "I've noted your request. Let me check the schedule.";

      // Extract booking ID from various potential response structures or from text (#reference)
      const textRefMatch =
        botReplyText.match(/\(#([a-zA-Z0-9_-]+)\)/) ||
        botReplyText.match(/booking\s*\(?#([a-zA-Z0-9_-]+)\)?/i) ||
        botReplyText.match(/#([a-zA-Z0-9]{5,})/);
      const textBookingId = textRefMatch ? textRefMatch[1] : undefined;

      const detectedBookingId =
        responseData.bookingId ||
        responseData.booking?.id ||
        responseData.data?.bookingId ||
        responseData.data?.booking?.id ||
        responseData.data?.id ||
        responseData.id ||
        textBookingId;

      const detectedCheckoutUrl =
        responseData.checkoutUrl ||
        responseData.data?.checkoutUrl ||
        responseData.booking?.checkoutUrl ||
        responseData.data?.booking?.checkoutUrl;

      const isPaymentRequired =
        Boolean(detectedBookingId) ||
        botReplyText.toLowerCase().includes("complete payment") ||
        botReplyText.toLowerCase().includes("confirm your booking");

      const botMessage: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: "bot",
        text: botReplyText,
        timestamp: format(new Date(), "HH:mm"),
        availableSlots:
          responseData.availableSlots ||
          responseData.slots ||
          responseData.data?.availableSlots ||
          responseData.data?.slots,
        booking: responseData.booking || responseData.data?.booking,
        bookingId: detectedBookingId,
        checkoutUrl: detectedCheckoutUrl,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Webchat message error:", err);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: "bot",
        text: "Sorry, I had trouble connecting to the booking engine. Please make sure your message contains your request and postcode.",
        timestamp: format(new Date(), "HH:mm"),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSelectSlot = (slotText: string) => {
    handleSendMessage(`I'd like to book the slot: ${slotText}`);
  };

  const handlePayNow = async (bookingId: string, directUrl?: string) => {
    if (directUrl) {
      window.location.href = directUrl;
      return;
    }

    setActiveCheckoutBookingId(bookingId);
    try {
      await checkoutMutation.mutateAsync(bookingId);
    } catch (err) {
      console.error("Checkout session creation error:", err);
      setActiveCheckoutBookingId(null);
    }
  };

  const handleResetConversation = () => {
    const newId = `web_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    localStorage.setItem(STORAGE_KEY, newId);
    setSenderId(newId);
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: "bot",
        text: "Conversation reset. Hello! What trade service do you need today?",
        timestamp: format(new Date(), "HH:mm"),
      },
    ]);
  };

  const samplePrompts = [
    "I need a boiler repair in NW1 tomorrow",
    "Wiring check in Camden",
    "What slots are available for plumbing?",
  ];

  return (
    <div className="flex flex-col h-[650px] max-h-[85vh] w-full max-w-xl mx-auto rounded-2xl bg-bg-surface border border-border-hairline shadow-2xl overflow-hidden">
      {/* Widget Header */}
      <div className="h-16 px-5 border-b border-border-hairline bg-bg-base/80 backdrop-blur flex items-center justify-between select-none">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-bg-surface-elevated border border-border-hairline flex items-center justify-center text-accent-brass">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-accent-copper border-2 border-bg-base" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-tight">
                TradeSlot Assistant
              </h2>
              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-accent-copper-muted text-accent-copper font-bold uppercase">
                Online
              </span>
            </div>
            <p className="font-mono text-[10px] text-text-muted">
              Auto Dispatch & Instant Scheduling
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetConversation}
          title="Start fresh conversation"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated transition-colors text-xs flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onSelectSlot={handleSelectSlot}
            onPayNow={handlePayNow}
            isCheckingOut={
              checkoutMutation.isPending &&
              activeCheckoutBookingId === msg.bookingId
            }
          />
        ))}

        {/* Bot Typing Indicator */}
        {sendMessageMutation.isPending && (
          <div className="flex items-center space-x-2 text-text-muted text-xs animate-pulse pl-11">
            <div className="w-2 h-2 rounded-full bg-accent-brass" />
            <div className="w-2 h-2 rounded-full bg-accent-brass animation-delay-200" />
            <div className="w-2 h-2 rounded-full bg-accent-brass animation-delay-400" />
            <span className="font-mono text-[11px] ml-1">
              Checking booking pipeline...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
          <span className="font-mono text-[10px] text-text-muted whitespace-nowrap flex items-center mr-1">
            <Sparkles className="w-3 h-3 mr-1 text-accent-brass" />
            Try:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-bg-base border border-border-hairline hover:border-accent-brass text-text-secondary hover:text-text-primary whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 border-t border-border-hairline bg-bg-base/60 backdrop-blur flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your service request & postcode..."
          disabled={sendMessageMutation.isPending}
          className="flex-1 px-4 py-2.5 rounded-xl bg-bg-surface border border-border-hairline text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-brass transition-colors font-sans"
        />

        <Button
          type="submit"
          size="icon"
          disabled={!inputText.trim() || sendMessageMutation.isPending}
          className="h-10 w-10 rounded-xl bg-accent-brass text-[#0E1217] hover:bg-accent-brass-hover flex-shrink-0"
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
