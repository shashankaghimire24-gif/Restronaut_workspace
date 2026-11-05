import Workspace from './workspace';
import {getChatGPTUser,chatGPTSignInPath} from './chatgpt-auth';
export const dynamic='force-dynamic';
export default async function Home(){const user=await getChatGPTUser();if(!user)return <main className="min-h-screen grid place-items-center p-8"><section className="panel max-w-lg"><span className="brand-icon inline-block mb-6">r.</span><h1>Your private sales workspace.</h1><p className="setting-description mb-6">Sign in to manage your restaurant leads, outreach, and customers.</p><a className="primary" href={chatGPTSignInPath('/')} target="_top">Sign in with ChatGPT</a></section></main>;return <Workspace/>}
