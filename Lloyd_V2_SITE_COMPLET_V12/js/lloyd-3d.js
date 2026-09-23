import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const mount=document.querySelector('#webgl'), heroCopy=document.querySelector('.copy'), header=document.querySelector('header'), brandLogo=document.querySelector('.brand-logo'), tracker=document.querySelector('.tracker-card');
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x02050b,.028);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);camera.position.set(0,0,10);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.25:1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;mount.appendChild(renderer.domElement);
const world=new THREE.Group();scene.add(world);
const uniforms={uTime:{value:0},uEnter:{value:0}};
const sphere=new THREE.Mesh(new THREE.SphereGeometry(2.42,160,160),new THREE.ShaderMaterial({uniforms,transparent:true,vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform float uTime;uniform float uEnter;varying vec3 vN;varying vec3 vP;void main(){vec3 V=normalize(vec3(0.,0.,1.));float fres=pow(1.-abs(dot(vN,V)),2.15);float band=sin(vP.y*3.1+vP.x*1.4+uTime*.38)+sin(vP.x*2.4-vP.z*2.2-uTime*.26);band=smoothstep(.55,1.55,band);float spark=pow(max(0.,sin(vP.x*7.+vP.y*5.+uTime*.2)),18.)*.12;vec3 deep=vec3(.008,.025,.10);vec3 blue=vec3(.02,.48,1.0);vec3 cyan=vec3(.12,.86,1.0);vec3 violet=vec3(.47,.15,1.0);vec3 col=deep+blue*band*.28+mix(cyan,violet,smoothstep(-1.,1.,vP.x))*fres*1.75+spark*cyan;float a=.94;gl_FragColor=vec4(col,a);}` }));
sphere.position.set(2.55,.05,0);world.add(sphere);
const glowMat=new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,vertexShader:`varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 vN;void main(){float f=pow(1.-abs(vN.z),2.4);vec3 c=mix(vec3(.05,.72,1.),vec3(.48,.18,1.),gl_FragCoord.x/1900.);gl_FragColor=vec4(c,f*.34);}`});
const glow=new THREE.Mesh(new THREE.SphereGeometry(2.57,96,96),glowMat);glow.position.copy(sphere.position);world.add(glow);
const ring=new THREE.Mesh(new THREE.TorusGeometry(3.12,.008,6,220),new THREE.MeshBasicMaterial({color:0x5669ff,transparent:true,opacity:.22,blending:THREE.AdditiveBlending}));ring.position.copy(sphere.position);ring.rotation.set(1.33,.18,.18);world.add(ring);
const ring2=ring.clone();ring2.scale.setScalar(1.08);ring2.rotation.set(1.48,-.12,-.24);ring2.material=ring.material.clone();ring2.material.opacity=.09;world.add(ring2);
const count=1250,pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*34;pos[i*3+1]=(Math.random()-.5)*20;pos[i*3+2]=(Math.random()-.5)*24}const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0x7b8cff,size:.012,transparent:true,opacity:.42})));
let mx=0,my=0,sy=0;addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});addEventListener('scroll',()=>sy=scrollY,{passive:true});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
function tick(t){const p=sy/innerHeight, approach=clamp(p/.62,0,1), fade=clamp((p-.18)/.34,0,1), reveal=clamp((p-.52)/.42,0,1);uniforms.uTime.value=t*.001;uniforms.uEnter.value=approach;
heroCopy.style.opacity=String(1-fade);heroCopy.style.transform=`translateY(${-fade*24}px)`;if(brandLogo){const lf=clamp((p-.10)/.28,0,1);brandLogo.style.opacity=String(1-lf);brandLogo.style.transform=`translateY(${-lf*18}px)`}header.style.opacity='1';
const mobile=innerWidth<850, baseX=mobile?0:2.55;baseX;
world.position.x=mix(0,mobile?.18:-.12,approach);world.position.z=mix(0,.34,approach);const s=mix(1,1.12,approach);world.scale.setScalar(s);sphere.position.x=baseX;glow.position.x=baseX;ring.position.x=baseX;ring2.position.x=baseX;
if(reveal>0){world.position.x=mix(world.position.x,mobile?2.2:-4.4,reveal);world.position.z=mix(.34,-2.2,reveal);world.scale.setScalar(mix(1.12,.68,reveal));world.rotation.z=mix(0,.12,reveal)}
sphere.rotation.y=t*.00008+mx*.055;sphere.rotation.x=my*.035;ring.rotation.z=.18+t*.000028;ring2.rotation.z=-.24-t*.000018;
camera.position.x+=(mx*.08-camera.position.x)*.025;camera.position.y+=(-my*.06-camera.position.y)*.025;
if(tracker){tracker.style.opacity=String(reveal);tracker.style.transform=innerWidth>850?`perspective(900px) rotateY(${-7+mx*2}deg) rotateX(${2-my*1.5}deg) translateY(${(1-reveal)*28}px)`:`translateY(${(1-reveal)*24}px)`}
renderer.render(scene,camera);requestAnimationFrame(tick)}requestAnimationFrame(tick);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.25:1.7))});

// V09 — navigation mobile
const menuButton=document.querySelector('.menu');
if(menuButton){
  menuButton.addEventListener('click',()=>{
    const open=header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
  });
  document.querySelectorAll('header nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('menu-open')));
}
