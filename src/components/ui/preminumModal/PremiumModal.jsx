import React, { useState } from "react";
import {
  X,
  Star,
  Shield,
  Zap,
  Crown,
  MessageSquare,
  Clock,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PremiumModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  // Early return if modal is closed
  if (!isOpen) return null;

  const features = [
    {
      icon: <Shield className="h-5 w-5 text-blue-400" />,
      title: "Ad-Free Experience",
    },
    {
      icon: <Zap className="h-5 w-5 text-purple-400" />,
      title: "Priority Support",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-green-400" />,
      title: "Unlimited Messages",
    },
    {
      icon: <Clock className="h-5 w-5 text-orange-400" />,
      title: "Message History",
    },
    {
      icon: <Palette className="h-5 w-5 text-pink-400" />,
      title: "Custom Themes",
    },
  ];

  const plans = [
    { id: "monthly", name: "Monthly", price: "₹799", period: "/month" },
    {
      id: "yearly",
      name: "Yearly",
      price: "₹7199",
      period: "/year",
      savings: "Save 25%",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 rounded-xl relative">
        {/* Multiple close options */}
        <div className="absolute top-0 right-0 m-4">
          <Button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Clicking outside also closes modal */}
        <div className="fixed inset-0 z-[-1]" onClick={onClose}></div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-2 rounded-lg">
              <Crown className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Upgrade to{" "}
              <span className="text-yellow-400">TalkHub Premium</span>
            </h2>
          </div>

          {/* Pricing Plans */}
          <div className="flex gap-4 mb-6 justify-center">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`cursor-pointer flex-1 max-w-xs`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div
                  className={`border ${
                    selectedPlan === plan.id
                      ? "border-yellow-500 bg-zinc-800"
                      : "border-zinc-800 bg-zinc-900"
                  } rounded-lg p-4`}
                >
                  <h3 className="text-base font-medium text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-end">
                    <span className="text-2xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-400 ml-1">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-green-400 text-sm">{plan.savings}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 border border-zinc-800 bg-zinc-900/50 rounded-lg"
              >
                {feature.icon}
                <h4 className="text-white text-sm">{feature.title}</h4>
              </div>
            ))}
          </div>

          {/* Action Buttons - Clear options with prominent close button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Button
              className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold px-6 py-2 rounded-lg w-full sm:w-auto"
              onClick={() => {
                // Handle subscription
                onClose();
                window.open(
                  "https://me-qr.com/qr-code-generator/for-payment?srsltid=AfmBOop8AB59WerhFknn8R8Sr1DiHZ11K03bPbFZmQdCeiP_VFhoRCOM",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Get {selectedPlan === "yearly" ? "Yearly" : "Monthly"}
            </Button>

            <Button
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-2 rounded-lg w-full sm:w-auto"
            >
              Maybe Later
            </Button>
          </div>

          {/* ESC key instruction */}
          <p className="text-zinc-500 text-center text-xs mt-4">
            Press ESC key or click outside to close
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PremiumModal;
