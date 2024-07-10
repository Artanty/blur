import dotenv from 'dotenv';
import express from 'express';
import { Octokit, App } from 'octokit';

dotenv.config();

const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY_PATH;
const secret = process.env.WEBHOOK_SECRET;
const enterpriseHostname = process.env.ENTERPRISE_HOSTNAME;

const githubApp = new App({
  appId,
  privateKey,
  webhooks: {
    secret
  },
  ...(enterpriseHostname && {
    Octokit: Octokit.defaults({
      baseUrl: `https://${enterpriseHostname}/api/v3`
    })
  })
});

const { data } = await githubApp.octokit.request('/app');
githubApp.octokit.log.debug(`Authenticated as '${data.name}'`);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    if (payload.action === 'workflow_dispatch') {
      const secretUrl = process.env.SECRET_URL;
      res.status(200).send({ secretUrl });
    } else {
      res.status(200).send({ message: 'No action required' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});