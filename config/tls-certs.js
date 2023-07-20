import "dotenv/config"
import { API_URL_BASE } from "../constants.mjs"
import { authorizationHeaders, wait } from "../common.mjs"
import fetch from "node-fetch"

/**
 * Updates the configuration for the environment specified by the ENVIRONMENT_ID environment variable.
 */
async function updateTlsCertExample() {
  const id = await updateTlsCert({
    environment_id: process.env.ENVIRONMENT_ID,
    // Injecting line breaks in env variables sometimes result in them being escaped
    // which we correct if the case arises.
    primary_cert: process.env.PRIMARY_CERT.replaceAll("\\n", "\n"),
    intermediate_cert: process.env.INTERMEDIATE_CERT.replaceAll("\\n", "\n"),
    private_key: process.env.PRIVATE_KEY.replaceAll("\\n", "\n"),
  })

  console.log("Creating new cert...")
  console.log(`success. (id=${id})`)
  console.log(`Checking cert status...`)

  let cert = {}

  while (cert.status !== "activated") {
    wait(2000)
    cert = await getCert(id)
    console.log(`Cert status: ${cert.status}`)
  }

  console.log(cert)
}

/**
 * Updates the environment's config.
 * @param {*} config
 * @returns
 */
async function updateTlsCert(cert) {
  console.log(cert)
  const url = `${API_URL_BASE}/config/v0.1/tls-certs`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cert),
  })

  if (res.ok) {
    const cert = await res.json()
    return cert.id
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`)
  }
}

/**
 * Retrieves the current config for the environment.
 * @param {*} id
 * @returns
 */
async function getCert(id) {
  const url = `${API_URL_BASE}/config/v0.1/tls-certs/${id}`

  const res = await fetch(url, {
    headers: authorizationHeaders,
  })

  if (res.ok) {
    return await res.json()
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`)
  }
}

updateTlsCertExample()
