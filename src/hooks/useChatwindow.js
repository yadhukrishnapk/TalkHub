import { useState, useRef, useEffect, useMemo } from "react";
import { chatdetails, globalState } from "../jotai/globalState";
import { useAtomValue } from "jotai";
import { fetchMessages } from "./utils/messageFetch";
import { formatMessageTime } from "./utils/timeFormat";
import { sendMessage, markMessageAsRead, fetchChatId } from "./utils/chatOperations";
import { getScrollElement, checkIsAtBottom, scrollToBottom } from "./utils/scrollUtils";
import { observeMessages } from "./utils/intersectionUtils";
import { ref, onValue, set } from "firebase/database";
import { db, realtimeDb } from "../firebase";

const useChatWindow = (initialUsername) => {
  const user = useAtomValue(globalState);
  const chatdet = useAtomValue(chatdetails);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollAreaRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const lastMessageCountRef = useRef(0);
  const observerRef = useRef(null);
  const [isOpponentOnline, setIsOpponentOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false); 
  const hasMarkedRead = useRef(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const typingTimeoutRef = useRef(null); 

  useEffect(() => {
    if (!initialUsername || !user) return;
    fetchChatId(db, user, initialUsername, setActiveChat);
  }, [initialUsername, user]);

  useEffect(() => {
    if (!initialUsername || !user) return;
    const lowercaseUsername = initialUsername.toLowerCase();
    const presenceRef = ref(realtimeDb, `presence/${lowercaseUsername}`);
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      setIsOpponentOnline(data?.online || false);
      setLastOnline(data?.lastOnline || null);
    });
    return () => unsubscribe();
  }, [initialUsername, user]);

  // Fetch messages
  useEffect(() => {
    if (!activeChat) return;
    const unsubscribe = fetchMessages(db, activeChat, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [activeChat]);

  // Mark messages as read
  useEffect(() => {
    if (!activeChat || !messages.length || !user.uid || hasMarkedRead.current) return;
    const unreadMessages = messages.filter(
      (msg) => !msg.readBy?.includes(user.uid) && msg.sender !== user.uid
    );
    if (unreadMessages.length > 0) {
      Promise.all(
        unreadMessages.map((msg) => markMessageAsRead(db, activeChat, msg.id, user.uid))
      ).then(() => {
        hasMarkedRead.current = true;
      });
    } else {
      hasMarkedRead.current = true;
    }
  }, [activeChat, messages, user.uid]);

  useEffect(() => {
    hasMarkedRead.current = false;
  }, [activeChat]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = {};
    messages.forEach((msg) => {
      const date = msg.timestamp.toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  }, [messages]);

  // Send typing status to Firebase
  useEffect(() => {
    if (!activeChat || !user.uid) return;

    const typingRef = ref(realtimeDb, `typing/${activeChat}/${user.uid}`);

    if (newMessage.trim()) {
      // User is typing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      set(typingRef, { isTyping: true, timestamp: Date.now() });

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        set(typingRef, { isTyping: false, timestamp: Date.now() });
      }, 2000);
    } else {
      // User stopped typing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      set(typingRef, { isTyping: false, timestamp: Date.now() });
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      set(typingRef, { isTyping: false, timestamp: Date.now() });
    };
  }, [newMessage, activeChat, user.uid]);

  // Listen for opponent's typing status
  useEffect(() => {
    if (!activeChat || !initialUsername || !user) return;

    const opponentTypingRef = ref(realtimeDb, `typing/${activeChat}`);
    const unsubscribe = onValue(opponentTypingRef, (snapshot) => {
      const typingData = snapshot.val();
      if (typingData) {
        const opponentData = Object.entries(typingData).find(
          ([uid]) => uid !== user.uid
        );
        setIsOpponentTyping(opponentData ? opponentData[1].isTyping : false);
      } else {
        setIsOpponentTyping(false);
      }
    });

    return () => unsubscribe();
  }, [activeChat, user, initialUsername]);

  const handleSendMessage = () => {
    sendMessage(
      db,
      activeChat,
      newMessage,
      user.uid,
      (behavior) => scrollToBottom(scrollAreaRef, setNewMessagesCount, setIsAtBottom, behavior),
      replyingTo
    );
    setNewMessage("");
    setReplyingTo(null);
  };

  const handleMarkMessageAsRead = (messageId) => {
    markMessageAsRead(db, activeChat, messageId, user.uid);
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Scroll and observer logic (unchanged)
  useEffect(() => {
    if (!scrollAreaRef.current || !messages.length || !activeChat) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = observeMessages(messages, user.uid, handleMarkMessageAsRead, scrollAreaRef);
    const scrollElement = getScrollElement(scrollAreaRef);
    if (scrollElement) {
      const messageElements = scrollElement.querySelectorAll("[data-message-id]");
      messageElements.forEach((element) => observerRef.current.observe(element));
    }
    return () => observerRef.current?.disconnect();
  }, [messages, activeChat, user.uid]);

  useEffect(() => {
    const scrollElement = getScrollElement(scrollAreaRef);
    if (scrollElement) {
      const handleScroll = () => {
        const isBottom = checkIsAtBottom(scrollAreaRef);
        setIsAtBottom(isBottom);
        if (isBottom) setNewMessagesCount(0);
      };
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [activeChat]);

  useEffect(() => {
    if (!messages.length || !scrollAreaRef.current) return;
    const scrollElement = getScrollElement(scrollAreaRef);
    const lastMessage = messages[messages.length - 1];
    const isLastMessageFromUser = lastMessage?.sender === user.uid;
    if (isLastMessageFromUser) {
      setTimeout(() => scrollToBottom(scrollAreaRef, setNewMessagesCount, setIsAtBottom, "smooth"), 100);
    } else if (!isAtBottom) {
      const unreadCount = messages.filter(
        (msg) => !msg.readBy?.includes(user.uid) && msg.sender !== user.uid
      ).length;
      setNewMessagesCount(unreadCount > 0 ? unreadCount : messages.length - lastMessageCountRef.current);
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, user.uid, activeChat]);

  useEffect(() => {
    if (messages.length && scrollAreaRef.current && activeChat) {
      scrollToBottom(scrollAreaRef, setNewMessagesCount, setIsAtBottom, "auto");
      setNewMessagesCount(0);
      lastMessageCountRef.current = messages.length;
    }
  }, [activeChat]);

  return {
    username: initialUsername,
    activeChat,
    setActiveChat,
    messages,
    replyingTo,
    setReplyingTo,
    sendMessage: handleSendMessage,
    setNewMessage,
    newMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiClick,
    scrollAreaRef,
    isLoading: !activeChat || !messages,
    chatdet,
    newMessagesCount,
    scrollToBottom: (behavior) => scrollToBottom(scrollAreaRef, setNewMessagesCount, setIsAtBottom, behavior),
    groupedMessages,
    formatMessageTime,
    user,
    isAtBottom,
    markMessageAsRead: handleMarkMessageAsRead,
    isOpponentOnline,
    lastOnline,
    isOpponentTyping, // Return new state
  };
};

export default useChatWindow;