import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonPage, IonList, IonItem, IonLabel, IonHeader, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Back from '../components/Back';
import style from './style/Inbox.module.css';


const Inbox: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const userInfo = sessionStorage.getItem('userInfo'); // Retrieve user info from session storage
  const parsedData = userInfo ? JSON.parse(userInfo) : {};
  const userId = parsedData?.id;

  const history = useHistory();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

                                                          
  useEffect(() => {
    document.body.style.fontFamily = "Varela Round, sans-serif";
  }, []);


  useEffect(() => {
    if (userId) {
      // Fetch chats with last message for the user
      fetch(`https://www.globalbills.com.ng/api/inbox.php?userId=${userId}`, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch chats');
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setChats(data);
          } else {
            console.error('Invalid data format:', data);
          }
        })
        .catch((error) => console.error('Error fetching chats:', error));
    }
  }, [userId]);

  const openChat = (chat: any) => {
    const chatId = chat.receiver_id === userId ? chat.sender_id : chat.receiver_id;
    history.push(`/chat/${chatId}`, {
      chatName: chat.chat_name,
      subChatName: chat.subcategory_name,
      senderName: chat.sender_name,
      senderId: chat.sender_id,
    });
  };

  const [showContent, setShowContent] = useState(false);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  // Duration required to trigger "hold" (e.g., 1 second)
  const holdDuration = 1000;

  const handlePressStart = () => {
    // Start a timer when pressing starts
    holdTimeout.current = setTimeout(() => {
      setShowContent(true); // Show content after holding for the duration
    }, holdDuration);
  };

  const handlePressEnd = () => {
    // Clear the timer when the press ends
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <Back />
        <div className={style.pageName}>Inbox</div>
      </IonHeader>
      <IonContent>
        <IonList lines="none">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <IonItem
              onPointerDown={handlePressStart}
              onPointerUp={handlePressEnd}
              onPointerLeave={handlePressEnd}
                className={style.box}
                button
                key={chat.id}
                onClick={() => openChat(chat)}
              >
                <IonLabel>
                <div style={{fontSize:"17px", width:"90%"}}>{chat.subcategory_name}</div>
                <div style={{display: "flex", justifyContent:"space-between", marginTop:"19px", alignItems: 'center', border:'0px solid black'}}>
                  <div>Press and hold to peep message</div>
                    <div style={{width:"40%", fontSize:"12.8px", textAlign:"right"}}>{chat.last_message_time}</div>
                  </div>
                  {showContent && (
                      <div
                        style={{
                          marginTop: "20px",
                          padding: "10px",
                          backgroundColor: "lightgreen",
                          borderRadius: "5px",
                        }}
                      >
                        <p className="last-message" style={{fontSize:"13px", textAlign:"center"}}>{chat.last_message}</p>
                      </div>
                    )}
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonItem>
              <IonLabel>No chats available</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Inbox;
