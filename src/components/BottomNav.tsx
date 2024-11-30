import React, { useState, useRef, useEffect } from 'react';
import { IonFooter, IonTabBar, IonTabButton, IonSkeletonText, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { homeOutline, hammerOutline, chatbubbleEllipsesOutline, chatboxEllipsesOutline, cashOutline } from 'ionicons/icons';
import edit from './bottomNav.module.css';
import style from "./bottomNav.module.css";


const BottomNav: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean[]>([false, false, false, false]);

 


  // Handles loading completion for each Lottie animation


  return (
    <IonFooter style={{ '--background': 'transparent' }}>
      <IonTabBar slot="bottom" style={{ boxShadow: '1px 3px 19px grey', '--background': 'transparent' }}>
        {/* Home Tab */}
        <IonTabButton tab="home" onClick={() => history.push('/dashboard')}>
          {loading[0] ? (
            <IonSkeletonText animated className={edit.icon} style={{ width: '40px', height: '40px' }} />
          ) : (
            <IonIcon icon={homeOutline} className={style.icon}/>
          )}
        </IonTabButton>

        {/* Work Tab */}
        <IonTabButton tab="work" onClick={() => history.push('/jobs')}>
          {loading[1] ? (
            <IonSkeletonText animated className={edit.icon} style={{ width: '40px', height: '40px' }} />
          ) : (
            <IonIcon icon={hammerOutline} className={style.icon}/>
          )}
        </IonTabButton>

        {/* Chat Tab */}
        <IonTabButton tab="chat" onClick={() => history.push('/inbox')}>
          {loading[2] ? (
            <IonSkeletonText animated className={edit.icon} style={{ width: '40px', height: '40px' }} />
          ) : (
            <IonIcon icon={chatboxEllipsesOutline} className={style.icon}/>
          )}
        </IonTabButton>

        {/* Wallet Tab */}
        <IonTabButton tab="wallet" onClick={() => history.push('/wallet')}>
          {loading[3] ? (
            <IonSkeletonText animated className={edit.icon} style={{ width: '40px', height: '40px' }} />
          ) : (
            <IonIcon icon={cashOutline} className={style.icon}/>
          )}
        </IonTabButton>
      </IonTabBar>
    </IonFooter>
  );
}

export default BottomNav;
