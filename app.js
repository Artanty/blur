import dotenv from 'dotenv';
import express from 'express';
import { Octokit, App } from 'octokit';
import { createAppAuth } from "@octokit/auth-app";

const owner = 'Artanty'
const repo = 'shared-secrets'
const secret_name = 'WIRE_URL'

dotenv.config();

const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const secret = process.env.WEBHOOK_SECRET;


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// console.log(privateKey)
// const githubApp = new App({
//   appId,
//   privateKey
// });

// const { data } = await githubApp.octokit.request('/app');
// githubApp.octokit.log.debug(`Authenticated as '${data.name}'`);

// console.log(`data.name: ${data}`)


// Object.keys(data).forEach(el =>{
//   console.log(el)
//   console.log(data[el])
// })
// await githubApp.octokit.rest.issues.create({
//   owner: owner,
//   repo: repo,
//   title: "Hello, world!",
//   body: "I created this issue using Octokit!",
//   installationId: 940632
// });

const app2 = new App({ appId, privateKey });
// const { data: slug } = await app2.octokit.rest.apps.getAuthenticated();
const octokit = await app2.getInstallationOctokit(52641163);
// await octokit.rest.issues.create({
//   owner: owner,
//   repo: repo,
//   title: "Hello world from " + slug,
// });

const { data } = await octokit.rest.actions.getRepoSecret({
  owner,
  repo,
  secret_name,
});
console.log(data)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});