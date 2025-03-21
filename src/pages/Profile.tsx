import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {shieldCheckmarkOutline, personOutline, handLeft, handLeftOutline, homeOutline, exitOutline, logOutOutline} from "ionicons/icons"
import style from "./style/Profile.module.css";
import BottomNav from "../components/BottomNav";
import React, {useEffect} from "react";
import { shieldCheckmark } from "ionicons/icons";
import MainPic from "../components/MainPic";
import {useHistory} from "react-router-dom";

const Profile: React.FC=()=>{
 const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // Access properties with fallback in case userInfo is null
  const firstName = userInfo?.firstName || "Guest";
  const lastName = userInfo?.lastName || "";


    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, []);

      const history = useHistory();
    return(
        <IonPage>
            <IonContent>
                
            </IonContent>
        </IonPage>
    )
}

export default Profile;