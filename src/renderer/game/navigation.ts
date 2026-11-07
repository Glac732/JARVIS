export type NavRect={x:number;z:number;halfWidth:number;halfDepth:number};
export type NavPoint={x:number;z:number};
type Node={x:number;z:number;g:number;f:number;parent?:string};
const key=(x:number,z:number)=>x+','+z;
export function findGridPath(start:NavPoint,goal:NavPoint,obstacles:readonly NavRect[],bounds={minX:-35,maxX:35,minZ:-32,maxZ:32},cell=2):NavPoint[]{
 const toCell=(v:number)=>Math.round(v/cell),sx=toCell(start.x),sz=toCell(start.z),gx=toCell(goal.x),gz=toCell(goal.z);
 const blocked=(x:number,z:number)=>{const px=x*cell,pz=z*cell;if(px<bounds.minX||px>bounds.maxX||pz<bounds.minZ||pz>bounds.maxZ)return true;return obstacles.some(o=>Math.abs(px-o.x)<o.halfWidth+.55&&Math.abs(pz-o.z)<o.halfDepth+.55);};
 if(blocked(gx,gz))return [];
 const open=new Map<string,Node>(),closed=new Set<string>(),parents=new Map<string,Node>(),first:Node={x:sx,z:sz,g:0,f:Math.abs(gx-sx)+Math.abs(gz-sz)};open.set(key(sx,sz),first);
 const dirs=[[1,0],[-1,0],[0,1],[0,-1]] as const;let found:Node|undefined;let iterations=0;
 while(open.size&&iterations++<6000){let current:Node|undefined;let currentKey='';for(const [k,n] of open){if(!current||n.f<current.f||(n.f===current.f&&n.g<current.g)){current=n;currentKey=k;}}if(!current)break;open.delete(currentKey);closed.add(currentKey);if(current.x===gx&&current.z===gz){found=current;break;}
  for(const [dx,dz] of dirs){const x=current.x+dx,z=current.z+dz,k=key(x,z);if(closed.has(k)||blocked(x,z))continue;const g=current.g+1,old=open.get(k);if(!old||g<old.g){const next={x,z,g,f:g+Math.abs(gx-x)+Math.abs(gz-z),parent:currentKey};open.set(k,next);parents.set(k,next);}}
 }
 if(!found)return [];
 const result:NavPoint[]=[];let cursor:Node|undefined=found;while(cursor){result.push({x:cursor.x*cell,z:cursor.z*cell});cursor=cursor.parent?closedNode(cursor.parent,closed,first,open):undefined;}
 result.reverse();if(result.length)result[0]={x:start.x,z:start.z};result[result.length-1]={x:goal.x,z:goal.z};return result;
 function closedNode(k:string,closedKeys:Set<string>,root:Node,remaining:Map<string,Node>):Node|undefined{
  if(key(root.x,root.z)===k)return root;
  // Parent records are retained separately while searching.
  return parents.get(k)||remaining.get(k);
 }
}

/** Select a reachable point where a real obstacle intersects the player's firing line. */
export function findProtectedCover(
  start:NavPoint,
  player:NavPoint,
  obstacles:readonly NavRect[],
  bounds={minX:-35,maxX:35,minZ:-32,maxZ:32},
):NavPoint|null{
 const blockedLine=(target:NavPoint,rect:NavRect)=>{
  const dx=target.x-player.x,dz=target.z-player.z;
  const minX=rect.x-rect.halfWidth,maxX=rect.x+rect.halfWidth,minZ=rect.z-rect.halfDepth,maxZ=rect.z+rect.halfDepth;
  let t0=0,t1=1;
  const clip=(p:number,q:number)=>{if(Math.abs(p)<1e-8)return q>=0;const r=q/p;if(p<0){if(r>t1)return false;if(r>t0)t0=r;}else{if(r<t0)return false;if(r<t1)t1=r;}return true;};
  return clip(-dx,player.x-minX)&&clip(dx,maxX-player.x)&&clip(-dz,player.z-minZ)&&clip(dz,maxZ-player.z)&&t0<.97&&t1>.015;
 };
 let best:NavPoint|null=null,bestScore=Infinity;
 for(const o of obstacles){
  const candidates:NavPoint[]=[
   {x:o.x-o.halfWidth-1.8,z:o.z},{x:o.x+o.halfWidth+1.8,z:o.z},
   {x:o.x,z:o.z-o.halfDepth-1.8},{x:o.x,z:o.z+o.halfDepth+1.8},
  ];
  for(const candidate of candidates){
   if(candidate.x<bounds.minX||candidate.x>bounds.maxX||candidate.z<bounds.minZ||candidate.z>bounds.maxZ)continue;
   if(!blockedLine(candidate,o))continue;
   const route=findGridPath(start,candidate,obstacles,bounds);
   if(!route.length)continue;
   const length=route.reduce((sum,p,i)=>i?sum+Math.hypot(p.x-route[i-1].x,p.z-route[i-1].z):0,0);
   const playerDistance=Math.hypot(candidate.x-player.x,candidate.z-player.z);
   const score=length+Math.max(0,5-playerDistance)*.12;
   if(score<bestScore){bestScore=score;best=candidate;}
  }
 }
 return best;
}
