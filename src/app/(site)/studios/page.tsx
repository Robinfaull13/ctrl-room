import {RouteContent,routeMetadata,type SearchParams} from '@/features/catalogue/RouteContent';
export const generateMetadata=()=>routeMetadata('studios');
export default function Page({searchParams}:{searchParams:SearchParams}){return <RouteContent section="studios" searchParams={searchParams}/>}