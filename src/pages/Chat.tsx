import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonIcon,
  IonHeader,
} from '@ionic/react';
import style from "./style/Chat.module.css";
import { addCircleOutline, sendOutline } from "ionicons/icons";
import Back from "../components/Back";
import { useParams, useLocation } from "react-router-dom";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { chatWithID } = useParams<{ chatWithID: string }>();
  const location = useLocation();
  const locationState = location.state as {
    chatName?: string;
    subChatName?: string;
    senderName?: string;
    senderId?: string;
  } | null;

  const chatName = locationState?.chatName || 'Chat';
  const subChatName = locationState?.subChatName || '';
  const senderName = locationState?.senderName || '';
  const senderId = locationState?.senderId || '';
  const [sent, setSent] = useState("");
  const userDetails = sessionStorage.getItem("userInfo");
  const parsedData = userDetails ? JSON.parse(userDetails) : {};
  const userId = parsedData?.id || '';
  const userName = parsedData?.firstName || '';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  //Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://www.globalbills.com.ng/api/fetchMessage.php?user_id=${userId}&chat_with_id=${chatWithID}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (userId && chatWithID) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [userId, chatWithID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInput = (event: React.FormEvent) => {
    const inputText = (event.target as HTMLTextAreaElement).value;
    setNewMessage(inputText);
    if (!isTyping && inputText.length > 0) {
      setIsTyping(true);
      setTypingUser(userId);
    } else if (isTyping && inputText.length === 0) {
      setIsTyping(false);
      setTypingUser(null);
    }

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSent("Sending...");
    setNewMessage('');

    const messageData = {
      sender_id: userId,
      senderName: userName,
      chatWithID: chatWithID,
      message: newMessage,
      chatName: chatName,
      subChatName: subChatName,
    };

    try {
      const response = await fetch('https://www.globalbills.com.ng/api/sendMessage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessages((prev) => [...prev, messageData]);
        setSent("Sent");
        setNewMessage('');
      } else {
        console.error('Failed to send message:', data.message);
      }
    } catch (error) {
      setNewMessage('');
      setSent('An error occurred while sending.')
      console.error("Error sending message:", error);
    }finally{
      setSent("");
    }
  };

  return (
    <IonPage>
      <IonHeader className={style.head}>
        <Back />
        <div className={style.chatName}>
          {subChatName} - {senderId === userId ? chatName : senderName}
        </div>
        <p>{sent}</p>
      </IonHeader>
      <IonContent style={{ border: "0px solid yellow", height: "50vh", overflowY: "auto" }}>
        <IonList style={{ border: "0px solid blue" }} lines="none">
          {messages.map((msg, index) => (
            <IonItem style={{ border: "0px solid white" }} key={index}>
              <div
                style={{
                  border: "0px solid black",
                  paddingTop: "6px",
                  borderRadius: ".4rem",
                  paddingInline: "5px",
                  fontSize: "19px",
                  textAlign: "left",
                  background: msg.sender_id === userId ? "#134d37" : "grey",
                  margin: msg.sender_id === userId ? "7px 0 0 auto" : "7px auto 0 0",
                }}
              >
                {msg.message}
                <p style={{
                  fontSize: "10px",
                  width: "fit-content",
                  marginLeft: "auto",
                  marginTop: "22px"
                }}>
                  {msg.timestamp}
                </p>
              </div>
            </IonItem>
          ))}
          <div ref={messagesEndRef}></div>
        </IonList>
        {isTyping && typingUser !== userId && (
          <div style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>Typing...</div>
        )}
      </IonContent>
      <div className={style.chatBox}>
        <textarea
          ref={textareaRef}
          value={newMessage}
          onInput={handleInput}
          placeholder="Type your message here..."
          style={{
            width: '100%',
            overflow: 'hidden',
            resize: 'none',
            padding: 0,
            marginLeft: '16px',
            boxSizing: 'border-box',
            outline: 'none',
            border: "none",
            minHeight: '5px',
            maxHeight: '400px',
            background: 'transparent',
          }}
        ></textarea>
        {newMessage.trim().length > 0 ? (
          
            <IonIcon onClick={sendMessage} className={style.sendButton} icon={sendOutline} />
          
        ) : (
          
            <IonIcon className={style.sendButton} icon={addCircleOutline} />
        )}
      </div>
    </IonPage>
  );
};

export default Chat;
