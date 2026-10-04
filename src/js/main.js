import {media, topics, discoveryTopics, districts, subdistricts, placeNotes, gallery, classifyCards, matches, orderSteps, questions, xoQuestions, mountainQuestions} from '../data/duhok-data.js';
import {curriculumIndex} from '../data/curriculum-index.js';
import {iraqLearningGoals, iraqLocation, iraqTerrain, iraqClimate, iraqRainfallOrder, iraqWaterSources, iraqWaterMatches, iraqHistory, iraqUnity} from '../data/iraq-data.js';
import {iraqPages, renderIraqPage, renderIraqChallengeSetup, renderIraqChallenge, iraqMapNote} from './lessons/iraq-pages.js';
import {iraqQuestions} from '../data/iraq-questions.js';
import {AmbienceAudio} from './core/ambience-audio.js';

const app = document.querySelector('#app');
const dialog = document.querySelector('#detail');
const xoDialog = document.querySelector('#xo-question');
const mountainDialog = document.querySelector('#mountain-question');
const stages = ['بوابة دهوك','الخريطة','بطاقات الاكتشاف','صنّف البطاقات','طابق الرموز','رتّب الرحلة','التحدي السريع','تحدي X/O','تسلّق الجبال','جواز الرحلة'];
const fresh = () => ({stage:0, reached:0, earned:new Set(), found:new Set(), packed:new Set(), matched:new Set(), selected:null, match:null, order:[], question:0, answers:{}, skipped:new Set()});
const safeGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
const safeSet = (key,value) => { try { localStorage.setItem(key,value); } catch { /* Offline lesson still works without storage. */ } };
const savedXo = (()=>{try{return JSON.parse(safeGet('iraq-journey-duhok-xo')||'{}');}catch{return {};}})();
const savedAudio = (()=>{try{return JSON.parse(safeGet('iraq-journey-duhok-audio')||'{}');}catch{return {};}})();
const xoTotals = savedXo.totals || {X:{wins:0,points:0},O:{wins:0,points:0},correct:0,wrong:0};
const xoFresh = () => ({started:false,board:Array(9).fill(''),current:'X',selectedCell:null,question:null,used:new Set(),roundPoints:{X:0,O:0},correct:0,wrong:0,feedback:null,pendingMark:false,winner:'',winningLine:[],finished:false,teams:{X:savedXo.names?.X||'الفريق الأول',O:savedXo.names?.O||'الفريق الثاني'}});
const mountainFresh = () => ({started:false,length:10,profile:'varied',current:'A',used:new Set(),lastQuestion:'',question:null,selection:[],feedback:null,pendingMove:false,winner:'',finished:false,teams:{A:{name:'فريق النسور',position:0,points:0,correct:0,wrong:0,streak:0},B:{name:'فريق القمم',position:0,points:0,correct:0,wrong:0,streak:0}}});
let trip = fresh();
let xo = xoFresh();
let mountain = mountainFresh();
let mode = 'index';
let tab = 'overview';
let iraqPage = 0;
let iraqReturnPage = 0;
let iraqGame = null;
let iraqActivity = {neighbor:null, terrain:null, terrainGuess:null, rainfall:[], rainfallFeedback:'', waterCard:null, timeline:null, selectedResource:null, waterMatches:[], waterFeedback:''};
let muted = savedAudio.muted ?? savedXo.muted === true;
let masterVolume = Math.max(0,Math.min(1,Number(savedAudio.volume ?? .3)));
const ambience = new AmbienceAudio({muted,volume:masterVolume});
let audio;
let drag;
let ignoreClickUntil = 0;
let returnFocus;
const icon = (name, cls='') => `<img class="icon ${cls}" src="assets/icons/${name}.svg" alt="" aria-hidden="true">`;
const btn = (action, label, symbol, cls='', extra='') => `<button type="button" class="button ${cls}" data-action="${action}" ${extra}>${symbol?icon(symbol):''}<span>${label}</span></button>`;
const schoolIdentity = () => `<div class="school-watermark" aria-hidden="true"><img src="assets/images/ui/lara-haider-watermark.png" alt=""></div>`;
const schoolLockup = () => `<div class="school-lockup"><img src="assets/images/ui/school-logo.png" alt="شعار مدارس الإمام علي بن أبي طالب ع النموذجية الأهلية" onerror="this.closest('.school-lockup').hidden=true"><span>مدارس الإمام علي بن أبي طالب <b>(ع)</b><small>النموذجية الأهلية</small></span></div>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
function saveXo() { safeSet('iraq-journey-duhok-xo',JSON.stringify({names:xo.teams,totals:xoTotals,muted})); }
function saveAudioPreferences() { safeSet('iraq-journey-duhok-audio',JSON.stringify({muted,volume:masterVolume})); }
const picture = (key, cls='') => {
  const m = media[key];
  return `<figure class="photo ${cls}"><img src="${m.src}" alt="${m.alt}" decoding="async"><figcaption class="fallback" hidden>${icon('mountain')}<span>نتعلّم من البطاقة، والصورة تُضاف لاحقاً</span></figcaption></figure>`;
};
const score = () => trip.earned.size * 10;
function tone(type='click') {
  if(muted) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume().catch(()=>{});
    const frequencies = type==='success' ? [523,659,784] : type==='hint' ? [294,330] : [440];
    frequencies.forEach((frequency,i)=>{
      const o=audio.createOscillator(), g=audio.createGain(), start=audio.currentTime+i*.075;
      o.type='sine'; o.frequency.value=frequency;
      g.gain.setValueAtTime(.0001,start); g.gain.exponentialRampToValueAtTime(.035*masterVolume,start+.012);
      g.gain.exponentialRampToValueAtTime(.0001,start+.13);
      o.connect(g).connect(audio.destination); o.start(start); o.stop(start+.14);
      o.onended=()=>{o.disconnect();g.disconnect();};
    });
  } catch { /* Effects are optional: lesson controls remain available. */ }
}
function earn(key) {
  if(mode!=='journey') return;
  if(!trip.earned.has(key)) trip.earned.add(key);
  tone('success');
  const s=document.querySelector('#score'); if(s)s.textContent=`${score()} نقطة`;
}
function feedback(text, good=false) {
  const el=document.querySelector('#feedback');
  if(el){el.textContent=text;el.className=`feedback ${good?'success':''}`;}
  document.querySelector('#announcer').textContent=text;
  if(!good)tone('hint');
}
function rail() {
  return `<nav class="route" aria-label="محطات الرحلة">${stages.map((name,i)=>`<button class="stop ${i===trip.stage?'current':''} ${i<trip.stage?'past':''}" data-action="station" data-index="${i}" ${i>trip.reached?'disabled':''} ${i===trip.stage?'aria-current="step"':''}><span class="stop-dot">${i<trip.stage?'✓':i+1}</span><span>${name}</span></button>`).join('')}</nav>`;
}
function controls() {
  const effects=btn('sound',muted?'المؤثرات: مكتومة':'المؤثرات: تعمل',muted?'muted':'sound','quiet',`aria-pressed="${muted}"`);
  const volume=`<label class="volume-control" title="مستوى الصوت"><input type="range" min="0" max="100" step="1" value="${Math.round(masterVolume*100)}" data-audio-volume aria-label="مستوى الصوت"></label>`;
  const full=btn('fullscreen',document.fullscreenElement?'إنهاء الملء':'ملء الشاشة','full','quiet');
  if(mode==='iraq')return `<footer class="controls iraq-controls"><div class="iraq-page-nav"><button type="button" data-action="iraq-prev" ${iraqPage===0?'disabled':''}>السابق</button><span>${iraqPage+1} / ${iraqPages.length}</span><button type="button" data-action="iraq-next">${iraqPage===iraqPages.length-1?'الختام':'التالي'}</button></div><div class="iraq-global-nav"><button type="button" data-action="iraq-topics">الموضوعات</button><button type="button" data-action="index">الفهرس</button><button type="button" data-action="fullscreen">${document.fullscreenElement?'إنهاء ملء الشاشة':'ملء الشاشة'}</button><button type="button" class="iraq-challenge-launch" data-action="iraq-game-open">تحدّي الفريقين</button></div></footer>`;
  if(mode==='iraq-challenge')return `<footer class="controls iraq-controls iraq-game-controls"><div><span class="iraq-game-footer-title">تحدّي الفريقين · ${iraqPages[iraqReturnPage]?.title||'وطننا العراق'}</span></div><div class="iraq-global-nav"><button type="button" data-action="iraq-game-exit">خروج إلى الشرح</button><button type="button" data-action="fullscreen">${document.fullscreenElement?'إنهاء ملء الشاشة':'ملء الشاشة'}</button></div></footer>`;
  if(mode!=='journey')return `<footer class="controls floating-controls"><div>${mode==='index'?'':btn('index','فهرس المحتويات','home','primary')}</div><div>${volume}${effects}${full}</div></footer>`;
  return `<footer class="controls floating-controls"><div>${btn('home','الرئيسية','home','quiet')}${btn('back','العودة','arrow','quiet',trip.stage===0?'disabled':'')}${btn('restart','إعادة البداية','reset','quiet')}</div><div class="progress-group"><span>المحطة ${trip.stage+1} من ${stages.length}</span><progress value="${trip.stage+1}" max="${stages.length}" aria-label="تقدّم الرحلة"></progress></div><div>${volume}${effects}${full}${btn('next',trip.stage===stages.length-1?'المحافظة التالية':'التقدّم','arrow','primary next')}</div></footer>`;
}
function render(focus=true) {
  ambience.setScene(mode==='journey'&&trip.stage===8?'mountains':'main');
  if(dialog.open) dialog.close();
  if(xoDialog.open) xoDialog.close();
  if(mountainDialog.open) mountainDialog.close();
  drag?.ghost?.remove(); drag=null;
  const title=mode==='index'?'فهرس مادة الاجتماعيات للصف السادس':mode==='home'?'محافظة دهوك':mode==='explore'?'استكشف دهوك':mode==='iraq'?'وطننا العراق':mode==='iraq-challenge'?'تحدّي الفريقين · وطننا العراق':stages[trip.stage];
  app.innerHTML=`<div class="app-shell ${mode}">${schoolIdentity()}${mode==='index'?indexTopbar():mode==='home'?homeTopbar():mode==='iraq'||mode==='iraq-challenge'?iraqTopbar():`<header class="topbar"><div class="brand">${icon('compass')}<span>رحلة في جغرافية العراق<small>محافظة دهوك · تعلّم، اكتشف، تأمّل</small></span></div>${schoolLockup()}<span class="mode-chip">${mode==='journey'?'مسار الرحلة':'مسار المعلومات'}</span>${mode==='journey'?`<span class="score" id="score">${score()} نقطة</span>`:'<span class="screen-label">دهوك / العراق</span>'}</header>`}${mode==='journey'?rail():''}<main id="screen" tabindex="-1" aria-label="${title}">${mode==='index'?indexPage():mode==='home'?home():mode==='iraq'?iraqUnit():mode==='iraq-challenge'?iraqChallengePage():mode==='explore'?explore():journey()}</main>${controls()}</div>`;
  if(focus)document.querySelector('#screen').focus({preventScroll:true});
}
function indexTopbar() {
  return `<header class="index-topbar">${schoolLockup()}<span class="index-grade">الصف السادس الابتدائي</span></header>`;
}
function indexPage() {
  const entries=curriculumIndex.map((entry,index)=>{
    const active=entry.status==='available';
    return `<button class="index-card ${active?'is-active':'is-upcoming'}" type="button" data-action="curriculum-entry" data-id="${entry.id}" data-route="${entry.route}" ${active?'':'disabled aria-disabled="true"'}><span class="index-card-number">${String(index+1).padStart(2,'0')}</span><span class="index-card-icon">${icon(entry.icon)}</span><span class="index-card-copy"><span class="index-card-status">${active?'متاح الآن':'قريباً'}</span><strong>${entry.title}</strong><small>${entry.description}</small></span><span class="index-card-arrow" aria-hidden="true">←</span></button>`;
  }).join('');
  return `<section class="curriculum-index"><div class="index-heading"><p class="eyebrow">مادة الاجتماعيات</p><h1>فهرس المحتويات</h1><p class="index-unit-label">الوحدة الأولى</p><h2>محافظات وطننا العراق جغرافياً وتاريخياً</h2><p class="index-intro">اختر وحدة للبدء. المحتوى المتاح الآن هو وطننا العراق ومحافظة دهوك.</p></div><div class="index-grid" aria-label="وحدات الوحدة الأولى">${entries}</div></section>`;
}
function iraqTopbar() {
  const topic=iraqPages[mode==='iraq'?iraqPage:iraqReturnPage]?.title||'وطننا العراق';
  const counter=mode==='iraq'?`<span class="iraq-screen-counter">صفحة ${iraqPage+1} من ${iraqPages.length}</span>`:'<span class="iraq-screen-counter">منافسة اختيارية</span>';
  return `<header class="iraq-topbar"><div class="iraq-topbar-main"><div class="iraq-brand">${icon('compass')}<span><strong>وطننا العراق</strong><small>${mode==='iraq-challenge'?'تحدّي الفريقين':topic}</small></span></div><span class="iraq-topbar-subject">الاجتماعيات · الصف السادس الابتدائي</span>${counter}<button type="button" class="iraq-top-index" data-action="${mode==='iraq-challenge'?'iraq-game-exit':'index'}">${mode==='iraq-challenge'?'عودة إلى الشرح':'الفهرس'}</button></div></header>`;
}
function iraqMapPlaceholder(number,title) {
  return `<figure class="iraq-map-placeholder"><div class="iraq-map-mark" aria-hidden="true">${icon('pin')}</div><figcaption><strong>الخريطة المنهجية رقم (${number})</strong><span>${title}</span><small>مساحة مؤقتة قابلة للاستبدال — لم يُعثر على الخريطة المنهجية في ملفات المشروع.</small></figcaption></figure>`;
}
function iraqUnitLegacy() {
  const neighbor=iraqLocation.neighbors.find(item=>item.id===iraqActivity.neighbor);
  return `<section class="iraq-unit">
    <section class="iraq-hero" id="iraq-intro"><div class="iraq-hero-copy"><p class="eyebrow">الوحدة الأولى · جغرافياً وتاريخياً</p><h1>وطننا العراق</h1><p class="iraq-subtitle">الموقع، التضاريس، المناخ، المياه، والمحافظات</p><div class="iraq-goals"><h2>أهدافنا في هذه الوحدة</h2><ul>${iraqLearningGoals.map(goal=>`<li>${goal}</li>`).join('')}</ul></div></div><div class="iraq-hero-art" aria-hidden="true">${icon('compass','large-icon')}<span>نتعلّم من أرضنا وتاريخنا</span></div></section>
    <section class="iraq-section" id="iraq-location"><div class="iraq-section-heading"><span class="iraq-step">01</span><div><p class="eyebrow">نتعرف إلى موقع الوطن</p><h2>${iraqLocation.title}</h2></div>${icon('pin')}</div><div class="iraq-location-grid"><article class="iraq-panel iraq-location-copy"><div class="iraq-location-pin">${icon('pin','large-icon')}</div><p class="iraq-quote">${iraqLocation.text}</p></article><div class="iraq-panel"><h3>حدّد جهة العراق</h3><p class="small">اختر دولة مجاورة لعرض الجهة الواردة في النص.</p><div class="iraq-neighbor-grid">${iraqLocation.neighbors.map(item=>`<button class="iraq-neighbor ${item.id===iraqActivity.neighbor?'selected':''}" data-action="iraq-neighbor" data-id="${item.id}" aria-pressed="${item.id===iraqActivity.neighbor}"><span>${item.icon}</span><strong>${item.name}</strong></button>`).join('')}</div><p class="iraq-feedback" aria-live="polite">${neighbor?`تقع ${neighbor.name} إلى جهة ${neighbor.direction} من العراق.`:'المس أو اختر دولة مجاورة.'}</p></div></div></section>
    <section class="iraq-section" id="iraq-terrain"><div class="iraq-section-heading"><span class="iraq-step">02</span><div><p class="eyebrow">نتأمل أشكال السطح</p><h2>أقسام سطح العراق</h2></div>${icon('mountain')}</div>${iraqMapPlaceholder(1,'خريطة أقسام سطح العراق')}<div class="iraq-terrain-grid">${iraqTerrain.map((item,index)=>`<article class="iraq-panel iraq-terrain-card"><span class="iraq-card-number">${String(index+1).padStart(2,'0')}</span>${icon(item.icon)}<h3>${item.title}</h3><p>${item.location}</p></article>`).join('')}</div><div class="iraq-activity"><p class="eyebrow">نشاط تفاعلي</p><h3>تحدّي الخريطة الصماء: حدّد أقسام سطح العراق</h3><p class="iraq-question">أي التضاريس تشغل مساحة أكبر؟</p><p class="small">اختر توقعك، ثم راجع ملاحظتنا. لا تتوفر لدينا نسخة الخريطة المنهجية (1) لتأكيد مساحة كل قسم.</p><div class="iraq-choice-row">${iraqTerrain.map(item=>`<button class="iraq-choice ${item.id===iraqActivity.terrainGuess?'selected':''}" data-action="iraq-terrain-guess" data-id="${item.id}" aria-pressed="${item.id===iraqActivity.terrainGuess}">${item.title}</button>`).join('')}</div>${btn('iraq-terrain-check','تحقّق من الدليل','compass','primary',iraqActivity.terrainGuess?'':'disabled')}${iraqActivity.terrainGuess?`<p class="iraq-feedback" role="status">المادة النصية والخريطة المتاحة لا تثبتان أي الأقسام أكبر مساحة؛ أبقينا الإجابة مفتوحة حتى تتوفر الخريطة المنهجية.</p>`:''}</div></section>
    <section class="iraq-section" id="iraq-climate"><div class="iraq-section-heading"><span class="iraq-step">03</span><div><p class="eyebrow">نلاحظ الفروق بين الشمال والجنوب</p><h2>مناخ العراق</h2></div><img class="icon iraq-climate-icon" src="assets/icons/iraq-climate.svg" alt="" aria-hidden="true"></div><div class="iraq-climate-layout"><article class="iraq-panel iraq-climate-card"><h3>أفكار من المنهج</h3><ul class="iraq-fact-list">${iraqClimate.map(fact=>`<li>${fact}</li>`).join('')}</ul></article>${iraqMapPlaceholder(2,'معدلات سقوط الأمطار في العراق')}</div><div class="iraq-activity"><p class="eyebrow">رتّب حسب وفرة الأمطار</p><h3>أي المناطق أكثر مطراً؟ رتّبها من الأكثر إلى الأقل</h3><p class="small">اضغط المناطق بالترتيب. استخدم السهم لإعادة المحاولة.</p><div class="iraq-order-row">${iraqRainfallOrder.map(item=>`<button class="iraq-choice ${iraqActivity.rainfall.includes(item.id)?'selected':''}" data-action="iraq-rainfall" data-id="${item.id}" ${iraqActivity.rainfall.includes(item.id)||iraqActivity.rainfall.length===3?'disabled':''}><span>${iraqActivity.rainfall.includes(item.id)?iraqActivity.rainfall.indexOf(item.id)+1:'+'}</span>${item.label}</button>`).join('')}</div><div class="iraq-activity-actions">${btn('iraq-rainfall-check','تحقّق','check','primary',iraqActivity.rainfall.length===3?'':'disabled')}${btn('iraq-rainfall-reset','إعادة الترتيب','reset','quiet')}</div>${iraqActivity.rainfallFeedback?`<p class="iraq-feedback" role="status">${iraqActivity.rainfallFeedback}</p>`:''}</div></section>
    <section class="iraq-section" id="iraq-water"><div class="iraq-section-heading"><span class="iraq-step">04</span><div><p class="eyebrow">نتعرف إلى مصادر المياه</p><h2>الموارد المائية في العراق</h2></div>${icon('water')}</div><div class="iraq-water-layout"><article class="iraq-panel"><h3>مصادر ومظاهر مائية</h3><ul class="iraq-fact-list">${iraqWaterSources.map(fact=>`<li>${fact}</li>`).join('')}</ul></article>${iraqMapPlaceholder(3,'الموارد المائية في العراق')}</div><div class="iraq-activity"><p class="eyebrow">لعبة مطابقة</p><h3>صل المورد المائي بفائدته أو وصفه</h3><p class="small">اختر مورداً من العمود الأول، ثم اختر العبارة المطابقة له.</p><div class="iraq-match-grid"><div><h4>المورد</h4>${iraqWaterMatches.map(item=>`<button class="iraq-match-option ${iraqActivity.selectedResource===item.id?'selected':''} ${iraqActivity.waterMatches.includes(item.id)?'matched':''}" data-action="iraq-water-resource" data-id="${item.id}" ${iraqActivity.waterMatches.includes(item.id)?'disabled':''}>${item.resource}${iraqActivity.waterMatches.includes(item.id)?' ✓':''}</button>`).join('')}</div><div><h4>الفائدة أو الوصف</h4>${iraqWaterMatches.map(item=>`<button class="iraq-match-option ${iraqActivity.waterMatches.includes(item.id)?'matched':''}" data-action="iraq-water-benefit" data-id="${item.id}" ${!iraqActivity.selectedResource||iraqActivity.waterMatches.includes(item.id)?'disabled':''}>${item.benefit}</button>`).join('')}</div></div>${iraqActivity.waterFeedback?`<p class="iraq-feedback" role="status">${iraqActivity.waterFeedback}</p>`:''}</div></section>
    <section class="iraq-section" id="iraq-provinces"><div class="iraq-section-heading"><span class="iraq-step">05</span><div><p class="eyebrow">التقسيم الإداري</p><h2>محافظات وطننا</h2></div>${icon('district')}</div><button class="iraq-panel iraq-province-summary" data-action="iraq-index"><span class="iraq-province-count">١٨</span><span><strong>يتكون التقسيم الإداري لوطننا العراق من ثماني عشرة محافظة موزعة على جميع أنحائه.</strong><small>العودة إلى فهرس المحافظات — تعرض الوحدات التي لم يكتمل محتواها بحالة «قريباً».</small></span>${icon('arrow')}</button></section>
    <section class="iraq-section" id="iraq-history"><div class="iraq-section-heading"><span class="iraq-step">06</span><div><p class="eyebrow">محطات من تاريخنا</p><h2>العراق بلد الحضارات</h2></div>${icon('gallery')}</div><div class="iraq-timeline">${iraqHistory.map((item,index)=>`<article class="iraq-history-card"><span>${String(index+1).padStart(2,'0')}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join('')}</div></section>
    <section class="iraq-section iraq-unity-section" id="iraq-unity"><div class="iraq-section-heading"><span class="iraq-step">07</span><div><p class="eyebrow">خاتمة الوحدة</p><h2>وحدة وطننا العراق</h2></div>${icon('compass')}</div><article class="iraq-unity-card"><p>${iraqUnity}</p></article></section>
  </section>`;
}
function iraqUnit() {
  return renderIraqPage(iraqPage,iraqActivity);
}
function iraqChallengePage() {
  return iraqGame?.phase==='play'?renderIraqChallenge(iraqGame):renderIraqChallengeSetup(iraqGame?.scope||'topic',iraqReturnPage);
}
function home() {
  const location=topics.find(t=>t.id==='location');
  return `<section class="home-layout"><div class="home-intro"><p class="eyebrow">بوابة استكشاف العراق · المحطة الأولى</p><h1>رحلة في جغرافية العراق<br><span>محافظة دهوك</span></h1><p class="lead">${location.facts[0]}</p><div class="home-tags"><span>${icon('mountain')} جبال</span><span>${icon('water')} مياه</span><span>${icon('bridge')} معالم</span></div></div><div class="home-map-panel"><div class="map-orbit orbit-one"></div><div class="map-orbit orbit-two"></div><div class="home-map-title"><span class="map-live-dot"></span> خريطة المحافظات <small>المس موضع دهوك في الخريطة</small></div><div class="home-map-stage"><div class="authentic-map"><img class="authentic-map-image" src="maps/interactive/4.png" alt="خريطة العراق المُحدّثة من ملف الخريطة التفاعلية، وتظهر فيها محافظة دهوك"><button class="duhok-map-hotspot" type="button" data-action="home-map" aria-label="افتح بطاقة موقع دهوك" title="موقع دهوك"></button></div></div><div class="map-legend"><span><i class="legend-duhok"></i> محافظة دهوك على الخريطة المرفقة</span></div></div><div class="path-cards"><button class="path-card journey-path" data-action="start"><span class="path-number">01 / تعلّم بالتجربة</span><span class="path-visual compass-visual">${icon('compass')}</span><h2>انطلق في الرحلة</h2><p>ألعاب وتحديات وجواز إنجاز</p><span class="path-bottom">ابدأ الاستكشاف ${icon('arrow')}</span></button><button class="path-card explore-path" data-action="explore"><span class="path-number">02 / دليل دهوك</span><span class="path-visual explore-visual">${icon('pin')}</span><h2>استكشف دهوك</h2><p>معلومات وصور وأقضية ونواحٍ</p><span class="path-bottom">افتح محتوى الدرس ${icon('arrow')}</span></button></div><div class="home-topics" aria-label="محاور الدرس">${[['location','الموقع','pin','map'],['terrain','التضاريس','mountain','referenceSnow'],['climate','المناخ','climate','referenceCamp']].map(([id,label,symbol,image])=>`<button class="home-topic-card" data-action="home-topic" data-id="${id}">${picture(image,'home-topic-photo')}<span class="topic-shade"></span><span class="topic-icon">${icon(symbol)}</span><span class="topic-title">${label}</span><span class="topic-hint">المس لقراءة معلومة</span></button>`).join('')}</div></section>`;
}
function homeTopbar() {
  return `<header class="home-topbar"><div class="home-top-brand">${schoolLockup()}</div><nav class="home-nav" aria-label="التنقل الرئيسي">${btn('index','فهرس المحتويات','home','active')}${btn('activities','الأنشطة','compass')}${btn('content','محتوى الدرس','gallery')}${btn('settings','الإعدادات','reset')}</nav></header>`;
}
function topicCard(t, action='topic') {
  return `<button class="topic-card ${t.id}" data-action="${action}" data-id="${t.id}">${icon(t.icon)}<span class="eyebrow">${t.tag}</span><h2>${t.title}</h2><span class="card-link">المس لفتح البطاقة ${icon('arrow')}</span></button>`;
}
function explore() {
  const tabs=[['overview','بطاقات دهوك','compass'],['districts','الأقضية والنواحي','district'],['gallery','معرض الصور','gallery']];
  return `<section class="explore-layout"><aside class="explore-nav"><p class="eyebrow">دليل دهوك المصوّر</p><h1>المعرفة<br>في متناول يدك.</h1><p>اختر بطاقة، واقرأ على مهل.</p><nav aria-label="أقسام المعلومات">${tabs.map(([id,label,i])=>btn('tab',label,i,tab===id?'active':'',`data-id="${id}" aria-pressed="${tab===id}"`)).join('')}</nav><img class="sidebar-art" src="assets/graphics/duhok-landscape.svg" alt="طبقات جبال مرسومة"></aside><div class="explore-body">${tab==='overview'?`<div class="section-heading"><p class="eyebrow">تعلّم فكرة واحدة كل مرة</p><h2>حكاية مكان… بخمس بطاقات</h2></div><div class="topic-grid">${topics.map(t=>topicCard(t)).join('')}</div>`:tab==='districts'?places():photos()}</div></section>`;
}
function places() {
  const group=(names,prefix)=>names.map(name=>`<button class="place-card" data-action="place" data-name="${name}" data-prefix="${prefix}">${icon('district')}<span>${prefix} ${name}</span>${placeNotes[name]?'<span class="detail-dot" aria-label="تتوفر معلومة">＋</span>':''}</button>`).join('');
  return `<div class="section-heading"><p class="eyebrow">أسماء نكتشفها معاً</p><h2>أقضية ونواحي محافظة دهوك</h2></div><h3>الأقضية</h3><div class="places-grid">${group(districts,'قضاء')}</div><h3>النواحي</h3><div class="places-grid">${group(subdistricts,'ناحية')}</div>`;
}
function photos() {
  return `<div class="section-heading"><p class="eyebrow">شاهد التفاصيل</p><h2>معرض الصور</h2></div><div class="gallery-grid">${gallery.map((g,i)=>`<button class="gallery-card" data-action="photo" data-index="${i}">${picture(g.image)}<span>${g.title}</span></button>`).join('')}</div>`;
}
function heading(kicker,title,hint='') {return `<div class="section-heading"><p class="eyebrow">${kicker}</p><h1>${title}</h1>${hint?`<p>${hint}</p>`:''}</div>`;}
function gameActions() {return `<div class="game-actions">${btn('retry','إعادة المحاولة','reset')}${btn('skip','تخطّي النشاط','arrow','quiet')}</div>`;}
function journey() {
  switch(trip.stage) {
    case 0:return `<section class="gate"><div class="gate-copy">${heading('أهلاً بالمستكشف','محافظة دهوك','تقع في أقصى شمال وطننا العراق.')}<p class="lead">جبال ومياه ومعالم تنتظرك.<br>ابدأ من الموقع، ثم اكتشف التفاصيل.</p><div class="gate-pills"><span>01 الموقع</span><span>02 الاكتشاف</span><span>03 التجربة</span></div>${btn('next','ابدأ الاستكشاف','compass','primary')}<small class="source">من النص المرفق · الصفحة 8</small></div><div class="gate-visual">${picture('map')}<div class="glass-label">${icon('pin')}<span>دهوك<span class="small">محطتنا في شمال العراق</span></span></div></div></section>`;
    case 1:return `<section class="map-game">${heading('تحدي الموقع','المس دهوك على الخريطة','استعن بالخريطة المرجعية، ثم المس الجزء الأخضر في الشمال.')}<div class="map-columns"><div class="interactive-map">${iraqMap()}<p class="small">رسم تفاعلي مبسّط، وليس حدوداً جغرافية دقيقة.</p></div><div class="reference">${picture('iraq')}<span class="small">الخريطة المرجعية المرفقة</span></div><aside class="map-note">${icon('pin','large-icon')}<h2>أين تقع دهوك؟</h2><p>في أقصى شمال العراق.</p><p id="feedback" class="feedback">${trip.found.has('map')?'أحسنت! حدّدت موقع دهوك.':'المس الموقع لتثبيت المعلومة.'}</p>${gameActions()}</aside></div></section>`;
    case 2:return `<section>${heading('كل بطاقة تفتح فكرة','اكتشف إشارات دهوك','المس بطاقة لقراءة المعلومة. المشهد للعرض ولا يحدد مواقع جغرافية دقيقة.')}<div class="discovery-scene"><div class="discovery-panorama" role="img" aria-label="مشهد بصري مؤقت مركب من صور محلية للجبال والمياه والخضرة؛ لا يمثل مواقع جغرافية محددة"><img class="panorama-base" src="assets/images/backgrounds/8379093ec2d2cbb45eaa89d12a6effb9.jpg" alt="" aria-hidden="true"><img class="panorama-water" src="assets/images/backgrounds/252b6fe4b2d4d8c9f82d1619b483efba.jpg" alt="" aria-hidden="true"><img class="panorama-bridge" src="assets/images/backgrounds/98647456ae9ccf4eed8917436ddd7a68.jpg" alt="" aria-hidden="true"><span class="scene-disclaimer">تركيب بصري مؤقت من صور محلية؛ البطاقات للتعلّم وليست نقاطاً جغرافية</span></div><div class="discovery-cards">${discoveryTopics.map(topic=>{const found=trip.found.has(topic.id);return `<button class="discovery-point discovery-${topic.id} ${found?'found':''}" data-action="discover" data-id="${topic.id}" aria-pressed="${found}"><span class="discovery-icons">${icon(topic.icon)}${topic.secondaryIcon?icon(topic.secondaryIcon):''}</span><span class="discovery-title">${topic.title}</span><small>${found?'✓ اكتُشفت':'المس واكتشف'}</small></button>`;}).join('')}</div></div><div class="inline-actions"><p id="feedback" class="feedback" role="status" aria-live="polite">اكتشفت ${discoveryTopics.filter(topic=>trip.found.has(topic.id)).length} من ${discoveryTopics.length} بطاقات</p>${gameActions()}</div></section>`;
    case 3:return classification();
    case 4:return matching();
    case 5:return ordering();
    case 6:return quiz();
    case 7:return xoGame();
    case 8:return mountainGame();
    case 9:return passport();
  }
}
function iraqMap(home=false) {
  return `<svg class="iraq ${home?'iraq-home':''}" viewBox="0 0 520 520" role="img" aria-label="خريطة العراق التفاعلية المبسطة؛ المس دهوك في الشمال"><defs><radialGradient id="mapGlow"><stop stop-color="#38ffc2" stop-opacity=".8"/><stop offset="1" stop-color="#38ffc2" stop-opacity="0"/></radialGradient></defs><path class="iraq-outline" d="M176 44 262 34 319 70 354 142 419 188 399 272 437 322 391 397 316 448 244 421 190 445 149 380 89 334 120 274 93 209 126 144Z"/><path class="river-line river-one" d="M258 110C236 182 278 215 248 292c-22 55 18 92 5 130"/><path class="river-line river-two" d="M286 121C307 183 286 223 315 274c15 36 19 75 43 108"/><path class="duhok-region ${trip.found.has('map')?'located':''}" data-action="${home?'home-map':'map-point'}" role="button" tabindex="0" aria-label="دهوك في شمال العراق" d="M176 44 262 34 280 74 249 108 190 98 151 121 126 144Z"/><circle class="duhok-halo" cx="205" cy="77" r="48" fill="url(#mapGlow)"/><g class="map-pin"><path d="M205 55a15 15 0 0 0-15 15c0 12 15 30 15 30s15-18 15-30a15 15 0 0 0-15-15Zm0 21a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" fill="#f2cf75" stroke="#fff1bd" stroke-width="2"/><circle cx="205" cy="70" r="20" fill="none" stroke="#f2cf75" stroke-width="2" opacity=".7"/></g><text x="205" y="111" text-anchor="middle" class="map-label">دهوك</text><text x="255" y="365" text-anchor="middle" class="country-label">العراق</text></svg>`;
}
function classification() {
  const targets=['water','terrain','location','climate'].map(id=>topics.find(t=>t.id===id));
  return `<section>${heading('لعبة 1 / صنّف المعلومة','كلُّ معلومةٍ لها مكان','اسحب البطاقة إلى تصنيفها، أو المس البطاقة ثم التصنيف.')}<div class="classify-layout"><div class="classification-cards">${classifyCards.map(c=>`<button class="drag-card ${trip.selected===c.id?'selected':''} ${trip.packed.has(c.id)?'complete':''}" data-action="select-card" data-id="${c.id}" ${trip.packed.has(c.id)?'disabled':''}>${trip.packed.has(c.id)?icon('check'):icon('compass')}<span>${c.label}</span></button>`).join('')}</div><div class="target-grid">${targets.map(t=>`<button class="drop-target" data-action="drop" data-id="${t.id}">${icon(t.icon)}<span>${t.title}</span><small>${classifyCards.some(c=>c.target===t.id&&trip.packed.has(c.id))?'✓ وصلت البطاقة':'ضع المعلومة هنا'}</small></button>`).join('')}</div></div><p id="feedback" class="feedback">${trip.packed.size===4?'أحسنت! صنّفت المعلومات الأربع.':'اختر بطاقة لتبدأ.'}</p>${gameActions()}</section>`;
}
function matching() {
  return `<section>${heading('لعبة 2 / طابق الرمز','الصورة تقول… والمعلومة تجيب','المس رمزاً، ثم المس المعلومة التي تناسبه.')}<div class="match-layout"><div class="symbol-row">${matches.map(m=>`<button class="symbol-card ${trip.match===m.id?'selected':''}" data-action="symbol" data-id="${m.id}" aria-label="رمز ${topics.find(t=>t.id===m.id).title}" ${trip.matched.has(m.id)?'disabled':''}>${icon(m.icon)}<span>${trip.matched.has(m.id)?'✓ تم التطابق':'اختر الرمز'}</span></button>`).join('')}</div><div class="match-answers">${[matches[2],matches[0],matches[1]].map(m=>btn('match',m.label,null,trip.matched.has(m.id)?'complete':'',`data-id="${m.id}" ${trip.matched.has(m.id)?'disabled':''}`)).join('')}</div></div><p id="feedback" class="feedback">${trip.matched.size===3?'جميل! ربطت الرموز بمعانيها.':'اختر رمزاً، ثم معلومة.'}</p>${gameActions()}</section>`;
}
function ordering() {
  return `<section>${heading('لعبة 3 / نظّم خطواتك','كيف نسير في رحلة الاكتشاف؟','المس الخطوات بالترتيب. ابدأ بالموقع، واختم بالمراجعة.')}<div class="order-track">${orderSteps.map((_,i)=>`<div class="order-slot ${trip.order[i]!==undefined?'filled':''}"><span>${i+1}</span><p>${trip.order[i]!==undefined?orderSteps[trip.order[i]]:'اختر الخطوة'}</p></div>`).join('')}</div><div class="order-options">${[2,0,3,1].map(i=>btn('order',orderSteps[i],'compass','',`data-index="${i}" ${trip.order.includes(i)?'disabled':''}`)).join('')}</div><p id="feedback" class="feedback">${trip.order.length===4?'أحسنت! الموقع، الاكتشاف، التطبيق، ثم المراجعة.':'هذا ترتيب التعلّم في رحلتنا، وليس حدثاً تاريخياً.'}</p>${gameActions()}</section>`;
}
function quiz() {
  const q=questions[trip.question], a=trip.answers[trip.question];
  return `<section class="quiz">${heading(`التحدي السريع / ${trip.question+1} من ${questions.length}`,q.q)}<div class="quiz-body"><div class="quiz-symbol">${icon(q.icon)}<span>فكّر… ثم المس</span></div><div class="answers">${q.options.map((o,i)=>btn('answer',o,null,a===i?'complete':'',`data-index="${i}" ${a!==undefined?'disabled':''}`)).join('')}</div></div><p id="feedback" class="feedback ${a===q.answer?'success':''}">${a===q.answer?q.success:a!==undefined?`تلميح: ${q.clue}`:'اختر الإجابة التي يدعمها ما تعلّمته.'}</p><div class="inline-actions">${gameActions()}${btn('question-next',trip.question===questions.length-1?'إلى جواز الرحلة':'السؤال التالي','arrow','primary')}</div><small class="source">من النص المرفق · الصفحة ${q.source}</small></section>`;
}
function xoTeamCard(side) {
  const active=xo.current===side&&!xo.finished;
  const t=xo.teams[side], total=xoTotals[side];
  return `<article class="xo-team xo-${side.toLowerCase()} ${active?'active':''}"><span class="xo-mark" aria-hidden="true">${side}</span><div><span class="eyebrow">${active?'دور الفريق الآن':'فريق اللعبة'}</span><h2>${escapeHTML(t)}</h2><p><b>${xo.roundPoints[side]}</b> نقطة هذه الجولة <small>• ${total.wins} فوز</small></p></div></article>`;
}
function xoSetup() {
  return `<section class="xo-setup">${heading('لعبة تعلّم جماعية','تحدي X/O: أجب أولاً… ثم ضع علامتك','كل مربع فرصة تعلم. لا تُثبت علامة X أو O إلا بعد إجابة صحيحة.')}<div class="xo-setup-grid"><div class="xo-rules-art"><div class="xo-orbit"><span>X</span><i></i><b>O</b></div><p>🎯 اختر مربعاً... ثم أثبت أنك تستحقه بالإجابة الصحيحة!</p><ul><li>يبدأ فريق X.</li><li>الإجابة الصحيحة تمنح النقاط والعلامة.</li><li>الإجابة الخاطئة تترك المربع فارغاً وينتقل الدور.</li></ul></div><form class="xo-form" onsubmit="return false"><label>اسم فريق X<input id="xo-name-x" maxlength="24" value="${escapeHTML(xo.teams.X)}" autocomplete="off"></label><label>اسم فريق O<input id="xo-name-o" maxlength="24" value="${escapeHTML(xo.teams.O)}" autocomplete="off"></label><div class="xo-setup-actions">${btn('xo-start','ابدأ اللعبة','compass','primary')}${btn('xo-how','طريقة اللعب','compass','quiet')}${btn('xo-review','راجع الدرس','check','quiet')}${btn('xo-teacher','لوحة المعلّم','district','quiet')}</div><small>الأسئلة من المادة المرفقة: موقع دهوك وتضاريسها.</small></form></div></section>`;
}
function xoGame() {
  if(!xo.started)return xoSetup();
  const result=xo.finished ? `<div class="xo-result ${xo.winner==='تعادل'?'draw':'win'}"><strong>${xo.winner==='تعادل'?'تعادل جميل!':'فاز '+escapeHTML(xo.teams[xo.winner])+'!'}</strong><span>${xo.winner==='تعادل'?'امتلأت المربعات بعد جولة من التفكير والتعاون.':'ثلاث علامات متصلة بعد إجابات صحيحة.'}</span></div>` : '';
  return `<section class="xo-game">${heading('لعبة 4 / X-O','اختر مربعاً… وأثبت أنك تستحقه','🎯 اختر مربعاً... ثم أثبت أنك تستحقه بالإجابة الصحيحة!')}<div class="xo-game-actions">${btn('xo-how','طريقة اللعب','compass','quiet')}${btn('xo-review','راجع الدرس','check','quiet')}${btn('xo-teacher','لوحة المعلّم','district','quiet')}${btn('xo-new-round','جولة جديدة','reset','quiet')}</div><div class="xo-layout">${xoTeamCard('X')}<div class="xo-board-wrap"><p class="xo-turn">${xo.finished?'انتهت الجولة':`الدور الآن: <b>${escapeHTML(xo.teams[xo.current])}</b> — اختر مربعاً فارغاً`}</p><div class="xo-board" role="grid" aria-label="لوح لعبة إكس أو">${xo.board.map((mark,index)=>`<button class="xo-cell ${mark?'mark-'+mark.toLowerCase():''} ${xo.winningLine.includes(index)?'winning':''}" data-action="xo-cell" data-index="${index}" role="gridcell" aria-label="المربع ${index+1}${mark?'، العلامة '+mark:'، فارغ'}" ${mark||xo.finished?'disabled':''}>${mark}</button>`).join('')}</div>${result}</div>${xoTeamCard('O')}</div><div class="xo-scoreline"><span>أسئلة صحيحة: <b>${xo.correct}</b></span><span>محاولات تحتاج مراجعة: <b>${xo.wrong}</b></span><span>نقاط تعليمية محفوظة: <b>${xoTotals.X.points+xoTotals.O.points}</b></span></div><div class="inline-actions">${gameActions()}${btn('next','إلى جواز الرحلة','arrow','primary')}</div></section>`;
}
function normalizeArabic(value='') { return String(value).trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ًٌٍَُِّْـ]/g,'').replace(/\s+/g,' '); }
function chooseXoQuestion() {
  const levels=['easy','medium','hard'];
  const preferred=levels[xo.used.size%levels.length];
  const types=['choice','truefalse','fill'];
  const preferredType=types[xo.used.size%types.length];
  const available=xoQuestions.filter(q=>!xo.used.has(q.id));
  const pool=available.filter(q=>q.difficulty===preferred&&q.type===preferredType);
  const sameType=available.filter(q=>q.type===preferredType);
  const sameLevel=available.filter(q=>q.difficulty===preferred);
  const choices=pool.length?pool:sameType.length?sameType:sameLevel.length?sameLevel:available;
  return choices[Math.floor(Math.random()*choices.length)];
}
function openXoQuestion(cell) {
  if(xo.finished||xo.board[cell]||xoDialog.open)return;
  const question=chooseXoQuestion(); if(!question)return;
  xo.selectedCell=cell;xo.question=question;xo.feedback=null;xo.pendingMark=false;
  renderXoDialog();xoDialog.showModal();
}
function renderXoDialog() {
  const q=xo.question, player=xo.teams[xo.current]; if(!q)return;
  const answerArea=q.type==='fill' ? `<label class="xo-fill-label">اكتب كلمة الإجابة<input id="xo-fill-answer" inputmode="text" autocomplete="off" ${xo.feedback?'disabled':''}></label>${btn('xo-submit-fill','تحقق من الإجابة','check','primary',xo.feedback?'disabled':'')}` : `<div class="xo-options">${q.options.map((option,index)=>btn('xo-answer',option,null,'',`data-index="${index}" ${xo.feedback?'disabled':''}`)).join('')}</div>`;
  const feedback=xo.feedback ? `<div class="xo-answer-feedback ${xo.feedback.good?'good':'try'}"><strong>${xo.feedback.good?'إجابة صحيحة! أحسنت.':'ليست هذه الإجابة.'}</strong><p>${xo.feedback.text}</p>${btn('xo-continue',xo.feedback.good?'ثبت العلامة في المربع':'مرّر الدور إلى الفريق الآخر','arrow','primary')}</div>` : '';
  xoDialog.innerHTML=`<div class="xo-question-head"><span class="xo-mini-mark ${xo.current.toLowerCase()}">${xo.current}</span><div><p class="eyebrow">دور ${escapeHTML(player)} · ${q.difficulty==='easy'?'سهل':q.difficulty==='medium'?'متوسط':'تحدٍّ'}</p><h2>أجب لتحجز المربع ${xo.selectedCell+1}</h2></div></div><div class="xo-question-content"><p class="xo-question-text">${q.q}</p>${answerArea}${feedback}</div><p class="xo-lock-note">بعد فتح السؤال، أجب أولاً قبل اختيار مربع آخر.</p>`;
  if(!xo.feedback) setTimeout(()=>xoDialog.querySelector(q.type==='fill'?'#xo-fill-answer':'[data-action="xo-answer"]')?.focus(),0);
}
function isCorrectXoAnswer(value) {
  const q=xo.question;
  if(q.type!=='fill')return Number(value)===q.answer;
  return q.acceptedAnswers.some(answer=>normalizeArabic(answer)===normalizeArabic(value));
}
function submitXoAnswer(value) {
  if(!xo.question||xo.feedback)return;
  const correct=isCorrectXoAnswer(value), q=xo.question;
  xo.used.add(q.id);
  if(correct){const points=q.difficulty==='easy'?10:q.difficulty==='medium'?20:30;xo.roundPoints[xo.current]+=points;xoTotals[xo.current].points+=points;xo.correct++;xoTotals.correct++;xo.pendingMark=true;xo.feedback={good:true,text:`+${points} نقطة. ${q.explanation}`};tone('success');}
  else {xo.wrong++;xoTotals.wrong++;xo.pendingMark=false;const answer=q.type==='fill'?q.answerText:q.options[q.answer];xo.feedback={good:false,text:`الإجابة الصحيحة: ${answer}. ${q.explanation}`};tone('hint');}
  saveXo();renderXoDialog();
}
function winningLine(board) {
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.find(line=>line.every(index=>board[index]&&board[index]===board[line[0]]))||[];
}
function continueXo() {
  const player=xo.current;
  if(xo.pendingMark){xo.board[xo.selectedCell]=player;xo.winningLine=winningLine(xo.board);if(xo.winningLine.length){xo.winner=player;xo.finished=true;xoTotals[player].wins++;}else if(xo.board.every(Boolean)){xo.winner='تعادل';xo.finished=true;}}
  if(!xo.finished)xo.current=player==='X'?'O':'X';
  xo.question=null;xo.feedback=null;xo.pendingMark=false;xo.selectedCell=null;saveXo();xoDialog.close();render(false);
}
function showXoInfo(kind) {
  if(kind==='how')openDetail('طريقة لعب X/O',`<div class="xo-info"><p><b>1.</b> يختار الفريق مربعاً فارغاً.</p><p><b>2.</b> يجيب عن السؤال الذي يظهر.</p><p><b>3.</b> الإجابة الصحيحة تثبّت العلامة وتمنح نقاطاً؛ والخطأ يمرر الدور.</p><p><b>4.</b> يفوز من يصل إلى ثلاث علامات متصلة.</p></div>`);
  if(kind==='review')openDetail('مراجعة سريعة قبل اللعب',`<div class="xo-info"><p><b>الموقع:</b> دهوك في شمال العراق، ضمن إقليم كردستان العراق.</p><p><b>الحدود:</b> تركيا شمالاً، أربيل شرقاً، ونينوى غرباً.</p><p><b>التضاريس:</b> يغلب عليها الطابع الجبلي، وتتكون من منطقة جبلية وهضاب وسهول.</p><p><b>الجبال:</b> من أمثلتها بيخير وباكرمان وكارة وعقرة.</p><small class="source">من بنك الأسئلة المرفق من مالك المشروع.</small></div>`);
  if(kind==='teacher'){const all=xoTotals.correct+xoTotals.wrong;const percent=all?Math.round(xoTotals.correct/all*100):0;openDetail('لوحة المعلّم',`<div class="teacher-stats"><span><b>${xoTotals.correct}</b>إجابات صحيحة</span><span><b>${xoTotals.wrong}</b>إجابات تحتاج مراجعة</span><span><b>${percent}%</b>نسبة الصحة</span><span><b>${xoTotals.X.wins+xoTotals.O.wins}</b>جولات منتهية</span></div>${btn('xo-reset-stats','تصفير الإحصاءات المحفوظة','reset','quiet')}`);}
}
function mountainSetup() {
  const lengths=[[6,'سريع'],[8,'عادي'],[10,'كامل']];
  return `<section class="mountain-setup">${heading('لعبة 5 / مغامرة جماعية','🏔️ تسلّق جبال دهوك','أجب… تسلّق… وكن أول من يصل إلى القمة!')}<div class="mountain-setup-grid"><div class="mountain-preview">${mountainScene(true)}<p>كل إجابة صحيحة تحرك متسلق فريقك محطة واحدة إلى الأعلى.</p></div><form class="mountain-form" onsubmit="return false"><label>اسم فريق المسار الذهبي<input id="mountain-name-a" maxlength="24" value="${escapeHTML(mountain.teams.A.name)}"></label><label>اسم فريق المسار السماوي<input id="mountain-name-b" maxlength="24" value="${escapeHTML(mountain.teams.B.name)}"></label><fieldset><legend>طول السباق</legend><div class="mountain-choice-row">${lengths.map(([value,label])=>btn('mountain-length',`${label} · ${value} محطات`,null,mountain.length===value?'active':'',`data-length="${value}" aria-pressed="${mountain.length===value}"`)).join('')}</div></fieldset><fieldset><legend>أسلوب الأسئلة</legend><div class="mountain-choice-row">${[['curriculum','منهجي'],['varied','متنوع'],['challenge','تحدٍّ']].map(([value,label])=>btn('mountain-profile',label,null,mountain.profile===value?'active':'',`data-profile="${value}" aria-pressed="${mountain.profile===value}"`)).join('')}</div></fieldset><div class="mountain-setup-actions">${btn('mountain-start','ابدأ التسلّق','mountain','primary')}${btn('mountain-how','طريقة اللعب','compass','quiet')}</div><small>لا يوجد مؤقت ضاغط. أسئلة المعلومات الإضافية تظهر بشارة واضحة.</small></form></div></section>`;
}
function mountainTeam(side) {
  const team=mountain.teams[side], active=mountain.current===side&&!mountain.finished;
  return `<article class="mountain-team ${side==='A'?'gold':'blue'} ${active?'active':''}"><span class="climber-avatar" aria-hidden="true">${side==='A'?'🧗':'🥾'}</span><div><span class="eyebrow">${active?'دور الفريق الآن':'فريق التسلق'}</span><h2>${escapeHTML(team.name)}</h2><p>المحطة <bdi dir="ltr">${Math.min(team.position,mountain.length)} / ${mountain.length}</bdi> · <bdi dir="ltr">${team.points}</bdi> نقطة</p><small>✓ <bdi dir="ltr">${team.correct}</bdi> &nbsp;↗ سلسلة <bdi dir="ltr">${team.streak}</bdi> &nbsp;↺ <bdi dir="ltr">${team.wrong}</bdi></small></div></article>`;
}
function mountainPoint(side, position) {
  const p=Math.min(position,10), y=552-p*49;
  return side==='A'?{x:250+p*36,y}:{x:950-p*36,y};
}
function climberSvg(side, position) {
  const point=mountainPoint(side,position), color=side==='A'?'#f4c66f':'#69dde5';
  return `<g class="mountain-climber ${side==='A'?'climber-a':'climber-b'}" transform="translate(${point.x} ${point.y})"><circle cx="0" cy="-14" r="10" fill="#f3d1ae"/><path d="M-13 2 0-7 13 2 9 25H-9Z" fill="${color}"/><path d="M-6 25-12 41M6 25 12 41M-9 7-22 17M9 7 21 15" fill="none" stroke="#f4f1e8" stroke-width="5" stroke-linecap="round"/><circle cx="-25" cy="18" r="4" fill="#eaf2e8"/></g>`;
}
function mountainScene(preview=false) {
  const count=preview?10:mountain.length, teamA=mountain.teams.A, teamB=mountain.teams.B;
  const stops=Array.from({length:count},(_,i)=>i+1).map(i=>{const a=mountainPoint('A',i),b=mountainPoint('B',i);return `<g class="mountain-stop"><circle cx="${a.x}" cy="${a.y}" r="11"/><circle cx="${b.x}" cy="${b.y}" r="11"/><text x="${a.x}" y="${a.y+4}">${i===0?'⌂':i}</text><text x="${b.x}" y="${b.y+4}">${i===0?'⌂':i}</text></g>`;}).join('');
  const positionA=preview?0:teamA.position, positionB=preview?0:teamB.position;
  return `<svg class="mountain-scene" viewBox="0 0 1200 640" role="img" aria-label="مشهد جبلي تفاعلي لمساري تسلّق نحو القمة"><defs><linearGradient id="mountain-face" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4f8c75"/><stop offset="1" stop-color="#163e43"/></linearGradient><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#153a67"/><stop offset="1" stop-color="#1c727b"/></linearGradient></defs><rect width="1200" height="640" fill="url(#sky)"/><path class="cloud cloud-one" d="M100 105q25-32 55 0q35-20 58 13H78q0-21 22-13"/><path class="cloud cloud-two" d="M930 130q23-29 52 0q31-20 56 12H908q0-20 22-12"/><path d="M0 610 210 432 365 503 610 55 848 493 1000 413 1200 610Z" fill="url(#mountain-face)"/><path d="m480 190 130-135 120 210-80-42-40 53-50-71-45 37Z" fill="#dfeee8" opacity=".88"/><path d="M0 570q230-70 420 5t400-15t380 15v65H0Z" fill="#0e343c"/><path class="climb-path path-a" d="M250 552C300 452 454 394 520 288S590 132 610 62"/><path class="climb-path path-b" d="M950 552C900 452 746 394 680 288S630 132 610 62"/>${stops}<g class="base-camp"><path d="m207 570 22-35 22 35Z" fill="#f1cf87"/><path d="m948 570 22-35 22 35Z" fill="#78dfe4"/></g>${climberSvg('A',positionA)}${climberSvg('B',positionB)}<g class="summit"><path d="m610 48 15 20-15 20-15-20Z" fill="#f2cd68"/><path d="m610 39v-22" stroke="#f2cd68" stroke-width="4"/><path d="m610 17h35l-8 12 8 12h-35Z" fill="#f2cd68"/></g><g class="scene-trees"><path d="m95 545 22-62 22 62Zm45 15 18-51 18 51Zm910-15 22-62 22 62Zm-45 15 18-51 18 51Z" fill="#2a705d"/></g></svg>`;
}
function mountainGame() {
  if(!mountain.started)return mountainSetup();
  const current=mountain.teams[mountain.current], atSummit=current.position>=mountain.length;
  const notice=mountain.finished?`🏆 وصل ${escapeHTML(mountain.teams[mountain.winner].name)} إلى القمة!`:(atSummit?'🏔️ سؤال القمة ينتظرك!':'المحطة التالية تنتظرك!');
  return `<section class="mountain-game">${heading('مغامرة دهوك الجبلية','تسلّق جبال دهوك','كل إجابة صحيحة تحرّك فريقك خطوة واحدة إلى القمة.')}<div class="mountain-game-actions">${btn('mountain-how','طريقة اللعب','compass','quiet')}${btn('mountain-review','راجع الحقائق','check','quiet')}${btn('mountain-new','جولة جديدة','reset','quiet')}</div><div class="mountain-status">${mountainTeam('A')}<div class="mountain-center"><span class="mountain-notice">${notice}</span>${btn('mountain-ask',mountain.finished?'اكتملت المغامرة':atSummit?'أجب عن سؤال القمة':'أجب لتصعد','mountain','primary',mountain.finished?'disabled':'')}</div>${mountainTeam('B')}</div><div class="mountain-board">${mountainScene()}${mountain.finished?`<div class="summit-message"><strong>🏆 بطل القمة</strong><span>${escapeHTML(mountain.teams[mountain.winner].name)} أنهى السباق بتعاون ومعرفة.</span></div>`:''}</div><p class="mountain-hint">${mountain.finished?'يمكن بدء جولة جديدة أو المتابعة إلى جواز الرحلة.':'لا عقوبة عند الخطأ؛ راجع التفسير ثم جرّب من جديد في دورك القادم.'}</p><div class="inline-actions">${gameActions()}${btn('next','إلى جواز الرحلة','arrow','primary')}</div></section>`;
}
function chooseMountainQuestion() {
  const team=mountain.teams[mountain.current];
  if(team.position>=mountain.length){const summits=mountainQuestions.filter(q=>q.type==='summit'&&!mountain.used.has(q.id));return summits[0]||mountainQuestions.find(q=>q.type==='summit');}
  const level=team.position<3?'easy':team.position<6?'medium':'hard';
  const eligible=mountainQuestions.filter(q=>q.type!=='summit'&&!mountain.used.has(q.id));
  const byProfile=mountain.profile==='curriculum'?eligible.filter(q=>q.source==='curriculum'):mountain.profile==='challenge'?eligible.filter(q=>q.difficulty===level):eligible.filter(q=>q.difficulty===level);
  const pool=byProfile.length?byProfile:eligible;
  if(!pool.length){mountain.used.clear();return chooseMountainQuestion();}
  return pool[Math.floor(Math.random()*pool.length)];
}
function openMountainQuestion() {
  if(mountain.finished||mountainDialog.open)return;
  mountain.question=chooseMountainQuestion();mountain.selection=[];mountain.feedback=null;mountain.pendingMove=false;renderMountainDialog();mountainDialog.showModal();
}
function sourceBadge(question) {return question.source==='enrichment'?'<span class="extra-badge">معلومة إضافية</span>':'';}
function renderMountainDialog() {
  const q=mountain.question, team=mountain.teams[mountain.current]; if(!q)return;
  const title=q.type==='summit'?'سؤال القمة':q.type==='multi'?'اختر إجابتين':q.type==='matching'?'طابق المعلومة':q.type==='classification'?'صنّف المعلومة':'أجب لتصعد';
  let activity='';
  if(q.type==='fill')activity=`<label class="mountain-fill">اكتب الإجابة<input id="mountain-fill" autocomplete="off" ${mountain.feedback?'disabled':''}></label>${btn('mountain-fill-submit','تحقق','check','primary',mountain.feedback?'disabled':'')}`;
  else if(q.type==='multi')activity=`<div class="mountain-options multi">${q.options.map((item,index)=>btn('mountain-select',item,null,mountain.selection.includes(index)?'selected':'',`data-index="${index}" ${mountain.feedback?'disabled':''}`)).join('')}</div>${btn('mountain-multi-submit','تحقق من الاختيارين','check','primary',mountain.feedback?'disabled':'')}`;
  else activity=`<div class="mountain-options">${q.options.map((item,index)=>btn('mountain-answer',item,null,'',`data-index="${index}" ${mountain.feedback?'disabled':''}`)).join('')}</div>`;
  const feedback=mountain.feedback?`<div class="mountain-feedback ${mountain.feedback.good?'good':'try'}"><strong>${mountain.feedback.good?'أحسنت، صعد فريقك!':'محاولة جيدة.'}</strong><p>${mountain.feedback.text}</p>${btn('mountain-continue',mountain.feedback.good?'شاهد الصعود':'مرّر الدور','arrow','primary')}</div>`:'';
  mountainDialog.innerHTML=`<div class="mountain-question-head"><span>🏔️</span><div><p class="eyebrow">دور ${escapeHTML(team.name)} · ${q.difficulty==='easy'?'سهل':q.difficulty==='medium'?'متوسط':q.difficulty==='hard'?'تحدٍّ':'القمة'}</p><h2>${title} ${sourceBadge(q)}</h2></div></div><div class="mountain-question-content"><p>${q.prompt}</p>${activity}${feedback}</div><p class="mountain-lock">أجب أولاً لتتابع مسار التسلق.</p>`;
}
function mountainAnswer(value) {
  const q=mountain.question;if(!q||mountain.feedback)return;
  const correct=q.type==='fill'?q.acceptedAnswers.some(answer=>normalizeArabic(answer)===normalizeArabic(value)):q.type==='multi'?q.answers.length===mountain.selection.length&&q.answers.every(answer=>mountain.selection.includes(answer)):Number(value)===q.answer;
  const team=mountain.teams[mountain.current];mountain.used.add(q.id);mountain.lastQuestion=q.id;
  if(correct){team.points+=q.points;team.correct++;team.streak++;mountain.pendingMove=true;mountain.feedback={good:true,text:`+${q.points} نقطة. ${q.explanation}`};tone('success');}
  else {team.wrong++;team.streak=0;mountain.pendingMove=false;const answer=q.type==='fill'?q.answerText:q.type==='multi'?q.answers.map(i=>q.options[i]).join(' و '):q.options[q.answer];mountain.feedback={good:false,text:`الإجابة الصحيحة: ${answer}. ${q.explanation}`};tone('hint');}
  renderMountainDialog();
}
function continueMountain() {
  const side=mountain.current, team=mountain.teams[side], q=mountain.question;
  if(mountain.pendingMove){if(q.type==='summit')mountain.winner=side,mountain.finished=true;else team.position=Math.min(mountain.length,team.position+1);}
  if(!mountain.finished)mountain.current=side==='A'?'B':'A';
  mountain.question=null;mountain.feedback=null;mountain.pendingMove=false;mountain.selection=[];mountainDialog.close();render(false);
}
function showMountainInfo(kind) {
  if(kind==='how')openDetail('طريقة تسلّق جبال دهوك',`<div class="xo-info"><p><b>1.</b> يتناوب الفريقان في الإجابة.</p><p><b>2.</b> الصحيحة تحرك المتسلق محطة واحدة، والخطأ يبقيه مكانه.</p><p><b>3.</b> عند آخر محطة يظهر سؤال القمة.</p><p><b>4.</b> الفائز هو أول فريق يجيب عن سؤال القمة.</p></div>`);
  if(kind==='review')openDetail('حقائق للمراجعة',`<div class="xo-info"><p><b>الجبال:</b> من جبال دهوك بيخير وباكرمان وكارة وعقرة.</p><p><b>التضاريس:</b> يغلب الطابع الجبلي، وتوجد هضاب وسهول غرباً وجنوب غرباً.</p><p><b>معلومة إضافية:</b> تقع زاخو قرب معبر إبراهيم الخليل الحدودي.</p><small class="source">المادة المنهجية أولاً؛ المعلومات الإضافية موضحة بشارتها.</small></div>`);
}
function passport() {
  const correct=questions.filter((q,i)=>trip.answers[i]===q.answer).length;
  return `<section class="passport-layout"><div class="achievement"><p class="eyebrow">كل فكرة تعلّمتها… خطوة إلى الأمام</p><h1>رحلتك تستحق<br>أن تُحفظ.</h1><p class="lead">وصلت إلى نهاية مسار دهوك.<br>يمكنك العودة لأي محطة لتواصل التعلّم.</p><div class="result-stats"><span><b>${score()}</b>نقطة اكتشاف</span><span><b>${correct} / ${questions.length}</b>إجابات صحيحة</span></div><p class="small">${trip.skipped.size?'تخطّيت بعض الأنشطة؛ يمكنك العودة إليها من المسار.':'شكراً لمشاركتك في رحلة دهوك.'}</p>${btn('restart','رحلة جديدة','reset')}</div><div class="passport-card"><div class="passport-top">جواز رحلة العراق ${icon('compass')}</div><img class="badge" src="assets/graphics/explorer-badge.svg" alt="شارة جبلية أصلية للمشاركة في رحلة دهوك"><h2>مستكشف دهوك</h2><span class="stamp">محطة دهوك • شارة مشاركة</span><p>الموقع · التضاريس · المناخ · المياه · المعالم</p><div class="next-province"><span>المحطة التالية: أربيل</span><small>قريباً، بعد إضافة محتواها المعتمد</small></div></div></section>`;
}
function openDetail(title, body, wide=false) {
  returnFocus=document.activeElement;
  dialog.className=wide?'wide':'';
  dialog.innerHTML=`<div class="drawer-head"><p class="eyebrow">تفاصيل الاكتشاف</p>${btn('close','إغلاق','close','quiet')}</div><h2 id="detail-title">${title}</h2>${body}`;
  dialog.showModal(); dialog.querySelector('[data-action="close"]').focus();
}
function closeDetail() {dialog.close(); if(returnFocus?.isConnected)returnFocus.focus();ambience.setScene(mode==='journey'&&trip.stage===8?'mountains':'main');}
function showTopic(id) {
  const t=topics.find(topic=>topic.id===id)||discoveryTopics.find(topic=>topic.id===id); if(!t)return;
  ambience.setScene(({water:'water',climate:'climate',terrain:'mountains'})[id]||'main');
  const visual=t.image?picture(t.image,'detail-photo'):t.id==='climate'?`<div class="climate-art">${icon(t.icon)}<span>شتاء بارد / صيف معتدل</span></div>`:`<div class="topic-art">${icon(t.icon)}${t.secondaryIcon?icon(t.secondaryIcon):''}</div>`;
  openDetail(t.title,`${visual}<ul class="fact-list">${t.facts.map(f=>`<li>${f}</li>`).join('')}</ul><small class="source">من النص التعليمي المرفق · ${t.source}</small>`);
}
function stageTo(index) {
  trip.stage=Math.max(0,Math.min(stages.length-1,index)); trip.reached=Math.max(trip.reached,trip.stage); trip.selected=null; trip.match=null; render();
}
function next(skip=false) {
  if(mode!=='journey')return;
  if(trip.stage===stages.length-1){openDetail('المحطة التالية: أربيل','<p>تُفتح هذه المحطة بعد إضافة النصوص والصور التعليمية المعتمدة.</p>');return;}
  const complete=[true,trip.found.has('map'),discoveryTopics.every(topic=>trip.found.has(topic.id)),trip.packed.size===4,trip.matched.size===3,trip.order.length===4,questions.every((_,i)=>trip.answers[i]!==undefined),xo.finished,mountain.finished][trip.stage];
  if(skip||!complete)trip.skipped.add(trip.stage);else trip.skipped.delete(trip.stage);
  stageTo(trip.stage+1);
}
function drop(target) {
  const card=classifyCards.find(c=>c.id===trip.selected);
  if(!card){feedback('المس بطاقة أولاً، ثم اختر تصنيفها.');return;}
  if(card.target===target){trip.packed.add(card.id);earn(`classify:${card.id}`);trip.selected=null;render(false);feedback('أحسنت! وصلت المعلومة إلى مكانها.',true);}
  else feedback('اقتربت! فكّر: هل تتحدث البطاقة عن موقع أم جبل أم مناخ أم ماء؟');
}
function retry() {
  if(trip.stage===1)trip.found.delete('map');
  if(trip.stage===2)discoveryTopics.forEach(topic=>trip.found.delete(topic.id));
  if(trip.stage===3){trip.packed.clear();trip.selected=null;}
  if(trip.stage===4){trip.matched.clear();trip.match=null;}
  if(trip.stage===5)trip.order=[];
  if(trip.stage===6)delete trip.answers[trip.question];
  if(trip.stage===7)xo=xoFresh();
  if(trip.stage===8)mountain=mountainFresh();
  render(false); feedback('لنحاول من جديد. خذ وقتك.',true);
}
async function action(el) {
  const a=el.dataset.action, id=el.dataset.id, n=Number(el.dataset.index);
  ambience.activate();
  if(a!=='sound')tone();
  if(a==='close'){closeDetail();return;}
  if(a==='home'){mode='home';render();return;}
  if(a==='index'){mode='index';render();return;}
  if(a==='curriculum-entry'&&mode==='index'&&el.dataset.route==='duhok'){mode='home';render();return;}
  if(a==='curriculum-entry'&&mode==='index'&&el.dataset.route==='iraq'){iraqActivity={neighbor:null,terrain:null,terrainGuess:null,rainfall:[],rainfallFeedback:'',waterCard:null,timeline:null,selectedResource:null,waterMatches:[],waterFeedback:''};iraqPage=0;mode='iraq';render();return;}
  if(a==='iraq-index'&&mode==='iraq'){mode='index';render();return;}
  if(a==='iraq-game-exit'&&mode==='iraq-challenge'){mode='iraq';iraqPage=iraqReturnPage;iraqGame=null;render();return;}
  if(a==='iraq-game-open'&&mode==='iraq'){
    iraqReturnPage=iraqPage;
    const topic=iraqPages[iraqPage]?.topic||'all';
    iraqGame={phase:'setup',scope:topic==='all'?'all':'topic',topic,questionIndex:0,turn:'X',selected:null,answered:false,wasCorrect:false,scores:{X:0,O:0},names:{X:'الفريق الأول',O:'الفريق الثاني'}};
    mode='iraq-challenge';render();return;
  }
  if(mode==='iraq-challenge'&&a==='iraq-game-scope'){iraqGame.scope=el.dataset.scope;render(false);return;}
  if(mode==='iraq-challenge'&&a==='iraq-game-start'){
    const topicQuestions=iraqQuestions.filter(question=>iraqGame.scope==='all'||question.topic===iraqGame.topic);
    if(!topicQuestions.length){openDetail('لا تتوفر أسئلة لهذا الموضوع','<p>يمكنك اختيار مراجعة الدرس كاملاً، أو العودة إلى الشرح.</p>');return;}
    iraqGame.names.X=document.querySelector('#iraq-team-x')?.value.trim()||'الفريق الأول';
    iraqGame.names.O=document.querySelector('#iraq-team-o')?.value.trim()||'الفريق الثاني';
    iraqGame.phase='play';render();return;
  }
  if(mode==='iraq-challenge'&&a==='iraq-game-answer'&&!iraqGame.answered){iraqGame.selected=n;render(false);return;}
  if(mode==='iraq-challenge'&&a==='iraq-game-submit'&&iraqGame.selected!==null){
    const question=iraqQuestions.filter(item=>iraqGame.scope==='all'||item.topic===iraqGame.topic)[iraqGame.questionIndex];
    iraqGame.wasCorrect=iraqGame.selected===question.answer;
    if(iraqGame.wasCorrect)iraqGame.scores[iraqGame.turn]++;
    iraqGame.answered=true;render(false);return;
  }
  if(mode==='iraq-challenge'&&['iraq-game-next','iraq-game-skip'].includes(a)){
    iraqGame.questionIndex++;iraqGame.turn=iraqGame.turn==='X'?'O':'X';
    iraqGame.selected=null;iraqGame.answered=false;iraqGame.wasCorrect=false;render(false);return;
  }
  if(mode==='iraq'&&a==='iraq-prev'){iraqPage=Math.max(0,iraqPage-1);render();return;}
  if(mode==='iraq'&&a==='iraq-next'){iraqPage=Math.min(iraqPages.length-1,iraqPage+1);render();return;}
  if(mode==='iraq'&&a==='iraq-page'){iraqPage=Math.max(0,Math.min(iraqPages.length-1,Number(el.dataset.page)));closeDetail();render();return;}
  if(mode==='iraq'&&a==='iraq-topics'){
    openDetail('موضوعات وطننا العراق',`<nav class="iraq-topic-menu" aria-label="انتقل مباشرة إلى موضوع">${iraqPages.map((page,index)=>btn('iraq-page',page.title,'arrow','',`data-page="${index}"`)).join('')}</nav>`,true);return;
  }
  if(mode==='iraq'&&a==='iraq-province-unit'&&el.dataset.route==='duhok'){mode='home';render();return;}
  if(mode==='iraq'&&a==='iraq-neighbor'){iraqActivity.neighbor=id;render(false);return;}
  if(mode==='iraq'&&a==='iraq-terrain'){iraqActivity.terrain=id;render(false);return;}
  if(mode==='iraq'&&a==='iraq-terrain-guess'){iraqActivity.terrainGuess=id;render(false);return;}
  if(mode==='iraq'&&a==='iraq-water-card'){iraqActivity.waterCard=id;render(false);return;}
  if(mode==='iraq'&&a==='iraq-timeline'){iraqActivity.timeline=id;render(false);return;}
  if(mode==='iraq'&&a==='iraq-zoom'){
    const image=document.querySelector('.iraq-earth-screenshot img');
    if(image)openDetail('لقطة Google Earth للعراق',`<figure class="iraq-earth-enlarged"><img src="${image.src}" alt="${escapeHTML(image.alt)}"><figcaption>لقطة شاشة من Google Earth؛ إسناد المصدر ظاهر أسفل الصورة.</figcaption></figure>`,true);
    return;
  }
  if(mode==='iraq'&&a==='iraq-map-zoom'){
    const image=document.querySelector('.iraq-cover-map img');
    if(image)openDetail('خريطة محافظات العراق',`<figure class="iraq-map-enlarged"><img src="${image.src}" alt="${escapeHTML(image.alt)}"></figure>`,true);
    return;
  }
  if(mode==='iraq'&&a==='iraq-map-note'){openDetail('حول الرسوم والخرائط',iraqMapNote());return;}
  if(mode==='iraq'&&a==='iraq-rainfall'){
    if(iraqActivity.rainfall.length<iraqRainfallOrder.length&&!iraqActivity.rainfall.includes(id)){
      iraqActivity.rainfall.push(id);iraqActivity.rainfallFeedback='';render(false);
    }return;
  }
  if(mode==='iraq'&&a==='iraq-rainfall-check'){
    iraqActivity.rainfallFeedback=iraqRainfallOrder.every((item,index)=>iraqActivity.rainfall[index]===item.id)
      ?'أحسنت! يزداد المطر في الشمال ويقل كلما اتجهنا جنوباً.'
      :'حاول مجدداً: يزداد المطر في الأقسام الشمالية ويقل كلما اتجهنا جنوباً.';
    render(false);return;
  }
  if(mode==='iraq'&&a==='iraq-rainfall-reset'){iraqActivity.rainfall=[];iraqActivity.rainfallFeedback='';render(false);return;}
  if(mode==='iraq'&&a==='iraq-water-resource'){iraqActivity.selectedResource=id;iraqActivity.waterFeedback='اختر الفائدة أو الوصف المطابق.';render(false);return;}
  if(mode==='iraq'&&a==='iraq-water-benefit'){
    if(!iraqActivity.selectedResource)return;
    if(iraqActivity.selectedResource===id){
      if(!iraqActivity.waterMatches.includes(id))iraqActivity.waterMatches.push(id);
      iraqActivity.selectedResource=null;
      iraqActivity.waterFeedback=iraqActivity.waterMatches.length===iraqWaterMatches.length?'أحسنت! طابقت جميع الموارد وفوائدها.':'مطابقة صحيحة! أكمل بقية الموارد.';
    }else iraqActivity.waterFeedback='ليست هذه المطابقة. أعد قراءة وصف المورد وحاول مرة أخرى.';
    render(false);return;
  }
  if(a==='activities'){trip=fresh();xo=xoFresh();mountain=mountainFresh();mode='journey';render();return;}
  if(a==='content'){mode='explore';tab='overview';render();return;}
  if(a==='settings'){openDetail('إعدادات العرض',`<div class="settings-panel"><p>اختر ما يناسب شاشة الصف.</p><div class="settings-actions">${btn('sound',muted?'تشغيل أصوات الواجهة':'كتم أصوات الواجهة',muted?'muted':'sound','quiet',`aria-pressed="${muted}"`)}${btn('fullscreen','ملء الشاشة','full','quiet')}</div><p class="small">الواجهة تعمل محلياً دون اتصال بالإنترنت.</p></div>`);return;}
  if(a==='home-topic'&&mode==='home'){showTopic(id);return;}
  if(a==='home-map'&&mode==='home'){showTopic('location');return;}
  if(a==='start'){trip=fresh();xo=xoFresh();mountain=mountainFresh();mode='journey';render();return;}
  if(a==='explore'){mode='explore';tab='overview';render();return;}
  if(a==='sound'){muted=!muted;ambience.setMuted(muted);saveAudioPreferences();saveXo();render(false);if(!muted)tone();return;}
  if(a==='fullscreen'){
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch{document.querySelector('#announcer').textContent='تعذر ملء الشاشة؛ يمكنك استخدام F11.';}return;
  }
  if(a==='topic'&&mode==='explore'){showTopic(id);return;}
  if(a==='tab'&&mode==='explore'){tab=id;render();return;}
  if(a==='place'&&mode==='explore'){
    const name=el.dataset.name,note=placeNotes[name];
    openDetail(`${el.dataset.prefix} ${name}`,note?`${note.image?picture(note.image,'detail-photo'):icon('district','large-icon')}<p class="lead">${note.text}</p><small class="source">النص المرفق · ${note.source}</small>`:`<div class="name-only">${icon('district')}<span>${el.dataset.prefix} ${name}</span></div>`);return;
  }
  if(a==='photo'&&mode==='explore'){const g=gallery[n];openDetail(g.title,`${picture(g.image,'gallery-detail')}<p>${g.text}</p>`,true);return;}
  // Route boundary: information mode cannot invoke any game or scoring action.
  if(mode!=='journey')return;
  if(a==='station'&&n<=trip.reached){stageTo(n);return;}
  if(a==='back'){stageTo(trip.stage-1);return;}
  if(a==='restart'){trip=fresh();xo=xoFresh();mountain=mountainFresh();render();return;}
  if(a==='next'){next();return;}
  if(a==='skip'){next(true);return;}
  if(a==='retry'){retry();return;}
  if(a==='xo-how'){showXoInfo('how');return;}
  if(a==='xo-review'){showXoInfo('review');return;}
  if(a==='xo-teacher'){showXoInfo('teacher');return;}
  if(a==='xo-reset-stats'){
    if(window.confirm('هل تريد تصفير نقاط وفوز وإحصاءات لعبة X/O المحفوظة؟')){xoTotals.X={wins:0,points:0};xoTotals.O={wins:0,points:0};xoTotals.correct=0;xoTotals.wrong=0;saveXo();closeDetail();render(false);}return;
  }
  if(a==='xo-start'&&trip.stage===7){
    xo.teams.X=document.querySelector('#xo-name-x')?.value.trim()||'الفريق الأول';
    xo.teams.O=document.querySelector('#xo-name-o')?.value.trim()||'الفريق الثاني';
    xo.started=true;saveXo();render();return;
  }
  if(a==='xo-new-round'&&trip.stage===7){xo=xoFresh();xo.started=true;saveXo();render();return;}
  if(a==='xo-cell'&&trip.stage===7){openXoQuestion(n);return;}
  if(a==='xo-answer'&&trip.stage===7){submitXoAnswer(n);return;}
  if(a==='xo-submit-fill'&&trip.stage===7){submitXoAnswer(xoDialog.querySelector('#xo-fill-answer')?.value||'');return;}
  if(a==='xo-continue'&&trip.stage===7){continueXo();return;}
  if(a==='mountain-how'){showMountainInfo('how');return;}
  if(a==='mountain-review'){showMountainInfo('review');return;}
  if(a==='mountain-length'&&trip.stage===8){mountain.length=Number(el.dataset.length);render(false);return;}
  if(a==='mountain-profile'&&trip.stage===8){mountain.profile=el.dataset.profile;render(false);return;}
  if(a==='mountain-start'&&trip.stage===8){mountain.teams.A.name=document.querySelector('#mountain-name-a')?.value.trim()||'فريق النسور';mountain.teams.B.name=document.querySelector('#mountain-name-b')?.value.trim()||'فريق القمم';mountain.started=true;render();return;}
  if(a==='mountain-new'&&trip.stage===8){const keepA=mountain.teams.A.name,keepB=mountain.teams.B.name;mountain=mountainFresh();mountain.teams.A.name=keepA;mountain.teams.B.name=keepB;mountain.started=true;render();return;}
  if(a==='mountain-ask'&&trip.stage===8){openMountainQuestion();return;}
  if(a==='mountain-answer'&&trip.stage===8){mountainAnswer(n);return;}
  if(a==='mountain-select'&&trip.stage===8){mountain.selection.includes(n)?mountain.selection=mountain.selection.filter(v=>v!==n):mountain.selection.push(n);renderMountainDialog();return;}
  if(a==='mountain-multi-submit'&&trip.stage===8){mountainAnswer();return;}
  if(a==='mountain-fill-submit'&&trip.stage===8){mountainAnswer(mountainDialog.querySelector('#mountain-fill')?.value||'');return;}
  if(a==='mountain-continue'&&trip.stage===8){continueMountain();return;}
  if(a==='map-point'&&trip.stage===1){trip.found.add('map');earn('map');el.classList.add('located');feedback('أحسنت! دهوك في أقصى شمال العراق.',true);return;}
  if(a==='discover'&&trip.stage===2){trip.found.add(id);earn(`discover:${id}`);el.classList.add('found');el.setAttribute('aria-pressed','true');el.querySelector('small').textContent='✓ اكتُشفت';document.querySelector('#feedback').textContent=`اكتشفت ${discoveryTopics.filter(topic=>trip.found.has(topic.id)).length} من ${discoveryTopics.length} بطاقات`;showTopic(id);return;}
  if(a==='select-card'&&trip.stage===3){trip.selected=id;document.querySelectorAll('.drag-card').forEach(c=>c.classList.toggle('selected',c.dataset.id===id));feedback('الآن المس التصنيف المناسب.',true);return;}
  if(a==='drop'&&trip.stage===3){drop(id);return;}
  if(a==='symbol'&&trip.stage===4){trip.match=id;document.querySelectorAll('.symbol-card').forEach(c=>c.classList.toggle('selected',c.dataset.id===id));return;}
  if(a==='match'&&trip.stage===4){
    if(trip.match===id){trip.matched.add(id);trip.match=null;earn(`match:${id}`);render(false);feedback('رائع! الرمز والمعلومة متطابقان.',true);}
    else feedback(trip.match?'تأمّل شكل الرمز، ثم جرّب معلومة أخرى.':'اختر رمزاً أولاً.');return;
  }
  if(a==='order'&&trip.stage===5){
    if(n===trip.order.length){trip.order.push(n);earn(`order:${n}`);render(false);feedback('خطوة موفّقة! أكمل المسار.',true);}
    else feedback('تذكّر: نحدّد الموقع، نكتشف، نطبّق، ثم نراجع.');return;
  }
  if(a==='answer'&&trip.stage===6&&trip.answers[trip.question]===undefined){
    trip.answers[trip.question]=n;const q=questions[trip.question];
    if(n===q.answer)earn(`quiz:${trip.question}`);else tone('hint');render(false);return;
  }
  if(a==='question-next'&&trip.stage===6){
    if(trip.answers[trip.question]===undefined)trip.skipped.add(`quiz:${trip.question}`);
    if(trip.question===questions.length-1)next();else{trip.question++;render();}return;
  }
}
document.addEventListener('click',e=>{
  if(performance.now()<ignoreClickUntil)return;
  const el=e.target.closest('[data-action]'); if(el&&!el.disabled)action(el);
});
document.addEventListener('input',e=>{
  if(!e.target.matches('[data-audio-volume]'))return;
  ambience.activate();
  masterVolume=Number(e.target.value)/100;
  ambience.setVolume(masterVolume);
  saveAudioPreferences();
});
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.duhok-region')){e.preventDefault();action(e.target);}
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}});
dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
xoDialog.addEventListener('cancel',e=>{e.preventDefault();});
xoDialog.addEventListener('click',e=>{if(e.target===xoDialog)e.preventDefault();});
mountainDialog.addEventListener('cancel',e=>{e.preventDefault();});
mountainDialog.addEventListener('click',e=>{if(e.target===mountainDialog)e.preventDefault();});
document.addEventListener('fullscreenchange',()=>{
  document.querySelectorAll('[data-action="fullscreen"]').forEach(button=>{
    const label=button.querySelector('span');
    const text=document.fullscreenElement?'إنهاء ملء الشاشة':'ملء الشاشة';
    if(label)label.textContent=text;else button.textContent=text;
  });
});
document.addEventListener('error',e=>{
  if(e.target.tagName!=='IMG')return;
  const img=e.target;img.hidden=true;
  const fallback=img.closest('.photo')?.querySelector('.fallback');if(fallback)fallback.hidden=false;
},true);
document.addEventListener('pointerdown',e=>{
  const card=e.target.closest('.drag-card');
  if(!card||card.disabled||mode!=='journey'||trip.stage!==3||e.button!==0||drag)return;
  drag={id:card.dataset.id,card,pointer:e.pointerId,x:e.clientX,y:e.clientY,moved:false};card.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointer)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>10){
    drag.moved=true;trip.selected=drag.id;drag.ghost=drag.card.cloneNode(true);drag.ghost.removeAttribute('data-action');drag.ghost.className='drag-ghost';drag.ghost.setAttribute('aria-hidden','true');drag.ghost.style.width=`${drag.card.offsetWidth}px`;document.body.append(drag.ghost);
  }
  if(drag.moved){e.preventDefault();drag.ghost.style.left=`${e.clientX}px`;drag.ghost.style.top=`${e.clientY}px`;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.drop-target');document.querySelectorAll('.drop-target').forEach(t=>t.classList.toggle('hover-drop',t===target));}
},{passive:false});
function endDrag(e,cancel=false){
  if(!drag||e.pointerId!==drag.pointer)return;
  const d=drag;drag=null;d.ghost?.remove();document.querySelectorAll('.drop-target').forEach(t=>t.classList.remove('hover-drop'));
  if(d.card.hasPointerCapture(e.pointerId))d.card.releasePointerCapture(e.pointerId);
  if(d.moved){ignoreClickUntil=performance.now()+350;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.drop-target');if(!cancel&&target)drop(target.dataset.id);else feedback('أفلت البطاقة فوق التصنيف، أو استخدم اللمس على خطوتين.');}
}
document.addEventListener('pointerup',e=>endDrag(e));
document.addEventListener('pointercancel',e=>endDrag(e,true));
render(false);
