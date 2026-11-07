export type GameAudio = {
  unlock(): void;
  fire(category:string): void;
  reload(): void;
  impact(): void;
  footstep(intensity:number): void;
  enemyShot(): void;
  setMuted(muted:boolean): void;
  dispose(): void;
};
export function createGameAudio():GameAudio{
  const AudioCtor=window.AudioContext||(window as Window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
  let context:AudioContext|null=null,master:GainNode|null=null,noise:AudioBuffer|null=null,muted=localStorage.getItem('breach-muted')==='true',lastStep=0;
  const ensure=()=>{if(!AudioCtor)return null;if(!context){context=new AudioCtor();master=context.createGain();master.gain.value=muted?0:.48;master.connect(context.destination);const buffer=context.createBuffer(1,Math.floor(context.sampleRate*.5),context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,1.7);noise=buffer;}if(context.state==='suspended')void context.resume();return context;};
  const tone=(frequency:number,duration:number,wave:OscillatorType='triangle',volume=.2,slide=0)=>{const c=ensure();if(!c||!master)return;const osc=c.createOscillator(),gain=c.createGain(),now=c.currentTime;osc.type=wave;osc.frequency.setValueAtTime(frequency,now);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(20,frequency+slide),now+duration);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+duration+.02);};
  const burst=(duration:number,volume:number,filter:number)=>{const c=ensure();if(!c||!master||!noise)return;const source=c.createBufferSource(),low=c.createBiquadFilter(),gain=c.createGain(),now=c.currentTime;source.buffer=noise;low.type='lowpass';low.frequency.value=filter;gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);source.connect(low);low.connect(gain);gain.connect(master);source.start(now);source.stop(now+duration);};
  return{
    unlock(){ensure();},
    fire(category){if(category==='shotgun'){for(let i=0;i<3;i++)tone(85+i*17,.11,'sawtooth',.13,-45);burst(.2,.36,950);}else if(category==='marksman'||category==='battle'){tone(125,.12,'sawtooth',.26,-75);burst(.13,.32,1250);}else if(category==='sidearm'){tone(155,.075,'square',.16,-70);burst(.1,.22,1500);}else{tone(105,.075,'sawtooth',.18,-55);burst(.12,.23,1100);}},
    reload(){tone(640,.035,'square',.08,-350);setTimeout(()=>tone(390,.05,'square',.09,-120),170);setTimeout(()=>tone(720,.045,'square',.07,-280),510);},
    impact(){tone(75,.09,'triangle',.13,-45);burst(.09,.14,480);},
    footstep(intensity){const now=performance.now();if(now-lastStep<115)return;lastStep=now;burst(.045,.055*intensity,260);tone(68,.035,'sine',.045,-18);},
    enemyShot(){tone(78,.08,'sawtooth',.09,-38);burst(.1,.12,600);},
    setMuted(value){muted=value;if(master)master.gain.setTargetAtTime(muted?0:.48,context?.currentTime||0,.025);},
    dispose(){if(context){void context.close();context=null;master=null;noise=null;}}
  };
}
