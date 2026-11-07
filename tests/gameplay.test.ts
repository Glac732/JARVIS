import {describe,it,expect} from 'vitest';
import {WEAPONS,initialWeaponStates,beginReload,settleReload,fireRound,chooseTacticalAction,computeAimError} from '../src/renderer/game/combat';
describe('weapon handling',()=>{
 it('creates independent magazines and reserves for every weapon',()=>{const s=initialWeaponStates();expect(s['VKR-7'].magazine).toBe(30);expect(s['KX-9'].magazine).toBe(24);expect(s.P9.reserve).toBe(75);});
 it('fires one round and preserves reserve ammunition',()=>{const w=WEAPONS[0],s=initialWeaponStates()[w.id],r=fireRound(w,s,1,0,true);expect(r.fired).toBe(true);expect(r.state.magazine).toBe(29);expect(r.state.reserve).toBe(120);});
 it('enforces weapon-specific fire cadence',()=>{const w=WEAPONS[1],s=initialWeaponStates()[w.id];expect(fireRound(w,s,.1,0,true).reason).toBe('cooldown');});
 it('requires a new trigger press for semi-automatic fire',()=>{const w=WEAPONS[1],s=initialWeaponStates()[w.id];expect(fireRound(w,s,1,0,false).reason).toBe('semi-auto-release');});
 it('starts and completes a bounded reload',()=>{const w=WEAPONS[0],s={magazine:5,reserve:18,reloadingUntil:0},loading=beginReload(w,s,10);expect(loading.reloadingUntil).toBeCloseTo(11.75);expect(settleReload(w,loading,11).magazine).toBe(5);const done=settleReload(w,loading,12);expect(done.magazine).toBe(23);expect(done.reserve).toBe(0);});
 it('does not reload a full magazine or an empty reserve',()=>{const w=WEAPONS[0];expect(beginReload(w,{magazine:30,reserve:2,reloadingUntil:0},0).reloadingUntil).toBe(0);expect(beginReload(w,{magazine:0,reserve:0,reloadingUntil:0},0).reloadingUntil).toBe(0);});
 it('defines six complete weapon profiles with valid combat values',()=>{expect(WEAPONS).toHaveLength(6);for(const w of WEAPONS){expect(w.magazine).toBeGreaterThan(0);expect(w.reserve).toBeGreaterThanOrEqual(0);expect(w.damage).toBeGreaterThan(0);expect(w.fireInterval).toBeGreaterThan(0);expect(w.reloadSeconds).toBeGreaterThan(0);expect(w.range).toBeGreaterThan(0);}});
 it('fires correctly with every weapon profile',()=>{for(const w of WEAPONS){const state=initialWeaponStates()[w.id];const result=fireRound(w,state,10,0,true);expect(result.fired, w.id).toBe(true);expect(result.state.magazine).toBe(w.magazine-1);}});
 it('does not create ammunition during a partial reload',()=>{for(const w of WEAPONS){const start={magazine:Math.max(0,w.magazine-3),reserve:2,reloadingUntil:0};const loading=beginReload(w,start,5);const done=settleReload(w,loading,5+w.reloadSeconds);expect(done.magazine+done.reserve).toBe(start.magazine+start.reserve);}});

});
describe('tactical AI decisions',()=>{
 it('retreats when critically wounded under pressure',()=>expect(chooseTacticalAction({distance:8,visible:true,recentlySawTarget:true,healthRatio:.2,underFire:true,allyDistance:20,coverDistance:5,aggression:.8})).toBe('retreat'));
 it('uses nearby cover when suppressed',()=>expect(chooseTacticalAction({distance:15,visible:true,recentlySawTarget:true,healthRatio:.8,underFire:true,allyDistance:20,coverDistance:4,aggression:.5})).toBe('seek-cover'));
 it('flanks when target is close',()=>expect(chooseTacticalAction({distance:4,visible:true,recentlySawTarget:true,healthRatio:1,underFire:false,allyDistance:30,coverDistance:20,aggression:.5})).toBe('flank'));
 it('searches using aggression when line of sight is lost',()=>expect(chooseTacticalAction({distance:15,visible:false,recentlySawTarget:true,healthRatio:.8,underFire:false,allyDistance:20,coverDistance:10,aggression:.9})).toBe('flank'));
 it('patrols when no target information exists',()=>expect(chooseTacticalAction({distance:50,visible:false,recentlySawTarget:false,healthRatio:1,underFire:false,allyDistance:30,coverDistance:20,aggression:.5})).toBe('patrol'));
});
describe('accuracy model',()=>{it('penalises movement and rewards aiming/crouching',()=>{const base=computeAimError(.01,0,false,false);expect(computeAimError(.01,5,false,false)).toBeGreaterThan(base);expect(computeAimError(.01,0,true,true)).toBeLessThan(base);});});
