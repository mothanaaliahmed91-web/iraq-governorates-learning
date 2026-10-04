# iraq-governorates-learning
منصة تعليمية تفاعلية لمادة الاجتماعيات للصف السادس الابتدائي — محافظات العراق جغرافياً وتاريخياً

---

## مادة الاجتماعيات | الصف السادس الابتدائي

منصة تعليمية تفاعلية عربية للصف السادس الابتدائي، تعمل محلياً دون اتصال بالإنترنت.

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

The Iraq overview unit and Duhok lesson are available. Iraq unit content is in `src/data/iraq-data.js`; province index metadata is independent under `src/data/provinces/`. Erbil, Sulaymaniyah, and Ninawa remain placeholders without detailed content. The three curriculum map locations remain explicit placeholders because matching maps were not present among the project assets.
