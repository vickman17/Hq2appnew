import React, { useState, useEffect } from "react";
import { IonList, IonItem, IonSpinner } from "@ionic/react";
import { useHistory } from "react-router-dom";

const UserList: React.FC = () => {
  const history = useHistory();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost/api/fetchUser.php");
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data); // Ensure the response is an array
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop the loader
      }
    };

    fetchUsers();
  }, []);

  const openChat = (chatWithID: string) => {
    history.push(`/chat/${chatWithID}`);
  };

  return (
    <>
      {loading ? (
        <IonSpinner /> // Display a loading spinner while fetching users
      ) : (
        <IonList>
          {users.length > 0 ? (
            users.map((user) => (
              <IonItem
                button
                key={user.id}
                onClick={() => openChat(user.id)}
              >
                {user.firstName}
              </IonItem>
            ))
          ) : (
            <IonItem>No users found.</IonItem>
          )}
        </IonList>
      )}
    </>
  );
};

export default UserList;
