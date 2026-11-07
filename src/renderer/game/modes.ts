export type GameModeId='tdm'|'ffa'|'domination'|'training'|'duel';
export type TeamId='alpha'|'bravo'|'free';
export type MatchPhase='warmup'|'active'|'overtime'|'complete';
export type PlayerScore={id:string;team:TeamId;kills:number;deaths:number;score:number;alive:boolean};
export type Objective={id:string;owner:TeamId|null;progress:number;capturing:TeamId|null};
export type ModeConfig={id:GameModeId;label:string;durationSeconds:number;targetScore:number;teams:boolean;objectives:number;};
export const MODES:Readonly<Record<GameModeId,ModeConfig>>={
 tdm:{id:'tdm',label:'Team Deathmatch',durationSeconds:300,targetScore:50,teams:true,objectives:0},
 ffa:{id:'ffa',label:'Free for All',durationSeconds:300,targetScore:25,teams:false,objectives:0},
 domination:{id:'domination',label:'Domination',durationSeconds:480,targetScore:100,teams:true,objectives:3},
 training:{id:'training',label:'Training',durationSeconds:0,targetScore:0,teams:false,objectives:0},
 duel:{id:'duel',label:'1v1 Duel',durationSeconds:300,targetScore:15,teams:false,objectives:0}
};
export type MatchState={mode:GameModeId;phase:MatchPhase;remaining:number;scores:Record<TeamId,number>;players:PlayerScore[];objectives:Objective[];winner:TeamId|null;};
export function createMatch(mode:GameModeId,players:PlayerScore[]):MatchState{
 const config=MODES[mode];
 if(mode==='duel'&&players.length!==2)throw new Error('A duel requires exactly two players.');
 if(mode!=='training'&&players.length<2)throw new Error('A match requires at least two players.');
 if(config.teams&&players.some(p=>p.team==='free'))throw new Error('Team modes require Alpha or Bravo assignments.');
 if(!config.teams&&players.some(p=>p.team!=='free'))throw new Error('Free modes require free-agent assignments.');
 return {mode,phase:mode==='training'?'active':'warmup',remaining:config.durationSeconds,scores:{alpha:0,bravo:0,free:0},players:players.map(p=>({...p,kills:0,deaths:0,score:0,alive:true})),objectives:Array.from({length:config.objectives},(_,i)=>({id:String.fromCharCode(65+i),owner:null,progress:0,capturing:null})),winner:null};
}
export function startMatch(s:MatchState):MatchState{return s.phase!=='warmup'?s:{...s,phase:'active'};}
export function recordElimination(s:MatchState,killerId:string,victimId:string):MatchState{
 if(s.phase!=='active'&&s.phase!=='overtime')return s;
 const killer=s.players.find(p=>p.id===killerId),victim=s.players.find(p=>p.id===victimId);
 if(!killer||!victim||killer.id===victim.id||!victim.alive)return s;
 const players=s.players.map(p=>p.id===killerId?{...p,kills:p.kills+1,score:p.score+100}:p.id===victimId?{...p,deaths:p.deaths+1,alive:false}:p);
 const scores={...s.scores};scores[killer.team]+=1;
 const next={...s,players,scores};
 return evaluate(next);
}
export function respawnPlayer(s:MatchState,id:string):MatchState{return {...s,players:s.players.map(p=>p.id===id?{...p,alive:true}:p)};}
export function captureObjective(s:MatchState,id:string,team:TeamId,amount:number):MatchState{
 if(s.mode!=='domination'||(s.phase!=='active'&&s.phase!=='overtime')||team==='free'||!Number.isFinite(amount)||amount<=0)return s;
 const objectives=s.objectives.map(o=>{if(o.id!==id)return o;const progress=o.capturing===team?Math.min(100,o.progress+amount):amount;return { ...o,capturing:team,progress,owner:progress>=100?team:o.owner};});
 return {...s,objectives};
}
export function tickMatch(s:MatchState,seconds=1):MatchState{
 if(s.phase!=='active'&&s.phase!=='overtime')return s;
 if(!Number.isFinite(seconds)||seconds<=0)return s;
 const remaining=Math.max(0,s.remaining-seconds);
 let scores={...s.scores};
 if(s.mode==='domination')for(const o of s.objectives)if(o.owner)scores[o.owner]+=Math.floor(seconds);
 const next={...s,remaining,scores};
 if(remaining===0){if(s.mode==='domination'&&scores.alpha===scores.bravo)return {...next,phase:'overtime'};return {...next,phase:'complete',winner:winningTeam(next)};}
 return evaluate(next);
}
function winningTeam(s:MatchState):TeamId|null{if(s.mode==='ffa'){const sorted=[...s.players].sort((a,b)=>b.kills-a.kills);return sorted[0]?.team??null;}if(s.scores.alpha===s.scores.bravo)return null;return s.scores.alpha>s.scores.bravo?'alpha':'bravo';}
function evaluate(s:MatchState):MatchState{const c=MODES[s.mode];if(c.targetScore>0){if(s.mode==='ffa'){const p=s.players.find(x=>x.kills>=c.targetScore);if(p)return {...s,phase:'complete',winner:'free'};}else{const team:TeamId=s.scores.alpha>=c.targetScore?'alpha':s.scores.bravo>=c.targetScore?'bravo': 'free';if(team!=='free')return {...s,phase:'complete',winner:team};}}return s;}
