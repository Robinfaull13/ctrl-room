import {RouteContent,routeMetadata,type SearchParams} from '@/features/catalogue/RouteContent';
export const generateMetadata=()=>routeMetadata('archive');
export default function Page({searchParams}:{searchParams:SearchParams}){return <RouteContent section="archive" searchParams={searchParams}/>}