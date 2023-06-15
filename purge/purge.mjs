import "dotenv/config";
import { API_URL_BASE } from "../constants.mjs";
import fetch from "node-fetch";

async function purgeExample() {
  let status = {};
  console.log("Sending purge request...");
  const purgeId = await sendPurgeRequest();
  console.log(`Purge request sent. Purge ID: ${purgeId}`);

  while (status.status !== "done") {
    wait(1000);
    status = await getPurgeStatus(purgeId);
    console.log(`Purge status: ${status.status}, progress: ${status.progress}`);
  }
}

async function sendPurgeRequest() {
  const url = `${API_URL_BASE}/app/purge/v1/request`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      purge_type: "all_entries",
      tenant_id: process.env.ENVIRONMENT_TENANT_ID,
    }),
  });

  if (res.ok) {
    const { purge_id } = await res.json();
    return purge_id;
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function getPurgeStatus(id) {
  const url = `${API_URL_BASE}/app/purge/v1/request/${id}`;

  const res = await fetch(url, {
    headers: {
      "X-Api-Key": process.env.API_KEY,
    },
  });

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

purgeExample();
