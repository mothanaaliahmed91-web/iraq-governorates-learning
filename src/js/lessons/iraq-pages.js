import {
  iraqLearningGoals, iraqLocation, iraqTerrain, iraqClimate,
  iraqRainfallOrder, iraqWaterSources, iraqWaterMatches, iraqHistory, iraqUnity,
} from '../../data/iraq-data.js';
import {iraqQuestions} from '../../data/iraq-questions.js';
import {curriculumIndex} from '../../data/curriculum-index.js';

const googleEarthScene = 'https://earth.google.com/web/@36.11716125,48.1496112,7423.90655204a,11746313.48810792d,35y,0h,0t,0r/data=ChMaDQoJL20vMGQwNXE0GAJCAggBOgMKATBCAggASg0I____________ARAA?hl=ar';

export const iraqPages = [
  {topic:'all',title:'بوابة الاستكشاف'},
  {topic:'location',title:'الموقع'},
  {topic:'location',title:'الحدود والدول المجاورة'},
  {topic:'terrain',title:'التضاريس'},
  {topic:'climate',title:'المناخ'},
  {topic:'climate',title:'ترتيب الأمطار'},
  {topic:'water',title:'الموارد المائية'},
  {topic:'water',title:'مطابقة الموارد'},
  {topic:'provinces',title:'المحافظات'},
  {topic:'history',title:'الحضارات والكتابة'},
  {topic:'history',title:'الاستقرار والقرى القديمة'},
  {topic:'unity',title:'وحدة العراق'},
];

const icon = (name, cls='') => `<img class="icon ${cls}" src="assets/icons/${name}.svg" alt="" aria-hidden="true">`;
const escapeHTML = value => String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const actionButton = (action, id, selected=false) =>
  `<button type="button" class="iraq-touch-card ${selected?'is-selected':''}" data-action="${action}" data-id="${id}" aria-pressed="${selected}">`;

function cover() {
  return `<section class="iraq-page iraq-cover" aria-labelledby="iraq-cover-title">
    <div class="iraq-cover-copy"><p class="eyebrow">الوحدة الأولى · جغرافياً وتاريخياً</p><h1 id="iraq-cover-title">وطننا العراق</h1>
      <p class="iraq-cover-lead">رحلة بين الموقع والتضاريس والمناخ والمياه والحضارات.</p>
      <ul class="iraq-goals">${iraqLearningGoals.map(goal=>`<li>${goal}</li>`).join('')}</ul>
      <button class="iraq-start-button" type="button" data-action="iraq-page" data-page="1">${icon('compass')}<span>ابدأ الاستكشاف</span><b aria-hidden="true">←</b></button>
    </div>
    <div class="iraq-cover-scene">
      <button class="iraq-cover-map" type="button" data-action="iraq-map-zoom" aria-label="كبّر خريطة محافظات العراق">
        <img src="assets/images/iraq-governorates-map.png" alt="خريطة العراق المرفقة، تُظهر أسماء المحافظات وحدودها وأسماء الدول المجاورة" decoding="async">
      </button>
      <span class="iraq-cover-art-label">${icon('star')}خريطة المحافظات · الصورة المرفقة</span>
    </div>
  </section>`;
}

function locationPage() {
  return `<section class="iraq-page" aria-labelledby="iraq-page-title">
    <header class="iraq-page-heading"><div><p class="eyebrow">المحطة ١ · الموقع الجغرافي</p><h1 id="iraq-page-title">أين يقع وطننا؟</h1><p>${iraqLocation.text}</p></div></header>
    <div class="iraq-location-scene">
      <article class="iraq-earth-card"><button type="button" class="iraq-earth-screenshot" data-action="iraq-zoom" aria-label="كبّر لقطة Google Earth للعراق"><img src="assets/images/iraq-google-earth-screenshot.png" alt="لقطة شاشة فعلية من Google Earth تُظهر العراق وحدوده باللون الأحمر وموقعه في المنطقة، مع إسناد Google ظاهراً أسفل الصورة" decoding="async"><span>${icon('full')}<b>المس لتكبير لقطة الخريطة</b></span></button><div class="iraq-earth-copy"><p class="eyebrow">لقطة فعلية من Google Earth</p><h2>العراق وجواره على الكرة الأرضية</h2><p>تُظهر الصورة العراق وموقعه بين البلدان المجاورة. المس الصورة لتكبيرها، أو افتح Earth لتحريك المشهد بنفسك.</p><a class="iraq-earth-link" href="${googleEarthScene}" target="_blank" rel="noopener noreferrer">${icon('full')}<span>استكشف المشهد التفاعلي</span><b aria-hidden="true">↗</b></a><small>مصدر اللقطة: Google Earth؛ إسناد المصدر ظاهر في الصورة. يتطلب المشهد التفاعلي اتصالاً بالإنترنت.</small></div></article>
      <article class="iraq-location-note"><span class="iraq-fact-icon">${icon('pin')}</span><p>يقع العراق في الجزء الجنوبي الغربي من قارة آسيا، وفي القسم الشمالي الشرقي من العالم العربي.</p><span class="iraq-fact-tag">الموقع الجغرافي</span></article>
    </div>
  </section>`;
}

function bordersPage(state) {
  const current=iraqLocation.neighbors.find(item=>item.id===state.neighbor);
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المحطة ٢ · الدول المجاورة</p><h1 id="iraq-page-title">نتعرّف إلى الحدود</h1><p>المس الدولة لتظهر جهة موقعها كما وردت في المادة.</p></div><div class="iraq-compass" aria-hidden="true">شمال <b>↑</b><span>غرب ←　　→ شرق</span><b>↓</b> جنوب</div></header>
    <div class="iraq-borders-layout"><div class="iraq-country-grid">${iraqLocation.neighbors.map(item=>`${actionButton('iraq-neighbor',item.id,item.id===state.neighbor)}<span class="iraq-country-arrow" aria-hidden="true">${item.icon}</span><small>المس لمعرفة الجهة</small></button>`).join('')}</div>
      <aside class="iraq-neighbor-reveal" aria-live="polite"><div class="iraq-reveal-glow">${icon('pin')}</div><p class="eyebrow">معلومة الموقع</p><h2>${current?current.name:'اختر دولة مجاورة'}</h2><p>${current?`تقع ${current.name} إلى جهة <strong>${current.direction}</strong> من العراق.`:'اختر إحدى البطاقات لتظهر جهة موقعها.'}</p><span class="iraq-map-caveat">الاتجاهات مستندة إلى النص المنهجي؛ لا تعرض هذه الشاشة حدوداً مرسومة.</span></aside>
    </div></section>`;
}

const terrainArt = {
  mountains:'<path d="m15 94 44-56 25 32 35-52 49 76Z" fill="#568f83"/><path d="m84 54 35-36 33 51-21-12-13 12-13-12-12 9Z" fill="#e5ece5"/><path d="M10 97h160" stroke="#6bd9dc" stroke-width="4"/>',
  rolling:'<path d="M8 94q28-37 57 0t57 0 57 0v13H8Z" fill="#7ea975"/><path d="M8 106q28-35 57 0t57 0 57 0" fill="none" stroke="#d1c17e" stroke-width="5"/>',
  alluvial:'<path d="M9 46q38 31 75 0t77 0" fill="none" stroke="#62dce2" stroke-width="8"/><path d="M10 67q39 28 77 0t75 0" fill="none" stroke="#43aab4" stroke-width="7"/><path d="M8 100h156" stroke="#b6a26c" stroke-width="8"/>',
  'western-plateau':'<path d="M12 101V69l26-10V43h38V30h78v71Z" fill="#9c8061"/><path d="M13 103h142" stroke="#dbbd84" stroke-width="5"/>',
};
function terrainPage(state) {
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المحطة ٣ · أشكال سطح الأرض</p><h1 id="iraq-page-title">أربعة أقسام للتضاريس</h1><p>المس بطاقة؛ يضيء الرسم وتظهر تسمية الموقع. الرسوم رمزية وليست خريطة.</p></div></header>
    ${iraqMapPlaceholder()}<div class="iraq-terrain-deck">${iraqTerrain.map((item,index)=>{const selected=state.terrain===item.id;return `${actionButton('iraq-terrain',item.id,selected)}<svg viewBox="0 0 180 120" aria-hidden="true">${terrainArt[item.id]}</svg><span class="iraq-terrain-number">0${index+1}</span><strong>${item.title}</strong><span class="iraq-terrain-description">${selected?item.location:'المس لعرض الوصف والموقع'}</span></button>`;}).join('')}</div>
    <aside class="iraq-open-question"><div><strong>سؤال الخريطة الصماء</strong><p>أي التضاريس تشغل مساحة أكبر؟</p><small>النص المتاح لا يحسم الإجابة؛ نحتاج إلى الخريطة المنهجية رقم (١).</small></div><div>${iraqTerrain.map(item=>`<button type="button" class="${state.terrainGuess===item.id?'is-selected':''}" data-action="iraq-terrain-guess" data-id="${item.id}" aria-pressed="${state.terrainGuess===item.id}">${item.title}</button>`).join('')}${state.terrainGuess?'<p role="status">تبقى الإجابة مفتوحة حتى تتوفر الخريطة المعتمدة.</p>':''}</div></aside>
  </section>`;
}

function iraqMapPlaceholder() {
  return `<button type="button" class="iraq-map-notice" data-action="iraq-map-note"><span>${icon('pin')}</span><strong>رسوم توضيحية لأشكال سطح العراق</strong><small>لا تحدد هذه الرسوم مواقع أو حدوداً دقيقة. المس لقراءة التنبيه.</small></button>`;
}

function climatePage() {
  const regions=[
    {name:'الشمال',symbol:'❄',className:'north',facts:['تنخفض الحرارة شتاءً.','تكون الحرارة أكثر اعتدالاً صيفاً؛ لذلك يقصد الناس الشمال للراحة والاستجمام.']},
    {name:'الوسط',symbol:'☀',className:'center',facts:['ترتفع درجات الحرارة صيفاً.','يتميز الطقس بالاعتدال شتاءً.']},
    {name:'الجنوب',symbol:'☀',className:'south',facts:['ترتفع درجات الحرارة صيفاً.','يتميز الطقس بالاعتدال شتاءً.']},
  ];
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المحطة ٤ · مناخ متنوع</p><h1 id="iraq-page-title">تختلف الأجواء بين المناطق</h1><p>${iraqClimate[0]} ${iraqClimate[2]}</p></div><div class="iraq-weather-icons" aria-hidden="true"><span class="rain">☂</span><span class="sun">☀</span><span class="snow">❄</span></div></header>
    <div class="iraq-climate-regions">${regions.map(region=>`<article class="iraq-climate-region ${region.className}"><span class="iraq-weather-symbol" aria-hidden="true">${region.symbol}</span><h2>${region.name} العراق</h2><ul>${region.facts.map(fact=>`<li>${fact}</li>`).join('')}</ul><div class="iraq-rain-dots" aria-label="مطر شتوي يكثر في الشمال ويقل جنوباً"><i></i><i></i><i></i><i></i><i></i></div></article>`).join('')}</div>
    <p class="iraq-climate-note"><span aria-hidden="true">☂</span> يقتصر المطر على فصل الشتاء، ويقل كلما اتجهنا من الشمال إلى الجنوب. الرموز للتوضيح ولا تمثل كميات أو مواقع دقيقة.</p>
  </section>`;
}

function rainfallPage(state) {
  const labels=iraqRainfallOrder.map(item=>item.label);
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">نشاط المناخ · ترتيب باللمس</p><h1 id="iraq-page-title">رتّب وفرة الأمطار</h1><p>المس الأقاليم من الأكثر مطراً إلى الأقل، كما توضح المادة.</p></div><div class="iraq-rain-scene" aria-hidden="true">☁<span>☂　☂　☂</span></div></header>
    <div class="iraq-rain-activity"><div class="iraq-rain-order" aria-label="الترتيب الذي اختاره الطالب">${state.rainfall.map((id,index)=>`<div><b>${index+1}</b><span>${iraqRainfallOrder.find(item=>item.id===id)?.label}</span></div>`).join('')||'<p class="iraq-empty-order">ابدأ باختيار المنطقة الأكثر مطراً.</p>'}</div>
      <div class="iraq-rain-options">${iraqRainfallOrder.map(item=>`<button type="button" data-action="iraq-rainfall" data-id="${item.id}" ${state.rainfall.includes(item.id)||state.rainfall.length===iraqRainfallOrder.length?'disabled':''}>${item.label}</button>`).join('')}</div>
      <div class="iraq-activity-feedback" role="status" aria-live="polite">${state.rainfallFeedback||'تذكّر: يزداد المطر في الأقسام الشمالية ويقل كلما اتجهنا جنوباً.'}</div>
      <div class="iraq-activity-actions"><button class="iraq-secondary-button" data-action="iraq-rainfall-reset" type="button">إعادة الترتيب</button><button class="iraq-primary-button" data-action="iraq-rainfall-check" type="button" ${state.rainfall.length!==iraqRainfallOrder.length?'disabled':''}>تحقّق من الترتيب</button></div>
    </div>
  </section>`;
}

function waterPage(state) {
  const cards=[
    {id:'sources',title:'مصادر الماء',symbol:'☁',detail:iraqWaterSources[0]},
    {id:'surface',title:'المياه السطحية',symbol:'≈',detail:iraqWaterSources[1]},
    {id:'rivers',title:'الأنهار المهمة',symbol:'〰',detail:iraqWaterSources[2]},
    {id:'wetlands',title:'موارد سطحية أخرى',symbol:'◉',detail:iraqWaterSources[3]},
    {id:'lakes',title:'بحيرات العراق',symbol:'◌',detail:iraqWaterSources[4]},
    {id:'benefits',title:'أهمية الموارد',symbol:'✧',detail:iraqWaterSources[5]},
  ];
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المحطة ٥ · الماء مورد للحياة</p><h1 id="iraq-page-title">موارد مائية متنوعة</h1><p>المس بطاقة لفتح المعلومة المنهجية.</p></div><div class="iraq-water-art" aria-hidden="true"><svg viewBox="0 0 300 120"><path d="M0 68q38-28 76 0t76 0 76 0 76 0" fill="none" stroke="#74e3e6" stroke-width="13"/><path d="M0 94q38-26 76 0t76 0 76 0 76 0" fill="none" stroke="#438ead" stroke-width="9"/></svg></div></header>
    <div class="iraq-water-cards">${cards.map(card=>{const selected=state.waterCard===card.id;return `${actionButton('iraq-water-card',card.id,selected)}<span class="iraq-water-symbol" aria-hidden="true">${card.symbol}</span><strong>${card.title}</strong><span>${selected?card.detail:'المس لقراءة التفاصيل'}</span></button>`;}).join('')}<p class="iraq-map-disclaimer">البطاقات للتعرّف إلى الموارد، ولا تمثل مواقعها على الخريطة.</p></div>
  </section>`;
}

function waterMatchPage(state) {
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">نشاط المياه · مطابقة باللمس</p><h1 id="iraq-page-title">صِل المورد بما يميّزه</h1><p>اختر مورداً، ثم المس وصفه المطابق.</p></div><span class="iraq-match-progress">${state.waterMatches.length} / ${iraqWaterMatches.length}</span></header>
    <div class="iraq-match-board"><div><h2>المورد</h2>${iraqWaterMatches.map(item=>`<button type="button" class="iraq-match-option ${state.selectedResource===item.id?'is-selected':''} ${state.waterMatches.includes(item.id)?'is-matched':''}" data-action="iraq-water-resource" data-id="${item.id}" ${state.waterMatches.includes(item.id)?'disabled':''}>${item.resource}</button>`).join('')}</div><div><h2>الوصف أو الفائدة</h2>${iraqWaterMatches.map(item=>`<button type="button" class="iraq-match-option ${state.waterMatches.includes(item.id)?'is-matched':''}" data-action="iraq-water-benefit" data-id="${item.id}" ${state.waterMatches.includes(item.id)?'disabled':''}>${item.benefit}</button>`).join('')}</div></div>
    <p class="iraq-activity-feedback" role="status" aria-live="polite">${state.waterFeedback||'المس مورداً أولاً، ثم ابحث عن وصفه أو فائدته.'}</p>
  </section>`;
}

function provincesPage() {
  const provinces=curriculumIndex.filter(entry=>entry.id!=='iraq');
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المحطة ٨ · التنظيم الإداري</p><h1 id="iraq-page-title">محافظات وطننا</h1><p>وفق المادة المنهجية، يتكون العراق من ثماني عشرة محافظة.</p></div><div class="iraq-province-total"><strong>١٨</strong><span>محافظة</span></div></header>
    <div class="iraq-province-scene"><div class="iraq-province-tiles" role="img" aria-label="ثمانية عشر رمزاً متساوياً تمثل عدد المحافظات"><span>١</span><span>٢</span><span>٣</span><span>٤</span><span>٥</span><span>٦</span><span>٧</span><span>٨</span><span>٩</span><span>١٠</span><span>١١</span><span>١٢</span><span>١٣</span><span>١٤</span><span>١٥</span><span>١٦</span><span>١٧</span><span>١٨</span></div><p>تعرّف إلى عدد محافظات وطننا، ثم اختر من الوحدات التعليمية المتاحة أدناه.</p></div>
    <div class="iraq-province-status" aria-label="حالة وحدات المحافظات المتوفرة في الفهرس">${provinces.map(entry=>`<button type="button" data-action="iraq-province-unit" data-route="${entry.route}" ${entry.status==='available'?'':'disabled'}><span class="iraq-unit-status">${entry.status==='available'?'متاحة الآن':'قريباً'}</span><strong>${entry.title}</strong><small>${entry.description}</small></button>`).join('')}</div>
  </section>`;
}

function historyPage(state, early=false) {
  const entries=early?iraqHistory.slice(4):iraqHistory.slice(0,4);
  const heading=early?'كيف بدأت القرى والاستقرار؟':'حضارات وإسهامات عبر العصور';
  const subtitle=early?'نتتبّع العيش القديم ثم نشوء القرى والزراعة.':'المس محطة زمنية؛ تظهر المعلومة تدريجياً.';
  return `<section class="iraq-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المحطة ${early?10:9} · نافذة على التاريخ</p><h1 id="iraq-page-title">${heading}</h1><p>${subtitle}</p></div><div class="iraq-timeline-line" aria-hidden="true"></div></header>
    <div class="iraq-timeline-cards">${entries.map((entry,index)=>{const id=`${early?'early':'civil'}-${index}`;const selected=state.timeline===id;return `${actionButton('iraq-timeline',id,selected)}<span class="iraq-timeline-node">${early?index+5:index+1}</span><strong>${entry.title}</strong><span>${selected?entry.text:'المس لفتح المعلومة'}</span></button>`;}).join('')}</div>
  </section>`;
}

function unityPage() {
  return `<section class="iraq-page iraq-unity-page" aria-labelledby="iraq-page-title"><header class="iraq-page-heading"><div><p class="eyebrow">المشهد الختامي · وطن يجمعنا</p><h1 id="iraq-page-title">تنوعٌ يقوّي وحدة العراق</h1><p>من اختلاف البيئات تنشأ صلات تجمع المحافظات.</p></div>${icon('star','iraq-unity-star')}</header>
    <div class="iraq-unity-flow"><div class="iraq-unity-pillar"><span>١</span><strong>تنوع التضاريس والمناخ</strong></div><b aria-hidden="true">←</b><div class="iraq-unity-pillar"><span>٢</span><strong>النبات والمنتجات الزراعية</strong></div><b aria-hidden="true">←</b><div class="iraq-unity-pillar"><span>٣</span><strong>التبادل وسهولة التنقل والصلات الاجتماعية</strong></div></div>
    <blockquote>${iraqUnity}</blockquote><div class="iraq-unity-seal">${icon('compass')}<span>تنوعنا يربطنا<br><small>وطننا العراق</small></span></div>
  </section>`;
}

export function renderIraqPage(pageIndex, state) {
  switch(pageIndex) {
    case 0:return cover();
    case 1:return locationPage();
    case 2:return bordersPage(state);
    case 3:return terrainPage(state);
    case 4:return climatePage();
    case 5:return rainfallPage(state);
    case 6:return waterPage(state);
    case 7:return waterMatchPage(state);
    case 8:return provincesPage();
    case 9:return historyPage(state);
    case 10:return historyPage(state,true);
    case 11:return unityPage();
    default:return cover();
  }
}

export function renderIraqChallengeSetup(scope='topic', pageIndex=0) {
  const topic=iraqPages[pageIndex]?.topic;
  const topicLabel=iraqPages[pageIndex]?.title||'الدرس كاملاً';
  const topicCount=iraqQuestions.filter(item=>item.topic===topic).length;
  const topicCountLabel=topicCount===1?'سؤال واحد':`${topicCount} أسئلة`;
  return `<section class="iraq-page iraq-game-setup"><div class="iraq-game-emblem">${icon('star')}</div><p class="eyebrow">تحدّي الفريقين · تجربة تعليمية اختيارية</p><h1>مستعدّون للتحدي؟</h1><p>يمكن إنهاء المنافسة أو تخطي أي سؤال والعودة إلى صفحة الشرح نفسها.</p>
    <div class="iraq-game-scope"><button type="button" class="${scope==='topic'?'is-selected':''}" data-action="iraq-game-scope" data-scope="topic" ${topic==='all'?'disabled':''}>${topicLabel}<small>${topicCountLabel} من هذا الموضوع</small></button><button type="button" class="${scope==='all'?'is-selected':''}" data-action="iraq-game-scope" data-scope="all">مراجعة الدرس كاملاً<small>${iraqQuestions.length} سؤالاً دون تكرار</small></button></div>
    <div class="iraq-team-names"><label>الفريق الأول<input id="iraq-team-x" maxlength="28" value="الفريق الأول"></label><label>الفريق الثاني<input id="iraq-team-o" maxlength="28" value="الفريق الثاني"></label></div>
    <div class="iraq-game-actions"><button type="button" class="iraq-primary-button" data-action="iraq-game-start">ابدأ المنافسة</button><button type="button" class="iraq-secondary-button" data-action="iraq-game-exit">خروج إلى الشرح</button></div>
  </section>`;
}

export function renderIraqChallenge(game) {
  const question=iraqQuestions.filter(item=>game.scope==='all'||item.topic===game.topic)[game.questionIndex];
  if(!question)return `<section class="iraq-page iraq-game-result"><span class="iraq-game-emblem">${icon('star')}</span><p class="eyebrow">انتهت الأسئلة المتاحة</p><h1>أحسنتم يا أبطال!</h1><div class="iraq-final-scores"><p>${escapeHTML(game.names.X)}<strong>${game.scores.X}</strong></p><p>${escapeHTML(game.names.O)}<strong>${game.scores.O}</strong></p></div><p>استُخدمت أسئلة البنك مرة واحدة لكل سؤال.</p><button type="button" class="iraq-primary-button" data-action="iraq-game-exit">العودة إلى صفحة الشرح</button></section>`;
  const team=game.turn;
  return `<section class="iraq-page iraq-game-play"><header class="iraq-game-scoreboard"><div class="${team==='X'?'is-turn':''}"><span>${escapeHTML(game.names.X)}</span><strong>${game.scores.X}</strong></div><p>السؤال ${game.questionIndex+1} من ${iraqQuestions.filter(item=>game.scope==='all'||item.topic===game.topic).length}</p><div class="${team==='O'?'is-turn':''}"><span>${escapeHTML(game.names.O)}</span><strong>${game.scores.O}</strong></div></header>
    <article class="iraq-question-card"><p class="eyebrow">دور ${escapeHTML(game.names[team])}</p><h1>${question.question}</h1><div class="iraq-answer-grid">${question.options.map((option,index)=>`<button type="button" class="${game.selected===index?'is-selected':''} ${game.answered&&index===question.answer?'is-correct':''}" data-action="iraq-game-answer" data-index="${index}" ${game.answered?'disabled':''}>${option}</button>`).join('')}</div>${game.answered?`<p class="iraq-answer-feedback" role="status">${game.wasCorrect?'إجابة صحيحة، أحسنتم!':'ليست الإجابة الصحيحة. الإجابة: '+question.options[question.answer]}</p>`:''}</article>
    <div class="iraq-game-actions"><button type="button" class="iraq-primary-button" data-action="${game.answered?'iraq-game-next':'iraq-game-submit'}" ${!game.answered&&game.selected===null?'disabled':''}>${game.answered?'السؤال التالي':'تحقّق من الإجابة'}</button><button type="button" class="iraq-secondary-button" data-action="iraq-game-skip">تخطّي السؤال</button><button type="button" class="iraq-secondary-button" data-action="iraq-game-exit">خروج إلى الشرح</button></div>
  </section>`;
}

export function iraqMapNote() {
  return `<p>هذا رسم توضيحي للفكرة، ولا يحدد حدوداً أو مواقع جغرافية دقيقة. لتعرّف هذه المواقع على خريطة، نحتاج إلى الخريطة التعليمية المعتمدة.</p>`;
}
