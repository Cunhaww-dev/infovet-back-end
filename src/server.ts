import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from '@/config/env';
import { healthRouter } from '@/routes/health';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(healthRouter);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});