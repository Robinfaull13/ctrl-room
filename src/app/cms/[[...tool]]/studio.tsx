'use client';
import dynamic from 'next/dynamic';import {studioConfig} from '../../../../sanity.config';
const SanityStudio=dynamic(()=>import('sanity').then(m=>m.Studio),{ssr:false,loading:()=> <p>Loading editor?</p>});
export default function Studio({projectId,dataset}:{projectId:string;dataset:string}){return <div style={{position:'fixed',inset:0}}><SanityStudio config={studioConfig(projectId,dataset)}/></div>}
