import "dotenv/config";
import { API_URL_BASE } from "../constants.mjs";
import { authorizationHeaders, wait, readlinePromise } from "../common.mjs";
import crypto from 'crypto'
import fetch from "node-fetch";

async function accountCreationExample() {
  const randomPrefix = `edgio-api-example-${crypto.randomBytes(10).toString('hex')}-`;
  
  if (process.env.JWT_ACCESS_KEY?.length && !process.env.ORGANIZATION_ID?.length) {
    throw new Error("JWT_ACCESS_TOKEN are not yet capable to create organizationm, please provide an existing ORGANIZATION_ID")
  } 
  
  let createdOrganization, createdProperty
  
  try {
    let organizationId
    if (process.env.ORGANIZATION_ID?.length) {
      organizationId = process.env.ORGANIZATION_ID
    } else {
      const orgName = `${randomPrefix}TestOrg`
      console.log(`Creating Organization: ${orgName}`)
      createdOrganization = await createOrganization(orgName);
      console.log("\n> Here is your organization:", createdOrganization)
      organizationId = createdOrganization.id
    }
  
    const propertySlug = `${randomPrefix}test-property`
    console.log(`\n\nCreating Property: ${propertySlug}`)
    createdProperty = await createProperty(organizationId, propertySlug);
    console.log("\n> Here is your property. Notice that it already has a production environment linked:", createdProperty)
  
    const environmentName = `${randomPrefix}test-environment`
    console.log(`\n\nCreating Environment: ${environmentName}`)
    const environment = await createEnvironment(createdProperty.id, environmentName);
    console.log("\n> Here is your environment:", environment)
  
    
  } catch(e) {
    console.error(e)
  } finally {
    if (createdOrganization || createdProperty) {
      await readlinePromise("\n\nPress enter to delete the created resources. Ctrl+C to exit without cleanup.")
    
      if (createdOrganization) {
        console.log(`Deleting organization ${createdOrganization.name}, which will cascade delete the rest`)
        await deleteOrganization(createdOrganization.id)
        console.log("> done")
        return
      }

      if (createdProperty) {
        console.log(`Deleting property "${createdProperty.slug}", which will cascade delete the rest`)
        await deleteProperty(createdProperty.id)
        console.log("> done")
      }
    }
  }
}

async function createOrganization(name) {
  const url = `${API_URL_BASE}/accounts/v0.1/organizations`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name
    }),
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function deleteOrganization(organizationId) {
  const url = `${API_URL_BASE}/accounts/v0.1/organizations/${organizationId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: authorizationHeaders
  });

  if (res.ok) {
    return
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function createProperty(organizationId, slug) {
  const url = `${API_URL_BASE}/accounts/v0.1/properties`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organization_id: organizationId,
      slug
    }),
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function deleteProperty(propertyId) {
  const url = `${API_URL_BASE}/accounts/v0.1/properties/${propertyId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: authorizationHeaders
  });

  if (res.ok) {
    return
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}

async function createEnvironment(propertyId, name) {
  const url = `${API_URL_BASE}/accounts/v0.1/environments`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authorizationHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      property_id: propertyId,
      name
    }),
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`error ${res.status} ${await res.text()}`);
  }
}


accountCreationExample();
