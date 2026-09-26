import {RouteContent,routeMetadata,type SearchParams} from '@/features/catalogue/RouteContent';
export const generateMetadata=()=>routeMetadata('invites');
export default function Page({searchParams}:{searchParams:SearchParams}){return <RouteContent section="invites" searchParams={searchParams}/>}