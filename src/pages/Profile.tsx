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
        <IonPage className={style.page}>
            <IonContent className={style.topContent}>
                <div className={style.topContainer}>
                    <MainPic/>
                </div>
                <div className={style.info}>
                    <div className={style.tag}>
                        <div className={style.name}>
                 {`${firstName} ${lastName}`}
              </div>
                        <div className={style.role}>Client</div>
                    </div>
                    <div className={style.details} onClick={()=>history.push('/editprofile')}>
                        <div className={style.icon}>
                            <IonIcon icon={personOutline} />
                        </div>
                        <div>
                            Personal info
                        </div>
                    </div>
                    <div className={style.details} onClick={()=>history.push('/security')}>
                        <div className={style.icon}>
                            <IonIcon icon={shieldCheckmarkOutline} />
                        </div>
                        <div>
                            Login & security
                        </div>
                    </div>
                    <div className={style.details}>
                        <div className={style.icon}>
                            <IonIcon icon={handLeftOutline} />
                        </div>
                        <div>
                            Privacy
                        </div>
                    </div>
                    <div className={style.details} style={{border: "none", paddingBlock:"0px"}}>
                    <div className={style.icon}>
                            <IonIcon icon={homeOutline} />
                        </div>
                        <div>
                            Add Location
                        </div>
                    </div>
                </div>
                <div className={style.signOut}>
                    <div>
                        Sign out
                    </div>  
                    <div className={style.Bicon}>
                        <IonIcon icon={logOutOutline} />
                    </div>
                </div>
            </IonContent>
            <BottomNav />
        </IonPage>
    )
}

export default Profile;