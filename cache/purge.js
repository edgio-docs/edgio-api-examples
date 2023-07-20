import "dotenv/config"
import { API_URL_BASE } from "../constants.mjs"
import { authorizationHeaders, wait } from "../common.mjs"
import fetch from "node-fetch"

async function purgeExample() {
  let status = {}
  console.log("Sending purge request...")
  const purgeId = await sendPurgeRequest()
  console.log(`Purge request sent. Purge ID: ${purgeId}`)

  while (status.status !== "done") {
    wait(1000)
    status = await getPurgeStatus(purgeId)
    console.log(
      `Purge status: ${status.status}, progress: ${status.progress_percentage}`
    )
  }
}

async function sendPurgeRequest() {
  const url = `${API_URL_BASE}/cache/v0.1/purge-requests`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      purge_type: "all_entries",
      environment_id: process.env.ENVIRONMENT_ID,
    }),
  })

  if (res.ok) {
    const { id } = await res.json()
    return id
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`)
  }
}

async function getPurgeStatus(id) {
  const url = `${API_URL_BASE}/cache/v0.1/purge-requests/${id}`

  const res = await fetch(url, {
    headers: authorizationHeaders,
  })

  if (res.ok) {
    return await res.json()
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`)
  }
}

purgeExample()
