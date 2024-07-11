import dotenv from 'dotenv';
import express from 'express';
import { Octokit, App } from 'octokit';
import { createAppAuth } from "@octokit/auth-app";

const owner = 'Artanty'
const repo = 'shared-secrets'
const secret_name = 'WIRE_URL'

dotenv.config();

const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY//.replace(/\\n/g, '\n');
const secret = process.env.WEBHOOK_SECRET;


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome');
});

app.get('/1', async (req, res) => {
  const app2 = new App({ appId, privateKey });
  const { data: slug } = await app2.octokit.rest.apps.getAuthenticated();
  const octokit = await app2.getInstallationOctokit(52641163);
  await octokit.rest.issues.create({
    owner: owner,
    repo: repo,
    title: "Hello world from " + slug.name,
  });
  res.send('isuue created');
});

app.get('/2', async (req, res) => {
  const app2 = new App({ appId, privateKey });
  for await (const { octokit, repository } of app2.eachRepository.iterator()) {
    if (repository.name === 'shared-secrets') {
      try {
        const fileResponse = await octokit.rest.repos.getContent({
          owner: repository.owner.login,
          repo: repository.name,
          path: 'folder/file.txt'
        });

        if (fileResponse.data.type === 'file' && fileResponse.data.content) {
          const content = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
          console.log(content);
          res.send(content); // Send the content back to the client
        } else {
          res.status(404).send('File not found or content is empty');
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



