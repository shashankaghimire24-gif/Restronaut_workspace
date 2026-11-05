import {db,authorize,reply,body} from '@/lib/server';
import {safeLink} from '@/lib/model';
import {CITIES,cityQuery} from '@/lib/geography';
import {z} from 'zod';
import sfSnapshot from '@/lib/listing-snapshots/sf-city.json';
export const dynamic='force-dynamic';
export async function POST(req:Request){try{
 const owner=await authorize(req);if(!owner)return reply({error:'Sign in to search.'},401);
 const input=z.object({city:z.string()}).parse(await body(req));const city=CITIES.find(c=>c.id===input.city);if(!city)return reply({error:'Choose a Bay Area city.'},400);
 const now=new Date().toISOString(),key='city-v2:'+city.id;const cache=await db().prepare('SELECT payload,expires FROM discovery_cache WHERE key=?').bind(key).first<{payload:string;expires:string}>();
 if(cache&&cache.expires>now)return reply({...JSON.parse(cache.payload),cached:true});
 const lock=await db().prepare('INSERT INTO discovery_cache(key,payload,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET expires=excluded.expires WHERE discovery_cache.expires<? RETURNING key').bind('search:'+owner,'{}',new Date(Date.now()+10000).toISOString(),now).first();if(!lock)return reply({error:'Please wait 10 seconds before searching another city.'},429);
 let data:any;for(const endpoint of ['https://overpass-api.de/api/interpreter','https://overpass.private.coffee/api/interpreter']){try{const res=await fetch(endpoint+'?data='+encodeURIComponent(cityQuery(city)),{headers:{Accept:'application/json','User-Agent':'RestronautSalesWorkspace/1.0'},signal:AbortSignal.timeout(25000)});if(!res.ok)continue;const d:any=await res.json();if(!d.remark&&Array.isArray(d.elements)){data=d;break}}catch{}}
 if(!data){if(!cache&&city.id==='sf')return reply({...sfSnapshot,cached:true,warning:'Live services are busy. Showing a saved, partial OpenStreetMap city snapshot from the displayed date. Verify current details before outreach.'});if(cache)return reply({...JSON.parse(cache.payload),cached:true,warning:'Live services are busy. Showing the last successful city search from the displayed date.'});return reply({error:'City listings are temporarily unavailable. Try a starter district below or retry shortly. Your saved leads are unaffected.'},503);}
 const boundary=data.elements.find((e:any)=>e.tags?.boundary==='administrative'&&e.bounds);
 if(!boundary)return reply({error:'The map provider did not resolve this city boundary. No nearby-city results have been substituted. Try a starter district or add a restaurant manually.'},422);
 const entries=data.elements.filter((e:any)=>['restaurant','fast_food','cafe'].includes(e.tags?.amenity));const seen=new Set<string>();
 const rows=entries.slice(0,5000).map((e:any)=>{const t=e.tags||{};return {name:t.name,city:city.name,territory:'city:'+city.id,street:t['addr:street']||'',address:[t['addr:housenumber'],t['addr:street'],t['addr:postcode']].filter(Boolean).join(' '),cuisine:(t.cuisine||t.amenity||'').replace(/;/g,', '),website:safeLink(t.website||t['contact:website']||''),email:/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(t.email||t['contact:email']||'')?(t.email||t['contact:email']):'',phone:t.phone||t['contact:phone']||'',sourceUrl:`https://www.openstreetmap.org/${e.type}/${e.id}`,sourceLabel:'OpenStreetMap',observedAt:now};}).filter((r:any)=>{const k=r.address?`${r.name.toLowerCase()}|${r.address.toLowerCase()}`:r.sourceUrl;if(seen.has(k))return false;seen.add(k);return true;});rows.sort((a:any,b:any)=>a.name.localeCompare(b.name));
 const result={restaurants:rows,searchedAt:now,city:city.name,truncated:entries.length>5000,bounds:boundary.bounds,boundaryUrl:`https://www.openstreetmap.org/relation/${boundary.id}`};
 try{await db().prepare('INSERT INTO discovery_cache(key,payload,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload,expires=excluded.expires').bind(key,JSON.stringify(result),new Date(Date.now()+86400000).toISOString()).run();}catch{console.error('City result cache could not be refreshed');}return reply(result);
 }catch(e){console.error('City search failed',e instanceof Error?e.name:'error');return reply({error:e instanceof z.ZodError?'Choose a city.':'Could not complete the city search. Please retry.'},e instanceof z.ZodError?400:503)}
}
