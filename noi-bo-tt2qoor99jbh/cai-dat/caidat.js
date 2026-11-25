// Cài khoá một lần. Chạy hoàn toàn trong trình duyệt: KHÔNG có lệnh gọi mạng nào trong file này.
// Mật khẩu → PBKDF2-SHA256 (600.000 vòng, muối ngẫu nhiên) → AES-256-GCM bọc khoá riêng RSA-OAEP 2048.
(function () {
  'use strict';
  var ITER = 600000, MIN = 14;
  var $ = function (s) { return document.querySelector(s); };
  function hex(b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function say(t) { var m = $('#msg'); m.textContent = t; m.hidden = !t; }

  function make(pw) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12)), pair, spki, pkcs8, wrapKey;
    return crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt'])
      .then(function (kp) { pair = kp; return crypto.subtle.exportKey('spki', kp.publicKey); })
      .then(function (b) { spki = b; return crypto.subtle.exportKey('pkcs8', pair.privateKey); })
      .then(function (b) { pkcs8 = b; return crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']); })
      .then(function (base) { return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: ITER }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); })
      .then(function (k) { wrapKey = k; return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, pkcs8); })
      .then(function (ct) {
        // tự kiểm: mở lại được bằng đúng mật khẩu vừa gõ
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, wrapKey, ct).then(function (back) {
          if (hex(back) !== hex(pkcs8)) throw new Error('self-test');
          return crypto.subtle.digest('SHA-256', spki).then(function (d) {
            return { v: 1, alg: 'RSA-OAEP-256', kid: hex(d).slice(0, 16), pub: hex(spki), priv: { kdf: 'PBKDF2-SHA256', iter: ITER, salt: hex(salt), iv: hex(iv), ct: hex(ct) } };
          });
        });
      });
  }

  function start() {
    $('#f').addEventListener('submit', function (e) {
      e.preventDefault();
      var a = $('#p1').value, b = $('#p2').value;
      if (a.length < MIN) return say('Mật khẩu phải từ ' + MIN + ' ký tự trở lên.');
      if (a !== b) return say('Hai lần gõ không giống nhau.');
      if (!(window.crypto && crypto.subtle)) return say('Trình duyệt này không hỗ trợ. Hãy dùng Chrome, Edge, Safari hoặc Firefox bản mới.');
      say(''); $('#ok').textContent = '';
      var btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'Đang tạo khoá…';
      make(a).then(function (block) {
        $('#p1').value = ''; $('#p2').value = '';
        $('#out').value = JSON.stringify(block);
        $('#out-card').hidden = false;
        $('#out-card').scrollIntoView();
      }, function () { say('Không tạo được khoá. Thử lại.'); }).then(function () { btn.disabled = false; btn.textContent = 'Tạo khoá'; });
    });
    $('#copy').addEventListener('click', function () {
      var t = $('#out'); t.select();
      (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(function () { $('#ok').textContent = 'Đã sao chép.'; },
        function () { try { document.execCommand('copy'); $('#ok').textContent = 'Đã sao chép.'; } catch (x) { $('#ok').textContent = 'Hãy bôi đen khối chữ và chép tay.'; } });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
