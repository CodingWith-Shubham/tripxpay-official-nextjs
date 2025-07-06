"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  HelpCircle,
  Shield,
  CreditCard,
  Star,
  Mail,
} from "lucide-react";
import { useAuth } from "@/contexts/Auth";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  options?: string[];
}

interface QuickButton {
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BotResponse {
  text: string;
  options: string[];
}

// fetch the user data from firebase
const getUserData = async (uid: string): Promise<any> => {
  try {
    const response = await fetch(`/api/getuserdata?uid=${uid}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const askTripXPayBot = async (message: string): Promise<string> => {
  try {
    const response = await fetch('/api/asktripxpaybot', {  // Changed from '/api/askBot' to '/api/asktripxpaybot'
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error asking bot:', error);
    return "I'm having trouble connecting to the AI service. Please try again later.";
  }
};

const ChatbotPage = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const [chatEnded, setChatEnded] = useState(false);
  const [hoveringChatbot, setHoveringChatbot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentUser } = useAuth();

  const quickButtons: QuickButton[] = [
    { id: "status", text: "Account Status", icon: Shield },
    { id: "credit", text: "Credit Spend", icon: CreditCard },
    { id: "help", text: "Help & Support", icon: HelpCircle }
  ];

  const HELP_OPTIONS = [
    "Report an issue",
    "Contact support team"
  ];

  // 5 minutes of inactivity timer resets on any user interaction
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      if (showChatbot) {
        endChat();
      }
    }, 5 * 60 * 1000);
  }, [showChatbot]);

  // Init on mount
  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [showChatbot, messages, resetInactivityTimer]);

  // Chat history will only be loaded when the chat hasn't ended
  useEffect(() => {
    if (showChatbot && !chatEnded) {
      if (messages.length === 0) {
        addBotMessage("Welcome to TripXPay! 👋");
        addBotMessage("I'm your AI assistant, ready to help you with all your travel and payment needs.");
        addBotMessage("Choose from the quick options below or type your question:");
      }
    }
  }, [showChatbot, chatEnded, messages.length]);

  useEffect(() => {
    const handleOpenChatbot = () => {
      setShowChatbot(true);
      setIsMinimized(false);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = useCallback((text: string, options: string[] = []) => {
    const newMessage: Message = { 
      id: Date.now() + Math.random(),
      sender: "bot", 
      text, 
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const addUserMessage = useCallback((text: string) => {
    const newMessage: Message = { 
      id: Date.now() + Math.random(),
      sender: "user", 
      text, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, newMessage]);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const processMessage = async (message: string): Promise<BotResponse> => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Handle back to main option
    if (lowerMessage.includes('back to main') || lowerMessage.includes('main menu') || lowerMessage.includes('back to home')) {
      setShowQuickButtons(true);
      return {
        text: "Welcome back to the main menu! How can I help you today?",
        options: []
      };
    }

    // Contact Support
    if (lowerMessage.includes('contact support') || lowerMessage.includes('call support') || lowerMessage.includes('contact support team')) {
      return {
        text: `📞 Contact Support Options\n\n1. Call: +919315224277\n2. Email: tripxpay@gmail.com\n3. Live Chat (available in app)`,
        options: []
      };
    }

    // Report Issue
    if (lowerMessage.includes('report an issue') || lowerMessage.includes('report issue')) {
      return {
        text: `Please describe your issue in detail below and click Send when ready.\n\nOur team will review it and get back to you.`,
        options: []
      };
    }

    // Account Status - detect various ways users might ask about verification
    if (lowerMessage.includes('verification') || 
        lowerMessage.includes('verified') || 
        lowerMessage.includes('status') || 
        lowerMessage.includes('am i verified') ||
        lowerMessage.includes('whats my verification') ||
        lowerMessage.includes('check my verification') ||
        lowerMessage.includes('account status') || 
        lowerMessage === 'status' || 
        lowerMessage === 'account') {
      if (!currentUser) {
        return {
          text: `🔐 Please log in to check your account status.`,
          options: []
        };
      }

      try {
        const userData = await getUserData(currentUser.uid);
        
        if (!userData) {
          return {
            text: `📝 Account setup incomplete`,
            options: []
          };
        }

        if (userData.isVerified === true) {
          return {
            text: `✅ Verified\n\nYour account is fully verified with all features unlocked.`,
            options: []
          };
        } else if (userData.isVerified === false) {
          return {
            text: `⏳ Pending Verification`,
            options: []
          };
        } else {
          return {
            text: `📋 Unverified`,
            options: []
          };
        }
      } catch (error) {
        return {
          text: `❌ Unable to check account status right now.`,
          options: []
        };
      }
    }

    // Credit Spend - combined credit limit and balance information
    if (lowerMessage.includes('credit spend') || 
        lowerMessage.includes('spend') || 
        lowerMessage.includes('available credit') ||
        lowerMessage.includes('how much can i spend') ||
        lowerMessage.includes('what can i spend') ||
        lowerMessage.includes('credit available') ||
        lowerMessage === 'credit' || 
        lowerMessage === 'spend') {
      if (!currentUser) {
        return {
          text: `🔐 Please log in to check your credit spend details.`,
          options: []
        };
      }

      try {
        const userData = await getUserData(currentUser.uid);
        const creditLimit = userData?.creditLimit || 0;
        const balance = userData?.creditedAmount || 0;
        const availableCredit = Math.max(0, creditLimit - balance);
        
        return {
          text: `Your Available Credit: ₹${balance.toFixed(2)}`,
          options: []
        };
      } catch (error) {
        return {
          text: `❌ Unable to check credit spend details right now.`,
          options: []
        };
      }
    }

    // Help & Support - detect various help requests
    if (lowerMessage.includes('help and support') || 
        lowerMessage === 'help' || 
        lowerMessage.includes('i need help') ||
        lowerMessage.includes('support') ||
        lowerMessage.includes('assistance')) {
      return {
        text: `I'm here to help! 🤝\n\nWhat can I assist you with?`,
        options: HELP_OPTIONS
      };
    }

    // Support message handling
    if (lowerMessage.includes('account problems') || lowerMessage.includes('payment issues')) {
      return {
        text: `📩 Please describe your issue below and our support team will get back to you soon.\n\nWe typically respond within 24 hours.`,
        options: []
      };
    }

    // Default fallback
    try {
      const geminiResponse = await askTripXPayBot(message);
      return {
        text: geminiResponse,
        options: []
      };
    } catch (error) {
      console.error("Gemini error:", error);
      return {
        text: "I'm not sure how to help with that. Please choose from the available options or contact support.",
        options: []
      };
    }
  };

  const handleSendMessage = async (messageText: string = input) => {
    const userMessage = messageText.trim();
    if (!userMessage || isLoading) return;

    addUserMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      if (userMessage.toLowerCase().includes('call now')) {
        window.location.href = 'tel:+919315224277';
        addBotMessage("Opening phone app to call support...", []);
      } else if (userMessage.toLowerCase().includes('send email')) {
        sendEmail();
        addBotMessage("Opening email client to contact support...", []);
      } else if (userMessage.toLowerCase().includes('report an issue') || 
                 userMessage.toLowerCase().includes('report issue')) {
        addBotMessage("Please describe your issue in detail below and click Send when ready.\n\nOur team will review it and get back to you.", []);
      } else if (userMessage.toLowerCase().includes('describe') && 
                 userMessage.toLowerCase().includes('issue')) {
        addBotMessage("Your issue has been reported to our support team. We'll get back to you soon!", []);
      } else {
        const response = await processMessage(userMessage);
        addBotMessage(response.text, response.options);
      }
    } catch (error) {
      console.error("Chat error:", error);
      addBotMessage("Sorry, I'm having trouble processing your request. Please try again or contact our support team.", []);
    } finally {
      setIsLoading(false);
      setShowQuickButtons(true);
      inputRef.current?.focus();
    }
  };

  const handleQuickButtonClick = (buttonId: string, buttonText: string) => {
    if (buttonId === 'help') {
      addBotMessage("I'm here to help! 🤝\n\nWhat can I assist you with?", HELP_OPTIONS);
    } else {
      handleSendMessage(buttonText);
    }
  };

  const handleOptionClick = (optionText: string) => {
    handleSendMessage(optionText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    if (showChatbot && chatEnded) {
      setChatEnded(false);
      setMessages([]);
      setShowQuickButtons(true);
    }
    setShowChatbot(!showChatbot);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const endChat = () => {
    addBotMessage("Thank you for chatting with us! If you need further assistance, feel free to start a new chat anytime. Have a great day! 😊");
    setChatEnded(true);
    setTimeout(() => {
      setMessages([]);
      setShowQuickButtons(true);
    }, 5000);
  };

  const sendEmail = () => {
    const subject = "Support Request from TripXPay Chat";
    const body = `Hello TripXPay Support Team,\n\nI need assistance with the following:\n\n[Please describe your issue here]`;
    window.location.href = `mailto:tripxpay@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-40"
      onMouseEnter={() => setHoveringChatbot(true)}
      onMouseLeave={() => setHoveringChatbot(false)}
    >
      <motion.button
        onClick={toggleChatbot}
        className="relative p-4 rounded-full bg-gradient-to-br from-teal-600 to-cyan-800 hover:from-teal-700 hover:to-cyan-900 text-white shadow-xl transition-all"
        aria-label="Open chatbot"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
        {!showChatbot && (
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5
            }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {showChatbot && (
          <motion.div
            className="w-80 max-w-[90vw] bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 mt-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <motion.div 
              className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 p-3 flex justify-between items-center border-b border-slate-700/50"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-600 to-cyan-800 flex items-center justify-center shadow-sm"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <span className="text-white font-bold text-xs">T</span>
                </motion.div>
                <h3 className="text-white font-medium text-sm tracking-tight">
                  TripXPay Assistant
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={toggleMinimize}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Minimize chatbot"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  onClick={toggleChatbot}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Close chatbot"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {!isMinimized && (
              <>
                {/* Messages area */}
                <div className="h-48 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-slate-800/50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 0.5
                        }}
                      >
                        <div className={`max-w-[90%]`}>
                          <motion.div
                            className={`relative rounded-xl px-3 py-2 ${msg.sender === "user"
                              ? "bg-gradient-to-br from-teal-600/90 to-cyan-800/90 text-white rounded-br-sm"
                              : "bg-slate-800/90 text-white rounded-bl-sm"
                            }`}
                            whileHover={{ scale: 1.01 }}
                          >
                            {msg.text.split("\n").map((line, j) => (
                              <p key={j} className="text-sm leading-relaxed whitespace-pre-wrap">
                                {line}
                              </p>
                            ))}
                            {msg.options && msg.options.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {msg.options.map((option, i) => (
                                  <motion.button
                                    key={i}
                                    onClick={() => handleOptionClick(option)}
                                    className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded-md"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    {option}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                            <span className={`text-xs text-slate-300/70 mt-0.5 block text-right ${msg.sender === "bot" ? "text-left" : "text-right"}`}>
                              {formatTime(msg.timestamp)}
                            </span>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="bg-slate-800/90 text-slate-100 rounded-xl rounded-bl-sm px-3 py-2 max-w-[90%]">
                        <div className="flex items-center space-x-1.5">
                          {[0, 0.15, 0.3].map((delay) => (
                            <motion.div
                              key={delay}
                              className="w-2 h-2 bg-teal-500/80 rounded-full"
                              animate={{ y: [0, -2, 0] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <motion.div 
                  className="border-t border-slate-700/50 p-3 bg-slate-900/95 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {!chatEnded && showQuickButtons && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                      {quickButtons.map((button) => (
                        <motion.button
                          key={button.id}
                          onClick={() => handleQuickButtonClick(button.id, button.text)}
                          className="w-full max-w-xs flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-teal-600/80 to-cyan-800/80 text-white text-xs font-medium hover:from-teal-700/80 hover:to-cyan-900/80 transition-all text-center whitespace-normal break-words"
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          disabled={isLoading}
                        >
                          <button.icon className="w-4 h-4" />
                          <span>{button.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  <motion.div 
                    className="flex items-center space-x-1.5 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50"
                    whileHover={{ scale: 1.005 }}
                  >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-white placeholder-slate-500 px-3 py-2 focus:outline-none text-sm rounded-md"
                        disabled={isLoading || chatEnded}
                        autoFocus
                      />
                    <motion.button
                      onClick={() => handleSendMessage()}
                      className="bg-gradient-to-br from-teal-600 to-cyan-800 hover:from-teal-700 hover:to-cyan-900 text-white p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      disabled={!input.trim() || isLoading || chatEnded}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                  
                  <div className="flex justify-between mt-2">
                    <motion.button
                      onClick={sendEmail}
                      className="text-xs text-slate-400 hover:text-teal-400 flex items-center transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email Support
                    </motion.button>
                    
                    {!chatEnded && (
                      <motion.button
                        onClick={endChat}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        End Chat
                      </motion.button>
                    )}
                    
                    <motion.p 
                      className="text-xs text-slate-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Press Enter to send
                    </motion.p>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotPage;