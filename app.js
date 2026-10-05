import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

const ERA = [
  { name:'史前与古代', range:'— 500', from:-9999, to:500 },
  { name:'中世纪', range:'500 — 1400', from:501, to:1400 },
  { name:'文艺复兴', range:'1400 — 1600', from:1401, to:1600 },
  { name:'巴洛克', range:'1600 — 1750', from:1601, to:1750 },
  { name:'古典与浪漫', range:'1750 — 1900', from:1751, to:1900 },
  { name:'现代之声', range:'1900 — 1945', from:1901, to:1945 },
  { name:'战后新声', range:'1945 — 1960', from:1946, to:1960 },
  { name:'摇滚与电声', range:'1960 — 1980', from:1961, to:1980 },
  { name:'数字与全球化', range:'1980 — 2000', from:1981, to:2000 },
  { name:'当代多元', range:'2000 — 2025', from:2001, to:2025 },
];
const CATEGORIES = [
  {id:'roots',label:'民间与地域',color:'#dfa96f'},
  {id:'classical',label:'古典音乐',color:'#bea9e2'},
  {id:'jazz',label:'爵士',color:'#76b4c7'},
  {id:'blues',label:'布鲁斯 / 灵魂',color:'#e58b6c'},
  {id:'rock',label:'摇滚 / 金属',color:'#df7481'},
  {id:'electronic',label:'电子 / 舞曲',color:'#65c7bd'},
  {id:'hiphop',label:'嘻哈 / R&B',color:'#ad91db'},
  {id:'pop',label:'流行',color:'#e9c17f'},
  {id:'experimental',label:'实验声音',color:'#a2aaa3'},
];
const ERA_COLORS = ['#d9b282','#cfac8c','#bca9bb','#a9a8ca','#99afcb','#86bac7','#79c0af','#9ab985','#c1ad79','#d69876'];
const YEAR_OVERRIDES = {
  'ancient music':-1500,'ancient greek music':-700,'ancient roman music':-100,'medieval music':1000,'gregorian chant':900,
  'renaissance music':1500,'baroque music':1680,'classical music':1780,'romantic music':1840,'romantic period':1840,
  'impressionism':1890,'opera':1600,'symphony':1750,'ragtime':1895,'blues':1890,'delta blues':1900,'jazz':1915,
  'swing':1935,'bebop':1944,'rock and roll':1954,'rock':1958,'rhythm and blues':1948,'soul':1958,'funk':1965,
  'country':1920,'rockabilly':1954,'doo-wop':1950,'reggae':1968,'ska':1960,'hip hop':1973,'rap':1979,
  'disco':1974,'punk rock':1976,'heavy metal':1970,'house':1982,'techno':1984,'ambient music':1978,
  'drum and bass':1992,'jungle':1991,'trance':1992,'grunge':1991,'dubstep':2002,'trap':2008,'drill':2012,
  'hyperpop':2018,'vaporwave':2010,'amapiano':2012,'afrobeats':2000,'afrobeat':1968,'reggaeton':1990,
  'cumbia':1950,'salsa':1965,'bossa nova':1958,'flamenco':1850,'fado':1850,'folk music':1850,
};
const ADDITIONAL_YEARS = {
  'ambient music':1970,'drone music':1960,'downtempo':1990,'trip hop':1994,'lo-fi':1980,'lo-fi hip hop':2010,
  'jungle':1991,'drum and bass':1992,'liquid funk':1997,'garage':1992,'uk garage':1995,'speed garage':1996,
  'bass music':1990,'uk bass':2000,'future bass':2010,'chicago house':1984,'detroit techno':1981,'minimal techno':1990,
  'tech house':1995,'progressive house':1990,'progressive trance':1995,'goa trance':1990,'psytrance':1990,
  'hard trance':1990,'hardstyle':1999,'hardcore techno':1990,'gabber':1990,'industrial techno':1989,
  'electro house':2002,'electroclash':1999,'glitch':1990,'noise music':1913,'experimental electronic':1950,
  'dark ambient':1980,'minimal wave':1978,'witch house':2009,'future garage':2009,'nightcore':2000,
  'phonk':2010,'old school hip hop':1980,'golden age hip hop':1986,'gangsta rap':1985,'conscious hip hop':1987,
  'cloud rap':2010,'southern hip hop':1990,'west coast hip hop':1980,'east coast hip hop':1980,'mumble rap':2010,
  'jersey club':2002,'dub reggae':1970,'dancehall':1978,'rocksteady':1966,'roots reggae':1968,'soca':1970,
  'calypso':1910,'reggaeton':1990,'merengue':1850,'son':1900,'rumba':1930,'samba rock':1950,'mpb':1966,
  'sertanejo':1929,'baile funk':1989,'funk carioca':1989,'kizomba':1984,'zouk':1979,'soukous':1940,
  'highlife':1920,'juju':1920,'kwaito':1990,'mbalax':1970,'coupé-décalé':2002,'ghazal':1850,
  'carnatic music':1500,'hindustani music':1500,'raga rock':1965,'arabic pop':1950,'persian pop':1950,
  "rai'n'b":2000,'worldbeat':1980,'ethnic electronica':1990,'country pop':1950,'country rap':1980,
  'western swing':1930,
};
const CORE = new Set(Object.keys(YEAR_OVERRIDES));
const $ = (s) => document.querySelector(s);
const canvas = $('#atlas'), tooltip = $('#tooltip');
const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio || 1,1.8));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.13;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b1115');
scene.fog = new THREE.FogExp2('#0b1115',0.0026);
const camera = new THREE.PerspectiveCamera(47,innerWidth/innerHeight,.1,1000);
camera.position.set(142,116,182);
const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,55,0); controls.enableDamping=true; controls.dampingFactor=.065;
controls.rotateSpeed=.52; controls.zoomSpeed=.72; controls.panSpeed=.65; controls.minDistance=35; controls.maxDistance=320;
scene.add(new THREE.HemisphereLight('#d5e4d9','#182022',1.55));
const keyLight = new THREE.DirectionalLight('#f3d6b5',2.3); keyLight.position.set(48,120,75); scene.add(keyLight);
const rimLight = new THREE.PointLight('#70bec4',270,240,2); rimLight.position.set(-52,75,-62); scene.add(rimLight);
const warmLight = new THREE.PointLight('#d69d6d',230,210,2); warmLight.position.set(45,18,50); scene.add(warmLight);
const world = new THREE.Group(); scene.add(world);
const nodeMeshes = [], nodeByName = new Map(), edges = [], edgeLines = [];
const activeCategories = new Set(CATEGORIES.map(c=>c.id));
let selected = null, hovered = null, searchTerm = '', noticeTimer, ready = false;
const raycaster = new THREE.Raycaster(); raycaster.params.Points.threshold=.5;
const mouse = new THREE.Vector2(2,2);

function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
function categoryOf(name){
  const n=name.toLowerCase();
  if(/^(ancient|medieval|renaissance|baroque|classical|romantic|opera|symph|sonata|concerto|cantata|motet|madrigal|oratorio|requiem|chamber music|western classical|art music|sacred|liturgical|gregorian|plainsong|organum|fugue|minimalism|impressionism)/.test(n)) return 'classical';
  if(/trip hop|hip.?hop|rap|trap|drill|grime|phonk|boom bap|jersey club/.test(n)) return 'hiphop';
  if(/baile funk|funk carioca|mpb|sertanejo|kizomba|zouk|soukous|highlife|juju|kwaito|mbalax|coupé-décalé|ghazal|carnatic|hindustani|raga|arabic|persian|rai'n'b|worldbeat|alt-country|western swing|country|\bson\b|rumba/.test(n)) return 'roots';
  if(/liquid funk|bass music|uk bass|speed garage|downtempo|future bass|dark ambient|minimal wave|witch house|future garage|nightcore|electroclash|glitch|noise|drone/.test(n)) return /noise|drone|experimental/.test(n)?'experimental':'electronic';
  if(/jazz|bebop|swing|ragtime|dixieland|big band|fusion/.test(n)) return 'jazz';
  if(/blues|soul|funk|gospel|r&b|rhythm and blues|doo-wop|motown/.test(n)) return 'blues';
  if(/metal|rock|punk|grunge|shoegaze|emo|post-hardcore|britpop|rockabilly/.test(n)) return 'rock';
  if(/electro|electronic|techno|house|trance|ambient|idm|drum and bass|jungle|dubstep|breakbeat|disco|synth|wave|rave|chiptune|glitch|edm|garage|dance|industrial|vaporwave|new age|noise|drone/.test(n)) return /noise|drone|experimental|avant|acousmatic|musique concrète/.test(n)?'experimental':'electronic';
  if(/pop|schlager|cantopop|mandopop/.test(n)) return 'pop';
  if(/folk|traditional|world|regional|african|arabic|celtic|chinese|indian|japanese|korean|brazilian|latin|mexican|flamenco|fado|samba|salsa|cumbia|tango|reggae|ska|calypso|zouk|gamelan|qawwali|raï|raga|country|americana|bluegrass|ethno|spiritual|chant|roots|baile|soukous|highlife|bhangra/.test(n)) return 'roots';
  if(/avant|experimental|noise|acousmatic|sound art|musique concrète|spoken word|drone/.test(n)) return 'experimental';
  return 'pop';
}
function estimateYear(name,index){
  const n=name.toLowerCase();
  if(Object.hasOwn(YEAR_OVERRIDES,n)) return YEAR_OVERRIDES[n];
  if(Object.hasOwn(ADDITIONAL_YEARS,n)) return ADDITIONAL_YEARS[n];
  if(/prehistoric|ancient|archaic/.test(n)) return -900 + Math.round(hash(n)*500);
  if(/medieval|gregorian|plainsong|troubadour|trouvère|ars antiqua|ars nova|organum|byzantine chant/.test(n)) return 900 + Math.round(hash(n)*500);
  if(/renaissance/.test(n)) return 1450 + Math.round(hash(n)*130);
  if(/baroque|opera|oratorio|madrigal/.test(n)) return 1600 + Math.round(hash(n)*175);
  if(/classical|romantic|symphony|symphonic|sonata|concerto|requiem|chamber music|motet|cantata|fugue|suite|ballet music/.test(n)) return 1750 + Math.round(hash(n)*145);
  if(/ragtime|blues|jazz|country|folk|gospel|tango|fado|flamenco|ragga|calypso|samba|ranchera|mariachi|bluegrass/.test(n)) return 1890 + Math.round(hash(n)*55);
  if(/doo-wop|rock and roll|rockabilly|rocksteady|ska|rhythm and blues|soul|bebop|swing/.test(n)) return 1945 + Math.round(hash(n)*20);
  if(/rock|metal|punk|disco|funk|reggae|hip.?hop|rap|synth|ambient|house|techno|new wave|electro|dancehall/.test(n)) return 1965 + Math.round(hash(n)*30);
  if(/trap|drill|dubstep|grime|vaporwave|hyperpop|phonk|bedroom|future bass|amapiano|afroswing|nightcore|digicore/.test(n)) return 2000 + Math.round(hash(n)*25);
  return 1900 + Math.round(hash(`${n}:${index}`)*105);
}
function eraIndex(year){const found=ERA.findIndex(e=>year<=e.to);return Math.max(0,found<0?9:found)}
function category(id){return CATEGORIES.find(c=>c.id===id)}
function color3(hex){return new THREE.Color(hex)}
function showToast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('show'),1900)}
function makeStars(){
  const geo=new THREE.BufferGeometry(),p=[];for(let i=0;i<1450;i++){const r=120+Math.random()*260,a=Math.random()*Math.PI*2,y=(Math.random()-.05)*160;p.push(Math.cos(a)*r,y,Math.sin(a)*r)}
  geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  const sprite=document.createElement('canvas');sprite.width=sprite.height=32;const ctx=sprite.getContext('2d');const glow=ctx.createRadialGradient(16,16,0,16,16,16);glow.addColorStop(0,'rgba(224,235,225,1)');glow.addColorStop(.22,'rgba(201,219,208,.72)');glow.addColorStop(1,'rgba(183,204,192,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,32,32);
  const texture=new THREE.CanvasTexture(sprite);texture.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.PointsMaterial({color:'#d6e3d8',map:texture,size:1.05,transparent:true,opacity:.5,alphaTest:.025,depthWrite:false,sizeAttenuation:true});scene.add(new THREE.Points(geo,mat));
}
function buildFilters(){
  const holder=$('#categoryFilters');holder.innerHTML='';
  CATEGORIES.forEach(cat=>{const b=document.createElement('button');b.className='cat-option';b.dataset.category=cat.id;b.innerHTML=`<i class="cat-swatch" style="color:${cat.color};background:${cat.color}"></i><span>${cat.label}</span>`;b.addEventListener('click',()=>{if(activeCategories.has(cat.id))activeCategories.delete(cat.id);else activeCategories.add(cat.id);b.classList.toggle('off',!activeCategories.has(cat.id));applyVisibility()});holder.append(b)});
}
function buildTimeline(){
  const holder=$('#timeline');holder.innerHTML='';ERA.forEach((era,i)=>{const b=document.createElement('button');b.className='era-marker';b.dataset.era=i;b.innerHTML=`<span class="era-date">${era.range}</span><span class="era-name">${era.name}</span>`;b.addEventListener('click',()=>focusEra(i));holder.append(b)});
}
function makeEraDiscs(nodes){
  const counts=ERA.map((_,i)=>nodes.filter(n=>n.era===i).length);
  ERA.forEach((era,i)=>{
    const y=i*12.2,radius=26+Math.sqrt(counts[i])*0.16;
    const disc=new THREE.Group();disc.position.y=y;world.add(disc);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.035,4,180),new THREE.MeshBasicMaterial({color:ERA_COLORS[i],transparent:true,opacity:.45,depthWrite:false}));
    ring.rotation.x=Math.PI/2;disc.add(ring);
    const inner=new THREE.Mesh(new THREE.TorusGeometry(radius-1.15,.012,3,180),new THREE.MeshBasicMaterial({color:ERA_COLORS[i],transparent:true,opacity:.18,depthWrite:false}));inner.rotation.x=Math.PI/2;disc.add(inner);
  });
  const axis=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,112,8),new THREE.MeshBasicMaterial({color:'#9fb6aa',transparent:true,opacity:.18}));axis.position.y=55;world.add(axis);
  const center=new THREE.Mesh(new THREE.CylinderGeometry(3,3,112,48,1,true),new THREE.MeshBasicMaterial({color:'#9fb6aa',side:THREE.DoubleSide,transparent:true,opacity:.018,depthWrite:false}));center.position.y=55;world.add(center);
}
function layoutNodes(nodes){
  const groups=ERA.map((_,i)=>nodes.filter(n=>n.era===i));
  groups.forEach((group,era)=>{
    group.sort((a,b)=>a.year-b.year || a.name.localeCompare(b.name));
    const total=group.length,offset=(era%2)*.13;
    group.forEach((n,i)=>{
      const seed=hash(n.name), golden=2.3999632297;
      const angle=i*golden+offset+seed*.22;
      const inner=8.4,outer=24.8;
      const radial=inner+Math.sqrt((i+.5)/Math.max(1,total))*(outer-inner)+(seed-.5)*1.2;
      n.position=new THREE.Vector3(Math.cos(angle)*radial,era*12.2+(seed-.5)*.75,Math.sin(angle)*radial);
    });
  });
}
function addNodes(nodes){
  layoutNodes(nodes);makeEraDiscs(nodes);
  const sphere=new THREE.SphereGeometry(1,14,12),materials=new Map();
  CATEGORIES.forEach(c=>materials.set(c.id,new THREE.MeshStandardMaterial({color:c.color,emissive:c.color,emissiveIntensity:.14,roughness:.3,metalness:.17,transparent:false})));
  nodes.forEach((n,index)=>{
    const cat=category(n.category),core=CORE.has(n.name.toLowerCase()),radius=core ? .34 : .21+(hash(n.name)*.045);
    const mesh=new THREE.Mesh(sphere,materials.get(cat.id).clone());mesh.position.copy(n.position);mesh.scale.setScalar(0);mesh.userData.node=n;mesh.userData.baseScale=radius;mesh.userData.baseEmissive=color3(cat.color);mesh.userData.pulse=0;
    n.mesh=mesh;n.index=index;n.core=core;world.add(mesh);nodeMeshes.push(mesh);nodeByName.set(n.name.toLowerCase(),n);
  });
}
function addEdges(raw){
  raw.forEach(row=>{const from=nodeByName.get(row.from.toLowerCase()),to=nodeByName.get(row.to.toLowerCase());if(!from||!to||from===to)return;const item={from,to,kind:row.kind,visible:true};edges.push(item);
    const curve=new THREE.QuadraticBezierCurve3(from.position,new THREE.Vector3((from.position.x+to.position.x)*.5,(from.position.y+to.position.y)*.5+1.8,(from.position.z+to.position.z)*.5),to.position);
    const auxiliary=row.kind==='同类关联';
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),new THREE.LineBasicMaterial({color:auxiliary?'#78928a':'#d2ad86',transparent:true,opacity:auxiliary?.105:.24,depthWrite:false}));line.userData.edge=item;line.renderOrder=1;line.frustumCulled=false;world.add(line);edgeLines.push(line);
  });
}
function completeRelationCoverage(nodes,raw){
  const valid=raw.filter(row=>nodeByName.has(row.from.toLowerCase())&&nodeByName.has(row.to.toLowerCase())&&row.from.toLowerCase()!==row.to.toLowerCase());
  const sameFamilyLinked=new Set();
  valid.forEach(row=>{
    const from=nodeByName.get(row.from.toLowerCase()),to=nodeByName.get(row.to.toLowerCase());
    if(from.category===to.category){sameFamilyLinked.add(from.name.toLowerCase());sameFamilyLinked.add(to.name.toLowerCase())}
  });
  const pending=new Set(nodes.filter(n=>!sameFamilyLinked.has(n.name.toLowerCase())));
  const byCategory=new Map(CATEGORIES.map(c=>[c.id,nodes.filter(n=>n.category===c.id)]));
  const covered=[...valid];
  while(pending.size){
    const node=pending.values().next().value;
    const sameFamily=(byCategory.get(node.category)||[]).filter(other=>other!==node);
    const pendingPeers=sameFamily.filter(other=>pending.has(other));
    const peer=(pendingPeers.length?pendingPeers:sameFamily.length?sameFamily:nodes.filter(other=>other!==node))
      .sort((a,b)=>Math.abs(a.year-node.year)-Math.abs(b.year-node.year)||a.name.localeCompare(b.name))[0];
    if(!peer){pending.delete(node);continue}
    const [from,to]=node.year<=peer.year?[node,peer]:[peer,node];
    covered.push({from:from.name,to:to.name,kind:'同类关联'});
    sameFamilyLinked.add(node.name.toLowerCase());sameFamilyLinked.add(peer.name.toLowerCase());
    pending.delete(node);pending.delete(peer);
  }
  return covered;
}
function setSelected(n){
  selected=n; if(!n)return;
  $('#detailName').textContent=n.name;$('#detailName').style.fontFamily=/^[\x00-\x7F]*$/.test(n.name)?"'Playfair Display',serif":"'Noto Sans SC',sans-serif";
  $('#detailCategory').textContent=category(n.category).label;$('#detailCategory').style.color=category(n.category).color;$('#detailCategory').style.borderColor=`${category(n.category).color}66`;
  $('#detailYear').textContent=`约 ${n.year<0?`${Math.abs(n.year)} BCE`:n.year}`;$('#detailEra').textContent=ERA[n.era].name;$('#detailFamily').textContent=category(n.category).label;
  $('#detailSub').textContent=n.core?'从它的声音向外，看看流派如何交汇。':'一条被声音标记的路径。年代为近似估算。';
  const list=$('#relations');list.innerHTML='';const connected=edges.filter(e=>e.from===n||e.to===n);
  $('#relationCount').textContent=`${connected.length.toString().padStart(2,'0')} ECHOES`;
  if(!connected.length){list.innerHTML='<span class="empty-rel">此节点暂无线索。</span>'}
  connected.slice(0,12).forEach(e=>{const other=e.from===n?e.to:e.from;const b=document.createElement('button');b.className='relation-chip';b.innerHTML=`${other.name}<span>${e.kind}</span>`;b.addEventListener('click',()=>focusNode(other));list.append(b)});
  const orbit=$('#detailOrbit');orbit.style.setProperty('--node-color',category(n.category).color);orbit.querySelector('b').style.color=category(n.category).color;
  $('#mapEra').textContent=ERA[n.era].name;$('#mapYear').textContent=ERA[n.era].range;
  document.querySelectorAll('.era-marker').forEach((b,i)=>b.classList.toggle('active',i===n.era));
}
function applyVisibility(){
  let count=0;for(const m of nodeMeshes){const n=m.userData.node;const catOn=activeCategories.has(n.category);m.visible=catOn; if(catOn)count++;}
  $('#visibleCount').textContent=`${count} / ${nodeMeshes.length}`;
  edgeLines.forEach(l=>{const e=l.userData.edge;l.visible=e.from.mesh.visible&&e.to.mesh.visible});
}
function focusNode(n){
  if(!n)return;for(const m of nodeMeshes){const other=m.userData.node;m.material.emissiveIntensity=other===n?.72:((edges.some(e=>(e.from===n&&e.to===other)||(e.to===n&&e.from===other)))?.31:.12)}
  n.mesh.visible=true;setSelected(n);camera.position.lerp(new THREE.Vector3(n.position.x+34,n.position.y+20,n.position.z+46),.42);controls.target.lerp(n.position,.46);controls.update();
  if(!activeCategories.has(n.category)){activeCategories.add(n.category);document.querySelector(`[data-category="${n.category}"]`)?.classList.remove('off');applyVisibility()}
}
function focusEra(i,updateActive=true){
  i=Math.max(0,Math.min(9,i));if(updateActive)document.querySelectorAll('.era-marker').forEach((b,j)=>b.classList.toggle('active',i===j));
  $('#mapEra').textContent=ERA[i].name;$('#mapYear').textContent=ERA[i].range;
  const y=i*12.2;camera.position.lerp(new THREE.Vector3(74,y+25,92),.15);controls.target.lerp(new THREE.Vector3(0,y,0),.2);controls.update();
}
function updateTooltip(){
  if(!ready)return;
  raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects(nodeMeshes.filter(m=>m.visible),false);const first=hits.find(h=>h.object.userData.node);
  if(first){const n=first.object.userData.node;hovered=n;tooltip.style.display='block';tooltip.style.left=`${Math.min(innerWidth-245,mouse.clientX+14)}px`;tooltip.style.top=`${Math.min(innerHeight-65,mouse.clientY+14)}px`;tooltip.innerHTML=`${escapeHtml(n.name)}<small>≈ ${n.year<0?`${Math.abs(n.year)} BCE`:n.year} · ${ERA[n.era].name}</small>`;renderer.domElement.style.cursor='pointer'}
  else {hovered=null;tooltip.style.display='none';renderer.domElement.style.cursor='grab'}
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function bindUI(){
  $('#resetView').addEventListener('click',()=>{camera.position.set(142,116,182);controls.target.set(0,55,0);controls.update();showToast('视角已重置')});
  $('#helpBtn').addEventListener('click',()=>$('#helpPopover').hidden=!$('#helpPopover').hidden);$('#closeHelp').addEventListener('click',()=>$('#helpPopover').hidden=true);
  $('#clearSelection').addEventListener('click',()=>{selected=null;$('#detailName').textContent='沿着声音\n开始探索';$('#detailSub').textContent='点击任意光点，打开流派档案。';$('#relations').innerHTML='<span class="empty-rel">选择一个节点查看示意关系</span>';$('#detailYear').textContent='—';$('#detailEra').textContent='—';$('#detailFamily').textContent='—'});
  $('#search').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.currentTarget.value.trim().toLowerCase();if(!q)return;const matches=[...nodeByName.values()].filter(n=>n.name.toLowerCase().includes(q));if(matches.length){focusNode(matches[0]);showToast(matches.length>1?`找到 ${matches.length} 个流派 · 已定位第一个`:'已定位流派')}else showToast('没有找到这个流派')}});
  $('#search').addEventListener('input',e=>{searchTerm=e.currentTarget.value.trim().toLowerCase();if(searchTerm){for(const m of nodeMeshes){const n=m.userData.node;const hit=n.name.toLowerCase().includes(searchTerm);m.material.emissiveIntensity=hit?.55:.045}}else nodeMeshes.forEach(m=>m.material.emissiveIntensity=.14)});
  canvas.addEventListener('pointermove',e=>{mouse.x=(e.clientX/innerWidth)*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;mouse.clientX=e.clientX;mouse.clientY=e.clientY;updateTooltip()});
  canvas.addEventListener('pointerleave',()=>{tooltip.style.display='none';hovered=null});
  canvas.addEventListener('click',e=>{if(!hovered)return;focusNode(hovered)});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#helpPopover').hidden)$('#helpPopover').hidden=true});
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8))});
}
function animate(){requestAnimationFrame(animate);controls.update();updateTooltip();renderer.render(scene,camera)}
async function initialize(){
  try{
    const [baseText,selectedText,additionalText,relationData]=await Promise.all([
      fetch('./data/catalog-a-c.txt').then(r=>{if(!r.ok)throw Error('catalog');return r.text()}),
      fetch('./data/selected.txt').then(r=>{if(!r.ok)throw Error('selected');return r.text()}),
      fetch('./data/additional.txt').then(r=>{if(!r.ok)throw Error('additional');return r.text()}),
      fetch('./data/relations.json').then(r=>{if(!r.ok)throw Error('relations');return r.json()}),
    ]);
    const curated=[...new Map(selectedText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(name=>[name.toLowerCase(),name])).values()].slice(0,240);
    const base=baseText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const unique=[...new Map([...curated,...base].map(name=>[name.toLowerCase(),name])).values()];
    const baseline=unique.slice(0,520),baselineNames=new Set(baseline.map(name=>name.toLowerCase()));
    const additions=[...new Map(additionalText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(name=>[name.toLowerCase(),name])).values()].filter(name=>!baselineNames.has(name.toLowerCase())).slice(0,100);
    const names=[...baseline,...additions];
    if(names.length<620)throw Error('流派资料不足 620 条');
    const nodes=names.map((name,index)=>{const year=estimateYear(name,index),cat=categoryOf(name);return{name,year,era:eraIndex(year),category:cat}});
    addNodes(nodes);const completeRelations=completeRelationCoverage(nodes,relationData);addEdges(completeRelations);buildFilters();buildTimeline();makeStars();bindUI();
    const selectedDefault=nodeByName.get('jazz')||nodeByName.get('blues')||nodes[0];
    $('#nodeCount').textContent=`${nodes.length} 个流派节点`;$('#visibleCount').textContent=`${nodes.length} / ${nodes.length}`;$('#relationCoverage').textContent=`${nodes.length} / ${nodes.length} 节点已连线 · ${completeRelations.length} 条关联`;
    for(const m of nodeMeshes){m.visible=true;m.scale.setScalar(m.userData.baseScale)}
    if(selectedDefault)setSelected(selectedDefault);
    ready=true;requestAnimationFrame(animate);
  }catch(error){console.error(error);$('#nodeCount').textContent=`资料载入失败：${error.message}`;showToast('请通过本地网页服务器打开项目（查看 README）')}
}
initialize();
