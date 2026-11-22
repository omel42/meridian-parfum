(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeAsset=value=>typeof value==='string'&&/^assets\/[a-zA-Z0-9_./-]+$/.test(value)&&!value.includes('..')?value:'';
  const config=window.MERIDIAN_EXPERIENCE_CONFIG||{};
  const live=Array.isArray(config.catalog);
  const asset=path=>/^https?:\/\//.test(path||'')?path:(config.base||'')+path;
  const home=(hash='')=>(config.homeUrl||'index.html').split('#')[0]+hash;
  document.querySelectorAll('a[href^="index.html"]').forEach(link=>{link.href=home(link.getAttribute('href').slice('index.html'.length))});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const state={worlds:[],products:[],world:null,chapter:0,elapsed:0,playing:false,started:0,raf:0,film:false,revealed:false,loading:false};
  const duration=24000;
  let statusTimer;
  function announce(text){const node=$('#status-message');clearTimeout(statusTimer);node.textContent=text;node.hidden=false;statusTimer=setTimeout(()=>node.hidden=true,4000)}
  function product(){return state.products.find(p=>p.id===state.world?.productId)}
  function setText(selector,text){$(selector).textContent=String(text||'')}
  function updateURL(){const url=new URL(location.href);url.searchParams.set('world',state.world.id);state.film?url.searchParams.set('film','1'):url.searchParams.delete('film');history.replaceState(null,'',url)}
  function shareURL(){const url=new URL(location.href);url.searchParams.set('world',state.world.id);url.searchParams.delete('film');url.searchParams.delete('v');return url.href}
  function updatePlayback(){
    $('#play-icon').textContent=state.playing?'Ⅱ':state.elapsed>=duration?'↺':'▶';
    $('#play-label').textContent=state.playing?'Пауза':state.elapsed>=duration?'Смотреть ещё раз':state.elapsed>0?'Продолжить историю':'Смотреть 24 секунды';
    $('#play').setAttribute('aria-label',state.playing?'Приостановить историю':state.elapsed>=duration?'Повторить историю':'Воспроизвести историю, 24 секунды');
    $('#film-progress').style.width=`${Math.min(100,state.elapsed/duration*100)}%`;
  }
  function pause(){state.playing=false;cancelAnimationFrame(state.raf);updatePlayback()}
  function syncSceneAccessibility(){
    const scene=$('#scent-scene');
    const productVisible=state.film&&state.chapter===2&&scene.classList.contains('has-product');
    $('#chapter-copy').setAttribute('aria-hidden',String((!state.film&&!scene.classList.contains('is-story'))||productVisible));
    $('#film-product').setAttribute('aria-hidden',String(!productVisible));
  }
  function setChapter(index,{seek=true,forceStory=false}={}){
    state.chapter=Math.max(0,Math.min(2,index));
    if(seek){pause();state.elapsed=state.chapter*8000;updatePlayback()}
    const chapter=state.world.chapters[state.chapter];
    const scene=$('#scent-scene');scene.dataset.chapter=String(state.chapter);scene.classList.toggle('is-story',forceStory||state.elapsed>0||state.playing||state.chapter>0);
    setText('#chapter-label',chapter.label||`ОЩУЩЕНИЕ ${state.chapter+1}`);
    setText('#chapter-title',chapter.title);setText('#chapter-body',chapter.body);
    setText('#film-chapter-counter',`0${state.chapter+1} / 03`);
    $('#chapter-navigation').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===state.chapter)));
    syncSceneAccessibility();
  }
  function tick(now){
    if(!state.playing)return;
    state.elapsed=Math.min(duration,now-state.started);
    const chapter=Math.min(2,Math.floor(state.elapsed/8000));
    if(chapter!==state.chapter)setChapter(chapter,{seek:false});
    updatePlayback();
    if(state.elapsed>=duration){pause();reveal(false);return}
    state.raf=requestAnimationFrame(tick);
  }
  function play(){
    if(state.playing){pause();return}
    if(state.elapsed>=duration)state.elapsed=0;
    state.playing=true;state.started=performance.now()-state.elapsed;
    setChapter(Math.min(2,Math.floor(state.elapsed/8000)),{seek:false});
    $('#scent-scene').classList.add('is-story');updatePlayback();state.raf=requestAnimationFrame(tick);
  }
  function renderIdentity(){
    const p=product(),validImage=typeof p?.image==='string'&&/^https?:\/\//.test(p.image)?p.image:safeAsset(p?.image);
    $('#scent-scene').classList.toggle('has-product',Boolean(p&&validImage));
    $('#reveal').hidden=!p;$('#identity').hidden=!state.revealed||!p;
    $('#film-product').hidden=!p||!validImage;
    syncSceneAccessibility();
    if(!p)return;
    $('.identity-disclaimer').hidden=live;
    setText('#identity-brand',p.brand);setText('#identity-title',p.name);setText('#identity-specs',`${p.concentration||''}${p.volume?' · '+p.volume+' мл':''}${p.family?' / '+p.family:''}`);
    setText('#identity-description',p.description);setText('#identity-price',Number.isFinite(Number(p.price))?new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(Number(p.price)):'Цена уточняется');
    $('#identity-notes').innerHTML=(Array.isArray(p.notes)?p.notes:[]).slice(0,6).map(note=>`<span>${esc(note)}</span>`).join('');
    $('#product-link').href=home(`#product/${encodeURIComponent(p.id)}`);
    $('#identity-image').src=asset(validImage||'assets/icon-green.png');$('#identity-image').alt=`${p.brand} ${p.name}`;
    setText('#film-product-brand',p.brand);setText('#film-product-name',p.name);
    $('#film-product-image').src=asset(validImage||'assets/icon-green.png');$('#film-product-image').alt='';
    setText('#film-product-notes',(Array.isArray(p.notes)?p.notes:[]).slice(0,3).join(' · '));
  }
  function reveal(scroll=true){
    if(!product()){announce('Название и карточка пока недоступны. Образы можно продолжать смотреть.');return}
    state.revealed=true;renderIdentity();
    if(scroll&&!state.film){$('#identity').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});$('#identity-title').setAttribute('tabindex','-1');$('#identity-title').focus({preventScroll:true})}
  }
  function setWorld(id,{syncURL=true}={}){
    const world=state.worlds.find(w=>w.id===id)||state.worlds[0];if(!world)return;
    pause();state.world=world;state.elapsed=0;state.chapter=0;state.revealed=false;
    const index=state.worlds.indexOf(world);setText('#world-number',`0${index+1} / 0${state.worlds.length}`);setText('#world-eyebrow',world.eyebrow);setText('#world-title',world.title);setText('#world-subtitle',world.subtitle);
    document.title=`${world.title.replace(/\n/g,' ')} — Атлас ощущений Меридиана`;
    const scene=$('#scent-scene');scene.classList.remove('is-story');
    for(const name of ['dark','light','accent']){const value=world.palette?.[name];if(typeof value==='string'&&/^#[0-9a-fA-F]{3,8}$/.test(value))scene.style.setProperty('--'+name,value)}
    const image=$('#scene-image');image.alt=`Визуальная ассоциация: ${world.title.replace(/\n/g,' ')}`;image.src=asset(safeAsset(world.image)||'assets/hero-green.png');
    $('#atmosphere').innerHTML=world.atmosphere.slice(0,3).map(word=>`<span>${esc(word)}</span>`).join('');
    $('#chapter-navigation').innerHTML=world.chapters.map((chapter,i)=>`<button type="button" data-chapter="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${esc(chapter.label||`Фаза ${i+1}`)}</button>`).join('');
    $('#world-options').querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.world===world.id)));
    $('#copy-fallback').hidden=true;
    const video=safeAsset(world.video);$('#video-download').hidden=!video;if(video)$('#video-download').href=asset(video);
    setChapter(0,{seek:false});renderIdentity();updatePlayback();if(syncURL)updateURL();
  }
  function setFilm(enabled,{syncURL=true}={}){
    pause();state.film=Boolean(enabled);document.body.classList.toggle('is-film',state.film);
    $('#film-tools').hidden=!state.film;$('#film-toggle').setAttribute('aria-pressed',String(state.film));setText('#film-toggle-label',state.film?'Вернуться к пейзажу':'Кино 9:16');
    if(state.world){setChapter(state.chapter,{seek:false});if(syncURL)updateURL()}
  }
  function renderOptions(){
    $('#world-options').innerHTML=state.worlds.map((world,i)=>`<button type="button" class="world-option" data-world="${esc(world.id)}" aria-pressed="false"><img src="${esc(asset(safeAsset(world.image)||'assets/hero-green.png'))}" alt="" loading="lazy"><span><small>ОЩУЩЕНИЕ 0${i+1}</small><strong>${esc(world.title.replace(/\n/g,' '))}</strong></span><span aria-hidden="true">↗</span></button>`).join('');
  }
  async function copyText(text,message){
    try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);$('#copy-fallback').hidden=true;announce(message)}
    catch{$('#copy-fallback').hidden=false;$('#copy-text').value=text;$('#copy-text').focus();$('#copy-text').select();announce('Текст выделен — скопируй его вручную.')}
  }
  async function load(){
    if(state.loading)return;state.loading=true;$('#loading').hidden=false;$('#load-error').hidden=true;$('#retry').disabled=true;
    try{
      const responses=await Promise.allSettled([fetch(asset('scent-worlds.json'),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}),live?Promise.resolve(config.catalog):fetch(asset('products.json'),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()})]);
      const source=responses[0].status==='fulfilled'?responses[0].value:null;
      if(!Array.isArray(source))throw Error('worlds');
      state.worlds=source.filter(world=>world&&typeof world.id==='string'&&/^[a-z0-9-]+$/.test(world.id)&&typeof world.title==='string'&&Array.isArray(world.chapters)&&world.chapters.length===3&&world.chapters.every(chapter=>chapter&&typeof chapter.title==='string')).map(world=>({...world,atmosphere:Array.isArray(world.atmosphere)?world.atmosphere:[]}));
      if(!state.worlds.length)throw Error('worlds');
      state.products=responses[1].status==='fulfilled'&&Array.isArray(responses[1].value)?responses[1].value.filter(p=>p&&typeof p.id==='string'):[];
      renderOptions();const params=new URLSearchParams(location.search);setFilm(params.get('film')==='1',{syncURL:false});setWorld(params.get('world'),{syncURL:false});
      $('#atlas-content').hidden=false;$('#loading').hidden=true;
      if(!state.products.length)announce('Образы готовы. Карточки ароматов пока не загрузились — можно обновить страницу позже.');
    }catch{$('#loading').hidden=true;$('#load-error').hidden=false}
    finally{state.loading=false;$('#retry').disabled=false}
  }
  $('#retry').addEventListener('click',load);
  $('#play').addEventListener('click',play);
  $('#reveal').addEventListener('click',()=>reveal());
  $('#film-toggle').addEventListener('click',()=>setFilm(!state.film));
  $('#chapter-navigation').addEventListener('click',event=>{const button=event.target.closest('button[data-chapter]');if(button){setChapter(Number(button.dataset.chapter),{forceStory:true})}});
  $('#world-options').addEventListener('click',event=>{const button=event.target.closest('button[data-world]');if(button){setWorld(button.dataset.world);$('#scene-shell').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});const title=state.film?$('#chapter-title'):$('#world-title');title.setAttribute('tabindex','-1');title.focus({preventScroll:true})}});
  $('#share-caption').addEventListener('click',()=>copyText(`${state.world.caption||state.world.subtitle||state.world.title}\n\n${shareURL()}`,'Описание скопировано.'));
  $('#share-link').addEventListener('click',()=>copyText(shareURL(),'Ссылка на это ощущение скопирована.'));
  $('#scene-image').addEventListener('error',()=>{const image=$('#scene-image');if(!image.src.endsWith('/assets/hero-green.png')){image.src=asset('assets/hero-green.png');image.alt='Атмосферная композиция Меридиана';announce('Этот пейзаж пока недоступен. Показываем запасной образ.')}});
  $('#fullscreen').addEventListener('click',async()=>{
    if(!state.film)setFilm(true);pause();state.elapsed=0;setChapter(0,{seek:false});
    try{if(!$('#scene-shell').requestFullscreen)throw Error();await $('#scene-shell').requestFullscreen();play()}
    catch{play();announce('Полный экран недоступен в этом браузере. История проигрывается в вертикальном кадре.')}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement!==$('#scene-shell'))pause()});
  window.addEventListener('pagehide',pause);
  window.addEventListener('popstate',()=>{if(state.worlds.length){const params=new URLSearchParams(location.search);setFilm(params.get('film')==='1',{syncURL:false});setWorld(params.get('world'),{syncURL:false})}});
  load();
})();
