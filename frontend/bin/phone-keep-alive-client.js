(function () {
  var D = window.KA_DATA || { routes: [] };
  var KEY = 'phone-keepalive-v1';
  function $(id) { return document.getElementById(id); }
  function track(n, p) { try { if (typeof window.gtag === 'function') window.gtag('event', n, p || {}); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fD(d) { return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function fI(d) { return fD(d).split('-').join(''); }
  function pD(v) {
    var p = String(v || '').split('-');
    if (p.length !== 3) return null;
    var y = +p[0], mo = +p[1], da = +p[2];
    if (!y || !mo || !da) return null;
    return new Date(Date.UTC(y, mo - 1, da));
  }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var DAY = 86400000;
  var now0 = new Date();
  var today = new Date(Date.UTC(now0.getUTCFullYear(), now0.getUTCMonth(), now0.getUTCDate()));

  function model(id) {
    for (var i = 0; i < D.routes.length; i++) { if (D.routes[i].id === id) return D.routes[i]; }
    return null;
  }

  function gcalUrl(m, start) {
    var end = new Date(start.getTime() + DAY);
    var text = m.brandName + ' keep-alive: ' + m.shortAction;
    var details = m.action + ' Cost per action ' + m.perActionLabel + '. Safe rhythm: every ' + m.safe +
      ' days inside a ' + m.interval + '-day window. Source: Phone Radar Keep-Alive Assistant.';
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(text) +
      '&dates=' + fI(start) + '/' + fI(end) +
      '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY;INTERVAL=' + m.safe) +
      '&details=' + encodeURIComponent(details);
  }

  function downloadIcs(m, start) {
    var n = new Date();
    var stamp = fI(n) + 'T' + pad(n.getUTCHours()) + pad(n.getUTCMinutes()) + pad(n.getUTCSeconds()) + 'Z';
    var desc = m.action.split(String.fromCharCode(10)).join(' ').split(',').join(' ').split(';').join(' ');
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Phone Radar//Keep-Alive Assistant//EN',
      'BEGIN:VEVENT',
      'UID:' + m.id + '-' + fI(start) + '@aineedhelpfromotherai.com',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + fI(start),
      'SUMMARY:' + m.brandName + ' keep-alive: ' + m.shortAction,
      'RRULE:FREQ=DAILY;INTERVAL=' + m.safe,
      'DESCRIPTION:' + desc + ' Safe rhythm: every ' + m.safe + ' days inside a ' + m.interval + '-day window.',
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    var blob = new Blob([lines.join(String.fromCharCode(13, 10))], { type: 'text/calendar' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = m.id + '-keep-alive.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    track('phone_keepalive_ics', { route_id: m.id });
  }

  function compute(m) {
    var inp = $('ka-date-' + m.id);
    var res = $('ka-result-' + m.id);
    if (!inp || !res) return;
    var last = pD(inp.value);
    if (!last) {
      res.innerHTML = '<p class="ka-muted">Pick the date of your last keep-alive action to see the next deadline.</p>';
      return;
    }
    var safeBy = new Date(last.getTime() + m.safe * DAY);
    var hardBy = new Date(last.getTime() + m.interval * DAY);
    var left = Math.ceil((safeBy.getTime() - today.getTime()) / DAY);
    var cls = 'ka-ok';
    var note;
    if (left < 0) {
      cls = 'ka-bad';
      note = 'The safe date passed ' + (-left) + ' day(s) ago — act now. The hard window closes ' + fD(hardBy) + '.';
    } else if (left <= 14) {
      cls = 'ka-bad';
      note = 'Act now — only ' + left + ' day(s) of safety buffer left.';
    } else if (left <= 30) {
      cls = 'ka-warn';
      note = 'Coming up — ' + left + ' day(s) left inside the safe window.';
    } else {
      note = left + ' day(s) left inside the safe window.';
    }
    res.innerHTML = '<div class="ka-countdown ' + cls + '"><strong>' + fD(safeBy) + '</strong><span>' + esc(note) + '</span></div>' +
      '<p class="ka-muted">Act by <b>' + fD(safeBy) + '</b> (safe) · hard window limit <b>' + fD(hardBy) + '</b> (' + m.interval + ' days after the last action).</p>' +
      '<div class="ka-cal-actions"><button type="button" id="ka-ics-' + m.id + '">Download .ics reminder</button>' +
      '<a id="ka-gcal-' + m.id + '" target="_blank" rel="noopener noreferrer" href="' + gcalUrl(m, safeBy) + '">Add to Google Calendar ↗</a></div>';
    save({ routeId: m.id, last: inp.value });
    track('phone_keepalive_calculate', { route_id: m.id, days_left: left });
    var b = $('ka-ics-' + m.id);
    if (b) b.addEventListener('click', function () { downloadIcs(m, safeBy); });
    var g = $('ka-gcal-' + m.id);
    if (g) g.addEventListener('click', function () { track('phone_keepalive_gcal', { route_id: m.id }); });
  }

  function select(id, scroll) {
    var m = model(id);
    if (!m) return;
    var btns = document.querySelectorAll('.ka-sel-btn');
    for (var i = 0; i < btns.length; i++) { btns[i].classList.toggle('active', btns[i].getAttribute('data-route') === id); }
    var panels = document.querySelectorAll('.ka-brand-panel');
    for (var j = 0; j < panels.length; j++) { panels[j].classList.toggle('ka-hidden', panels[j].id !== 'ka-panel-' + id); }
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    track('phone_keepalive_select', { route_id: id });
    if (scroll) {
      var p = $('ka-panel-' + id);
      if (p && p.scrollIntoView) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  var saved = load();
  var startId = null;
  var i;
  if (location.hash) {
    var hid = decodeURIComponent(location.hash.slice(1));
    if (model(hid)) startId = hid;
  }
  if (!startId && saved && model(saved.routeId)) {
    startId = saved.routeId;
    track('phone_keepalive_return', { route_id: saved.routeId });
  }
  if (!startId) {
    for (i = 0; i < D.routes.length; i++) { if (!D.routes[i].hold) { startId = D.routes[i].id; break; } }
  }
  if (!startId && D.routes.length) startId = D.routes[0].id;

  var btns = document.querySelectorAll('.ka-sel-btn');
  for (i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () { select(this.getAttribute('data-route'), true); });
  }
  var inputs = document.querySelectorAll('.ka-date-input');
  for (i = 0; i < inputs.length; i++) {
    (function (inp) {
      if (!inp.value) inp.value = fD(today);
      inp.addEventListener('change', function () { var m = model(inp.getAttribute('data-route')); if (m) compute(m); });
      inp.addEventListener('input', function () { var m = model(inp.getAttribute('data-route')); if (m) compute(m); });
    })(inputs[i]);
  }
  if (startId) {
    select(startId, false);
    var sm = model(startId);
    if (sm && !sm.hold) {
      var inp = $('ka-date-' + startId);
      if (inp) {
        if (saved && saved.routeId === startId && saved.last) inp.value = saved.last;
        compute(sm);
      }
    }
  }
})();
