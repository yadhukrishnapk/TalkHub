import React, { useState } from "react";
import {
  X,
  Star,
  Shield,
  Zap,
  Crown,
  Check,
  Sparkles,
  MessageSquare,
  Clock,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PremiumModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const features = [
    {
      icon: <Shield className="h-5 w-5 text-blue-400" />,
      title: "Ad-Free Experience",
      description: "Enjoy TalkHub without any advertisements or distractions",
    },
    {
      icon: <Zap className="h-5 w-5 text-purple-400" />,
      title: "Priority Support",
      description: "Get faster responses from our dedicated support team",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-green-400" />,
      title: "Unlimited Messages",
      description: "No limits on messages across all your conversations",
    },
    {
      icon: <Clock className="h-5 w-5 text-orange-400" />,
      title: "Message History",
      description: "Access your complete message history without limitations",
    },
    {
      icon: <Palette className="h-5 w-5 text-pink-400" />,
      title: "Custom Themes",
      description: "Personalize your chat experience with exclusive themes",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
      title: "AI Assistant",
      description: "Advanced AI features to enhance your conversations",
    },
  ];

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$9.99",
      period: "/month",
      popular: false,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$89.99",
      period: "/year",
      popular: true,
      savings: "Save 25%",
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-3xl relative my-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 text-zinc-400 hover:text-white transition-all duration-200 z-10 shadow-lg"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 overflow-hidden shadow-xl shadow-yellow-500/10 rounded-2xl">
              {/* Gold accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

              <div className="p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-2 sm:p-3 rounded-xl shadow-lg shadow-yellow-500/20">
                    <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    Upgrade to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                      TalkHub Premium
                    </span>
                  </h2>
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-center text-sm sm:text-base max-w-xl mx-auto mb-6 sm:mb-8">
                  Unlock the full potential of TalkHub with our Premium
                  subscription. Enjoy advanced features, unlimited messages, and
                  an ad-free experience.
                </p>

                {/* Pricing Plans */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 sm:mb-8 justify-center">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative flex-1 max-w-xs mx-auto md:mx-0 cursor-pointer group`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 inset-x-0 flex justify-center">
                          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            BEST VALUE
                          </div>
                        </div>
                      )}

                      <div
                        className={`border ${
                          selectedPlan === plan.id
                            ? "border-yellow-500 bg-gradient-to-b from-zinc-800/80 to-zinc-900"
                            : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50"
                        } 
                        rounded-xl p-4 sm:p-6 transition-all duration-200 ${
                          plan.popular ? "mt-3" : ""
                        }`}
                      >
                        <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                          {plan.name}
                        </h3>
                        <div className="flex items-end mb-1">
                          <span className="text-2xl sm:text-3xl font-bold text-white">
                            {plan.price}
                          </span>
                          <span className="text-zinc-400 ml-1">
                            {plan.period}
                          </span>
                        </div>
                        {plan.savings && (
                          <div className="text-green-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                            {plan.savings}
                          </div>
                        )}

                        <div
                          className={`mt-3 sm:mt-4 w-full h-1 rounded ${
                            selectedPlan === plan.id
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                              : "bg-zinc-800"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border border-zinc-800 bg-zinc-900/50 rounded-lg hover:border-zinc-700 transition-all duration-200"
                    >
                      <div className="mt-1 flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h4 className="text-white text-sm sm:text-base font-medium">
                          {feature.title}
                        </h4>
                        <p className="text-zinc-400 text-xs sm:text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 hover:scale-105 transition-all duration-200 h-auto">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Get Premium{" "}
                    {selectedPlan === "yearly" ? "Yearly" : "Monthly"}
                  </Button>
                </div>

                <p className="text-zinc-500 text-center text-xs sm:text-sm mt-4 sm:mt-6">
                  30-day money-back guarantee. Cancel anytime.
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={onClose}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
