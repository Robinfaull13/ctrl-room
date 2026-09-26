import {RouteContent,routeMetadata,type SearchParams} from '@/features/catalogue/RouteContent';
type Props={params:Promise<{slug:string}>;searchParams:SearchParams};
export async function generateMetadata({params}:Props){return routeMetadata('studios',(await params).slug)}
export default async function Page({params,searchParams}:Props){return <RouteContent section="studios" slug={(await params).slug} searchParams={searchParams}/>}