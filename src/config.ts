import dotenv from 'dotenv';
dotenv.config();

import { InferenceClient } from "@huggingface/inference";
import { pipeline } from '@xenova/transformers';
import { createClient } from "@supabase/supabase-js";

/** Hugging Face config */
const HF_TOKEN = process.env.HF_TOKEN;
export const hfClient = new InferenceClient(HF_TOKEN);

/** Local embedding model using Transformers.js */
let embeddingPipeline: any = null;

export async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingPipeline;
}

/** Supabase config */
const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);