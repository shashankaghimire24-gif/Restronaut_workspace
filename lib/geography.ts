// Incorporated cities/towns: MTC/ABAG Bay Area Census, accessed 2026-09-26.
// https://census.bayareametro.gov/cities-counties
export const REGIONS=[{id:'bay',name:'Entire Bay Area'},{id:'sf',name:'San Francisco'},{id:'east',name:'East Bay'},{id:'peninsula',name:'Peninsula'},{id:'south',name:'South Bay'},{id:'north',name:'North Bay'}];
const counties=[
 {county:'San Francisco',region:'sf',names:'San Francisco'},
 {county:'Alameda',region:'east',names:'Alameda|Albany|Berkeley|Dublin|Emeryville|Fremont|Hayward|Livermore|Newark|Oakland|Piedmont|Pleasanton|San Leandro|Union City'},
 {county:'Contra Costa',region:'east',names:'Antioch|Brentwood|Clayton|Concord|Danville|El Cerrito|Hercules|Lafayette|Martinez|Moraga|Oakley|Orinda|Pinole|Pittsburg|Pleasant Hill|Richmond|San Pablo|San Ramon|Walnut Creek'},
 {county:'Marin',region:'north',names:'Belvedere|Corte Madera|Fairfax|Larkspur|Mill Valley|Novato|Ross|San Anselmo|San Rafael|Sausalito|Tiburon'},
 {county:'Napa',region:'north',names:'American Canyon|Calistoga|Napa|St. Helena|Yountville'},
 {county:'San Mateo',region:'peninsula',names:'Atherton|Belmont|Brisbane|Burlingame|Colma|Daly City|East Palo Alto|Foster City|Half Moon Bay|Hillsborough|Menlo Park|Millbrae|Pacifica|Portola Valley|Redwood City|San Bruno|San Carlos|San Mateo|South San Francisco|Woodside'},
 {county:'Santa Clara',region:'south',names:'Campbell|Cupertino|Gilroy|Los Altos|Los Altos Hills|Los Gatos|Milpitas|Monte Sereno|Morgan Hill|Mountain View|Palo Alto|San Jose|Santa Clara|Saratoga|Sunnyvale'},
 {county:'Solano',region:'north',names:'Benicia|Dixon|Fairfield|Rio Vista|Suisun City|Vacaville|Vallejo'},
 {county:'Sonoma',region:'north',names:'Cloverdale|Cotati|Healdsburg|Petaluma|Rohnert Park|Santa Rosa|Sebastopol|Sonoma|Windsor'},
];
export const CITIES=counties.flatMap(c=>c.names.split('|').map(name=>({id:name==='San Francisco'?'sf':name==='San Jose'?'sanjose':name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,county:c.county,region:c.region}))).sort((a,b)=>a.name.localeCompare(b.name));
export type City=typeof CITIES[number];
export function cityQuery(city:City){
 const place=city.name==='San Jose'?'San Jos[eé]':city.name==='St. Helena'?'(St[.] Helena|Saint Helena)':city.name;
 const boundary=city.id==='sf'?'rel["boundary"="administrative"]["admin_level"="6"]["name"="San Francisco"](area.state)->.boundary;':`rel["boundary"="administrative"]["admin_level"="8"]["name"~"^${place}$"](area.state)->.boundary;`;
 return `[out:json][timeout:20];area["ISO3166-2"="US-CA"]->.state;${boundary}.boundary out tags bb;.boundary map_to_area->.city;nwr["amenity"~"^(restaurant|fast_food|cafe)$"]["name"](area.city);out center tags 5001;`;
}
