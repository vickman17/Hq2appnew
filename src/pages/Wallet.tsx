import { IonPage, IonContent } from "@ionic/react";
import React from "react";
import BottomNav from "../components/BottomNav";
import style from './style/Wallet.module.css';

const Wallet: React.FC = () => {

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
                        <button className={style.add}>Add money</button>
                    </div>
                </div>
                <div style={{background:"#d9d9d9", marginTop:"-3rem", padding:"1rem", borderTopLeftRadius:"3rem", borderTopRightRadius:"3rem"}}>
                    <div className={style.history}>
                        <div style={{fontSize:"18px", fontWeight: "500"}}>Payment History</div>
                        <div style={{fontSize:"10px", fontWeight: "600"}}>Includes direct payments history and wallet activity</div>  
                    </div>
                </div>
            </IonContent>
            <BottomNav/>
        </IonPage>
    )
}

export default Wallet