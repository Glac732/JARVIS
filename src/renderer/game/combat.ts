export type WeaponId = 'VKR-7' | 'KX-9' | 'M4A1' | 'S12' | 'DMR-11' | 'P9';
export type WeaponSpec = Readonly<{
  id: WeaponId;
  label: string;
  category: 'assault' | 'battle' | 'marksman' | 'shotgun' | 'sidearm';
  magazine: number;
  reserve: number;
  damage: number;
  fireInterval: number;
  reloadSeconds: number;
  automatic: boolean;
  spread: number;
  range: number;
}>;
export type WeaponState = { magazine: number; reserve: number; reloadingUntil: number };
export const WEAPONS: readonly WeaponSpec[] = [
  {id:'VKR-7',label:'VKR-7',category:'assault',magazine:30,reserve:120,damage:28,fireInterval:.105,reloadSeconds:1.75,automatic:true,spread:.012,range:90},
  {id:'KX-9',label:'KX-9',category:'battle',magazine:24,reserve:96,damage:48,fireInterval:.22,reloadSeconds:2.05,automatic:false,spread:.006,range:120},
  {id:'M4A1',label:'M4A1',category:'assault',magazine:30,reserve:120,damage:25,fireInterval:.085,reloadSeconds:1.65,automatic:true,spread:.014,range:85},
  {id:'S12',label:'S12',category:'shotgun',magazine:8,reserve:40,damage:14,fireInterval:.72,reloadSeconds:2.35,automatic:false,spread:.075,range:24},
  {id:'DMR-11',label:'DMR-11',category:'marksman',magazine:12,reserve:60,damage:62,fireInterval:.38,reloadSeconds:2.15,automatic:false,spread:.003,range:150},
  {id:'P9',label:'P9',category:'sidearm',magazine:15,reserve:75,damage:22,fireInterval:.16,reloadSeconds:1.25,automatic:false,spread:.01,range:55},
] as const;
export type FireResult = {state:WeaponState;fired:boolean;reason:'fired'|'reloading'|'cooldown'|'empty'|'semi-auto-release'};
export function initialWeaponStates():Record<WeaponId,WeaponState>{
  return Object.fromEntries(WEAPONS.map(w=>[w.id,{magazine:w.magazine,reserve:w.reserve,reloadingUntil:0}])) as Record<WeaponId,WeaponState>;
}
export function beginReload(spec:WeaponSpec,state:WeaponState,now:number):WeaponState{
  if(state.reloadingUntil>now||state.magazine>=spec.magazine||state.reserve<=0)return state;
  return {...state,reloadingUntil:now+spec.reloadSeconds};
}
export function settleReload(spec:WeaponSpec,state:WeaponState,now:number):WeaponState{
  if(!state.reloadingUntil||now<state.reloadingUntil)return state;
  const amount=Math.min(spec.magazine-state.magazine,state.reserve);
  return {magazine:state.magazine+amount,reserve:state.reserve-amount,reloadingUntil:0};
}
export function fireRound(spec:WeaponSpec,state:WeaponState,now:number,lastShot:number,triggerPressed:boolean):FireResult{
  if(state.reloadingUntil>now)return {state,fired:false,reason:'reloading'};
  if(now-lastShot<spec.fireInterval)return {state,fired:false,reason:'cooldown'};
  if(!spec.automatic&&!triggerPressed)return {state,fired:false,reason:'semi-auto-release'};
  if(state.magazine<=0)return {state,fired:false,reason:'empty'};
  return {state:{...state,magazine:state.magazine-1},fired:true,reason:'fired'};
}
export type TacticalInput={
  distance:number;visible:boolean;recentlySawTarget:boolean;healthRatio:number;
  underFire:boolean;allyDistance:number;coverDistance:number;aggression:number;
};
export type TacticalAction='patrol'|'advance'|'engage'|'flank'|'seek-cover'|'retreat';
export function chooseTacticalAction(input:TacticalInput):TacticalAction{
  if(input.healthRatio<.28&&(input.underFire||input.distance<9))return 'retreat';
  if(input.underFire&&input.coverDistance<12)return 'seek-cover';
  if(!input.visible){
    if(input.recentlySawTarget)return input.aggression>.65?'flank':'seek-cover';
    return 'patrol';
  }
  if(input.distance<6)return 'flank';
  if(input.distance>26)return 'advance';
  if(input.allyDistance<9&&input.distance<18)return 'engage';
  return input.aggression>.72?'engage':'advance';
}
export function computeAimError(baseSpread:number,movementSpeed:number,isAiming:boolean,isCrouched:boolean):number{
  const movementPenalty=Math.min(.045,movementSpeed*.0045);
  return Math.max(.001,baseSpread+movementPenalty-(isAiming?.004:0)-(isCrouched?.003:0));
}
