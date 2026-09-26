import {it,expect} from 'vitest';import {sectionAngle,nearestTargetAngle,motionProgress} from '@/features/cockpit/motion';
it('maps the approved section order to the ring',()=>{expect(sectionAngle('studios')).toBeCloseTo(Math.PI/3);expect(sectionAngle('records')).toBeCloseTo(2*Math.PI/3)});
it('takes the short path around the wrap boundary',()=>{expect(nearestTargetAngle(5*Math.PI/3,'invites')).toBeCloseTo(2*Math.PI);expect(nearestTargetAngle(0,'contact')).toBeCloseTo(-Math.PI/3)});
it('completes immediately under reduced motion and eases normal travel',()=>{expect(motionProgress(0,true)).toBe(1);expect(motionProgress(0,false)).toBe(0);expect(motionProgress(.9,false)).toBeCloseTo(.5);expect(motionProgress(1.8,false)).toBe(1)});
