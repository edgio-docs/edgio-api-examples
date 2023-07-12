import * as readline from 'node:readline';

export let authorizationHeaders = {};

if (process.env.API_KEY?.length) {
  authorizationHeaders = {
    "X-Api-Key": process.env.API_KEY,
  };
} else if (process.env.JWT_ACCESS_TOKEN?.length) {
  authorizationHeaders = {
    Authorization: `Bearer ${process.env.JWT_ACCESS_TOKEN}`,
  };
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Node >=16 has a built-in readline promise API, this is just convenient 
// to have this run in lower versions
export async function readlinePromise(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (response) => {
      resolve(response)
      rl.close();
    });
  });
}
