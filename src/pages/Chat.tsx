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
import ProfilePics from '../components/ProfilePics';
import { useParams, useLocation } from "react-router-dom";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<any>('');
  const [file, setFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false); // State to track typing status
  const [typingUser, setTypingUser] = useState<string | null>(null); // Track who is typing
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { chatWithID } = useParams<{ chatWithID: string }>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { chatName, subChatName, senderName, senderId } = location.state || { chatName: 'chat', subChatName: '', senderName: '', senderId: '' };

  const userDetails = sessionStorage.getItem("userInfo");
  const parsedData = JSON.parse(userDetails);
  const userId = parsedData.id;
  const userName = parsedData.firstName;
  // Extract service name and subcategory name from the location state or params


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
          `https://globalbills.com.ng/api/fetchMessage.php?user_id=${userId}&chat_with_id=${chatWithID}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (userId && chatWithID) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Fetch every 3 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [userId, chatWithID]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle textarea input and dynamic resizing
  const handleInput = (event: React.FormEvent) => {
    const inputText = (event.target as HTMLTextAreaElement).value;
    setNewMessage(inputText);

    // Set the isTyping status
    if (!isTyping && inputText.length > 0) {
      setIsTyping(true);
      setTypingUser(userId); // Set current user as typing
      sessionStorage.setItem('isTyping', 'true'); // Store typing status
    } else if (isTyping && inputText.length === 0) {
      setIsTyping(false);
      setTypingUser(null); // Reset typing user
      sessionStorage.setItem('isTyping', 'false'); // Store typing status
    }

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height

      // Ensure the textarea starts with a minimum of one line
      if (textarea.scrollHeight < 10) {
        textarea.style.height = '10px'; // Set to minimum height if smaller
      }
      
      if (textarea.scrollHeight >= 400) { // Max height check
        textarea.style.height = "400px";
      }
    }
  };

  console.log(chatWithID);

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() && !file) return; // Prevent sending empty messages

    const formData = new FormData();
    formData.append('sender_id', userId);
    formData.append('senderName', userName);
    formData.append('chatWithID', chatWithID);
    formData.append('message', newMessage);
    formData.append('chatName', `${chatName}`);
    formData.append('subChatName', `${subChatName}`)

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('https://globalbills.com.ng/api/sendMessage.php', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Error: ${response.status} - ${errorDetails}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setMessages((prev) => [
          ...prev,
          { sender_id: userId, recipient_id: chatWithID, message: newMessage, file: data.filePath },
        ]);
        setNewMessage('');
        setFile(null); // Reset file input after sending
      } else {
        console.error('Failed to send message:', data.message);
        setNewMessage('');
        setFile(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage('');
      setFile(null);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };



  const profile = '/profile.jpg';
  return (
    <IonPage>
      <IonHeader className={style.head}>
        <Back />

        <div className={style.chatName}>
        { subChatName} - {senderId == userId ? ChatName : senderName}
        </div>
      </IonHeader>
      <IonContent style={{border: "0px solid yellow", height:"50vh", overflowY:"auto"}}>
        <IonList style={{border: "0px solid blue"}} lines="none">
          {messages.map((msg, index) => (
            <IonItem style={{border:"0px solid white"}} key={index}>
              <div
                style={{
                  border: "0px solid black",
                  paddingTop: "6px",
                  borderRadius: ".4rem",
                  paddingInline: "5px",
                  fontSize: "19px",
                  textAlign: "left",
                  borderRadiusTop: "7rem",
                  background: msg.sender_id === userId ? "#134d37" : "grey",
                  margin: msg.sender_id === userId ? "7px 0 0 auto" : "7px auto 0 0",
                }}
              >
                {msg.message}
                <p style={{fontSize:"10px", border:'0px solid black', width:"fit-content", marginLeft:"auto", marginTop:"22px"}}>{msg.timestamp}</p>
              </div>
              {msg.file && <a href={msg.file} download>Download File</a>}
            </IonItem>
          ))}
          <div ref={messagesEndRef}></div> {/* Reference to the end of the messages */}
        </IonList>
        {isTyping  && typingUser !== userId && (<div style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>Typing...</div>)}
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
            border: '0px solid black', // Remove the border
            outline: 'none', // Remove the outline when focused
            minHeight: '5px', // Start with one line height
            background: 'transparent', // Initial reduced height
            maxHeight: '400px', // Max height for growth
          }}
        ></textarea>

        {/* Conditionally render the send button */}
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
