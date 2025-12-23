/**
 * API Logic for Cloudflare D1 Synchronization
 * Centralizes all Data Fetching and Updating
 */

const API_ENDPOINT = "/api"; // The URL of your Cloudflare Worker

/**
 * FETCH ALL RECORDS
 * Pulls the entire database state from the cloud.
 */
async function fetchAllRecords() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

/**
 * SAVE OR UPDATE RECORD
 * Sends a JSON object to the cloud. If the jobcard exists, D1 updates it.
 * If the jobcard is new, D1 inserts it.
 */
async function saveRecord(recordData) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recordData),
        });
        
        if (!response.ok) throw new Error("Failed to save to cloud");
        return await response.json();
    } catch (error) {
        console.error("Save Error:", error);
        alert("Sync Failed: Check internet connection.");
        return null;
    }
}

/**
 * DATE UTILITY
 * Standardizes date parsing across all pages.
 */
function parseDate(str) {
    if (!str) return null;
    // Expected format: DD/MM/YYYY
    const p = str.split(" ")[0].split("/");
    if (p.length < 3) return null;
    return new Date(p[2], p[1] - 1, p[0]);
}

/**
 * SYNC INDICATOR UTILITY
 * Updates the UI "Sync Dot" found on all pages.
 */
function updateSyncStatus(isOnline) {
    const dot = document.getElementById('syncDot');
    const text = document.getElementById('syncText');
    if (dot && text) {
        dot.className = isOnline ? "dot online" : "dot";
        text.innerText = isOnline ? "Cloud Active" : "Sync Error";
    }
}