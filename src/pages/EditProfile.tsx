import React, { useEffect, useState, useRef } from "react";
import style from "./style/EditProfile.module.css";
import { IonPage, IonHeader, IonContent, IonIcon, IonButton, IonToast, IonLoading } from "@ionic/react";
import Back from "../components/Back";
import { camera } from "ionicons/icons";
import MainPic from "../components/MainPic";

const EditProfile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = sessionStorage.getItem("userInfo");
  const parsedData = user ? JSON.parse(user) : {};
  const [firstName, setFirstName] = useState(parsedData.firstName || "First Name");
  const [lastName, setLastName] = useState(parsedData.lastName || "Last Name");
  const [email, setEmail] = useState(parsedData.email || "Email");
  const [phoneNumber, setPhoneNumber] = useState(parsedData.phoneNumber || "Phone Number");
  const userId = parsedData.user_id;
  const [toastActive, setToastActive] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [loadText, setLoadText] = useState<string>("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically open the file input dialog
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setLoadText("Uploading profile image")
      setLoader(true);
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("userId", userId);

        try {
            const response = await fetch("http://localhost/api/uploadProfile.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.status === "success") {
                setToastActive(true);
                setLoader(false);
                setToastText("Profile picture uploaded successfully!");
            } else {
                setLoader(false);
                setToastActive(true);
                setToastText("Failed to upload profile picture: " + data.message);
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            setToastActive(true);
            setLoader(false);
            setToastText("Error uploading profile picture.");
        }finally{
          setLoader(false);
        }
    }
};


  const handleUpload = async () => {
    const profileData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
    };

    try {
      const response = await fetch("http://localhost/api/uploadImage.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.status === "success") {
        setToastActive(true);
        setToastText("Profile details updated successfully!");
      } else {
        setToastActive(true);
        setToastText("Failed to update profile: " + data.message);
      }
    } catch (error) {
        setToastActive(true)
      console.error("Error updating profile:", error);
      setToastText("Error updating profile details");
    }
  };

  return (
    <IonPage>
      <IonHeader style={{ boxShadow: "none" }}>
        <Back />
      </IonHeader>
      <IonContent>
        <div className={style.imgBox}>
          <div className={style.pic}>
            <MainPic />
          </div>
          <div className={style.add}>
            {/* Hidden File Input */}
            <input
              type="file"
              accept="images/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* Icon to Open File Input */}
            <IonIcon onClick={handleOpenFilePicker} icon={camera} />
          </div>
        </div>
        <div className={style.sectionTwo}>
          <div className={style.table}>
            <div className={style.head}>First Name</div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={style.editInput}
            />
          </div>
          <div className={style.table}>
            <div className={style.head}>Last Name</div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={style.editInput}
            />
          </div>
          <div className={style.table}>
            <div className={style.head}>Email</div>
            <input
           type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={style.editInput}
            />
          </div>
          <div className={style.table}>
            <div className={style.head}>Phone Number</div>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={style.editInput}
            />
          </div>
        </div>
        <div className={style.submit}>
          <IonButton onClick={handleUpload} className={style.button}>
            Save
          </IonButton>
        </div>
        <IonToast isOpen={toastActive} message={toastText} duration={5000}/>
        <IonLoading className="custom-loading" isOpen={loader} message={loadText}  />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
