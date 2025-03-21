import React, { useState, useEffect } from "react";
import { IonModal, IonButton } from "@ionic/react";
import PaystackPayment from "./PaystackPayment";

interface PayJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    amount: number;
    userId: string;
}

const PayJobModal: React.FC<PayJobModalProps> = ({ isOpen, onClose, jobId, amount, userId }) => {
    const [isPaying, setIsPaying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"wallet" | "paystack" | null>(null);
    const userInfoString = sessionStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const [walletBalance, setWalletBalance] = useState<number>(0.00);


    useEffect(() => {
        if (isOpen) {
            fetchUserAccount(userId);
        }
    }, [isOpen, userId]); // Runs when modal opens

    useEffect(() => {
        console.log("Updated Wallet Balance:", walletBalance);
    }, [walletBalance]); // Runs when walletBalance changes
    

    const fetchUserAccount = async (userId: string) => {
        try {
            const response = await fetch("http://localhost/hq2ClientApi/getAccountDetails.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }), // Send userId as JSON
            });
    
            const data = await response.json();
    
            if (data.error) {
                console.error("Error fetching account:", data.error);
            } else {
                const balance = parseFloat(data[0].balance);
                setWalletBalance(balance);                
                console.log("User account data:", data[0].balance);
                return data; // Return data for further processing
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };
    
    // Example usage:
    
    const handleWalletPayment = async () => {
        console.log(`wallet balance ${walletBalance}`);
        console.log(`amount ${amount}`);

        if (walletBalance < amount) {
            alert("Insufficient wallet balance.");
            return;
        }

        setIsPaying(true);
        try {
            const response = await fetch("http://localhost/hq2ClientApi/jobPayment.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, jobId, amount })
            });
            const data = await response.json();
            if (data.success) {
                alert("Payment successful!");
                onClose();
            } else {
                alert("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing wallet payment:", error);
        }
        setIsPaying(false);
    };

    const handlePaystackSuccess = async () => {
        try {
            const response = await fetch("http://localhost/hq2ClientApi/updateJobStatus.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId, status: "completed" })
            });
            const data = await response.json();
            if (data.success) {
                alert("Job marked as completed!");
                onClose();
            }
        } catch (error) {
            console.error("Error updating job status:", error);
        }
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Settle Job Payment</h2>
                <p>Amount: ₦{amount.toLocaleString()}</p>
                <p>Wallet Balance: ₦{walletBalance.toLocaleString()}</p>
                
                <IonButton 
                    onClick={() => setPaymentMethod("wallet")} 
                    // disabled={isPaying || walletBalance < amount}
                >
                    Pay with Wallet
                </IonButton>
                
                <IonButton 
                    onClick={() => setPaymentMethod("paystack")} 
                    disabled={isPaying}
                >
                    Pay with Paystack
                </IonButton>
                
                {paymentMethod === "wallet" && <IonButton onClick={handleWalletPayment} disabled={isPaying}>Confirm Wallet Payment</IonButton>}
                
                {paymentMethod === "paystack" && <PaystackPayment transactionType="Job Payment" amount={amount * 100} onSuccess={handlePaystackSuccess} />}
            </div>
        </IonModal>
    );
};

export default PayJobModal;
