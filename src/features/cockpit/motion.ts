import type {Section} from '@/lib/content/types';import {sections} from '@/lib/navigation';
export function sectionAngle(section:Section):number{return sections.indexOf(section)*Math.PI/3}
export function nearestTargetAngle(current:number,section:Section):number{const tau=2*Math.PI;return current+((sectionAngle(section)-current+Math.PI)%tau+tau)%tau-Math.PI}
export function motionProgress(seconds:number,reducedMotion:boolean):number{if(reducedMotion)return 1;const t=Math.max(0,Math.min(1,seconds/1.8));return t*t*(3-2*t)}
