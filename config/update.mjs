import "dotenv/config";
import { API_URL_BASE } from "../constants.mjs";
import fetch from "node-fetch";

/**
 * Updates the configuration for the environment specified by the ENVIRONMENT_TENANT_ID environment variable.
 */
async function updateConfigExample() {
  const id = await updateConfig({
    environment_id: process.env.ENVIRONMENT_TENANT_ID,
    origins: [
      {
        name: "web",
        hosts: [{ scheme: "match", location: [{ hostname: "mui.com" }] }],
        shields: { us_east: "DCD" },
        override_host_header: "mui.com",
      },
    ],
    hostnames: [],
    rules: [
      {
        headers: {
          debug_header: true,
        },
      },
    ],
  });

  console.log("Deploying new config...");
  console.log(`success. (id=${id})`);

  console.log(`Fetching ${id}...`);
  const config = await getCurrentConfig(id);
  console.log(config);
}

/**
 * Updates the environment's config.
 * @param {*} config
 * @returns
 */
async function updateConfig(config) {
  const url = `${API_URL_BASE}/app/config/v1/configs`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  if (res.ok) {
    const result = await res.json();
    return result["@id"];
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

/**
 * Retrieves the current config for the environment.
 * @param {*} id
 * @returns
 */
async function getCurrentConfig(id) {
  const url = `${API_URL_BASE}/app${id}`;

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

updateConfigExample();
