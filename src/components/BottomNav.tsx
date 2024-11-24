import React from 'react';
import {IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton} from '@ionic/react'
import{homeOutline, construct, wallet, chatboxEllipses, constructOutline, chatboxEllipsesOutline, walletOutline} from 'ionicons/icons'
import {Route, Switch} from 'react-router-dom';
import edit from './bottomNav.module.css';
import {useHistory} from "react-router-dom";



const BottomNav: React.FC = () => {

    const history = useHistory();
    return(
        <IonFooter style={{'--background':"transparent"}}>
            <IonTabBar slot="bottom" style={{boxShadow:"1px 3px 19px grey", '--background':"transparent"}}>
                <IonTabButton tab="home" onclick={()=>history.push('/dashboard')}>
                    <IonIcon className={edit.icon} icon={homeOutline}/>
                </IonTabButton>
                <IonTabButton tab="work" onclick={()=>history.push('/jobs')}>
                    <IonIcon icon={constructOutline} className={edit.icon} />
                </IonTabButton>
                <IonTabButton tab="chat" onclick={()=>history.push('/inbox')}>
                    <IonIcon icon={chatboxEllipsesOutline} className={edit.icon} />
                </IonTabButton>
                <IonTabButton tab="wallet" onclick={()=>history.push('/wallet')}>
                    <IonIcon icon={walletOutline} className={edit.icon}/>
                </IonTabButton>
            </IonTabBar>
        </IonFooter>
    )
}


export default BottomNav;