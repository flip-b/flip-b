/**
 * Get chat client web function
 */
export function getChatClientWeb(params: any = {}, query: any = {}) {
  const author: any = params.system_author || 'Flip-B';
  const prefix: any = params.system_prefix || 'Bot';
  const version: any = params.system_version || '1.0.0';

  // Define page options
  const pageTitle: any = params.dialog_title || params.system_author || 'Flip-B';
  const pageBackgroundColor: any = params.colors_dialog_bg || '#42de3b';
  const pageForegroundColor: any = params.colors_dialog_fg || '#fff';
  const pageLanguage: any = query.language || params.global_language || 'en-US';

  // Define chat options
  const chatLibrary = query.nominify ? 'chat.js' : 'chat.min.js';
  const chatOptions = encodeOptions(query);

  // Define result
  return String.raw`<!DOCTYPE html>
<html lang="${pageLanguage}">
  <head>

    <!-- Required page needs -->
    <meta charset="utf-8">
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Basic page needs -->
    <title>${pageTitle}</title>
    <meta name="description" content="${author} Chat">
    <meta name="copyright" content="© Copyright ${new Date().getFullYear()} ${author}">
    <meta name="version" content="${version}">
    <meta name="author" content="${author}">

    <!-- Style page needs -->
    <meta name="theme-color" content="${pageBackgroundColor}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- Icons -->
    <link href="_URL_/apple-touch-icon.png" rel="apple-touch-icon">
    <link href="_URL_/favicon.png" rel="icon" sizes="192x192">
    <link href="_URL_/favicon.ico" rel="icon">

    <!-- Fonts -->
    <link href="//fonts.googleapis.com" rel="preconnect">
    <link href="//fonts.gstatic.com" rel="preconnect" crossorigin>
    <link href="//fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>

    <!-- Style -->
    <style>
      html, body {
        position: relative;
        height: 100%;
        border: 0;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: 'Ubuntu', sans-serif;
      }
      .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${pageBackgroundColor};
        color: ${pageForegroundColor};
        text-align: center;
        border: 0;
        margin: 0;
        padding: 0;
        padding-top: 20%;
      }
      .container .logo {
        width: 254px;
      }
    </style>

    <!-- Container -->
    <div class="container">
      <img class="logo" src="_URL_/images/logo.svg" alt="${author}">
      <h1>${pageTitle}</h1>
    </div>

    <!-- Javascript -->
    <script src="_URL_/socket.io/socket.io.min.js"></script>
    <script src="_URL_/_PLUGIN_/_ORIGIN_/${chatLibrary}${chatOptions ? '?' + chatOptions : ''}"></script>
    <script>
      setTimeout(function() {
        ${prefix}Chat.showButton();
      }, 0);
    </script>
  </body>
</html>
`;
}

/**
 * Encode settings
 */
export function encodeOptions(params: any, prefix: any = ''): any {
  const result = [];
  for (const p in params) {
    const k = prefix ? prefix + '[' + p + ']' : p;
    const v = params[p];
    if (v !== null && v !== false && v !== undefined) {
      result.push(typeof v === 'object' ? encodeOptions(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return result.filter((v: any) => !!v).join('&');
}
