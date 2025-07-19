import { config } from 'dotenv';
config();

import '@/ai/flows/answer-technical-query.ts';
import '@/ai/flows/summarize-documentation.ts';
import '@/ai/flows/adapt-response-to-expertise-level.ts';