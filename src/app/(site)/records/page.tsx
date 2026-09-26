import {
  RouteContent,
  routeMetadata,
  type SearchParams,
} from "@/features/catalogue/RouteContent";
export const generateMetadata = () => routeMetadata("records");
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return <RouteContent section="records" searchParams={searchParams} />;
}
