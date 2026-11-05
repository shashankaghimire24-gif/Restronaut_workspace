export type Territory={id:string;market:string;name:string;streets:string;box:[number,number,number,number]};
export {CITIES as TERRITORY_MARKETS} from './geography';
// Practical prospecting rectangles, not administrative neighborhood boundaries.
export const TERRITORIES:Territory[]=[
{id:'sf-northbeach',market:'sf',name:'North Beach',streets:'Columbus Avenue · Broadway to Union Street',box:[37.797,-122.4125,37.8035,-122.404]},
{id:'sf-mission',market:'sf',name:'Mission · Valencia corridor',streets:'Valencia and Mission streets · 16th to 24th',box:[37.751,-122.4235,37.7665,-122.416]},
{id:'sf-marina',market:'sf',name:'Marina · Chestnut & Union',streets:'Chestnut and Union streets · Divisadero to Gough',box:[37.7965,-122.4445,37.802,-122.425]},
{id:'sf-richmond',market:'sf',name:'Inner Richmond · Clement',streets:'Clement and Geary · Arguello to 12th Avenue',box:[37.78,-122.471,37.7845,-122.458]},
{id:'sf-sunset',market:'sf',name:'Inner Sunset · Irving',streets:'Irving and Judah · 5th to 12th Avenue',box:[37.761,-122.4695,37.7655,-122.462]},
{id:'sf-hayes',market:'sf',name:'Hayes Valley',streets:'Hayes Street · Laguna to Franklin',box:[37.774,-122.4265,37.7785,-122.4205]},
{id:'sf-fidi',market:'sf',name:'Financial District / Jackson Square',streets:'Montgomery and Kearny · California to Broadway',box:[37.792,-122.4065,37.7985,-122.399]},
{id:'sf-chinatown',market:'sf',name:'Chinatown',streets:'Grant and Stockton · Bush to Broadway',box:[37.7905,-122.409,37.798,-122.403]},
{id:'solano-albany',market:'albany',name:'Solano Avenue · Albany',streets:'San Pablo Avenue to the Albany / Berkeley edge',box:[37.889,-122.3005,37.8925,-122.283]},
{id:'solano-berkeley',market:'berkeley',name:'Upper Solano · Berkeley',streets:'Eastern Solano Avenue toward The Alameda',box:[37.8885,-122.283,37.892,-122.272]},
{id:'berkeley-shattuck',market:'berkeley',name:'North Berkeley · Shattuck',streets:'Shattuck Avenue · Hearst to Rose',box:[37.873,-122.2725,37.8835,-122.266]},
{id:'sj-sanpedro',market:'sanjose',name:'San Pedro Square',streets:'San Pedro, Market and Almaden · Santa Clara to St. John',box:[37.3345,-121.8965,37.3385,-121.891]},
];
export const territoryMap=(t:Territory)=>`https://www.openstreetmap.org/export/embed.html?bbox=${t.box[1]},${t.box[0]},${t.box[3]},${t.box[2]}&layer=mapnik`;
