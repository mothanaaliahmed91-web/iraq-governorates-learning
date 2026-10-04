# iraq-governorates-learning
منصة تعليمية تفاعلية لمادة الاجتماعيات للصف السادس الابتدائي — محافظات العراق جغرافياً وتاريخياً

---

## مادة الاجتماعيات | الصف السادس الابتدائي

منصة تعليمية تفاعلية عربية للصف السادس الابتدائي، تعمل محلياً دون اتصال بالإنترنت.

## النسخة المنشورة على GitHub Pages

بعد اكتمال أول نشر، ستكون المنصة متاحة من:

https://mothanaaliahmed91-web.github.io/iraq-governorates-learning/

يُنشر الموقع الثابت تلقائياً إلى GitHub Pages عند دفع تغييرات `main` في `index.html` أو `src/` أو `assets/` أو `maps/` أو ملف سير العمل. لا توجد خطوة بناء أو حزم npm؛ يرفع GitHub الملفات الثابتة اللازمة للتشغيل. يمكن تشغيل النشر يدوياً من تبويب **Actions** باختيار **Deploy educational site to GitHub Pages** ثم **Run workflow**.

تظل نسخة الملفات قابلة للتشغيل دون اتصال عند تقديمها عبر خادم HTTP محلي بسبب استخدام JavaScript modules. يعمل محتوى الموقع وصوره وخرائطه وصوته محلياً؛ رابط Google Earth التفاعلي وحده خدمة خارجية اختيارية ويتطلب الاتصال بالإنترنت.

## Use

1. Open `F:\Horion K7A` in Visual Studio Code.
2. Open `index.html` using Live Server, or run a simple local server from the project root (for example `python -m http.server 8000`) and visit `http://localhost:8000`.
3. تبدأ المنصة بفهرس الوحدة الأولى «محافظات وطننا العراق جغرافياً وتاريخياً». «وطننا العراق» و«محافظة دهوك» وحدتان متاحتان؛ أربيل والسليمانية ونينوى تظهر بحالة «قريباً».
4. اختر «وطننا العراق» لمحطاته التعليمية التفاعلية أو «محافظة دهوك» لفتح البرنامج الحالي بمساري المعلومات والأنشطة والألعاب. استخدم «فهرس المحتويات» للعودة إلى الفهرس.

The interface adapts to interactive displays, desktop, and mobile screens.

The app is HTML, CSS, and vanilla JavaScript only. It works without internet access and uses standard Pointer Events for touch, mouse, and drag-and-drop. Future web output can be packaged as an Android APK with Capacitor.

## Media handoff

Place approved owner-supplied media in `assets/images/`, `assets/videos/`, `assets/audio/`, and `assets/fonts/` following [ASSET_PLAN.md](docs/design/ASSET_PLAN.md). The prototype has designed no-media fallbacks, so missing assets never produce broken image icons.

## Current scope

The Iraq unit and Duhok lesson are available. Iraq is presented as 12 touch-friendly screens with a separate 16-question review challenge. Lesson content and questions are maintained in `src/data/iraq-data.js` and `src/data/iraq-questions.js`; province index metadata is independent under `src/data/provinces/`. Erbil, Sulaymaniyah, and Ninawa remain placeholders without detailed content. The available Iraq governorates map and Google Earth screenshot are labeled with their sources; schematic terrain art is not presented as a precise curriculum map.
