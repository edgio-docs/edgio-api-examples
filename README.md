# Edgio API Examples

JavaScript examples for calling the Edgio APIs

# Requirements

- Node 16 or newer

# Setup

- Install dependencies:

```
npm i
```

- Copy `.env.example` to `.env`. and fill in:
  - the environment tenand id to operate on: `ENVIRONMENT_ID`
  - an authentication key, `API_KEY` or `JWT_ACCESS_KEY`
  - for `/config/tls-cert.mjs`: `PRIMARY_CERT`, `INTERMEDIATE_CERT` and `PRIVATE_KEY`
  - for `/accounts/creation.mjs`: (required for JWT_ACCESS_KEY authentication) the `ORGANIZATION_ID` on which to create properties and environments. It creates a new organization otherwise.
  - for `/configs/*`: the `ENVIRONMENT_ID` on which to operate.

# Running Examples

```
node accounts/creation.js
node cache/purge.js
node config/configs.js
node config/tls-certs.js
```
