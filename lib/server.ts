import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export function db(){if(!env.DB)throw new Error('Database is not connected');return env.DB}
export async function authorize(req:Request){const user=await getChatGPTUser();if(!user)return null;if(req.method!=='GET'){const origin=req.headers.get('origin');if(req.headers.get('sec-fetch-site')==='cross-site'||(origin&&origin!==new URL(req.url).origin))return null;}return user.userId}
export const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function body(req:Request){const raw=await req.text();if(raw.length>900000)throw new Error('Request is too large');return JSON.parse(raw)}
