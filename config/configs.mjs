import "dotenv/config";
import { API_URL_BASE } from "../constants.mjs";
import { authorizationHeaders, wait } from "../common.mjs";

import fetch from "node-fetch";

/**
 * Updates the configuration for the environment specified by the ENVIRONMENT_ID environment variable.
 */
async function updateConfigExample() {
  const {hrefId, deploymentId} = await updateConfig({
    environment_id: process.env.ENVIRONMENT_ID,
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

  console.log("\n\nCreating new config...");
  console.log(`success. (id=${hrefId})`);

  console.log(`\n\nChecking deployment status...`);
  let status = {};
  while (status.status !== "completed") {
    wait(2000);
    status = await getDeployment(deploymentId);
    console.log(`Deployment status: ${status.status}`);
  }

  console.log(`\n\nChecking deployment logs`);
  const logs = await getDeploymentLogs(deploymentId);
  console.log(logs);

  console.log(`\n\nFetching the config ${hrefId}...`);
  const config = await getCurrentConfig(hrefId);
  console.log(JSON.stringify(config, null, 2));
}

/**
 * Updates the environment's config.
 * @param {*} config
 * @returns
 */
async function updateConfig(config) {
  const url = `${API_URL_BASE}/config/v0.1/configs`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  if (res.ok) {
    const result = await res.json();
    // TODO: API should also reutrn the plain 'id' here. Will be fixed in next release
    return {hrefId: result["@id"], deploymentId: result["@links"].deployment.id };
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

/**
 * Retrieves the current config for the environment.
 * @param {*} id
 * @returns
 */
async function getCurrentConfig(hrefId) {
  const url = `${API_URL_BASE}${hrefId}`;

  const res = await fetch(url, {
    headers: authorizationHeaders,
  });

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function getDeployment(deploymentId) {
  const url = `${API_URL_BASE}/config/v0.1/deployments/${deploymentId}`;

  const res = await fetch(url, {
    headers: authorizationHeaders,
  });

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function getDeploymentLogs(deploymentId) {
  const url = `${API_URL_BASE}/config/v0.1/deployments/${deploymentId}/logs`;

  const res = await fetch(url, {
    headers: authorizationHeaders,
  });

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}


updateConfigExample();