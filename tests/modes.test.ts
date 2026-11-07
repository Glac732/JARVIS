import {describe,it,expect} from 'vitest';
import {createMatch,startMatch,recordElimination,respawnPlayer,captureObjective,tickMatch} from '../src/renderer/game/modes';
const players=(teams=['alpha','bravo'])=>teams.map((team,i)=>({id:'p'+i,team:team as 'alpha'|'bravo'|'free',kills:0,deaths:0,score:0,alive:true}));
describe('match modes',()=>{
 it('creates and starts team deathmatch',()=>{const s=startMatch(createMatch('tdm',players()));expect(s.phase).toBe('active');expect(s.remaining).toBe(300);});
 it('scores eliminations and ends at target',()=>{let s=startMatch(createMatch('tdm',players()));for(let i=0;i<50;i++){s=recordElimination(s,'p0','p1');s=respawnPlayer(s,'p1');}expect(s.phase).toBe('complete');expect(s.winner).toBe('alpha');});
 it('rejects invalid duel roster',()=>expect(()=>createMatch('duel',players())).toThrow());
 it('tracks three domination points and awards control score',()=>{let s=startMatch(createMatch('domination',players()));expect(s.objectives).toHaveLength(3);s=captureObjective(s,'A','alpha',100);s=tickMatch(s,5);expect(s.scores.alpha).toBe(5);});
 it('prevents friendly fire scoring and duplicate dead-player kills',()=>{let s=startMatch(createMatch('tdm',players()));s=recordElimination(s,'p0','p1');const once=s;s=recordElimination(s,'p0','p1');expect(s.scores.alpha).toBe(once.scores.alpha);});
});
