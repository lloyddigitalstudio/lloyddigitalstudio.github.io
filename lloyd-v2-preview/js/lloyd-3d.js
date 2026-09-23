import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const mount=document.querySelector('#webgl'), heroCopy=document.querySelector('.copy'), header=document.querySelector('header'), tracker=document.querySelector('.tracker-card');
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x03040a,.035);
const camera=new THREE.PerspectiveCamera(44,innerWidth/innerHeight,.08,120);camera.position.set(0,0,9.2);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;mount.appendChild(renderer.domElement);
const world=new THREE.Group();scene.add(world);
const geo=new THREE.SphereGeometry(2.18,128,128);
const mat=new THREE.MeshPhysicalMaterial({color:0x16073f,roughness:.16,metalness:.18,clearcoat:1,clearcoatRoughness:.08,iridescence:.8,iridescenceIOR:1.5,transmission:.02,emissive:0x12002e,emissiveIntensity:.45});
const sphere=new THREE.Mesh(geo,mat);sphere.position.set(2.65,.02,0);world.add(sphere);
const shell=new THREE.Mesh(new THREE.SphereGeometry(2.24,96,96),new THREE.MeshBasicMaterial({color:0x7ccfff,transparent:true,opacity:.065,side:THREE.BackSide,blending:THREE.AdditiveBlending}));shell.position.copy(sphere.position);world.add(shell);
const aura=new THREE.Mesh(new THREE.SphereGeometry(2.58,64,64),new THREE.MeshBasicMaterial({color:0x6b35ff,transparent:true,opacity:.045,side:THREE.BackSide,blending:THREE.AdditiveBlending}));aura.position.copy(sphere.position);world.add(aura);
scene.add(new THREE.HemisphereLight(0x301060,0x02030a,1.4));
const cyan=new THREE.PointLight(0x7ccfff,135,18,2);cyan.position.set(1,-2.8,3);scene.add(cyan);const violet=new THREE.PointLight(0x8e6cff,170,20,2);violet.position.set(5.3,2.4,3.5);scene.add(violet);const deep=new THREE.PointLight(0x3a0fff,95,14,2);deep.position.set(4,-.8,-2);scene.add(deep);
const ring=new THREE.Mesh(new THREE.TorusGeometry(3.25,.018,8,180),new THREE.MeshBasicMaterial({color:0x7ccfff,transparent:true,opacity:.11}));ring.rotation.x=1.42;ring.rotation.z=.18;ring.position.copy(sphere.position);world.add(ring);
const count=1150,pos=new Float32Array(count*3);for(let i=0;i<count;i++){const r=8+Math.random()*19,a=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r*.62;pos[i*3+2]=(Math.random()-.5)*22}const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));const stars=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9a82ff,size:.015,transparent:true,opacity:.42}));scene.add(stars);
let mx=0,my=0,sy=0;addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});addEventListener('scroll',()=>sy=scrollY,{passive:true});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), mix=(a,b,t)=>a+(b-a)*t;
function tick(t){const vh=innerHeight,p=sy/vh,enter=clamp(p,0,1),inside=clamp((p-.72)/.55,0,1),reveal=clamp((p-1.55)/.7,0,1);
heroCopy.style.opacity=String(1-clamp((p-.18)/.48,0,1));heroCopy.style.transform=`translateY(${-enter*34}px)`;header.style.opacity=String(1-clamp((p-.55)/.35,0,.72));
const targetX=mix(2.65,0,enter);sphere.position.x=targetX;shell.position.x=targetX;aura.position.x=targetX;ring.position.x=targetX;
world.scale.setScalar(mix(1,3.45,enter));world.position.z=mix(0,1.1,inside);mat.emissiveIntensity=mix(.45,1.25,inside);aura.material.opacity=mix(.045,.16,inside);shell.material.opacity=mix(.065,.18,inside);
sphere.rotation.y=t*.000075+mx*.07;sphere.rotation.x=my*.045;ring.rotation.z=.18+t*.000035;stars.rotation.z=t*.000006;
const vanish=inside;world.visible=vanish<.97 || reveal<.1;if(reveal>.02){world.scale.setScalar(mix(3.45,.7,reveal));world.position.x=mix(0,-5.5,reveal);world.position.z=mix(1.1,-5,reveal);aura.material.opacity=mix(.16,.018,reveal)}
camera.position.x+=(mx*.12-camera.position.x)*.025;camera.position.y+=(-my*.09-camera.position.y)*.025;camera.position.z=mix(9.2,6.4,inside);
if(tracker){tracker.style.transform=innerWidth>800?`perspective(900px) rotateY(${-8+mx*2.5}deg) rotateX(${3-my*2}deg) translateY(${(1-reveal)*35}px)`:`translateY(${(1-reveal)*25}px)`;tracker.style.opacity=String(reveal)}
renderer.render(scene,camera);requestAnimationFrame(tick)}requestAnimationFrame(tick);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.65))});
