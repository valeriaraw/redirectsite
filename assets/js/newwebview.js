const CONFIG = {
  
  /**
   * Тип платформы, на которую происходит переход.
   * Возможные значения:
   *  - "instagram" — откроет профиль в приложении Instagram или в браузере.
   *  - "onlyfans"  — откроет профиль на OnlyFans.
   *  - "telegram"  — откроет чат в Telegram.
   *  - "custom"    — позволяет указать свою произвольную ссылку в CUSTOM_LINK.
   */
  PLATFORM: "custom",


  /**
   * Имя пользователя (username) для выбранной платформы.
   * Примеры:
   *  - Instagram:     https://instagram.com/valeriarawx
   *  - OnlyFans:      https://onlyfans.com/valeria.raw
   *  - Telegram:      https://t.me/valeria_raw
   */
  USERNAME: "didenok",


  /**
   * Своя кастомная ссылка. Используется только если PLATFORM = "custom".
   * Например: "https://valeriaraw.com/"
   */
  CUSTOM_LINK: "https://valeriaraw.com/",


  /**
   * Включает или отключает проверку на WebView (встроенный браузер приложений).
   * true  — если пользователь во встроенном браузере, покажется сообщение "Откройте в браузере".
   * false — проверка отключена, редирект произойдёт сразу.
   */
  ENABLE_WEBVIEW_CHECK: true,


  /**
   * Нужно ли пытаться открыть ссылку через приложение (если оно установлено).
   * true  — скрипт попытается открыть приложение (Instagram, Telegram и т.п.)
   * false — не будет пытаться открыть в приложении, сразу будет работать fallback на веб.
   */
  REDIRECT_IN_APP: false,


  /**
   * Нужно ли делать переход на веб-версию (если приложение не открылось).
   * true  — через указанное время произойдёт переход на web-версию.
   * false — ничего не произойдёт, если приложение не открылось.
   */
  FALLBACK_TO_WEB: true,


  /**
   * Показывать ли сообщение "Откройте в браузере", если пользователь в WebView.
   * true  — сообщение будет показано.
   * false — даже если пользователь в WebView, скрипт попытается редиректить (на свой страх и риск).
   */
  WEBVIEW_MESSAGE: true,


  /**
   * Время ожидания (в миллисекундах) перед переходом на web-версию, если приложение не открылось.
   * По умолчанию 2000 мс (2 секунды).
   */
  FALLBACK_TIMEOUT: 0,

  /**
   * Полностью отключает редиректы (всё остаётся на текущей странице).
   * true  — редиректы отключены.
   * false — работает обычная логика переходов.
    */
  DISABLE_REDIRECT: false,
};

function isWebView() {
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isIOSWebView = isIOS && !ua.includes("Safari") && ua.includes("AppleWebKit");
  const isAndroidWebView = isAndroid && ua.includes("wv");

  const knownInApp = /(FBAN|FBAV|Instagram|Line|Twitter|LinkedIn|MicroMessenger|WebView|wv|Telegram|tiktok|TTWebView|musically)/i;
  const fromApp = knownInApp.test(ua) || /t\.me|telegram\.org|tiktok\.com/i.test(document.referrer);

  return isIOSWebView || isAndroidWebView || fromApp;
}

function getLinks() {
  const { PLATFORM, USERNAME, CUSTOM_LINK } = CONFIG;

  switch (PLATFORM.toLowerCase()) {
    case "instagram":
      return {
        appUrl: `instagram://user?username=${USERNAME}`,
        webUrl: `https://www.instagram.com/${USERNAME}/`
      };
    case "onlyfans":
      return {
        appUrl: `https://onlyfans.com/${USERNAME}`,
        webUrl: `https://onlyfans.com/${USERNAME}`
      };
    case "telegram":
      return {
        appUrl: `tg://resolve?domain=${USERNAME}`,
        webUrl: `https://t.me/${USERNAME}`
      };
    case "custom":
      return {
        appUrl: "https://valeriaraw.com/",
        webUrl: "https://valeriaraw.com/"
      };
    default:
      return { appUrl: "", webUrl: "" };
  }
}

function showWebViewWarning() {
  const msg = document.createElement("div");
  msg.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h2>Open in browser</h2>
      <p>You are inside an in-app browser.<br>Please tap <b>⋮</b> or <b>⋯</b> above and choose<br><b>"Open in browser"</b>.</p>
      <img class="gif" src="assets/gif/1.gif" alt="animation" style="width: 80%; max-width: 300px;" />
      <img class="arrow" src="assets/png/1.png" alt="arrow" style="position: absolute; top: 2vh; right: 2vw; width: 40px;" />
    </div>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(msg);
}

function redirectOrLoad() {
  const { ENABLE_WEBVIEW_CHECK, REDIRECT_IN_APP, FALLBACK_TO_WEB, FALLBACK_TIMEOUT, WEBVIEW_MESSAGE, DISABLE_REDIRECT } = CONFIG;
  const { appUrl, webUrl } = getLinks();

  if (DISABLE_REDIRECT) {
    return;
  }

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const inWebView = ENABLE_WEBVIEW_CHECK && isWebView();

  if (inWebView && WEBVIEW_MESSAGE) {
    showWebViewWarning();
    return;
  }

  if (REDIRECT_IN_APP) {
    if (isIOS) {
      window.location.replace(appUrl);
    } else if (isAndroid) {
      window.location.href = appUrl;
    }
  }

  if (FALLBACK_TO_WEB) {
    setTimeout(() => {
      window.location.href = webUrl;
    }, FALLBACK_TIMEOUT);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const { webUrl } = getLinks();
  const button = document.querySelector(".button");

  if (button) {
    button.onclick = () => {
      window.location.href = webUrl;
    };
  }

  if (!CONFIG.DISABLE_REDIRECT) {
    redirectOrLoad();
  }

});



