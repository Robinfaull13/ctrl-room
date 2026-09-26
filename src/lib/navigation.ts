import type {ContentItem,Section} from './content/types';
export const sections:Section[]=['invites','studios','records','archive','about','contact'];
export const labels:Record<Section,string>={invites:'Invites',studios:'Studios',records:'Records',archive:'Archive',about:'About',contact:'Contact'};
export function contentHref(item:Pick<ContentItem,'kind'|'slug'>):string{const prefix={event:'invites',session:'studios',release:'records',archiveEntry:'archive'}[item.kind];return '/'+prefix+'/'+encodeURIComponent(item.slug)}
export function parseBrowseQuery(params:URLSearchParams):{q:string;format?:'DJ set'|'Live'}{const format=params.get('format');return {q:params.get('q')||'',format:format==='DJ set'||format==='Live'?format:undefined}}
export function querySuffix(query:{q?:string;format?:string}):string{const params=new URLSearchParams();if(query.q)params.set('q',query.q);if(query.format)params.set('format',query.format);return params.size?'?'+params.toString():''}
export function currentSection(pathname:string):Section{const first=pathname.split('/')[1];return sections.find(x=>x===first)||'invites'}
