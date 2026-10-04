// Educational text: owner-supplied دهوك_المحتوى_العربي.md, sections 8–12.
// No network sources. District names are supplied directly by the project owner.
export const media = {
  map: {src:'assets/images/provinces/duhok-learning-map-neon.png', alt:'الخريطة التعليمية المرفقة، تبرز دهوك في شمال العراق'},
  iraq: {src:'maps/interactive/4.png', alt:'خريطة العراق المُحدّثة من ملف الخريطة التفاعلية، وتظهر فيها محافظة دهوك'},
  city: {src:'assets/images/backgrounds/8379093ec2d2cbb45eaa89d12a6effb9.jpg', alt:'مشهد مدينة وجبال ومسطح مائي من صور الدرس'},
  water: {src:'assets/images/backgrounds/252b6fe4b2d4d8c9f82d1619b483efba.jpg', alt:'شلال بين الصخور ومياه في مقدمة الصورة'},
  bridge: {src:'assets/images/backgrounds/349522a9d41dccf9ac0c5f92cac964b6.jpg', alt:'صورة الجسر الحجري في زاخو فوق الماء'},
  referenceSnow: {src:'maps/reference/1.jpg', alt:'مشهد جبلي شتوي مغطى بالثلوج من الصور المرجعية المرفقة'},
  referenceCamp: {src:'maps/reference/2.jpg', alt:'مشهد صخور جبلية وثلوج مع جلسة خارجية من الصور المرجعية المرفقة'},
  referenceCave: {src:'maps/reference/3.jpg', alt:'مشهد لمدينة تُرى من فتحة كهف، من الصور المرجعية المرفقة؛ لا يحدد الملف اسم الموقع'},
};
export const topics = [
  {id:'location', title:'موقع دهوك', icon:'pin', tag:'في أقصى الشمال', image:'map', source:'الصفحة 8', facts:['تقع محافظة دهوك في أقصى شمال وطننا العراق.','وهي إحدى محافظات إقليم كردستان العراق.']},
  {id:'terrain', title:'التضاريس', icon:'mountain', tag:'جبال وسهول', image:'city', source:'الصفحتان 8 و9', facts:['يغلب الطابع الجبلي على تضاريس دهوك.','جبال طوروس جزء من تضاريس المنطقة الجبلية.','تقع السهول في الجنوب والجنوب الغربي، ومنها سهل زاخو والسندي وسهل العمادية.']},
  {id:'climate', title:'المناخ', icon:'climate', tag:'شتاء وصيف', source:'الصفحة 9', facts:['شتاء دهوك بارد، تكثر فيه الأمطار والثلوج.','صيفها معتدل، بحسب وصف المنهج المرفق.']},
  {id:'water', title:'الموارد المائية', icon:'water', tag:'أنهار وينابيع', image:'water', source:'الصفحتان 9 و10', facts:['من مواردها نهر دجلة وروافده والأنهار الصغيرة.','الخابور من روافد دجلة، ويجري في أقسام من المحافظة.','تنتشر العيون والينابيع، وتُستخدم مياهها في المنزل والزراعة.','تساعد بحيرة دهوك وسدها على خزن المياه.']},
  {id:'landmarks', title:'المعالم الحضارية والطبيعية', icon:'bridge', tag:'زاخو والمصايف', image:'bridge', source:'الصفحتان 11 و12', facts:['الجسر العباسي في زاخو مبني بالحجر فوق نهر الخابور.','من مصايف المحافظة: زاويتة وسرسنك وسولاف.','يساعد اعتدال الصيف على الراحة والاستجمام في المصايف.']},
];
export const discoveryTopics = [
  topics.find(topic => topic.id === 'climate'),
  topics.find(topic => topic.id === 'water'),
  topics.find(topic => topic.id === 'terrain'),
  topics.find(topic => topic.id === 'location'),
  {
    id:'economy-tourism', title:'الاقتصاد والسياحة', icon:'wheat', secondaryIcon:'bridge',
    tag:'زراعة وتجارة ومصايف', source:'الصفحتان 10 و11',
    facts:[
      'ساعد توافر مصادر المياه والتربة الخصبة على تنوع المحاصيل الزراعية، ومنها القمح والبنجر والتبغ والجوز واللوز والتين.',
      'من الصناعات المذكورة في المحافظة: الصناعات الغذائية والإنشائية.',
      'تسهم المنافذ الحدودية مع تركيا وسوريا في تنشيط التبادل التجاري.',
      'من مواقع الاصطياف المذكورة: زاويتة وسواره توكا وسرسنك وأنشكاي وسولاف وعيون المياه المعدنية.',
    ],
  },
];
export const districts = ['دهوك','زاخو','سميل','العمادية','بردرش','عقرة','شيخان','باتيفا'];
export const subdistricts = ['خانكي','زاويتة','مانكيش','بامرني'];
export const placeNotes = {
  'زاخو': {text:'في زاخو الجسر العباسي، وهو مشيّد بالحجر فوق نهر الخابور.', source:'الصفحة 12', image:'bridge'},
  'العمادية': {text:'توجد عيون وينابيع في منطقة العمادية.', source:'الصفحة 10'},
  'زاويتة': {text:'يذكر النص مصيف زاويتة ضمن المصايف في محافظة دهوك.', source:'الصفحة 11'},
};
export const gallery = [
  {image:'map', title:'موقع دهوك', text:'شاهد موضع دهوك في شمال العراق.'},
  {image:'city', title:'المدينة والطبيعة', text:'لاحظ الجبال والمباني والمياه في الصورة.'},
  {image:'water', title:'شاهد الماء', text:'صورة من المرفقات لتأمّل الماء والتضاريس؛ لم يرد اسم هذا الشلال في النص.'},
  {image:'bridge', title:'جسر زاخو', text:'لاحظ القناطر الحجرية والماء أسفل الجسر.'},
  {image:'iraq', title:'العراق ومحافظاته', text:'ابحث بعينيك عن دهوك في أعلى الخريطة.'},
  {image:'referenceSnow', title:'مشهد جبلي شتوي', text:'تأمل الثلوج والمرتفعات في الصورة المرفقة. الملف لا يذكر اسم الموقع.'},
  {image:'referenceCamp', title:'الجبال والطقس البارد', text:'تأمل الصخور والثلوج في هذا المشهد المرجعي، ولا تنسب الصورة إلى موقع محدد.'},
  {image:'referenceCave', title:'مدينة بين المرتفعات', text:'مشهد لمدينة من فتحة كهف في صورة مرجعية؛ لا يحدد الملف المدينة أو موقعها.'},
];
export const classifyCards = [
  {id:'north', label:'أقصى شمال العراق', target:'location'},
  {id:'rain', label:'شتاء بارد ممطر', target:'climate'},
  {id:'river', label:'دجلة والخابور', target:'water'},
  {id:'peaks', label:'جبال طوروس', target:'terrain'},
];
export const matches = [
  {id:'terrain', icon:'mountain', label:'جبال طوروس'},
  {id:'water', icon:'water', label:'العيون والينابيع'},
  {id:'landmarks', icon:'bridge', label:'جسر زاخو الحجري'},
];
export const orderSteps = ['أحدّد موقع دهوك','أكتشف الجبال والماء','أطبّق ما تعلّمت','أراجع معلوماتي'];
export const questions = [
  {q:'تبحث عن دهوك في خريطة العراق. إلى أي جهة تتجه؟', options:['الجنوب','أقصى الشمال','الوسط'], answer:1, icon:'pin', clue:'تذكّر بطاقة الموقع وأعلى الخريطة.', success:'صحيح! دهوك في أقصى شمال العراق.', source:'8'},
  {q:'لماذا يقصد بعض الناس مصايف دهوك صيفاً؟', options:['لاعتدال صيفها','لأنها بلا جبال','لأنها تقع في الجنوب'], answer:0, icon:'climate', clue:'فكّر في وصف الصيف في بطاقة المناخ.', success:'أحسنت! اعتدال الصيف يساعد على الراحة والاستجمام.', source:'9 و11'},
  {q:'أي مورد ورد استخدامه في المنزل والزراعة؟', options:['حجارة الجسر','القمم الجبلية','مياه العيون والينابيع'], answer:2, icon:'water', clue:'ابحث عن مصدر الماء.', success:'رائع! العيون والينابيع مورد للماء.', source:'10'},
  {q:'من أنا؟ جسر حجري فوق الخابور في زاخو.', options:['سد دهوك','الجسر العباسي','مصيف سولاف'], answer:1, icon:'bridge', clue:'اسم معلم شاهدت قناطره في الصورة.', success:'صحيح! إنه الجسر العباسي في زاخو.', source:'12'},
  {q:'صح أم خطأ: لا توجد سهول في دهوك لأن طابعها جبلي.', options:['صح','خطأ'], answer:1, icon:'mountain', clue:'تذكّر تنوّع التضاريس جنوب المحافظة.', success:'أحسنت! فيها سهول أيضاً، مع سيادة الطابع الجبلي.', source:'8 و9'},
];

// بنك لعبة X/O: النص والأسئلة أدناه من المادة المرفقة من مالك المشروع فقط.
// لا تُعرض الإجابة أو التفسير قبل أن يختار الطالب جوابه.
export const xoQuestions = [
  {id:1,type:'choice',difficulty:'easy',q:'أين تقع محافظة دهوك؟',options:['في شمال العراق','في جنوب العراق','في وسط العراق'],answer:0,explanation:'دهوك تقع في شمال العراق.'},
  {id:2,type:'choice',difficulty:'easy',q:'تقع محافظة دهوك ضمن أي إقليم؟',options:['إقليم كردستان العراق','إقليم البصرة','إقليم الفرات الأوسط'],answer:0,explanation:'دهوك من محافظات إقليم كردستان العراق.'},
  {id:3,type:'choice',difficulty:'medium',q:'تقع دهوك في أي جهة من العراق؟',options:['شمال غرب العراق','جنوب شرق العراق','وسط العراق'],answer:0,explanation:'تذكر المادة أن دهوك تقع في شمال غرب العراق.'},
  {id:4,type:'choice',difficulty:'easy',q:'أي دولة تحد دهوك من الشمال؟',options:['تركيا','إيران','الكويت'],answer:0,explanation:'يحد دهوك من الشمال جمهورية تركيا.'},
  {id:5,type:'choice',difficulty:'medium',q:'ما المحافظة التي تحد دهوك من الشرق؟',options:['أربيل','نينوى','كركوك'],answer:0,explanation:'تحد محافظة أربيل دهوك من الشرق.'},
  {id:6,type:'choice',difficulty:'medium',q:'ما المحافظة التي تحد دهوك من الغرب؟',options:['نينوى','السليمانية','واسط'],answer:0,explanation:'تحد محافظة نينوى دهوك من الغرب.'},
  {id:7,type:'choice',difficulty:'easy',q:'يبلغ عدد أقضية محافظة دهوك:',options:['ثمانية أقضية','ثلاثة أقضية','اثنا عشر قضاءً'],answer:0,explanation:'تضم القائمة التعليمية ثمانية أقضية.'},
  {id:8,type:'choice',difficulty:'medium',q:'ما قضاء دهوك الذي يحده من الشمال جبال طوروس؟',options:['قضاء زاخو','قضاء العمادية','قضاء سميل'],answer:0,explanation:'يحد قضاء زاخو من الشمال جبال طوروس.'},
  {id:9,type:'choice',difficulty:'hard',q:'كيف يكون امتداد جبال طوروس في قضاء زاخو؟',options:['شمالاً حتى حدود العراق مع تركيا','جنوباً حتى البصرة','شرقاً حتى إيران فقط'],answer:0,explanation:'تمتد جبال طوروس شمالاً حتى حدود العراق مع تركيا.'},
  {id:10,type:'choice',difficulty:'medium',q:'ما الذي يغلب على سطح محافظة دهوك؟',options:['الطابع الجبلي','الطابع الصحراوي','الطابع الساحلي'],answer:0,explanation:'يغلب على سطح دهوك الطابع الجبلي.'},
  {id:11,type:'choice',difficulty:'easy',q:'تنقسم تضاريس محافظة دهوك إلى:',options:['منطقة جبلية وهضاب وسهول','منطقة صحراوية وبحرية','سهول ساحلية فقط'],answer:0,explanation:'تتكون تضاريس دهوك من منطقة جبلية وهضاب وسهول.'},
  {id:12,type:'choice',difficulty:'medium',q:'أي جزء من دهوك يشغل مساحة واسعة منها؟',options:['المنطقة الجبلية','المنطقة الساحلية','الصحراء'],answer:0,explanation:'تشغل المنطقة الجبلية مساحة واسعة من المحافظة.'},
  {id:13,type:'choice',difficulty:'hard',q:'أي جبل يُعرف باسم الجبل الأبيض؟',options:['جبل بيخير','جبل حمرين','جبل سنجار'],answer:0,explanation:'جبل بيخير هو المعروف بالجبل الأبيض.'},
  {id:14,type:'choice',difficulty:'hard',q:'أي من الآتي من جبال دهوك؟',options:['جبل باكرمان','جبل إيفرست','جبل أحد'],answer:0,explanation:'جبل باكرمان من جبال دهوك المذكورة في المادة.'},
  {id:15,type:'choice',difficulty:'hard',q:'أي من الآتي من جبال دهوك؟',options:['جبل كارة','جبل الشيخ','جبل طارق'],answer:0,explanation:'جبل كارة من جبال دهوك المذكورة في المادة.'},
  {id:16,type:'choice',difficulty:'hard',q:'أي من الآتي من جبال دهوك؟',options:['جبل عقرة','جبل اللوز','جبل لبنان'],answer:0,explanation:'جبل عقرة من جبال دهوك المذكورة في المادة.'},
  {id:17,type:'choice',difficulty:'medium',q:'أين تقع الهضاب والسهول في دهوك؟',options:['في الجهة الغربية والجنوبية الغربية','في الشمال فقط','في الشرق فقط'],answer:0,explanation:'تقع الهضاب والسهول في الجهة الغربية والجنوبية الغربية من دهوك.'},
  {id:18,type:'truefalse',difficulty:'easy',q:'صح أم خطأ: تقع محافظة دهوك في شمال العراق.',options:['صح','خطأ'],answer:0,explanation:'صح. تقع دهوك في شمال العراق.'},
  {id:19,type:'truefalse',difficulty:'medium',q:'صح أم خطأ: تحد دهوك من الشمال جمهورية تركيا.',options:['صح','خطأ'],answer:0,explanation:'صح. يحد دهوك من الشمال تركيا.'},
  {id:20,type:'truefalse',difficulty:'medium',q:'صح أم خطأ: تحد دهوك من الشرق محافظة نينوى.',options:['صح','خطأ'],answer:1,explanation:'خطأ. تحد دهوك من الشرق محافظة أربيل.'},
  {id:21,type:'truefalse',difficulty:'easy',q:'صح أم خطأ: عدد أقضية دهوك ثمانية أقضية.',options:['صح','خطأ'],answer:0,explanation:'صح. تسرد القائمة التعليمية ثمانية أقضية.'},
  {id:22,type:'truefalse',difficulty:'medium',q:'صح أم خطأ: يحد قضاء زاخو من الشمال جبال طوروس.',options:['صح','خطأ'],answer:0,explanation:'صح. جبال طوروس تقع شمال قضاء زاخو.'},
  {id:23,type:'truefalse',difficulty:'medium',q:'صح أم خطأ: يغلب الطابع الصحراوي على سطح دهوك.',options:['صح','خطأ'],answer:1,explanation:'خطأ. يغلب الطابع الجبلي على سطح دهوك.'},
  {id:24,type:'truefalse',difficulty:'easy',q:'صح أم خطأ: تتكون تضاريس دهوك من منطقة جبلية وهضاب وسهول.',options:['صح','خطأ'],answer:0,explanation:'صح. هذان هما القسمان الرئيسان المذكوران للتضاريس.'},
  {id:25,type:'truefalse',difficulty:'medium',q:'صح أم خطأ: جبال دهوك تشغل مساحة قليلة جداً من المحافظة.',options:['صح','خطأ'],answer:1,explanation:'خطأ. المنطقة الجبلية تشغل مساحة واسعة من دهوك.'},
  {id:26,type:'truefalse',difficulty:'hard',q:'صح أم خطأ: جبل بيخير يسمى بالجبل الأبيض.',options:['صح','خطأ'],answer:0,explanation:'صح. جبل بيخير هو الجبل الأبيض.'},
  {id:27,type:'truefalse',difficulty:'hard',q:'صح أم خطأ: جبل باكرمان من جبال دهوك.',options:['صح','خطأ'],answer:0,explanation:'صح. جبل باكرمان من جبال دهوك.'},
  {id:28,type:'truefalse',difficulty:'hard',q:'صح أم خطأ: جبل كارة من جبال دهوك.',options:['صح','خطأ'],answer:0,explanation:'صح. جبل كارة من جبال دهوك.'},
  {id:29,type:'truefalse',difficulty:'hard',q:'صح أم خطأ: جبل عقرة من جبال دهوك.',options:['صح','خطأ'],answer:0,explanation:'صح. جبل عقرة من جبال دهوك.'},
  {id:30,type:'truefalse',difficulty:'medium',q:'صح أم خطأ: الهضاب والسهول تقع في الجهة الشرقية فقط من دهوك.',options:['صح','خطأ'],answer:1,explanation:'خطأ. تقع في الجهة الغربية والجنوبية الغربية.'},
  {id:31,type:'fill',difficulty:'easy',q:'أكمل: تقع محافظة دهوك في ______ العراق.',answerText:'شمال',acceptedAnswers:['شمال','شمال العراق'],explanation:'الإجابة: شمال العراق.'},
  {id:32,type:'fill',difficulty:'easy',q:'أكمل: تقع دهوك ضمن إقليم ______ العراق.',answerText:'كردستان',acceptedAnswers:['كردستان','اقليم كردستان','إقليم كردستان'],explanation:'الإجابة: إقليم كردستان العراق.'},
  {id:33,type:'fill',difficulty:'easy',q:'أكمل: يحد دهوك من الشمال دولة ______.',answerText:'تركيا',acceptedAnswers:['تركيا','الجمهورية التركية','جمهورية تركيا'],explanation:'الإجابة: تركيا.'},
  {id:34,type:'fill',difficulty:'medium',q:'أكمل: يحد دهوك من الشرق محافظة ______.',answerText:'أربيل',acceptedAnswers:['اربيل','أربيل'],explanation:'الإجابة: أربيل.'},
  {id:35,type:'fill',difficulty:'medium',q:'أكمل: يحد دهوك من الغرب محافظة ______.',answerText:'نينوى',acceptedAnswers:['نينوى'],explanation:'الإجابة: نينوى.'},
  {id:36,type:'fill',difficulty:'easy',q:'أكمل: عدد أقضية دهوك ______ أقضية.',answerText:'ثمانية',acceptedAnswers:['ثمانية','8','ثمان'],explanation:'الإجابة: ثمانية أقضية.'},
  {id:37,type:'fill',difficulty:'medium',q:'أكمل: يحد قضاء زاخو من الشمال جبال ______.',answerText:'طوروس',acceptedAnswers:['طوروس'],explanation:'الإجابة: جبال طوروس.'},
  {id:38,type:'fill',difficulty:'easy',q:'أكمل: يغلب على سطح دهوك الطابع ______.',answerText:'الجبلي',acceptedAnswers:['جبلي','الجبلي'],explanation:'الإجابة: الطابع الجبلي.'},
  {id:39,type:'choice',difficulty:'medium',q:'ما الجبال التي تقع شمال قضاء زاخو وتمتد حتى حدود العراق مع تركيا؟',options:['جبال طوروس','جبال حمرين','جبال سنجار'],answer:0,explanation:'إنها جبال طوروس.'},
  {id:40,type:'choice',difficulty:'medium',q:'كيف نصف سطح محافظة دهوك؟',options:['جبلي في معظمه','صحراوي في معظمه','ساحلي في معظمه'],answer:0,explanation:'سطح دهوك جبلي في معظمه.'},
  {id:41,type:'choice',difficulty:'medium',q:'ما القسمان الرئيسان لتضاريس دهوك؟',options:['الجبال والهضاب والسهول','البحار والخلجان','الصحارى والواحات'],answer:0,explanation:'التضاريس: منطقة جبلية، وهضاب وسهول.'},
  {id:42,type:'choice',difficulty:'hard',q:'اذكر جبلاً واحداً من جبال دهوك.',options:['جبل بيخير','جبل أحد','جبل الشيخ'],answer:0,explanation:'من جبال دهوك: بيخير وباكرمان وكارة وعقرة.'},
  {id:43,type:'choice',difficulty:'hard',q:'أين تتركز الهضاب والسهول في دهوك؟',options:['غرب وجنوب غرب المحافظة','شمال شرق المحافظة فقط','وسط المحافظة فقط'],answer:0,explanation:'تتركز في الجهة الغربية والجنوبية الغربية.'},
];

// لعبة «تسلّق جبال دهوك». المصدر المنهجي هو محتوى الدرس؛ enrichment يعني
// معلومة جغرافية إضافية ثابتة من الصفحة التي اعتمدها مالك المشروع، وتظهر بشارة واضحة.
export const mountainQuestions = [
  {id:'DUH-M-001',factId:'LOCATION-NW',source:'enrichment',topic:'الموقع',type:'choice',difficulty:'easy',prompt:'أين تقع محافظة دهوك في العراق؟',options:['في أقصى الشمال الغربي','في أقصى الجنوب','في وسط العراق'],answer:0,explanation:'تقع دهوك في أقصى الشمال الغربي من العراق.',points:10},
  {id:'DUH-M-002',factId:'TERRAIN-MOUNTAIN',source:'curriculum',topic:'التضاريس',type:'truefalse',difficulty:'easy',prompt:'صح أم خطأ: يغلب الطابع الجبلي على تضاريس دهوك.',options:['صح','خطأ'],answer:0,explanation:'صح. الطابع الجبلي واضح في تضاريس دهوك.',points:10},
  {id:'DUH-M-003',factId:'MOUNTAINS-SET',source:'curriculum',topic:'الجبال',type:'multi',difficulty:'easy',prompt:'اختر جبلين وردا ضمن جبال دهوك.',options:['بيخير','كارة','جبل أحد','جبل حمرين'],answers:[0,1],explanation:'بيخير وكارة من جبال دهوك المذكورة في المادة.',points:10},
  {id:'DUH-M-004',factId:'WHITE-MOUNTAIN',source:'curriculum',topic:'الجبال',type:'whoami',difficulty:'medium',prompt:'من أنا؟ جبل في دهوك يُعرف باسم «الجبل الأبيض».',options:['جبل بيخير','جبل باكرمان','جبل عقرة'],answer:0,explanation:'جبل بيخير هو الجبل المعروف بالجبل الأبيض.',points:20},
  {id:'DUH-M-005',factId:'MOUNTAIN-ODD',source:'curriculum',topic:'الجبال',type:'odd',difficulty:'medium',prompt:'المختلف: أي اسم ليس من جبال دهوك المذكورة في الدرس؟',options:['جبل باكرمان','جبل كارة','سهل سميل','جبل عقرة'],answer:2,explanation:'سهل سميل سهل، وليس جبلاً.',points:20},
  {id:'DUH-M-006',factId:'TERRAIN-PAIR',source:'curriculum',topic:'التضاريس',type:'matching',difficulty:'medium',prompt:'طابق الوصف مع الاسم الصحيح: «الجبل الأبيض».',options:['جبل بيخير','جبل كارة','جبل عقرة'],answer:0,explanation:'الاسم المطابق للجبل الأبيض هو جبل بيخير.',points:20},
  {id:'DUH-M-007',factId:'PLAINS-CLASSIFY',source:'curriculum',topic:'التضاريس',type:'classification',difficulty:'medium',prompt:'صنّف «سهل العمادية»: هل هو جبل أم سهل؟',options:['جبل','سهل'],answer:1,explanation:'سهل العمادية من السهول المذكورة في المادة.',points:20},
  {id:'DUH-M-008',factId:'TAURUS-DIRECTION',source:'curriculum',topic:'الاتجاهات',type:'direction',difficulty:'hard',prompt:'أي جبال تقع شمال قضاء زاخو وتمتد نحو الحدود مع تركيا؟',options:['جبال طوروس','جبال حمرين','جبال سنجار'],answer:0,explanation:'تقع جبال طوروس شمال قضاء زاخو وتمتد نحو حدود العراق مع تركيا.',points:30},
  {id:'DUH-M-009',factId:'ZAKHO-ENRICHMENT',source:'enrichment',topic:'الموقع',type:'correct',difficulty:'hard',prompt:'اختر العبارة الجغرافية الصحيحة عن زاخو.',options:['تقع زاخو قرب معبر إبراهيم الخليل الحدودي','تقع زاخو على ساحل البحر','تقع زاخو في جنوب العراق'],answer:0,explanation:'تقع زاخو قرب معبر إبراهيم الخليل الحدودي.',points:30},
  {id:'DUH-M-010',factId:'SIMMEL-PLAIN',source:'enrichment',topic:'التضاريس',type:'fill',difficulty:'hard',prompt:'أكمل: تنفتح مدينة دهوك من جهة الغرب على سهل ______.',answerText:'سميل',acceptedAnswers:['سميل','سهل سميل'],explanation:'تنفتح مدينة دهوك من جهة الغرب على سهل سميل.',points:30},
  {id:'DUH-M-011',factId:'CENTER-DUHOK',source:'enrichment',topic:'الموقع',type:'choice',difficulty:'easy',prompt:'ما مدينة مركز محافظة دهوك؟',options:['مدينة دهوك','مدينة البصرة','مدينة الحلة'],answer:0,explanation:'مركز محافظة دهوك هو مدينة دهوك.',points:10},
  {id:'DUH-M-012',factId:'MOUNTAIN-AREA',source:'curriculum',topic:'التضاريس',type:'truefalse',difficulty:'easy',prompt:'صح أم خطأ: تشغل المنطقة الجبلية مساحة واسعة من دهوك.',options:['صح','خطأ'],answer:0,explanation:'صح. المنطقة الجبلية تشغل مساحة واسعة من المحافظة.',points:10},
  {id:'DUH-M-013',factId:'TERRAIN-SELECT',source:'curriculum',topic:'التضاريس',type:'multi',difficulty:'easy',prompt:'اختر القسمين اللذين وردا في تضاريس دهوك.',options:['المنطقة الجبلية','الهضاب والسهول','البحار','السواحل'],answers:[0,1],explanation:'تتكون تضاريس دهوك من منطقة جبلية وهضاب وسهول.',points:10},
  {id:'DUH-M-014',factId:'KARA-MOUNTAIN',source:'curriculum',topic:'الجبال',type:'whoami',difficulty:'medium',prompt:'من أنا؟ اسم جبل ورد ضمن جبال دهوك، وليس سهلاً أو نهراً.',options:['جبل كارة','سهل زاخو','نهر الخابور'],answer:0,explanation:'جبل كارة من جبال دهوك.',points:20},
  {id:'DUH-M-015',factId:'MOUNTAIN-ODD-2',source:'curriculum',topic:'الجبال',type:'odd',difficulty:'medium',prompt:'المختلف: أي اسم ليس جبلاً من جبال دهوك؟',options:['جبل عقرة','جبل بيخير','سهل العمادية','جبل باكرمان'],answer:2,explanation:'سهل العمادية سهل وليس جبلاً.',points:20},
  {id:'DUH-M-016',factId:'TAURUS-MATCH',source:'curriculum',topic:'الاتجاهات',type:'matching',difficulty:'medium',prompt:'طابق: الجبال الواقعة شمال قضاء زاخو.',options:['جبال طوروس','جبال كارة','جبل بيخير'],answer:0,explanation:'جبال طوروس تقع شمال قضاء زاخو.',points:20},
  {id:'DUH-M-017',factId:'AQRA-CLASSIFY',source:'curriculum',topic:'التضاريس',type:'classification',difficulty:'medium',prompt:'صنّف «جبل عقرة»: هل هو جبل أم سهل؟',options:['جبل','سهل'],answer:0,explanation:'جبل عقرة من جبال دهوك.',points:20},
  {id:'DUH-M-018',factId:'PLAINS-DIRECTION',source:'curriculum',topic:'الاتجاهات',type:'direction',difficulty:'hard',prompt:'في أي جهة تتركز الهضاب والسهول في دهوك؟',options:['الغرب والجنوب الغربي','الشمال الشرقي فقط','الجنوب الشرقي فقط'],answer:0,explanation:'تتركز في الجهة الغربية والجنوبية الغربية.',points:30},
  {id:'DUH-M-019',factId:'MOUNTAINS-CITY',source:'enrichment',topic:'التضاريس',type:'correct',difficulty:'hard',prompt:'اختر العبارة الصحيحة عن مدينة دهوك.',options:['تحيط بها الجبال من ثلاث جهات','تقع على ساحل البحر','لا توجد سهول قربها'],answer:0,explanation:'تحيط الجبال بمدينة دهوك من ثلاث جهات، وتنفتح غرباً على سهل سميل.',points:30},
  {id:'DUH-M-020',factId:'WHITE-MOUNTAIN-FILL',source:'curriculum',topic:'الجبال',type:'fill',difficulty:'hard',prompt:'أكمل: يُعرف جبل بيخير باسم الجبل ______.',answerText:'الأبيض',acceptedAnswers:['الابيض','الأبيض'],explanation:'يُعرف جبل بيخير باسم الجبل الأبيض.',points:30},
  {id:'DUH-M-SUMMIT',factId:'SUMMIT-COMBO',source:'curriculum',topic:'القمة',type:'summit',difficulty:'summit',prompt:'سؤال القمة: أي خيار يجمع معلومتين صحيحتين عن دهوك؟',options:['جبل بيخير هو الجبل الأبيض، وتغلب الجبال على تضاريس دهوك','سهل سميل جبل، ودهوك تقع في جنوب العراق','جبال طوروس تقع جنوب زاخو، ودهوك ساحلية'],answer:0,explanation:'جبل بيخير هو الجبل الأبيض، والطابع الجبلي يغلب على تضاريس دهوك.',points:40},
  {id:'DUH-M-SUMMIT-2',factId:'SUMMIT-COMBO-2',source:'curriculum',topic:'القمة',type:'summit',difficulty:'summit',prompt:'سؤال القمة: أي خيار يصف تضاريس دهوك وصفاً صحيحاً؟',options:['جبال واسعة، وهضاب وسهول في الغرب والجنوب الغربي','صحراء واسعة وسواحل بحرية','سهول فقط بلا جبال'],answer:0,explanation:'تضم دهوك منطقة جبلية واسعة، وهضاباً وسهولاً في الغرب والجنوب الغربي.',points:40},
];
