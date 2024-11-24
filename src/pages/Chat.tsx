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
import { sendOutline, addCircleOutline } from "ionicons/icons";
import Back from "../components/Back";
import { useParams, useLocation } from "react-router-dom";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
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

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://myendpoint.atwebpages.com/fetchMessage.php?user_id=${userId}&chat_with_id=${chatWithID}`
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
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append('sender_id', userId);
    formData.append('senderName', userName);
    formData.append('chatWithID', chatWithID);
    formData.append('message', newMessage);
    formData.append('chatName', chatName);
    formData.append('subChatName', subChatName);

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('https://myendpoint.atwebpages.com/sendMessage.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessages((prev) => [
          ...prev,
          { sender_id: userId, recipient_id: chatWithID, message: newMessage, file: data.filePath },
        ]);
        setNewMessage('');
        setFile(null);
      } else {
        console.error('Failed to send message:', data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <IonPage>
      <IonHeader className={style.head}>
        <Back />
        <div className={style.chatName}>
          {subChatName} - {senderId === userId ? chatName : senderName}
        </div>
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
              {msg.file && <a href={msg.file} download>Download File</a>}
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
            minHeight: '5px',
            maxHeight: '400px',
            background: 'transparent',
          }}
        ></textarea>
        {(newMessage.trim().length > 0 || file) ? (
          <IonButton className={style.send} expand="block" onClick={sendMessage}>
            <IonIcon className={style.sendButton} icon={sendOutline} />
          </IonButton>
        ) : (
          <IonButton className={style.send} expand="block">
            <IonIcon className={style.sendButton} icon={addCircleOutline} />
          </IonButton>
        )}
      </div>
    </IonPage>
  );
};

export default Chat;
