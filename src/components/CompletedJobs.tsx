import { IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import empty from "/assets/empty.png";

interface Job {
    skill: string;
    status: string;
    created_at: string;
    local_government: string;
    bid_data: number;
}

const CompletedJobs: React.FC = () => {
    const userInfoString = sessionStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const [jobs, setJobs] = useState<Job[]>([]);

    // Access properties with fallback in case userInfo is null
    const firstName = userInfo?.firstName || "Guest";
    const lastName = userInfo?.lastName || "";
    const userId = userInfo?.id || "";

    const endpoint = "http://localhost/hq2ClientApi/getJob.php";

    useEffect(() => {
        if (userId) {
            handleFetchJobs();
        }
    }, [userId]);

    const handleFetchJobs = async () => {
        const payload = { userId };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (data.status === "success" && data.jobDetails) {
                let jobList = [];

                // Ensure jobDetails is an array
                if (Array.isArray(data.jobDetails)) {
                    jobList = data.jobDetails;
                } else {
                    jobList = [data.jobDetails]; // Convert single object to an array
                }

                const pendingJobs = Array.isArray(jobList)
                    ? jobList.filter((job: Job) => job.status === "completed" || job.status === "cancelled")
                    : [];

                setJobs(pendingJobs);
            } else {
                console.error("Failed to retrieve job details:", data.message);
                setJobs([]); // Clear the job list if no jobs are found
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            {jobs.length > 0 ? (
                <div>
                    {jobs.map((job: Job, index: number) => (
                        <div
                            key={index}
                            style={{
                                padding: "7px",
                                background: "white",
                                marginTop: "10px",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        overflow: "hidden",
                                        color: "var(--ion-company-wood)",
                                        width: "50%",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {job.skill}
                                </div>
                                <div
                                    style={{
                                        color: job.status === "completed" ? "green" : "red",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                    }}
                                >
                                    {job.status}
                                </div>
                            </div>
                            <div style={{ fontSize: "10px", marginTop: "4px" }}>{job.created_at}</div>
                            <div
                                style={{
                                    marginTop: "5px",
                                    borderTop: "1px solid grey",
                                    paddingTop: "4px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        overflow: "hidden",
                                        width: "50%",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: "13px",
                                    }}
                                >
                                    {job.local_government}
                                </div>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        color: "var(--ion-company-gold)",
                                    }}
                                    onClick={() =>
                                        job.status === "pending approval"
                                            ? console.log(`approved and paid ${job.bid_data}`)
                                            : console.log("view details")
                                    }
                                >
                                    {job.status === "pending approval" ? "Approve & Pay" : "View details >>"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div>
                        <img src={empty} alt="No completed jobs" />
                    </div>
                    <div style={{ fontSize: "14px", color: "grey", textAlign: "center" }}>
                        You currently have no completed job
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedJobs;
