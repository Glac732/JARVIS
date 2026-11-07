import{describe,it,expect}from'vitest';import{findGridPath}from'../src/renderer/game/navigation';
describe('grid navigation',()=>{
 it('routes around blocking cover instead of crossing it',()=>{const path=findGridPath({x:-8,z:0},{x:8,z:0},[{x:0,z:0,halfWidth:2,halfDepth:4}]);expect(path.length).toBeGreaterThan(2);expect(path.some(p=>Math.abs(p.x)<2.6&&Math.abs(p.z)<4.6)).toBe(false);expect(path[0]).toEqual({x:-8,z:0});expect(path[path.length-1]).toEqual({x:8,z:0});});
 it('returns an empty route when the destination is blocked',()=>expect(findGridPath({x:-8,z:0},{x:0,z:0},[{x:0,z:0,halfWidth:3,halfDepth:3}])).toEqual([]));
 it('returns the start point for a zero-distance route',()=>expect(findGridPath({x:2,z:2},{x:2,z:2},[])).toEqual([{x:2,z:2}]));
 it('keeps routes inside the battlefield bounds',()=>{const path=findGridPath({x:30,z:0},{x:34,z:0},[]);expect(path.every(p=>p.x<=35&&p.x>=-35)).toBe(true);});
});
