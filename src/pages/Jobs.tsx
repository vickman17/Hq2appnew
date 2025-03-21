import { IonContent, IonHeader, IonPage, IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import style from "./style/Jobs.module.css";
import CancelledJobs from "../components/CancelledJobs";
import PendingJobs from "../components/PendingJobs";
import CompletedJobs from "../components/CompletedJobs";
import Back from '../components/Back';
import CloseModal from "../components/CloseModal";


const Jobs: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);
  const [selectedSegment, setSelectedSegment] = useState<string>('Completed');
  const [segmentColor, setSegmentColor] = useState<string>("");

  const handleSegmentChange = (event: CustomEvent) => {
    setSelectedSegment(event.detail.value);
  };

  const renderSegmentContent = () => {
    switch (selectedSegment) {
      case 'Completed':
        return <CompletedJobs/>;
      case 'Pending':
        return <PendingJobs/>;
      default:
        return null;
    }
  };


  return (
    <IonPage>
      <IonContent>
        <IonSegment className={style.segment} onIonChange={handleSegmentChange} value={selectedSegment} mode="ios" >
          <IonSegmentButton className={style.segBut} value="Completed">
            <IonLabel >Completed</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton className={style.segBut}  value="Pending">
            <IonLabel>Ongoing</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <div>
          {renderSegmentContent()}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Jobs;
