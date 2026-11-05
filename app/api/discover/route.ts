import {db,authorize,reply,body} from '@/lib/server';
import {emptyRestaurant,safeLink} from '@/lib/model';
import {TERRITORIES,TERRITORY_MARKETS} from '@/lib/territories';
import {z} from 'zod';
import northBeach from '@/lib/listing-snapshots/sf-northbeach.json';
import solano from '@/lib/listing-snapshots/solano-albany.json';
import sanPedro from '@/lib/listing-snapshots/sj-sanpedro.json';
const snapshots:Record<string,unknown>={'sf-northbeach':northBeach,'solano-albany':solano,'sj-sanpedro':sanPedro};
export const dynamic='force-dynamic';
export async function POST(req:Request){
 try{
  const owner=await authorize(req);if(!owner)return reply({error:'Sign in to search.'},401);
  const {territory}=z.object({territory:z.string()}).parse(await body(req));
  const area=TERRITORIES.find(x=>x.id===territory);if(!area)return reply({error:'Choose a listed restaurant district.'},400);
  const key=`district-v2:${area.id}`,now=new Date().toISOString();
  const cached=await db().prepare('SELECT payload,expires FROM discovery_cache WHERE key=?').bind(key).first<{payload:string;expires:string}>();
  if(cached&&cached.expires>now)return reply({...JSON.parse(cached.payload),cached:true});
  const lock=await db().prepare('INSERT INTO discovery_cache(key,payload,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET expires=excluded.expires WHERE discovery_cache.expires<? RETURNING key').bind('search:'+owner,'{}',new Date(Date.now()+10000).toISOString(),now).first();
  if(!lock)return reply({error:'Please wait 10 seconds before another search.'},429);
  const query=`[out:json][timeout:12];nwr["amenity"~"^(restaurant|fast_food|cafe)$"]["name"](${area.box.join(',')});out center tags 501;`;
  let data:any;
  for(const endpoint of ['https://overpass-api.de/api/interpreter','https://overpass.private.coffee/api/interpreter']){
   try{const res=await fetch(endpoint+'?data='+encodeURIComponent(query),{headers:{'Accept':'application/json','User-Agent':'RestronautSalesWorkspace/1.0'},signal:AbortSignal.timeout(16000)});if(!res.ok)continue;const parsed:any=await res.json();if(!parsed.remark&&Array.isArray(parsed.elements)){data=parsed;break;}}catch{/* Try the next public provider. */}
  }
  if(!data){if(!cached&&snapshots[area.id])return reply({...snapshots[area.id] as object,cached:true,stale:true,warning:'Live providers are busy. Showing a saved OpenStreetMap snapshot from the displayed date. Verify current details before outreach.'});if(cached)return reply({...JSON.parse(cached.payload),cached:true,stale:true,warning:'Live providers are busy. Showing the last successful search; verify current business details.'});return reply({error:'Both public listing servers are unavailable right now. Your saved leads are safe. Use the district map to research businesses or retry shortly.'},503);}
  const seen=new Set<string>();const rows=data.elements.slice(0,500).map((e:any)=>{const t=e.tags||{};return {...emptyRestaurant(),name:t.name,city:t['addr:city']||(TERRITORY_MARKETS.find(m=>m.id===area.market)!.name),street:t['addr:street']||'',address:[t['addr:housenumber'],t['addr:street'],t['addr:postcode']].filter(Boolean).join(' '),cuisine:(t.cuisine||t.amenity||'').replace(/;/g,', '),website:safeLink(t.website||t['contact:website']||''),email:/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(t.email||t['contact:email']||'')?(t.email||t['contact:email']):'',phone:t.phone||t['contact:phone']||'',sourceUrl:`https://www.openstreetmap.org/${e.type}/${e.id}`,sourceLabel:'OpenStreetMap',observedAt:now,territory:area.id};}).filter((r:any)=>{const k=r.address?`${r.name.toLowerCase()}|${r.address.toLowerCase()}`:r.sourceUrl;if(seen.has(k))return false;seen.add(k);return true;});
  rows.sort((a:any,b:any)=>a.name.localeCompare(b.name));
  const result={restaurants:rows,searchedAt:now,market:area.name,truncated:data.elements.length>500};
  await db().prepare('INSERT INTO discovery_cache(key,payload,expires) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload,expires=excluded.expires').bind(key,JSON.stringify(result),new Date(Date.now()+86400000).toISOString()).run();return reply(result);
 }catch(e){console.error('Discovery failed',e instanceof Error?e.name:'error');return reply({error:e instanceof z.ZodError?'Choose a restaurant district.':'Search could not complete. Please retry.'},e instanceof z.ZodError?400:503);}
}
