import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
const spaceMono=localFont({src:[{path:'../../public/fonts/SpaceMono-Regular.ttf',weight:'400'},{path:'../../public/fonts/SpaceMono-Bold.ttf',weight:'700'}],variable:'--font-mono',display:'swap'});
export const metadata: Metadata={metadataBase:new URL(process.env.SITE_URL||"http://localhost:3000"),title:{default:'CTRL ROOM',template:'%s / CTRL ROOM'},description:'Sound, vision, culture, community.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={spaceMono.variable}>{children}</body></html>}
