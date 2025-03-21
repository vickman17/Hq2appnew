import { IonPage, IonContent, IonModal, IonHeader, IonIcon } from "@ionic/react";
import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import style from "./style/Wallet.module.css";
import AccountDetailsModal from "../components/AccountDetailsModal";
import Back from "../components/Back";
import { arrowBack } from "ionicons/icons";
import CloseModal from "../components/CloseModal";
import CardPayment from "../components/CardPayment";

const Wallet: React.FC = () => {
    const [addMoney, setAddMoney] = useState<boolean>(false);

    const [openDetails, setOpenDetails] = useState<boolean>(false);

    const closeDetails = () => {
        setOpenDetails(false)
    }

    const closeAddMoney = () => {
        setAddMoney(false);
    }

    const [card, setCard] = useState<boolean>(false);

    const openCard =()=> {
        setCard(true);
    }


    return(
        <IonPage>
            <IonContent style={{'--background':"#d9d9d9"}}>
                <div style={{background:"#212121", color:"white", paddingBottom:"7rem"}}>
                   <div style={{padding:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}> 
                        <div>
                            <p>Balance</p>
                            <h1 style={{fontSize:"35px"}}>&#8358; 0.0</h1>
                        </div>
                        <div>
                            <h1>Wallet</h1>
                        </div>
                    </div>
                    <div style={{border:"0px solid white", textAlign:"right", marginTop:"4rem"}}>
                        <button className={style.add} onClick={()=>setAddMoney(true)}>Add money</button>
                    </div>
                </div>
                <div style={{background:"#d9d9d9", marginTop:"-3rem", padding:"1rem", borderTopLeftRadius:"3rem", borderTopRightRadius:"3rem"}}>
                    <div className={style.history}>
                        <div style={{fontSize:"18px", fontWeight: "500"}}>Payment History</div>
                        <div style={{fontSize:"10px", fontWeight: "600"}}>Includes direct payments history and wallet activity</div>  
                    </div>
                </div>
            </IonContent>
            <IonModal isOpen={addMoney}> 
            <div onClick={closeAddMoney} style={{border: "0px solid black", width: "fit-content"}}>
                <CloseModal title=" " color="black" />
            </div>
                <IonContent style={{"--height": "100vh", "--overflow": "hidden"}}>
                    <div style={{border: "0px solid", height: "100vh", width:"95%", margin: "auto"}}>
                        <div style={{fontSize: "29px", fontWeight: "600", color: "var(--ion-company-wood)", marginTop: "50%"}}>Payment Method</div>
                        <div style={{fontSize: "15px", color: "grey"}}>Choose Preferred Payment Method.</div>
                        <div style={{border: "0px solid", marginTop: "20px"}}>
                            <div className={style.but} onClick={()=>setOpenDetails(true)} style={{background: "var(--ion-company-wood)", color: "white"}}>
                                Bank Transfer
                            </div>
                            <div onClick={openCard} className={style.but} style={{background: "#f5f5f5", color: "var(--ion-company-wood)"}}>
                                Credit Card
                            </div>
                        </div>
                    </div>
                </IonContent>
            </IonModal>
            <AccountDetailsModal isOpen={openDetails} closeModal={closeDetails} />
            <CardPayment isOpen={card} onClose={()=>setCard(false)} />
        </IonPage>
    )
}

export default Wallet