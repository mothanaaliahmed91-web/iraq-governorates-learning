(async () => {
  const pages = (await (await fetch('http://127.0.0.1:9339/json')).json());
  const target = pages.find(p => p.type === 'page' && p.url && p.url.includes('http://127.0.0.1:4173/'));
  if (!target) throw new Error('No active page found at http://127.0.0.1:4173/');
  const WebSocket = require('ws');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = Date.now() + Math.random();
    const onmsg = (message) => {
      const data = JSON.parse(message.toString());
      if (data.id === id) {
        ws.off('message', onmsg);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };
    ws.on('message', onmsg);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const before = (await send('Runtime.evaluate', {
    expression: "document.querySelector('.authentic-map-image')?.getAttribute('src') || 'missing'",
    returnByValue: true
  })).result.value;

  const changed = (await send('Runtime.evaluate', {
    expression: `
      const img = document.querySelector('.authentic-map-image');
      if (!img) return 'missing';
      img.src = 'http://127.0.0.1:4173/maps/interactive/4.png';
      img.alt = 'خريطة العراق المُحدّثة من ملف الخريطة التفاعلية، وتظهر فيها محافظة دهوك';
      return img.getAttribute('src');
    `,
    returnByValue: true
  })).result.value;

  const after = (await send('Runtime.evaluate', {
    expression: "document.querySelector('.authentic-map-image')?.getAttribute('src') || 'missing'",
    returnByValue: true
  })).result.value;

  console.log(JSON.stringify({ before, changed, after }, null, 2));
  ws.close();
})();
