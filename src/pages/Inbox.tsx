import React, { useEffect, useState } from 'react';
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
      fetch(`http://myendpoint.atwebpages.com/inbox.php?userId=${userId}`, {
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
                className={style.box}
                button
                key={chat.id}
                onClick={() => openChat(chat)}
              >
                <IonLabel>
                <div style={{fontSize:"14px", width:"90%"}}>{chat.subcategory_name}</div>
                <div style={{display: "flex", justifyContent:"space-between", marginTop:"5px", alignItems: 'center',}}>
                    <p className="last-message" style={{fontSize:"19px"}}>{chat.last_message}</p>
                    <div style={{width:"40%", fontSize:"12.8px", textAlign:"right"}}>{chat.last_message_time}</div>
                  </div>
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
