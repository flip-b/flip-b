/**
 * Get chat client lib function
 */
export function getChatClientLib(params: any = {}, query: any = {}) {
  const author: any = params.system_author || 'Flip-B';
  const prefix: any = params.system_prefix || 'Bot';
  const version: any = params.system_version || '1.0.0';

  // Define default global values
  const global: any = {
    user: query.user || params.global_user || undefined,
    customer: query.customer || params.global_customer || undefined,
    settings: query.settings || params.global_settings || undefined,
    language: query.language || params.global_language || 'en-US',
    ...(params.global || {})
  };

  // Define default system values
  const system: any = {
    storage: params.system_storage || 'sessionStorage',
    timeout: params.system_timeout || 0,
    waiting: params.system_waiting || 0,
    ...(params.system || {})
  };

  // Define default colors values
  const colors: any = {
    button_bg: params.colors_button_bg || '#02ad83',
    button_bg_active: params.colors_button_bg_active || '#7f7f7f',
    button_fg: params.colors_button_fg || '#ffffff',
    button_fg_active: params.colors_button_fg_active || '#134390',
    dialog_bg: params.colors_dialog_bg || '#1b3b6e',
    dialog_bg_active: params.colors_dialog_bg_active || '#134390',
    dialog_fg: params.colors_dialog_fg || '#ffffff',
    dialog_fg_active: params.colors_dialog_fg_active || '#134390',
    ...(params.colors || {})
  };

  // Define default images values
  const images: any = {
    logo: params.images_logo || params.images_avatar_im || '',
    head: params.images_head || params.images_dialog_im || '',
    chat: params.images_chat || params.images_button_im || '',
    ...(params.images || {})
  };

  // Define default styles values
  const styles: any = {
    font_family: params.styles_font_family || 'inherit',
    font_size: params.styles_font_size || 'inherit',
    radius: params.styles_radius || 0,
    ...(params.styles || {})
  };

  // Define default buttom values
  const button: any = {
    style: params.button_style || 'responsive',
    title: params.button_title || 'Chat',
    align: params.button_align || 'right',
    quit_button: params.button_quit_button || false,
    ...(params.button || {})
  };

  // Define default dialog values
  const dialog: any = {
    style: params.dialog_style || 'responsive',
    title: params.dialog_title || 'Chat',
    align: params.dialog_align || 'right',
    write: params.dialog_write || 'Type a message here',
    share_attach_message: params.dialog_share_attach_message || 'Select an file or drop it here',
    share_attach_link: params.dialog_share_attach_link || 'Download file',
    share_attach_name: params.dialog_share_attach_name || 'File',
    share_camera_message: params.dialog_share_camera_message || 'Send a capture',
    emojis: params.dialog_emojis || false,
    attach: params.dialog_attach || false,
    camera: params.dialog_camera || false,
    dictate: params.dialog_dictate || false,
    hide_button: params.dialog_hide_button || false,
    quit_button: params.dialog_quit_button || false,
    quit_dialog: params.dialog_quit_dialog || false,
    quit_dialog_message: params.dialog_quit_dialog_message || 'Do you want to leave the chat?',
    quit_dialog_negative: params.dialog_quit_dialog_negative || 'Cancel',
    quit_dialog_positive: params.dialog_quit_dialog_positive || 'Exit',
    logo: params.dialog_logo || false,
    time: params.dialog_time || false,
    ...(params.dialog || {})
  };

  // Define result
  return String.raw`

/*!
 * ${prefix}Chat ${version}
 * © Copyright ${new Date().getFullYear()} ${author}
 */

window.${prefix}Chat = {

  // Define id
  id: 'chat',

  // Define params
  params: {

    // Define global
    global: {
      user: ${global.user ? JSON.stringify(global.user) : 'undefined'},
      customer: ${global.customer ? JSON.stringify(global.customer) : 'undefined'},
      settings: ${global.settings ? JSON.stringify(global.settings) : 'undefined'},
      language: ${global.language ? "'" + global.language + "'" : 'undefined'}
    },

    // Define system
    system: {
      storage: ${system.storage ? "'" + system.storage + "'" : 'sessionStorage'},
      timeout: ${system.timeout ? parseInt(system.timeout) * 1000 : 0},
      waiting: ${system.waiting ? parseInt(system.waiting) * 1000 : 0}
    },

    // Define colors
    colors: {
      button_bg: '${colors.button_bg}',
      button_bg_active: '${colors.button_bg_active}',
      button_fg: '${colors.button_fg}',
      button_fg_active: '${colors.button_fg_active}',
      dialog_bg: '${colors.dialog_bg}',
      dialog_bg_active: '${colors.dialog_bg_active}',
      dialog_fg: '${colors.dialog_fg}',
      dialog_fg_active: '${colors.button_bg_active}'
    },

    // Define images
    images: {
      logo: '${images.logo}',
      chat: '${images.chat}',
      head: '${images.head}'
    },

    // Define styles
    styles: {
      font_family: '${styles.font_family}',
      font_size: '${styles.font_size}',
      radius: '${styles.radius}'
    },

    // Define button
    button: {
      style: '${button.style}',
      title: '${button.title}',
      align: '${button.align}',
      quit_button: ${button.quit_button}
    },

    // Define dialog
    dialog: {
      style: '${dialog.style}',
      title: '${dialog.title}',
      align: '${dialog.align}',
      write: '${dialog.write}',
      share_attach_message: '${dialog.share_attach_message}',
      share_attach_link: '${dialog.share_attach_link}',
      share_attach_name: '${dialog.share_attach_name}',
      share_camera_message: '${dialog.share_camera_message}',
      emojis: ${dialog.emojis},
      attach: ${dialog.attach},
      camera: ${dialog.camera},
      dictate: ${dialog.dictate},
      hide_button: ${dialog.hide_button},
      quit_button: ${dialog.quit_button},
      quit_dialog: ${dialog.quit_dialog},
      quit_dialog_message: '${dialog.quit_dialog_message}',
      quit_dialog_negative: '${dialog.quit_dialog_negative}',
      quit_dialog_positive: '${dialog.quit_dialog_positive}',
      logo: ${dialog.logo},
      time: ${dialog.time}
    },

    // Define emojis
    emojis: [{
      code: 'favorites',
      text: '⭐',
      list: ['👍','👎','😂','😎','😜','👏','💪','😁','🙂','🤘','😲','🤔','🙄','😬','😠']
    }, {
      code: 'smileys & people',
      text: '😀',
      list: ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','☺️','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🤠','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','☠️','👻','👽','👾','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','👶','🧒','👦','👧','🧑','👨','👩','🧓','👴','👵','👨‍⚕️','👩‍⚕️','👨‍🎓','👩‍🎓','👨‍🏫','👩‍🏫','👨‍⚖️','👩‍⚖️','👨‍🌾','👩‍🌾','👨‍🍳','👩‍🍳','👨‍🔧','👩‍🔧','👨‍🏭','👩‍🏭','👨‍💼','👩‍💼','👨‍🔬','👩‍🔬','👨‍💻','👩‍💻','👨‍🎤','👩‍🎤','👨‍🎨','👩‍🎨','👨‍✈️','👩‍✈️','👨‍🚀','👩‍🚀','👨‍🚒','👩‍🚒','👮','👮‍♂️','👮‍♀️','🕵️','🕵️‍♂️','🕵️‍♀️','💂','💂‍♂️','💂‍♀️','👷','👷‍♂️','👷‍♀️','🤴','👸','👳','👳‍♂️','👳‍♀️','👲','🧕','🧔','👱','👱‍♂️','👱‍♀️','🤵','👰','🤰','🤱','👼','🎅','🤶','🧙','🧙‍♀️','🧙‍♂️','🧚','🧚‍♀️','🧚‍♂️','🧛','🧛‍♀️','🧛‍♂️','🧜','🧜‍♀️','🧜‍♂️','🧝','🧝‍♀️','🧝‍♂️','🧞','🧞‍♀️','🧞‍♂️','🧟','🧟‍♀️','🧟‍♂️','🙍','🙍‍♂️','🙍‍♀️','🙎','🙎‍♂️','🙎‍♀️','🙅','🙅‍♂️','🙅‍♀️','🙆','🙆‍♂️','🙆‍♀️','💁','💁‍♂️','💁‍♀️','🙋','🙋‍♂️','🙋‍♀️','🙇','🙇‍♂️','🙇‍♀️','🤦','🤦‍♂️','🤦‍♀️','🤷','🤷‍♂️','🤷‍♀️','💆','💆‍♂️','💆‍♀️','💇','💇‍♂️','💇‍♀️','🚶','🚶‍♂️','🚶‍♀️','🏃','🏃‍♂️','🏃‍♀️','💃','🕺','👯','👯‍♂️','👯‍♀️','🧖','🧖‍♀️','🧖‍♂️','🧗','🧗‍♀️','🧗‍♂️','🧘','🧘‍♀️','🧘‍♂️','🛀','🛌','🕴️','🗣️','👤','👥','🤺','🏇','⛷️','🏂','🏌️','🏌️‍♂️','🏌️‍♀️','🏄','🏄‍♂️','🏄‍♀️','🚣','🚣‍♂️','🚣‍♀️','🏊','🏊‍♂️','🏊‍♀️','⛹️','⛹️‍♂️','⛹️‍♀️','🏋️','🏋️‍♂️','🏋️‍♀️','🚴','🚴‍♂️','🚴‍♀️','🚵','🚵‍♂️','🚵‍♀️','🏎️','🏍️','🤸','🤸‍♂️','🤸‍♀️','🤼','🤼‍♂️','🤼‍♀️','🤽','🤽‍♂️','🤽‍♀️','🤾','🤾‍♂️','🤾‍♀️','🤹','🤹‍♂️','🤹‍♀️','👫','👬','👭','💏','👩‍❤️‍💋‍👨','👨‍❤️‍💋‍👨','👩‍❤️‍💋‍👩','💑','👩‍❤️‍👨','👨‍❤️‍👨','👩‍❤️‍👩','👪','👨‍👩‍👦','👨‍👩‍👧','👨‍👩‍👧‍👦','👨‍👩‍👦‍👦','👨‍👩‍👧‍👧','👨‍👨‍👦','👨‍👨‍👧','👨‍👨‍👧‍👦','👨‍👨‍👦‍👦','👨‍👨‍👧‍👧','👩‍👩‍👦','👩‍👩‍👧','👩‍👩‍👧‍👦','👩‍👩‍👦‍👦','👩‍👩‍👧‍👧','👨‍👦','👨‍👦‍👦','👨‍👧','👨‍👧‍👦','👨‍👧‍👧','👩‍👦','👩‍👦‍👦','👩‍👧','👩‍👧‍👦','👩‍👧‍👧','🤳','💪','👈','👉','☝️','👆','🖕','👇','✌️','🤞','🖖','🤘','🤙','🖐️','✋','👌','👍','👎','✊','👊','🤛','🤜','🤚','👋','🤟','✍️','👏','👐','🙌','🤲','🙏','🤝','💅','👂','👃','👣','👀','👁️','👁️‍🗨️','🧠','👅','👄','💋','💘','❤️','💓','💔','💕','💖','💗','💙','💚','💛','🧡','💜','🖤','💝','💞','💟','❣️','💌','💤','💢','💣','💥','💦','💨','💫','💬','🗨️','🗯️','💭','🕳️','👓','🕶️','👔','👕','👖','🧣','🧤','🧥','🧦','👗','👘','👙','👚','👛','👜','👝','🛍️','🎒','👞','👟','👠','👡','👢','👑','👒','🎩','🎓','🧢','⛑️','📿','💄','💍','💎']
    }, {
      code: 'animals & nature',
      text: '🐵',
      list: ['🐵','🐒','🦍','🐶','🐕','🐩','🐺','🦊','🐱','🐈','🦁','🐯','🐅','🐆','🐴','🐎','🦄','🦓','🦌','🐮','🐂','🐃','🐄','🐷','🐖','🐗','🐽','🐏','🐑','🐐','🐪','🐫','🦒','🐘','🦏','🐭','🐁','🐀','🐹','🐰','🐇','🐿️','🦔','🦇','🐻','🐨','🐼','🐾','🦃','🐔','🐓','🐣','🐤','🐥','🐦','🐧','🕊️','🦅','🦆','🦉','🐸','🐊','🐢','🦎','🐍','🐲','🐉','🦕','🦖','🐳','🐋','🐬','🐟','🐠','🐡','🦈','🐙','🐚','🦀','🦐','🦑','🐌','🦋','🐛','🐜','🐝','🐞','🦗','🕷️','🕸️','🦂','💐','🌸','💮','🏵️','🌹','🥀','🌺','🌻','🌼','🌷','🌱','🌲','🌳','🌴','🌵','🌾','🌿','☘️','🍀','🍁','🍂','🍃']
    }, {
      code: 'food & drink',
      text: '🍇',
      list: ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🍎','🍏','🍐','🍑','🍒','🍓','🥝','🍅','🥥','🥑','🍆','🥔','🥕','🌽','🌶️','🥒','🥦','🍄','🥜','🌰','🍞','🥐','🥖','🥨','🥞','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🍡','🥟','🥠','🥡','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🥧','🍫','🍬','🍭','🍮','🍯','🍼','🥛','☕','🍵','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🥤','🥢','🍽️','🍴','🥄','🔪','🏺']
    }, {
      code: 'travel & places',
      text: '🌍',
      list: ['🌍','🌎','🌏','🌐','🗺️','🗾','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏛️','🏗️','🏘️','🏙️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🕍','⛩️','🕋','⛲','⛺','🌁','🌃','🌄','🌅','🌆','🌇','🌉','♨️','🌌','🎠','🎡','🎢','💈','🎪','🎭','🖼️','🎨','🎰','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚌','🚍','🚎','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🚚','🚛','🚜','🚲','🛴','🛵','🚏','🛣️','🛤️','⛽','🚨','🚥','🚦','🚧','🛑','⚓','⛵','🛶','🚤','🛳️','⛴️','🛥️','🚢','✈️','🛩️','🛫','🛬','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🛎️','🚪','🛏️','🛋️','🚽','🚿','🛁','⌛','⏳','⌚','⏰','⏱️','⏲️','🕰️','🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕡','🕖','🕢','🕗','🕣','🕘','🕤','🕙','🕥','🕚','🕦','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','🌚','🌛','🌜','🌡️','☀️','🌝','🌞','⭐','🌟','🌠','☁️','⛅','⛈️','🌤️','🌥️','🌦️','🌧️','🌨️','🌩️','🌪️','🌫️','🌬️','🌀','🌈','🌂','☂️','☔','⛱️','⚡','❄️','☃️','⛄','☄️','🔥','💧','🌊']
    }, {
      code: 'activities',
      text: '🎃',
      list: ['🎃','🎄','🎆','🎇','✨','🎈','🎉','🎊','🎋','🎍','🎎','🎏','🎐','🎑','🎀','🎁','🎗️','🎟️','🎫','🎖️','🏆','🏅','🥇','🥈','🥉','⚽','⚾','🏀','🏐','🏈','🏉','🎾','🎱','🎳','🏏','🏑','🏒','🏓','🏸','🥊','🥋','🥅','🎯','⛳','⛸️','🎣','🎽','🎿','🛷','🥌','🎮','🕹️','🎲','♠️','♥️','♦️','♣️','🃏','🀄','🎴']
    }, {
      code: 'objects',
      text: '🔇',
      list: ['🔇','🔈','🔉','🔊','📢','📣','📯','🔔','🔕','🎼','🎵','🎶','🎙️','🎚️','🎛️','🎤','🎧','📻','🎷','🎸','🎹','🎺','🎻','🥁','📱','📲','☎️','📞','📟','📠','🔋','🔌','💻','🖥️','🖨️','⌨️','🖱️','🖲️','💽','💾','💿','📀','🎥','🎞️','📽️','🎬','📺','📷','📸','📹','📼','🔍','🔎','🔬','🔭','📡','🕯️','💡','🔦','🏮','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️','💰','💴','💵','💶','💷','💸','💳','💹','💱','💲','✉️','📧','📨','📩','📤','📥','📦','📫','📪','📬','📭','📮','🗳️','✏️','✒️','🖋️','🖊️','🖌️','🖍️','📝','💼','📁','📂','🗂️','📅','📆','🗒️','🗓️','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔏','🔐','🔑','🗝️','🔨','⛏️','⚒️','🛠️','🗡️','⚔️','🔫','🏹','🛡️','🔧','🔩','⚙️','🗜️','⚗️','⚖️','🔗','⛓️','💉','💊','🚬','⚰️','⚱️','🗿','🛢️','🔮','🛒']
    }, {
      code: 'symbols',
      text: '🏧',
      list: ['🏧','🚮','🚰','♿','🚹','🚺','🚻','🚼','🚾','🛂','🛃','🛄','🛅','⚠️','🚸','⛔','🚫','🚳','🚭','🚯','🚱','🚷','📵','🔞','☢️','☣️','⬆️','↗️','➡️','↘️','⬇️','↙️','⬅️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔃','🔄','🔙','🔚','🔛','🔜','🔝','🛐','⚛️','🕉️','✡️','☸️','☯️','✝️','☦️','☪️','☮️','🕎','🔯','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🔀','🔁','🔂','▶️','⏩','⏭️','⏯️','◀️','⏪','⏮️','🔼','⏫','🔽','⏬','⏸️','⏹️','⏺️','⏏️','🎦','🔅','🔆','📶','📳','📴','♀️','♂️','⚕️','♻️','⚜️','🔱','📛','🔰','⭕','✅','☑️','✔️','✖️','❌','❎','➕','➖','➗','➰','➿','〽️','✳️','✴️','❇️','‼️','⁉️','❓','❔','❕','❗','〰️','©️','®️','™️','#️⃣','*️⃣','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','💯','🔠','🔡','🔢','🔣','🔤','🅰️','🆎','🅱️','🆑','🆒','🆓','ℹ️','🆔','Ⓜ️','🆕','🆖','🅾️','🆗','🅿️','🆘','🆙','🆚','🈁','🈂️','🈷️','🈶','🈯','🉐','🈹','🈚','🈲','🉑','🈸','🈴','🈳','㊗️','㊙️','🈺','🈵','▪️','▫️','◻️','◼️','◽','◾','⬛','⬜','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘','🔲','🔳','⚪','⚫','🔴','🔵']
    }, {
      code: 'flags',
      text: '🏁',
      list: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🇦🇨','🇦🇩','🇦🇪','🇦🇫','🇦🇬','🇦🇮','🇦🇱','🇦🇲','🇦🇴','🇦🇶','🇦🇷','🇦🇸','🇦🇹','🇦🇺','🇦🇼','🇦🇽','🇦🇿','🇧🇦','🇧🇧','🇧🇩','🇧🇪','🇧🇫','🇧🇬','🇧🇭','🇧🇮','🇧🇯','🇧🇱','🇧🇲','🇧🇳','🇧🇴','🇧🇶','🇧🇷','🇧🇸','🇧🇹','🇧🇻','🇧🇼','🇧🇾','🇧🇿','🇨🇦','🇨🇨','🇨🇩','🇨🇫','🇨🇬','🇨🇭','🇨🇮','🇨🇰','🇨🇱','🇨🇲','🇨🇳','🇨🇴','🇨🇵','🇨🇷','🇨🇺','🇨🇻','🇨🇼','🇨🇽','🇨🇾','🇨🇿','🇩🇪','🇩🇬','🇩🇯','🇩🇰','🇩🇲','🇩🇴','🇩🇿','🇪🇦','🇪🇨','🇪🇪','🇪🇬','🇪🇭','🇪🇷','🇪🇸','🇪🇹','🇪🇺','🇫🇮','🇫🇯','🇫🇰','🇫🇲','🇫🇴','🇫🇷','🇬🇦','🇬🇧','🇬🇩','🇬🇪','🇬🇫','🇬🇬','🇬🇭','🇬🇮','🇬🇱','🇬🇲','🇬🇳','🇬🇵','🇬🇶','🇬🇷','🇬🇸','🇬🇹','🇬🇺','🇬🇼','🇬🇾','🇭🇰','🇭🇲','🇭🇳','🇭🇷','🇭🇹','🇭🇺','🇮🇨','🇮🇩','🇮🇪','🇮🇱','🇮🇲','🇮🇳','🇮🇴','🇮🇶','🇮🇷','🇮🇸','🇮🇹','🇯🇪','🇯🇲','🇯🇴','🇯🇵','🇰🇪','🇰🇬','🇰🇭','🇰🇮','🇰🇲','🇰🇳','🇰🇵','🇰🇷','🇰🇼','🇰🇾','🇰🇿','🇱🇦','🇱🇧','🇱🇨','🇱🇮','🇱🇰','🇱🇷','🇱🇸','🇱🇹','🇱🇺','🇱🇻','🇱🇾','🇲🇦','🇲🇨','🇲🇩','🇲🇪','🇲🇫','🇲🇬','🇲🇭','🇲🇰','🇲🇱','🇲🇲','🇲🇳','🇲🇴','🇲🇵','🇲🇶','🇲🇷','🇲🇸','🇲🇹','🇲🇺','🇲🇻','🇲🇼','🇲🇽','🇲🇾','🇲🇿','🇳🇦','🇳🇨','🇳🇪','🇳🇫','🇳🇬','🇳🇮','🇳🇱','🇳🇴','🇳🇵','🇳🇷','🇳🇺','🇳🇿','🇴🇲','🇵🇦','🇵🇪','🇵🇫','🇵🇬','🇵🇭','🇵🇰','🇵🇱','🇵🇲','🇵🇳','🇵🇷','🇵🇸','🇵🇹','🇵🇼','🇵🇾','🇶🇦','🇷🇪','🇷🇴','🇷🇸','🇷🇺','🇷🇼','🇸🇦','🇸🇧','🇸🇨','🇸🇩','🇸🇪','🇸🇬','🇸🇭','🇸🇮','🇸🇯','🇸🇰','🇸🇱','🇸🇲','🇸🇳','🇸🇴','🇸🇷','🇸🇸','🇸🇹','🇸🇻','🇸🇽','🇸🇾','🇸🇿','🇹🇦','🇹🇨','🇹🇩','🇹🇫','🇹🇬','🇹🇭','🇹🇯','🇹🇰','🇹🇱','🇹🇲','🇹🇳','🇹🇴','🇹🇷','🇹🇹','🇹🇻','🇹🇼','🇹🇿','🇺🇦','🇺🇬','🇺🇲','🇺🇳','🇺🇸','🇺🇾','🇺🇿','🇻🇦','🇻🇨','🇻🇪','🇻🇬','🇻🇮','🇻🇳','🇻🇺','🇼🇫','🇼🇸','🇽🇰','🇾🇪','🇾🇹','🇿🇦','🇿🇲','🇿🇼','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🏴󠁧󠁢󠁳󠁣󠁴󠁿','🏴󠁧󠁢󠁷󠁬󠁳󠁿']
    }]
  },

  // Define system
  system: null,

  // Define system storage
  system_storage: null,

  // Define system content
  system_content: null,

  // Define client
  client: null,

  // Define socket
  socket: null,

  // Define ticket
  ticket: null,

  // Define welcome
  welcome: null,

  //
  //
  // Private methods
  //
  //

  //
  // Define system init
  //
  // @private
  // @return void
  //
  __systemInit: function() {

    // Define self
    var self = this;

    // Verify system status
    if (self.system) {
      return;
    }

    // Define system
    self.system = true;
    self.system_storage = self.__getStorage();
    self.system_content = self.__getContent();

    // Define chat
    self.chat = document.createElement('div');
    self.chat.id = self.id;
    self.chat.innerHTML = self.system_content;

    // Define body
    self.body = document.getElementsByTagName('body')[0];
    self.body.appendChild(self.chat);

    // Define button
    self.button = document.getElementById(self.id + '_button');
    self.button_chat = document.getElementById(self.id + '_button_chat');
    self.button_quit = document.getElementById(self.id + '_button_quit');

    // Define dialog
    self.dialog = document.getElementById(self.id + '_dialog');

    // Define dialog head
    self.dialog_head_hide_control = document.getElementById(self.id + '_dialog_head_hide_control');
    self.dialog_head_quit_control = document.getElementById(self.id + '_dialog_head_quit_control');

    // Define dialog body
    self.dialog_body = document.getElementById(self.id + '_dialog_body');
    self.dialog_body_emojis = document.getElementById(self.id + '_dialog_body_emojis');
    self.dialog_body_attach = document.getElementById(self.id + '_dialog_body_attach');
    self.dialog_body_attach_area = document.getElementById(self.id + '_dialog_body_attach_area');
    self.dialog_body_attach_area_control = document.getElementById(self.id + '_dialog_body_attach_area_control');
    self.dialog_body_camera = document.getElementById(self.id + '_dialog_body_camera');
    self.dialog_body_camera_area = document.getElementById(self.id + '_dialog_body_camera_area');
    self.dialog_body_camera_area_control = document.getElementById(self.id + '_dialog_body_camera_area_control');

    // Define dialog form
    self.dialog_form = document.getElementById(self.id + '_dialog_form');
    self.dialog_form_text_control = document.getElementById(self.id + '_dialog_form_text_control');
    self.dialog_form_emojis_control = document.getElementById(self.id + '_dialog_form_emojis_control');
    self.dialog_form_attach_control = document.getElementById(self.id + '_dialog_form_attach_control');
    self.dialog_form_camera_control = document.getElementById(self.id + '_dialog_form_camera_control');
    self.dialog_form_dictate_control = document.getElementById(self.id + '_dialog_form_dictate_control');
    self.dialog_form_send_control = document.getElementById(self.id + '_dialog_form_send_control');

    // Define dialog form size
    self.dialog_form_text_control_menu_height = 30;
    self.dialog_form_text_control_line_height = 40;
    self.dialog_form_text_control_lines = 2;
    self.dialog_form_text_control_chars = 80;

    // Define dialog size
    self.dialog_body.style.bottom = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height) + 'px';
    self.dialog_form.style.height = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height) + 'px';

    // Define window
    self.window = document.getElementById(self.id + '_window');
    self.window_quit_dialog = document.getElementById(self.id + '_window_quit_dialog');
    self.window_quit_dialog_negative_control = document.getElementById(self.id + '_window_quit_dialog_negative_control');
    self.window_quit_dialog_positive_control = document.getElementById(self.id + '_window_quit_dialog_positive_control');

    // Define button chat click event
    self.button_chat.addEventListener('click', function(event) {
      event.preventDefault();
      self.dialog_body_emojis.style.display = 'none';
      self.dialog_body_attach.style.display = 'none';
      self.dialog_body_camera.style.display = 'none';
      self.dialog.style.display = 'block';
      self.dialog_form_text_control.value = '';
      self.dialog_form_text_control.focus();
      self.sendAction('show_dialog');
      if (!self.welcome) {
        self.sendAction('welcome');
        self.welcome = true;
      }
    }, false);

    // Define button chat click event
    self.button_quit.addEventListener('click', function(event) {
      event.preventDefault();
      self.hideButton();
    }, false);

    // Define dialog head hide control click event
    self.dialog_head_hide_control.addEventListener('click', function(event) {
      event.preventDefault();
      self.dialog.style.display = 'none';
      self.sendAction('hide_dialog');
    }, false);

    // Define dialog head quit control click event
    self.dialog_head_quit_control.addEventListener('click', function(event) {
      event.preventDefault();
      if (self.params.dialog.quit_dialog) {
        self.window.style.display = 'block';
        self.window_quit_dialog.style.display = 'block';
        self.window_quit_dialog_positive_control.focus();
      } else {
        self.window_quit_dialog_positive_control.click();
      }
    }, false);

    // Define window quit dialog negative control click event
    self.window_quit_dialog_negative_control.addEventListener('click', function(event) {
      self.window_quit_dialog.style.display = 'none';
      self.window.style.display = 'none';
      self.dialog_form_text_control.focus();
    }, false);

    // Define window quit dialog positive control click event
    self.window_quit_dialog_positive_control.addEventListener('click', function(event) {
      self.window_quit_dialog.style.display = 'none';
      self.window.style.display = 'none';
      self.sendAction('quit_dialog');
      self.__quit();
    }, false);

    // Define dialog form submit event
    self.dialog_form.addEventListener('submit', function(event) {
      event.preventDefault();
    }, false);

    // Define dialog form send control click event
    self.dialog_form_send_control.addEventListener('click', function(event) {
      event.preventDefault();
      var text = self.dialog_form_text_control.value.trim();
      if (text) {
        self.sendText(text);
      }
    }, false);

    // Define dialog form text control mouseup event
    self.dialog_form_text_control.addEventListener('mouseup', function(event) {
      if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          return sel.getRangeAt(0);
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
      }
    }, false);

    // Define dialog form text control keyup event
    self.dialog_form_text_control.addEventListener('keyup', function(event) {
      if ([10, 13].indexOf(event.keyCode) === -1) {
        var lines = self.dialog_form_text_control.value.split(/\r\n|\r|\n/).length;
        var chars = self.dialog_form_text_control.value.length;
        if (lines < self.dialog_form_text_control_lines && chars < self.dialog_form_text_control_chars) {
          self.dialog_body.style.bottom = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height * lines) + 'px';
          self.dialog_form.style.height = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height * lines) + 'px';
        } else {
          self.dialog_body.style.bottom = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height * self.dialog_form_text_control_lines) + 'px';
          self.dialog_form.style.height = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height * self.dialog_form_text_control_lines) + 'px';
        }
        self.dialog_body_emojis.style.bottom = self.dialog_form.style.height;
        self.dialog_body_attach.style.bottom = self.dialog_form.style.height;
        self.dialog_body_camera.style.bottom = self.dialog_form.style.height;
      }
    }, false);

    // Define dialog form text control keypress event
    self.dialog_form_text_control.addEventListener('keydown', function(event) {
      if ([10, 13].indexOf(event.keyCode) > -1 && (event.shiftKey || event.ctrlKey)) {
        event.preventDefault();
        self.dialog_form_text_control.value += '\n';
      } else if (event.keyCode === 13) {
        event.preventDefault();
        self.dialog_form_text_control.value += '\n';
        self.dialog_form_send_control.click();
      } else if (self.dialog_form_text_control.value) {
        if (!self.talking) {
          self.sendAction('talking');
          self.talking = true;
        }
        if (self.talking && self.talkingTimeout) {
          clearTimeout(self.talkingTimeout);
        }
        if (self.talking) {
          self.talkingTimeout = setTimeout(function() {
            self.sendAction('silence');
            self.talking = false;
          }, 2500);
        }
      }
    }, false);

    // Define dialog form text control keyup event
    self.dialog_form_text_control.addEventListener('input', function(event) {
      ${prefix}Mask.mask(event, self.dialog_form_text_control.getAttribute('mask') || '');
    }, false);

    // Define emojis module
    if (self.params.dialog.emojis) {
      self.dialog_form_emojis_control.style.display = 'block';
      self.dialog_form_emojis_control.addEventListener('click', function(event) {
        self.dialog_body_attach.style.display = 'none';
        self.dialog_body_camera.style.display = 'none';
        if (self.dialog_body_emojis.style.display === 'block') {
          self.dialog_body_emojis.style.display = 'none';
        } else {
          self.dialog_body_emojis.style.display = 'block';
          self.dialog_body_emojis.style.bottom = self.dialog_form.style.height;
        }
        self.dialog_form_text_control.focus();
      }, false);
      var onclick_toolbar = function(event) {
        event.preventDefault();
        for (var x = 0; x < self.params.emojis.length; x++) {
          if (parseInt(event.target.id.substr(-1, 1)) === parseInt(x)) {
            document.getElementById(self.id + '_dialog_body_emojis_content_' + x).style.display = 'block';
          } else {
            document.getElementById(self.id + '_dialog_body_emojis_content_' + x).style.display = 'none';
          }
        }
        self.dialog_form_text_control.focus();
      };
      var onclick_content = function(event) {
        event.preventDefault();
        var start = self.dialog_form_text_control.selectionStart;
        var end = self.dialog_form_text_control.selectionEnd;
        var text = self.dialog_form_text_control.value;
        self.dialog_form_text_control.value = (text.substring(0, start) + event.target.innerText + text.substring(end, text.length));
        self.dialog_form_text_control.selectionStart = self.dialog_form_text_control.selectionEnd = start + event.target.innerText.length;
        self.dialog_form_text_control.focus();
      };
      for (var i = 0; i < self.params.emojis.length; i++) {
        var display = i === 0 ? 'block' : 'none';
        var group = self.params.emojis[i];
        if (group.text) {
          document.getElementById(self.id + '_dialog_body_emojis_toolbar').insertAdjacentHTML('beforeend', '<div id="' + self.id + '_dialog_body_emojis_toolbar_' + i + '">' + group.text + '</div>');
          document.getElementById(self.id + '_dialog_body_emojis_toolbar_' + i).addEventListener('click', onclick_toolbar, false);
          document.getElementById(self.id + '_dialog_body_emojis_content').insertAdjacentHTML('beforeend', '<div id="' + self.id + '_dialog_body_emojis_content_' + i + '" style="display: ' + display + '"></div>');
          for (var j = 0; j < group.list.length; j++) {
            var emoji = group.list[j];
            if (emoji) {
              document.getElementById(self.id + '_dialog_body_emojis_content_' + i).insertAdjacentHTML('beforeend', '<div id="' + self.id + '_dialog_body_emojis_content_' + i + '_' + j + '">' + emoji + '</div>');
              document.getElementById(self.id + '_dialog_body_emojis_content_'+ i + '_' + j).addEventListener('click', onclick_content, false);
            }
          }
        }
      }
    }

    // Define attach module
    if (self.params.dialog.attach) {
      self.dialog_form_attach_control.style.display = 'block';
      self.dialog_form_attach_control.addEventListener('click', function(event) {
        self.dialog_body_emojis.style.display = 'none';
        self.dialog_body_camera.style.display = 'none';
        if (self.dialog_body_attach.style.display === 'block') {
          self.dialog_body_attach.style.display = 'none';
        } else {
          self.dialog_body_attach.style.display = 'block';
          self.dialog_body_attach.style.bottom = self.dialog_form.style.height;
        }
        self.dialog_form_text_control.focus();
      }, false);
      self.dialog_body_attach_area.addEventListener('dragenter', function(event) {
        event.preventDefault();
        event.stopPropagation();
        self.dialog_body_attach_area.classList.add('active');
      }, false);
      self.dialog_body_attach_area.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.stopPropagation();
        self.dialog_body_attach_area.classList.add('active');
      }, false);
      self.dialog_body_attach_area.addEventListener('dragleave', function(event) {
        event.preventDefault();
        event.stopPropagation();
        self.dialog_body_attach_area.classList.remove('active');
      }, false);
      self.dialog_body_attach_area.addEventListener('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        self.dialog_body_attach_area.classList.remove('active');
        handleImages(event.dataTransfer.files);
      }, false);
      self.dialog_body_attach_area.addEventListener('click', function(event) {
        self.dialog_body_attach_area_control.click();
      }, false);
      self.dialog_body_attach_area_control.addEventListener('change', function(event) {
        self.dialog_body_attach_area.classList.remove('active');
        handleImages(event.target.files);
      }, false);
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(name) {
        self.body.addEventListener(name, function(event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
      function uploadImages(file) {
        if (file) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function() {
            if (reader.result) {
              self.sendFile(reader.result);
            }
          }
        }
      }
      function handleImages(files) {
        if (files && files.length > 0) {
          for (var f = 0; f < files.length; f++) {
            var file = files.item(f);
            if (file) {
              uploadImages(file);
            }
          }
        }
      }
    }

    // Define camera module
    if (self.params.dialog.camera) {
      self.dialog_form_camera_control.style.display = 'block';
      self.dialog_form_camera_control.addEventListener('click', function(event) {
        self.dialog_body_emojis.style.display = 'none';
        self.dialog_body_attach.style.display = 'none';
        if (self.dialog_body_camera.style.display === 'block') {
          self.dialog_body_camera.style.display = 'none';
        } else {
          self.dialog_body_camera.style.display = 'block';
          self.dialog_body_camera.style.bottom = self.dialog_form.style.height;
        }
        if (self.dialog_body_camera.style.display === 'block') {
          navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
            self.dialog_body_camera_area_control.srcObject = stream;
            self.dialog_body_camera_area_control.play();
            self.dialog_body_camera_area_control_play_interval = setInterval(function() {
              if (self.dialog_body_camera.style.display === 'none' && self.dialog_body_camera_area_control && self.dialog_body_camera_area_control.srcObject) {
                clearInterval(self.dialog_body_camera_area_control_play_interval);
                self.dialog_body_camera_area_control.srcObject.getTracks()[0].stop();
              }
            }, 500);
          }).catch(function() {
          });
        }
        self.dialog_form_text_control.focus();
      }, false);
      self.dialog_body_camera_area.addEventListener('click', function(event) {
        var canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 120;
        canvas.getContext('2d').drawImage(self.dialog_body_camera_area_control, 0, 0, canvas.width, canvas.height);
        var reader = {
          result: canvas.toDataURL('image/png')
        };
        if (reader.result) {
          self.sendFile(reader.result);
        }
      }, false);
    }

    // Define dictate module
    if (self.params.dialog.dictate && window.hasOwnProperty('webkitSpeechRecognition')) {
      self.dialog_form_dictate_control.style.display = 'block';
      self.dialog_form_dictate_control.addEventListener('click', function(event) {
        event.preventDefault();
        self.dialog_body_emojis.style.display = 'none';
        self.dialog_body_attach.style.display = 'none';
        self.dialog_body_camera.style.display = 'none';
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = self.params.global.language;
        recognition.start();
        recognition.onresult = function(e) {
          if (e) {
            self.dialog_form_text_control.value = e.results[0][0].transcript || '';
            self.dialog_form_text_control.focus();
          }
        };
        recognition.onerror = function(e) {
          recognition.stop();
        }
        self.dialog_form_text_control.focus();
      }, false);
    }
  },

  //
  // Define client init
  //
  // @private
  // @return void
  //
  __clientInit: function() {

    // Define self
    var self = this;

    // Verify client
    if (self.client) {
      return;
    }

    // Define status
    self.client = true;

    // Define ticket
    self.ticket = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    self.system_storage.setItem('ticket', self.ticket);

    // Define ticket interval
    var ticketInterval = setInterval(function() {
      if (!self.system_storage.hasItem('ticket')) {
        self.__quit();
        clearInterval(ticketInterval);
      }
    }, 1000);

    var timeoutInterval = setInterval(function() {
      if (self.params.system.timeout && self.last && (new Date().getTime() - self.last) > self.params.system.timeout) {
        self.last = 0;
        self.sendAction('timeout');
        clearInterval(ticketInterval);
        clearInterval(timeoutInterval);
        setTimeout(function() {
          self.__close();
        }, 5000);
      }
    }, 1000);
  },

  //
  // Define socket init
  //
  // @private
  // @return void
  //
  __socketInit: function() {

    // Define self
    var self = this;

    // Verify socket
    if (self.socket) {
      return;
    }

    // Define socket
    self.socket = io('_URL_/_PLUGIN_', {
      path: '/socket.io',
      query: {
        plugin: '_PLUGIN_',
        origin: '_ORIGIN_',
        ticket: self.ticket
      },
      transports: ['websocket', 'polling'],
      timeout: 60000
    });

    // Define socket message event
    self.socket.on('message', function(update) {
      self.__drawMessage(update);
    });
  },

  //
  // Define send message
  //
  // @private
  // @param {Object} update
  // @return void
  //
  __sendMessage: function(update) {

    // Verify update
    if (!update) {
      return;
    }

    // Define self
    var self = this;

    // Verify data
    for (var k in update) {
      if (typeof update[k] === 'undefined') {
        delete update[k];
      } else if (typeof update[k] === 'string' && update[k] === '') {
        delete update[k];
      } else if (typeof update[k] === 'number' && update[k] === 0) {
        delete update[k];
      } else if (typeof update[k] === 'object' && Array.isArray(update[k]) && !update[k].length) {
        delete update[k];
      } else if (typeof update[k] === 'object' && !Object.keys(update[k]).length) {
        delete update[k];
      }
    }

    // Verify message
    self.socket.send(update);

    // Verify message
    if (update.text || update.file || update.menu || update.form) {

      // Draw message
      self.__drawMessage(update);

      // Verify dialog form text
      self.dialog_form_text_control.value = '';
      self.dialog_form_text_control.focus();

      // Verify dialog body emojis, attach and camera
      self.dialog_body_emojis.style.display = 'none';
      self.dialog_body_attach.style.display = 'none';
      self.dialog_body_camera.style.display = 'none';

      // Verify dialog body and form size
      self.dialog_body.style.bottom = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height) + 'px';
      self.dialog_form.style.height = (self.dialog_form_text_control_menu_height + self.dialog_form_text_control_line_height) + 'px';
    }
  },

  //
  // Define draw message
  //
  // @private
  // @param {Object} update
  // @param {Boolean} hisotry
  // @return void
  //
  __drawMessage: function(update) {

    // Verify update
    if (!update) {
      return;
    }

    // Define self
    var self = this;

    // Define date
    var date = new Date(update.time || new Date().getTime());

    // Define last
    self.last = new Date().getTime();

    // Define from
    var type = '';
    if (update.type === 'outgoing') {
      type = 'bubble bubble-left';
    } else {
      type = 'bubble bubble-right';
    }

    // Define time
    var time = '';
    if (self.params.dialog.time) {
      time = '<div class="time">' + ('0' + date.getHours()).substr(-2) + ':' + ('0' + date.getMinutes()).substr(-2) + '</div>';
    }

    // Define logo
    var logo = '';
    if (self.params.dialog.logo && self.params.images.logo && update.type === 'outgoing') {
      logo = '<div class="icon"><img src="' + self.params.images.logo + '"></div>';
    }

    // Delete talking
    var talking = document.getElementsByClassName('talking');
    for (var t = 0; t < talking.length; t++) {
      talking[t].remove();
    }

    // Delete buttons
    var buttons = document.getElementsByClassName('buttons');
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].remove();
    }

    // Delete forms
    var forms = document.getElementsByClassName('form');
    for (var f = 0; f < forms.length; f++) {
      //forms[f].remove();
      forms[f].style.display = 'none';
    }

    // Verify user
    if (update.user) {
      self.params.global.user = update.user;
    }

    // Verify customer
    if (update.customer) {
      self.params.global.customer = update.customer;
    }

    // Verify settings
    if (update.settings) {
      self.params.global.settings = update.settings;
    }

    // Verify settings
    if (update.settings) {
      self.params.global.settings = update.settings;
    }

    // Verify language
    if (update.language) {
      self.params.global.language = update.language;
    }

    // Verify show button
    if (update.action === 'show_button') {
      self.showButton();
      return;
    }

    // Verify hide button
    if (update.action === 'hide_button') {
      self.hideButton();
      return;
    }

    // Verify show dialog
    if (update.action === 'show_dialog') {
      self.showDialog();
      return;
    }

    // Verify hide dialog
    if (update.action === 'hide_dialog') {
      self.hideDialog();
      return;
    }

    // Verify quit dialog
    if (update.action === 'quit_dialog') {
      self.quitDialog();
      return;
    }

    // Verify talking
    if (update.action === 'talking') {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div class="' + type + ' talking">' + logo + '<div class="talk"><span></span><span></span><span></span></div></div>')
      self.dialog_body.scrollTop = self.dialog_body.scrollHeight;
      return;
    }

    // Verify talking
    if (update.action === 'silence') {
      self.dialog_body.scrollTop = self.dialog_body.scrollHeight;
      return;
    }

    // Verify text
    if (update.text && !update.text.match(/^\[[^\]]+\]$/gim)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="text">' + update.text.replace(/\r?\n/g, '<br>') + time + '</div></div>');
    }

    // Verify file
    if (update.file && update.file.substr(0, 10) === 'data:image') {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-image"><img src="' + update.file + '">' + time + '</div></div>');
    } else if (update.file && update.file.match(/\.(bmp|cur|gif|ico|jpe?g|png|raw|svgz?|tiff|webp)$/i)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-image"><img src="' + update.file + '">' + time + '</div></div>');
    } else if (update.file && update.file.match(/\.mp3$/i)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-audio"><audio controls controlsList="nodownload"><source src="' + update.file + '" type="audio/mp3"></audio>' + time + '</div></div>');
    } else if (update.file && update.file.match(/\.mp4$/i)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-video"><video controls controlsList="nodownload"><source src="' + update.file + '" type="video/mp4"></video>' + time + '</div></div>');
    } else if (update.file && update.file.match(/\.ogg$/i)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-video"><video controls controlsList="nodownload"><source src="' + update.file + '" type="video/ogg"></video>' + time + '</div></div>');
    } else if (update.file && update.file.match(/^https:\/\/drive\.google\.com\/file\/d\//)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-video"><video controls controlsList="nodownload"><source src="https://drive.google.com/u/0/uc?id=' + update.file.split('/file/d/')[1].split('/')[0] + '&export=download" type="video/mp4"></video>' + time + '</div></div>');
    } else if (update.file && update.file.match(/^iframe:\/\//)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-frame"><iframe src="' + update.file.replace(/^iframe/, 'https') + '" allow="autoplay" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" encrypted-media="true"></iframe>' + time + '</div></div>');
    } else if (update.file && update.file.match(/^https:\/\/docs\.google\.com\/presentation\//)) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file file-frame"><iframe src="' + update.file + '" allow="autoplay" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" encrypted-media="true"></iframe>' + time + '</div></div>');
    } else if (update.file) {
      self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + self.id + '-message-' + update.id + '" class="' + type + ' message">' + logo + '<div class="file" onclick="${prefix}Chat.__downloadFile(\'' + update.file + '\', \'' + self.params.dialog.share_attach_name + '\');">' + self.params.dialog.share_attach_link + '' + time + '</div></div>');
    }

    // Verify mask
    if (update.mask) {
      self.dialog_form_text_control.setAttribute('mask', update.mask);
    } else {
      self.dialog_form_text_control.setAttribute('mask', '');
    }

    // Verify menu
    if (update.menu && update.menu.length) {
      var menu = '';
      var menu_prefix = 'menu_' + new Date().getTime();
      var menu_format = 'buttons';
      var menu_number;

      // Define menu items
      for (menu_number = 0; menu_number < update.menu.length; menu_number++) {
        if (update.menu[menu_number]) {
          var item = update.menu[menu_number];

          if (item.text && item.attr && item.attr.display === 'onetime') {
            self.onetime = self.onetime || {};
            if (self.onetime[item.text]) {
              item.attr.display = 'none';
            } else {
              item.attr.display = 'block';
            }
            item.onetime = 'yes';
          }

          var attr = '';
          attr += (item.attr && item.attr.fontFamily ? 'font-family: ' + item.attr.fontFamily + ' !important;' : '');
          attr += (item.attr && item.attr.fontSize ? 'font-size: ' + item.attr.fontSize + ' !important;' : '');
          attr += (item.attr && item.attr.background ? 'background: ' + item.attr.background + ' !important;' : '');
          attr += (item.attr && item.attr.backgroundColor ? 'background-color: ' + item.attr.backgroundColor + ' !important;' : '');
          attr += (item.attr && item.attr.backgroundImage ? 'background-image: ' + item.attr.backgroundImage + ' !important;' : '');
          attr += (item.attr && item.attr.color ? 'color: ' + item.attr.color + ' !important;' : '');
          attr += (item.attr && item.attr.width ? 'width: ' + item.attr.width + ' !important;' : '');
          attr += (item.attr && item.attr.height ? 'height: ' + item.attr.height + ' !important;' : '');
          attr += (item.attr && item.attr.border ? 'border: ' + item.attr.border + ' !important;' : '');
          attr += (item.attr && item.attr.borderRadius ? 'border-radius: ' + item.attr.borderRadius + ' !important;' : '');
          attr += (item.attr && item.attr.margin ? 'margin: ' + item.attr.margin + ' !important;' : '');
          attr += (item.attr && item.attr.padding ? 'padding: ' + item.attr.padding + ' !important;' : '');
          attr += (item.attr && item.attr.display ? 'display: ' + item.attr.display + ' !important;' : '');

          if (item.text) {
            menu += '<button id="' + menu_prefix + '.' + menu_number + '" type="button" onetime="' + (item.onetime || '') + '" action="' + (item.action || '') + '" intent="' + (item.intent || '') + '" title="' + (item.help || item.text) + '" style="' + attr + '">' + item.text + '</button>';
          }

          if (item.file) {
            menu_format = 'slides';
            if (item.file.substr(0, 10) === 'data:image') {
              menu += '<div class="slide file file-slide"><img src="' + item.file + '"></div>';
            } else if (item.file.match(/\.(bmp|cur|gif|ico|jpe?g|png|raw|svgz?|tiff|webp)$/i)) {
              menu += '<div class="slide file file-slide"><img src="' + item.file + '"></div>';
            } else if (item.file.match(/\.mp3$/i)) {
              menu += '<div class="slide file file-slide"><audio controls controlsList="nodownload"><source src="' + item.file + '" type="audio/mp3"></audio></div>';
            } else if (item.file.match(/\.mp4$/i)) {
              menu += '<div class="slide file file-slide"><video controls controlsList="nodownload"><source src="' + item.file + '" type="video/mp4"></video></div>';
            } else if (item.file.match(/\.ogg$/i)) {
              menu += '<div class="slide file file-slide"><video controls controlsList="nodownload"><source src="' + item.file + '" type="video/ogg"></video></div>';
            } else if (item.file.match(/^https:\/\/drive\.google\.com\/file\/d\//)) {
              menu += '<div class="slide file file-slide"><video controls controlsList="nodownload"><source src="https://drive.google.com/u/0/uc?id=' + item.file.split('/file/d/')[1].split('/')[0] + '&export=download" type="video/mp4"></video></div>';
            } else if (item.file.match(/^iframe:\/\//)) {
              menu += '<div class="slide file file-slide"><iframe src="' + item.file.replace(/^iframe/, 'https') + '" allow="autoplay" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" encrypted-media="true"></iframe></div>';
            } else if (item.file.match(/^https:\/\/docs\.google\.com\/presentation\//)) {
              menu += '<div class="slide file file-slide"><iframe src="' + item.file + '" allow="autoplay" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" encrypted-media="true"></iframe></div>';
            }
          }
        }
      }

      // Create menu
      if (menu_format === 'slides') {
        var arrows = '';
        arrows += '<button id="' + menu_prefix + '.slide-arrow-prev" class="slide-arrow slide-arrow-prev">&#8249;</button>';
        arrows += '<button id="' + menu_prefix + '.slide-arrow-next" class="slide-arrow slide-arrow-next">&#8250;</button>';

        self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + menu_prefix + '" class="' + type  + ' slides">' + arrows + '<div id="' + menu_prefix + '.slides-container" class="menu slides-container" id="slides-container">' + menu + '</div></div>');

        document.getElementById(menu_prefix + '.slide-arrow-next').addEventListener('click', function() {
          var slidesContainer = document.getElementById(menu_prefix + '.slides-container');
          slidesContainer.scrollLeft += slidesContainer.clientWidth;
          self.dialog_form_text_control.focus();
        });
        document.getElementById(menu_prefix + '.slide-arrow-prev').addEventListener('click', function() {
          var slidesContainer = document.getElementById(menu_prefix + '.slides-container');
          slidesContainer.scrollLeft -= slidesContainer.clientWidth;
          self.dialog_form_text_control.focus();
        });
      }

      // Create menu
      if (menu_format === 'buttons') {
        self.dialog_body.insertAdjacentHTML('beforeend', '<div id="' + menu_prefix + '" class="' + type  + ' buttons"><div class="icon"></div><div class="menu">' + menu + '</div></div>');

        // Create menu events
        for (menu_number = 0; menu_number < update.menu.length; menu_number++) {
          if (update.menu[menu_number]) {
            document.getElementById(menu_prefix + '.' + menu_number).addEventListener('click', function(event) {
              event.preventDefault();
              if (event.target.getAttribute('onetime')) {
                var text = event.target.innerText;
                self.onetime = self.onetime || {};
                self.onetime[text] = true;
              }
              if (event.target.getAttribute('action')) {
                return self.sendAction(event.target.getAttribute('action'));
              }
              if (event.target.getAttribute('intent')) {
                return self.sendIntent(event.target.getAttribute('intent'));
              }
              var text = event.target.innerText.trim();
              if (text) {
                self.sendText(text);
              }
            });
          }
        }
      }
    }

    // Verify form
    if (update.form) {

      // Define form
      var form = '';
      var form_prefix = 'form_' + new Date().getTime();
      var form_number;

      // Define item
      var item;
      var item_header;
      var item_footer;
      var item_values;

      // Define form items
      for (form_number = 0; form_number < update.form.length; form_number++) {
        item = update.form[form_number];

        // Define item header
        item_header = '';
        item_header += '<div style="display: inline-block; width: ' + (item.size || '100') + '% !important; border: 0; margin: 0; padding: 4px; vertical-align: top !important;">';
        item_header += (item.attr && item.attr.header ? item.attr.header : '');

        // Define item footer
        item_footer = '';
        item_footer += (item.attr && item.attr.footer ? item.attr.footer : '');
        item_footer += '</div>';

        // Define item values
        item_values = '';
        item_values += ' id="' + form_prefix + '.' + form_number + '"';
        item_values += ' name="' + (item.data || '') + '"';
        item_values += ' type="' + (item.type || '') + '"';
        item_values += ' mask="' + (item.mask || '') + '"';
        item_values += ' placeholder="' + (item.help || '') + '"';
        item_values += (item.attr && item.attr.disabled ? ' disabled="true"' : '');
        item_values += (item.attr && item.attr.required ? ' required="true"' : '');
        item_values += (item.attr && item.attr.readonly ? ' readonly="true"' : '');
        item_values += (item.attr && item.attr.multiple ? ' multiple="true"' : '');
        item_values += (item.attr && item.attr.checked ? ' checked="true"' : '');
        item_values += (item.attr && item.attr.autocomplete ? ' autocomplete="true"' : ' autocomplete="off"');
        item_values += (item.attr && item.attr.autofocus ? ' autofocus="true"' : '');
        item_values += (item.attr && item.attr.class ? ' class="' + item.attr.class + '"' : '');
        item_values += (item.attr && item.attr.style ? ' style="' + item.attr.style + '"' : '');
        item_values += (item.attr && item.attr.value ? ' value="' + item.attr.value + '"' : '');
        item_values += (item.attr && item.attr.error ? ' error="' + item.attr.error + '"' : '');
        item_values += (item.attr && item.attr.size ? ' size="' + item.attr.size + '"' : '');
        item_values += (item.attr && item.attr.step ? ' step="' + item.attr.step + '"' : '');
        item_values += (item.attr && item.attr.min ? ' min="' + item.attr.min + '"' : '');
        item_values += (item.attr && item.attr.max ? ' max="' + item.attr.max + '"' : '');
        item_values += (item.attr && item.attr.minlength ? ' minlength="' + item.attr.minlength + '"' : '');
        item_values += (item.attr && item.attr.maxlength ? ' maxlength="' + item.attr.maxlength + '"' : '');
        item_values += (item.attr && item.attr.pattern ? ' pattern="' + item.attr.pattern + '"' : '');
        item_values += (item.attr && item.attr.onchange ? ' onchange="' + item.attr.onchange + '"' : '');
        item_values += (item.attr && item.attr.onfocus ? ' onfocus="' + item.attr.onfocus + '"' : '');
        item_values += (item.attr && item.attr.onblur ? ' onblur="' + item.attr.onblur + '"' : '');
        item_values += (item.attr && item.attr.onclick ? ' onclick="' + item.attr.onclick + '"' : '');
        item_values += (item.attr && item.attr.ondblclick ? ' ondblclick="' + item.attr.ondblclick + '"' : '');
        item_values += (item.attr && item.attr.onkeyup ? ' onkeyup="' + item.attr.onkeyup + '"' : '');
        item_values += (item.attr && item.attr.onkeydown ? ' onkeydown="' + item.attr.onkeydown + '"' : '');
        item_values += (item.attr && item.attr.onkeypress ? ' onkeypress="' + item.attr.onkeypress + '"' : '');

        if (item.action && (item.type === 'submit' || item.type === 'button')) {
          item_values += ' onclick="${prefix}Chat.__submitForm(\'' + form_prefix + '\', \'' + item.action + '\', \'' + item.type + '\');"';
        }

        // Define form item: custom
        if (item.type === 'custom') {
          form += item_header;
          form += '<custom ' + item_values + ' title="' + (item.help || '') + '">' + (item.text || '') + '</custom>';
          form += item_footer;
          continue;
        }

        // Define form item: button
        if (item.type && ['button', 'submit', 'reset'].indexOf(item.type) > -1) {
          form += item_header;
          form += '<button ' + item_values + ' title="' + (item.help || '') + '">' + (item.text || '') + '</button>';
          form += item_footer;
          continue;
        }

        // Define form item: select
        if (item.type && ['select'].indexOf(item.type) > -1) {
          form += item_header;
          form += (item.text ? '<label for="' + form_prefix + '.' + form_number + '">' + item.text + '</label>' : '');
          form += '<select ' + item_values + '>';
          if (item.attr && item.attr.items) {
            for (var o in item.attr.items) {
              form += '<option value="' + item.attr.items[o].value + '"' + (item.attr.items[o].value === item.attr.value ? ' selected' : '') + '>' + item.attr.items[o].label + '</option>';
            }
          }
          form += '</select>';
          form += item_footer;
          continue;
        }

        // Define form item: textarea
        if (item.type && ['textarea'].indexOf(item.type) > -1) {
          form += item_header;
          form += (item.text ? '<label for="' + form_prefix + '.' + form_number + '">' + item.text + '</label>' : '');
          form += '<textarea ' + item_values + '>' + (item.value || '') + '</textarea>';
          form += item_footer;
          continue;
        }

        // Define form item: input
        if (item.type) {
          form += item_header;
          form += (item.text ? '<label for="' + form_prefix + '.' + form_number + '">' + item.text + '</label>' : '');
          form += '<input ' + item_values + '>';
          form += (['checkbox', 'radio'].indexOf(item.type) > -1 && item.help ? '<label for="' + form_prefix + '.' + form_number + '">' + item.help + '</label>' : '');
          form += item_footer;
          continue;
        }
      }

      // Create form
      self.dialog.insertAdjacentHTML('beforeend', '<form id="' + form_prefix + '" class="form" novalidate="true" onsubmit="return false;"><div style="padding: 0 32px !important;">' + form + '</div></form>');

      // Create form events
      for (form_number = 0; form_number < update.form.length; form_number++) {
        if (update.form[form_number] && document.getElementById(form_prefix + '.' + form_number)) {
          document.getElementById(form_prefix + '.' + form_number).addEventListener('input', function(event) {
            if (event.target) {
              ${prefix}Mask.mask(event, event.target.getAttribute('mask') || '');
              var errors = event.target.parentElement.getElementsByClassName('form-item-error');
              for (var e = 0; e < errors.length; e++) {
                errors[e].remove();
              }
              event.target.checkValidity();
            }
          }, false);
          document.getElementById(form_prefix + '.' + form_number).addEventListener('invalid', function(event) {
            event.preventDefault();
            if (event.target) {
              var errors = event.target.parentElement.getElementsByClassName('form-item-error');
              for (var e = 0; e < errors.length; e++) {
                errors[e].remove();
              }
            }
            if (event.target && event.target.getAttribute('error') && event.target.style.display !== 'none') {
              event.target.parentElement.insertAdjacentHTML('beforeend', '<div class="form-item-error">' + event.target.getAttribute('error') + '</div>');
            }
          }, false);
        }
      }
    }

    // Verify form
    if (update.form) {
      self.dialog_body.style.display = 'none';
      self.dialog_form.style.display = 'none';
      self.dialog_form_text_control.value = '';
      self.dialog_form_text_control.blur();
    } else if (self.dialog_body.style.display !== 'block') {
      self.dialog_body.style.display = 'block';
      self.dialog_form.style.display = 'block';
      self.dialog_form_text_control.value = '';
      self.dialog_form_text_control.focus();
    }

    // Verify dialog
    self.showDialog();

    // Verify scroll top
    setTimeout(function() {
      self.dialog_body.scrollTop = self.dialog_body.scrollHeight;
    }, 100)
    setTimeout(function() {
      self.dialog_body.scrollTop = self.dialog_body.scrollHeight;
    }, 500)
    setTimeout(function() {
      self.dialog_body.scrollTop = self.dialog_body.scrollHeight;
    }, 1000)
  },

  //
  // Define submit form
  //
  // @private
  // @param {String} target
  // @param {String} action
  // @return void
  //
  __submitForm: function(target, action, type) {
    var inputs = document.getElementById(target);
    var values = [];
    if (type === 'submit') {
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].style.display !== 'none' && !inputs[i].checkValidity()) {
          inputs[i].focus();
          return;
        }
        if (inputs[i].style.display === 'none' || inputs[i].type === 'submit' || inputs[i].type ===  'button') {
          continue;
        }
        if (inputs[i].name) {
          values.push({
            index: inputs[i].name,
            value: inputs[i].value
          });
        }
      }
    }
    this.__drawMessage({action: 'refresh'});
    this.__drawMessage({action: 'talking'});
    this.sendAction(action, values);
  },

  //
  // Define download file
  //
  // @private
  // @param {String} data
  // @param {String} name
  // @return void
  //
  __downloadFile: function(data, name) {
    var mime = {"application/andrew-inset":"ez","application/applixware":"aw","application/atom+xml":"atom","application/atomcat+xml":"atomcat","application/atomsvc+xml":"atomsvc","application/bdoc":"bdoc","application/ccxml+xml":"ccxml","application/cdmi-capability":"cdmia","application/cdmi-container":"cdmic","application/cdmi-domain":"cdmid","application/cdmi-object":"cdmio","application/cdmi-queue":"cdmiq","application/cu-seeme":"cu","application/dash+xml":"mpd","application/davmount+xml":"davmount","application/docbook+xml":"dbk","application/dssc+der":"dssc","application/dssc+xml":"xdssc","application/ecmascript":"ecma","application/emma+xml":"emma","application/epub+zip":"epub","application/exi":"exi","application/font-tdpfr":"pfr","application/font-woff":"woff","application/font-woff2":"woff2","application/geo+json":"geojson","application/gml+xml":"gml","application/gpx+xml":"gpx","application/gxf":"gxf","application/gzip":"gz","application/hjson":"hjson","application/hyperstudio":"stk","application/inkml+xml":"ink","application/ipfix":"ipfix","application/java-archive":"jar","application/java-serialized-object":"ser","application/java-vm":"class","application/javascript":"js","application/json":"json","application/json5":"json5","application/jsonml+json":"jsonml","application/ld+json":"jsonld","application/lost+xml":"lostxml","application/mac-binhex40":"hqx","application/mac-compactpro":"cpt","application/mads+xml":"mads","application/manifest+json":"webmanifest","application/marc":"mrc","application/marcxml+xml":"mrcx","application/mathematica":"ma","application/mathml+xml":"mathml","application/mbox":"mbox","application/mediaservercontrol+xml":"mscml","application/metalink+xml":"metalink","application/metalink4+xml":"meta4","application/mets+xml":"mets","application/mods+xml":"mods","application/mp21":"m21","application/mp4":"mp4s","application/msword":"doc","application/mxf":"mxf","application/octet-stream":"bin","application/oda":"oda","application/oebps-package+xml":"opf","application/ogg":"ogx","application/omdoc+xml":"omdoc","application/onenote":"onetoc","application/oxps":"oxps","application/patch-ops-error+xml":"xer","application/pdf":"pdf","application/pgp-encrypted":"pgp","application/pgp-signature":"asc","application/pics-rules":"prf","application/pkcs10":"p10","application/pkcs7-mime":"p7m","application/pkcs7-signature":"p7s","application/pkcs8":"p8","application/pkix-attr-cert":"ac","application/pkix-cert":"cer","application/pkix-crl":"crl","application/pkix-pkipath":"pkipath","application/pkixcmp":"pki","application/pls+xml":"pls","application/postscript":"ai","application/pskc+xml":"pskcxml","application/raml+yaml":"raml","application/rdf+xml":"rdf","application/reginfo+xml":"rif","application/relax-ng-compact-syntax":"rnc","application/resource-lists+xml":"rl","application/resource-lists-diff+xml":"rld","application/rls-services+xml":"rs","application/rpki-ghostbusters":"gbr","application/rpki-manifest":"mft","application/rpki-roa":"roa","application/rsd+xml":"rsd","application/rss+xml":"rss","application/rtf":"rtf","application/sbml+xml":"sbml","application/scvp-cv-request":"scq","application/scvp-cv-response":"scs","application/scvp-vp-request":"spq","application/scvp-vp-response":"spp","application/sdp":"sdp","application/set-payment-initiation":"setpay","application/set-registration-initiation":"setreg","application/shf+xml":"shf","application/smil+xml":"smi","application/sparql-query":"rq","application/sparql-results+xml":"srx","application/srgs":"gram","application/srgs+xml":"grxml","application/sru+xml":"sru","application/ssdl+xml":"ssdl","application/ssml+xml":"ssml","application/tei+xml":"tei","application/thraud+xml":"tfi","application/timestamped-data":"tsd","application/voicexml+xml":"vxml","application/wasm":"wasm","application/widget":"wgt","application/winhlp":"hlp","application/wsdl+xml":"wsdl","application/wspolicy+xml":"wspolicy","application/xaml+xml":"xaml","application/xcap-diff+xml":"xdf","application/xenc+xml":"xenc","application/xhtml+xml":"xhtml","application/xml":"xml","application/xml-dtd":"dtd","application/xop+xml":"xop","application/xproc+xml":"xpl","application/xslt+xml":"xslt","application/xspf+xml":"xspf","application/xv+xml":"mxml","application/yang":"yang","application/yin+xml":"yin","application/zip":"zip","audio/3gpp":"3gpp","audio/adpcm":"adp","audio/basic":"au","audio/midi":"mid","audio/mp3":"mp3","audio/mp4":"m4a","audio/mpeg":"mpga","audio/ogg":"oga","audio/s3m":"s3m","audio/silk":"sil","audio/wav":"wav","audio/wave":"wav","audio/webm":"weba","audio/xm":"xm","font/collection":"ttc","font/otf":"otf","font/ttf":"ttf","font/woff":"woff","font/woff2":"woff2","image/apng":"apng","image/bmp":"bmp","image/cgm":"cgm","image/g3fax":"g3","image/gif":"gif","image/ief":"ief","image/jp2":"jp2","image/jpeg":"jpeg","image/jpm":"jpm","image/jpx":"jpx","image/ktx":"ktx","image/png":"png","image/sgi":"sgi","image/svg+xml":"svg","image/tiff":"tiff","image/webp":"webp","message/rfc822":"eml","model/gltf+json":"gltf","model/gltf-binary":"glb","model/iges":"igs","model/mesh":"msh","model/vrml":"wrl","model/x3d+binary":"x3db","model/x3d+vrml":"x3dv","model/x3d+xml":"x3d","text/cache-manifest":"appcache","text/calendar":"ics","text/coffeescript":"coffee","text/css":"css","text/csv":"csv","text/html":"html","text/jade":"jade","text/jsx":"jsx","text/less":"less","text/markdown":"markdown","text/mathml":"mml","text/n3":"n3","text/plain":"txt","text/richtext":"rtx","text/rtf":"rtf","text/sgml":"sgml","text/shex":"shex","text/slim":"slim","text/stylus":"stylus","text/tab-separated-values":"tsv","text/troff":"t","text/turtle":"ttl","text/uri-list":"uri","text/vcard":"vcard","text/vtt":"vtt","text/xml":"xml","text/yaml":"yaml","video/3gpp":"3gp","video/3gpp2":"3g2","video/h261":"h261","video/h263":"h263","video/h264":"h264","video/jpeg":"jpgv","video/jpm":"jpm","video/mj2":"mj2","video/mp2t":"ts","video/mp4":"mp4","video/mpeg":"mpeg","video/ogg":"ogv","video/quicktime":"qt","video/webm":"webm","application/prs.cww":"cww","application/vnd.3gpp.pic-bw-large":"plb","application/vnd.3gpp.pic-bw-small":"psb","application/vnd.3gpp.pic-bw-var":"pvb","application/vnd.3gpp2.tcap":"tcap","application/vnd.3m.post-it-notes":"pwn","application/vnd.accpac.simply.aso":"aso","application/vnd.accpac.simply.imp":"imp","application/vnd.acucobol":"acu","application/vnd.acucorp":"atc","application/vnd.adobe.air-application-installer-package+zip":"air","application/vnd.adobe.formscentral.fcdt":"fcdt","application/vnd.adobe.fxp":"fxp","application/vnd.adobe.xdp+xml":"xdp","application/vnd.adobe.xfdf":"xfdf","application/vnd.ahead.space":"ahead","application/vnd.airzip.filesecure.azf":"azf","application/vnd.airzip.filesecure.azs":"azs","application/vnd.amazon.ebook":"azw","application/vnd.americandynamics.acc":"acc","application/vnd.amiga.ami":"ami","application/vnd.android.package-archive":"apk","application/vnd.anser-web-certificate-issue-initiation":"cii","application/vnd.anser-web-funds-transfer-initiation":"fti","application/vnd.antix.game-component":"atx","application/vnd.apple.installer+xml":"mpkg","application/vnd.apple.mpegurl":"m3u8","application/vnd.apple.pkpass":"pkpass","application/vnd.aristanetworks.swi":"swi","application/vnd.astraea-software.iota":"iota","application/vnd.audiograph":"aep","application/vnd.blueice.multipass":"mpm","application/vnd.bmi":"bmi","application/vnd.businessobjects":"rep","application/vnd.chemdraw+xml":"cdxml","application/vnd.chipnuts.karaoke-mmd":"mmd","application/vnd.cinderella":"cdy","application/vnd.claymore":"cla","application/vnd.cloanto.rp9":"rp9","application/vnd.clonk.c4group":"c4g","application/vnd.cluetrust.cartomobile-config":"c11amc","application/vnd.cluetrust.cartomobile-config-pkg":"c11amz","application/vnd.commonspace":"csp","application/vnd.contact.cmsg":"cdbcmsg","application/vnd.cosmocaller":"cmc","application/vnd.crick.clicker":"clkx","application/vnd.crick.clicker.keyboard":"clkk","application/vnd.crick.clicker.palette":"clkp","application/vnd.crick.clicker.template":"clkt","application/vnd.crick.clicker.wordbank":"clkw","application/vnd.criticaltools.wbs+xml":"wbs","application/vnd.ctc-posml":"pml","application/vnd.cups-ppd":"ppd","application/vnd.curl.car":"car","application/vnd.curl.pcurl":"pcurl","application/vnd.dart":"dart","application/vnd.data-vision.rdz":"rdz","application/vnd.dece.data":"uvf","application/vnd.dece.ttml+xml":"uvt","application/vnd.dece.unspecified":"uvx","application/vnd.dece.zip":"uvz","application/vnd.denovo.fcselayout-link":"fe_launch","application/vnd.dna":"dna","application/vnd.dolby.mlp":"mlp","application/vnd.dpgraph":"dpg","application/vnd.dreamfactory":"dfac","application/vnd.ds-keypoint":"kpxx","application/vnd.dvb.ait":"ait","application/vnd.dvb.service":"svc","application/vnd.dynageo":"geo","application/vnd.ecowin.chart":"mag","application/vnd.enliven":"nml","application/vnd.epson.esf":"esf","application/vnd.epson.msf":"msf","application/vnd.epson.quickanime":"qam","application/vnd.epson.salt":"slt","application/vnd.epson.ssf":"ssf","application/vnd.eszigno3+xml":"es3","application/vnd.ezpix-album":"ez2","application/vnd.ezpix-package":"ez3","application/vnd.fdf":"fdf","application/vnd.fdsn.mseed":"mseed","application/vnd.fdsn.seed":"seed","application/vnd.flographit":"gph","application/vnd.fluxtime.clip":"ftc","application/vnd.framemaker":"fm","application/vnd.frogans.fnc":"fnc","application/vnd.frogans.ltf":"ltf","application/vnd.fsc.weblaunch":"fsc","application/vnd.fujitsu.oasys":"oas","application/vnd.fujitsu.oasys2":"oa2","application/vnd.fujitsu.oasys3":"oa3","application/vnd.fujitsu.oasysgp":"fg5","application/vnd.fujitsu.oasysprs":"bh2","application/vnd.fujixerox.ddd":"ddd","application/vnd.fujixerox.docuworks":"xdw","application/vnd.fujixerox.docuworks.binder":"xbd","application/vnd.fuzzysheet":"fzs","application/vnd.genomatix.tuxedo":"txd","application/vnd.geogebra.file":"ggb","application/vnd.geogebra.tool":"ggt","application/vnd.geometry-explorer":"gex","application/vnd.geonext":"gxt","application/vnd.geoplan":"g2w","application/vnd.geospace":"g3w","application/vnd.gmx":"gmx","application/vnd.google-apps.document":"gdoc","application/vnd.google-apps.presentation":"gslides","application/vnd.google-apps.spreadsheet":"gsheet","application/vnd.google-earth.kml+xml":"kml","application/vnd.google-earth.kmz":"kmz","application/vnd.grafeq":"gqf","application/vnd.groove-account":"gac","application/vnd.groove-help":"ghf","application/vnd.groove-identity-message":"gim","application/vnd.groove-injector":"grv","application/vnd.groove-tool-message":"gtm","application/vnd.groove-tool-template":"tpl","application/vnd.groove-vcard":"vcg","application/vnd.hal+xml":"hal","application/vnd.handheld-entertainment+xml":"zmm","application/vnd.hbci":"hbci","application/vnd.hhe.lesson-player":"les","application/vnd.hp-hpgl":"hpgl","application/vnd.hp-hpid":"hpid","application/vnd.hp-hps":"hps","application/vnd.hp-jlyt":"jlt","application/vnd.hp-pcl":"pcl","application/vnd.hp-pclxl":"pclxl","application/vnd.hydrostatix.sof-data":"sfd-hdstx","application/vnd.ibm.minipay":"mpy","application/vnd.ibm.modcap":"afp","application/vnd.ibm.rights-management":"irm","application/vnd.ibm.secure-container":"sc","application/vnd.iccprofile":"icc","application/vnd.igloader":"igl","application/vnd.immervision-ivp":"ivp","application/vnd.immervision-ivu":"ivu","application/vnd.insors.igm":"igm","application/vnd.intercon.formnet":"xpw","application/vnd.intergeo":"i2g","application/vnd.intu.qbo":"qbo","application/vnd.intu.qfx":"qfx","application/vnd.ipunplugged.rcprofile":"rcprofile","application/vnd.irepository.package+xml":"irp","application/vnd.is-xpr":"xpr","application/vnd.isac.fcs":"fcs","application/vnd.jam":"jam","application/vnd.jcp.javame.midlet-rms":"rms","application/vnd.jisp":"jisp","application/vnd.joost.joda-archive":"joda","application/vnd.kahootz":"ktz","application/vnd.kde.karbon":"karbon","application/vnd.kde.kchart":"chrt","application/vnd.kde.kformula":"kfo","application/vnd.kde.kivio":"flw","application/vnd.kde.kontour":"kon","application/vnd.kde.kpresenter":"kpr","application/vnd.kde.kspread":"ksp","application/vnd.kde.kword":"kwd","application/vnd.kenameaapp":"htke","application/vnd.kidspiration":"kia","application/vnd.kinar":"kne","application/vnd.koan":"skp","application/vnd.kodak-descriptor":"sse","application/vnd.las.las+xml":"lasxml","application/vnd.llamagraphics.life-balance.desktop":"lbd","application/vnd.llamagraphics.life-balance.exchange+xml":"lbe","application/vnd.lotus-1-2-3":"123","application/vnd.lotus-approach":"apr","application/vnd.lotus-freelance":"pre","application/vnd.lotus-notes":"nsf","application/vnd.lotus-organizer":"org","application/vnd.lotus-screencam":"scm","application/vnd.lotus-wordpro":"lwp","application/vnd.macports.portpkg":"portpkg","application/vnd.mcd":"mcd","application/vnd.medcalcdata":"mc1","application/vnd.mediastation.cdkey":"cdkey","application/vnd.mfer":"mwf","application/vnd.mfmp":"mfm","application/vnd.micrografx.flo":"flo","application/vnd.micrografx.igx":"igx","application/vnd.mif":"mif","application/vnd.mobius.daf":"daf","application/vnd.mobius.dis":"dis","application/vnd.mobius.mbk":"mbk","application/vnd.mobius.mqy":"mqy","application/vnd.mobius.msl":"msl","application/vnd.mobius.plc":"plc","application/vnd.mobius.txf":"txf","application/vnd.mophun.application":"mpn","application/vnd.mophun.certificate":"mpc","application/vnd.mozilla.xul+xml":"xul","application/vnd.ms-artgalry":"cil","application/vnd.ms-cab-compressed":"cab","application/vnd.ms-excel":"xls","application/vnd.ms-excel.addin.macroenabled.12":"xlam","application/vnd.ms-excel.sheet.binary.macroenabled.12":"xlsb","application/vnd.ms-excel.sheet.macroenabled.12":"xlsm","application/vnd.ms-excel.template.macroenabled.12":"xltm","application/vnd.ms-fontobject":"eot","application/vnd.ms-htmlhelp":"chm","application/vnd.ms-ims":"ims","application/vnd.ms-lrm":"lrm","application/vnd.ms-officetheme":"thmx","application/vnd.ms-outlook":"msg","application/vnd.ms-pki.seccat":"cat","application/vnd.ms-pki.stl":"stl","application/vnd.ms-powerpoint":"ppt","application/vnd.ms-powerpoint.addin.macroenabled.12":"ppam","application/vnd.ms-powerpoint.presentation.macroenabled.12":"pptm","application/vnd.ms-powerpoint.slide.macroenabled.12":"sldm","application/vnd.ms-powerpoint.slideshow.macroenabled.12":"ppsm","application/vnd.ms-powerpoint.template.macroenabled.12":"potm","application/vnd.ms-project":"mpp","application/vnd.ms-word.document.macroenabled.12":"docm","application/vnd.ms-word.template.macroenabled.12":"dotm","application/vnd.ms-works":"wps","application/vnd.ms-wpl":"wpl","application/vnd.ms-xpsdocument":"xps","application/vnd.mseq":"mseq","application/vnd.musician":"mus","application/vnd.muvee.style":"msty","application/vnd.mynfc":"taglet","application/vnd.neurolanguage.nlu":"nlu","application/vnd.nitf":"ntf","application/vnd.noblenet-directory":"nnd","application/vnd.noblenet-sealer":"nns","application/vnd.noblenet-web":"nnw","application/vnd.nokia.n-gage.data":"ngdat","application/vnd.nokia.n-gage.symbian.install":"n-gage","application/vnd.nokia.radio-preset":"rpst","application/vnd.nokia.radio-presets":"rpss","application/vnd.novadigm.edm":"edm","application/vnd.novadigm.edx":"edx","application/vnd.novadigm.ext":"ext","application/vnd.oasis.opendocument.chart":"odc","application/vnd.oasis.opendocument.chart-template":"otc","application/vnd.oasis.opendocument.database":"odb","application/vnd.oasis.opendocument.formula":"odf","application/vnd.oasis.opendocument.formula-template":"odft","application/vnd.oasis.opendocument.graphics":"odg","application/vnd.oasis.opendocument.graphics-template":"otg","application/vnd.oasis.opendocument.image":"odi","application/vnd.oasis.opendocument.image-template":"oti","application/vnd.oasis.opendocument.presentation":"odp","application/vnd.oasis.opendocument.presentation-template":"otp","application/vnd.oasis.opendocument.spreadsheet":"ods","application/vnd.oasis.opendocument.spreadsheet-template":"ots","application/vnd.oasis.opendocument.text":"odt","application/vnd.oasis.opendocument.text-master":"odm","application/vnd.oasis.opendocument.text-template":"ott","application/vnd.oasis.opendocument.text-web":"oth","application/vnd.olpc-sugar":"xo","application/vnd.oma.dd2+xml":"dd2","application/vnd.openofficeorg.extension":"oxt","application/vnd.openxmlformats-officedocument.presentationml.presentation":"pptx","application/vnd.openxmlformats-officedocument.presentationml.slide":"sldx","application/vnd.openxmlformats-officedocument.presentationml.slideshow":"ppsx","application/vnd.openxmlformats-officedocument.presentationml.template":"potx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.template":"xltx","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"docx","application/vnd.openxmlformats-officedocument.wordprocessingml.template":"dotx","application/vnd.osgeo.mapguide.package":"mgp","application/vnd.osgi.dp":"dp","application/vnd.osgi.subsystem":"esa","application/vnd.palm":"pdb","application/vnd.pawaafile":"paw","application/vnd.pg.format":"str","application/vnd.pg.osasli":"ei6","application/vnd.picsel":"efif","application/vnd.pmi.widget":"wg","application/vnd.pocketlearn":"plf","application/vnd.powerbuilder6":"pbd","application/vnd.previewsystems.box":"box","application/vnd.proteus.magazine":"mgz","application/vnd.publishare-delta-tree":"qps","application/vnd.pvi.ptid1":"ptid","application/vnd.quark.quarkxpress":"qxd","application/vnd.realvnc.bed":"bed","application/vnd.recordare.musicxml":"mxl","application/vnd.recordare.musicxml+xml":"musicxml","application/vnd.rig.cryptonote":"cryptonote","application/vnd.rim.cod":"cod","application/vnd.rn-realmedia":"rm","application/vnd.rn-realmedia-vbr":"rmvb","application/vnd.route66.link66+xml":"link66","application/vnd.sailingtracker.track":"st","application/vnd.seemail":"see","application/vnd.sema":"sema","application/vnd.semd":"semd","application/vnd.semf":"semf","application/vnd.shana.informed.formdata":"ifm","application/vnd.shana.informed.formtemplate":"itp","application/vnd.shana.informed.interchange":"iif","application/vnd.shana.informed.package":"ipk","application/vnd.simtech-mindmapper":"twd","application/vnd.smaf":"mmf","application/vnd.smart.teacher":"teacher","application/vnd.solent.sdkm+xml":"sdkm","application/vnd.spotfire.dxp":"dxp","application/vnd.spotfire.sfs":"sfs","application/vnd.stardivision.calc":"sdc","application/vnd.stardivision.draw":"sda","application/vnd.stardivision.impress":"sdd","application/vnd.stardivision.math":"smf","application/vnd.stardivision.writer":"sdw","application/vnd.stardivision.writer-global":"sgl","application/vnd.stepmania.package":"smzip","application/vnd.stepmania.stepchart":"sm","application/vnd.sun.wadl+xml":"wadl","application/vnd.sun.xml.calc":"sxc","application/vnd.sun.xml.calc.template":"stc","application/vnd.sun.xml.draw":"sxd","application/vnd.sun.xml.draw.template":"std","application/vnd.sun.xml.impress":"sxi","application/vnd.sun.xml.impress.template":"sti","application/vnd.sun.xml.math":"sxm","application/vnd.sun.xml.writer":"sxw","application/vnd.sun.xml.writer.global":"sxg","application/vnd.sun.xml.writer.template":"stw","application/vnd.sus-calendar":"sus","application/vnd.svd":"svd","application/vnd.symbian.install":"sis","application/vnd.syncml+xml":"xsm","application/vnd.syncml.dm+wbxml":"bdm","application/vnd.syncml.dm+xml":"xdm","application/vnd.tao.intent-module-archive":"tao","application/vnd.tcpdump.pcap":"pcap","application/vnd.tmobile-livetv":"tmo","application/vnd.trid.tpt":"tpt","application/vnd.triscape.mxs":"mxs","application/vnd.trueapp":"tra","application/vnd.ufdl":"ufd","application/vnd.uiq.theme":"utz","application/vnd.umajin":"umj","application/vnd.unity":"unityweb","application/vnd.uoml+xml":"uoml","application/vnd.vcx":"vcx","application/vnd.visio":"vsd","application/vnd.visionary":"vis","application/vnd.vsf":"vsf","application/vnd.wap.wbxml":"wbxml","application/vnd.wap.wmlc":"wmlc","application/vnd.wap.wmlscriptc":"wmlsc","application/vnd.webturbo":"wtb","application/vnd.wolfram.player":"nbp","application/vnd.wordperfect":"wpd","application/vnd.wqd":"wqd","application/vnd.wt.stf":"stf","application/vnd.xara":"xar","application/vnd.xfdl":"xfdl","application/vnd.yamaha.hv-dic":"hvd","application/vnd.yamaha.hv-script":"hvs","application/vnd.yamaha.hv-voice":"hvp","application/vnd.yamaha.openscoreformat":"osf","application/vnd.yamaha.openscoreformat.osfpvg+xml":"osfpvg","application/vnd.yamaha.smaf-audio":"saf","application/vnd.yamaha.smaf-phrase":"spf","application/vnd.yellowriver-custom-menu":"cmp","application/vnd.zul":"zir","application/vnd.zzazz.deck+xml":"zaz","application/x-7z-compressed":"7z","application/x-abiword":"abw","application/x-ace-compressed":"ace","application/x-apple-diskimage":"dmg","application/x-arj":"arj","application/x-authorware-bin":"aab","application/x-authorware-map":"aam","application/x-authorware-seg":"aas","application/x-bcpio":"bcpio","application/x-bdoc":"bdoc","application/x-bittorrent":"torrent","application/x-blorb":"blb","application/x-bzip":"bz","application/x-bzip2":"bz2","application/x-cbr":"cbr","application/x-cdlink":"vcd","application/x-cfs-compressed":"cfs","application/x-chat":"chat","application/x-chess-pgn":"pgn","application/x-chrome-extension":"crx","application/x-cocoa":"cco","application/x-conference":"nsc","application/x-cpio":"cpio","application/x-csh":"csh","application/x-debian-package":"deb","application/x-dgc-compressed":"dgc","application/x-director":"dir","application/x-doom":"wad","application/x-dtbncx+xml":"ncx","application/x-dtbook+xml":"dtb","application/x-dtbresource+xml":"res","application/x-dvi":"dvi","application/x-envoy":"evy","application/x-eva":"eva","application/x-font-bdf":"bdf","application/x-font-ghostscript":"gsf","application/x-font-linux-psf":"psf","application/x-font-pcf":"pcf","application/x-font-snf":"snf","application/x-font-type1":"pfa","application/x-freearc":"arc","application/x-futuresplash":"spl","application/x-gca-compressed":"gca","application/x-glulx":"ulx","application/x-gnumeric":"gnumeric","application/x-gramps-xml":"gramps","application/x-gtar":"gtar","application/x-hdf":"hdf","application/x-httpd-php":"php","application/x-install-instructions":"install","application/x-iso9660-image":"iso","application/x-java-archive-diff":"jardiff","application/x-java-jnlp-file":"jnlp","application/x-latex":"latex","application/x-lua-bytecode":"luac","application/x-lzh-compressed":"lzh","application/x-makeself":"run","application/x-mie":"mie","application/x-mobipocket-ebook":"prc","application/x-ms-application":"application","application/x-ms-shortcut":"lnk","application/x-ms-wmd":"wmd","application/x-ms-wmz":"wmz","application/x-ms-xbap":"xbap","application/x-msaccess":"mdb","application/x-msbinder":"obd","application/x-mscardfile":"crd","application/x-msclip":"clp","application/x-msdos-program":"exe","application/x-msdownload":"exe","application/x-msmediaview":"mvb","application/x-msmetafile":"wmf","application/x-msmoney":"mny","application/x-mspublisher":"pub","application/x-msschedule":"scd","application/x-msterminal":"trm","application/x-mswrite":"wri","application/x-netcdf":"nc","application/x-ns-proxy-autoconfig":"pac","application/x-nzb":"nzb","application/x-perl":"pl","application/x-pilot":"prc","application/x-pkcs12":"p12","application/x-pkcs7-certificates":"p7b","application/x-pkcs7-certreqresp":"p7r","application/x-rar-compressed":"rar","application/x-redhat-package-manager":"rpm","application/x-research-info-systems":"ris","application/x-sea":"sea","application/x-sh":"sh","application/x-shar":"shar","application/x-shockwave-flash":"swf","application/x-silverlight-app":"xap","application/x-sql":"sql","application/x-stuffit":"sit","application/x-stuffitx":"sitx","application/x-subrip":"srt","application/x-sv4cpio":"sv4cpio","application/x-sv4crc":"sv4crc","application/x-t3vm-image":"t3","application/x-tads":"gam","application/x-tar":"tar","application/x-tcl":"tcl","application/x-tex":"tex","application/x-tex-tfm":"tfm","application/x-texinfo":"texinfo","application/x-tgif":"obj","application/x-ustar":"ustar","application/x-virtualbox-hdd":"hdd","application/x-virtualbox-ova":"ova","application/x-virtualbox-ovf":"ovf","application/x-virtualbox-vbox":"vbox","application/x-virtualbox-vbox-extpack":"vbox-extpack","application/x-virtualbox-vdi":"vdi","application/x-virtualbox-vhd":"vhd","application/x-virtualbox-vmdk":"vmdk","application/x-wais-source":"src","application/x-web-app-manifest+json":"webapp","application/x-x509-ca-cert":"der","application/x-xfig":"fig","application/x-xliff+xml":"xlf","application/x-xpinstall":"xpi","application/x-xz":"xz","application/x-zmachine":"z1","audio/vnd.dece.audio":"uva","audio/vnd.digital-winds":"eol","audio/vnd.dra":"dra","audio/vnd.dts":"dts","audio/vnd.dts.hd":"dtshd","audio/vnd.lucent.voice":"lvp","audio/vnd.ms-playready.media.pya":"pya","audio/vnd.nuera.ecelp4800":"ecelp4800","audio/vnd.nuera.ecelp7470":"ecelp7470","audio/vnd.nuera.ecelp9600":"ecelp9600","audio/vnd.rip":"rip","audio/x-aac":"aac","audio/x-aiff":"aif","audio/x-caf":"caf","audio/x-flac":"flac","audio/x-m4a":"m4a","audio/x-matroska":"mka","audio/x-mpegurl":"m3u","audio/x-ms-wax":"wax","audio/x-ms-wma":"wma","audio/x-pn-realaudio":"ram","audio/x-pn-realaudio-plugin":"rmp","audio/x-realaudio":"ra","audio/x-wav":"wav","chemical/x-cdx":"cdx","chemical/x-cif":"cif","chemical/x-cmdf":"cmdf","chemical/x-cml":"cml","chemical/x-csml":"csml","chemical/x-xyz":"xyz","image/prs.btif":"btif","image/vnd.adobe.photoshop":"psd","image/vnd.dece.graphic":"uvi","image/vnd.djvu":"djvu","image/vnd.dvb.subtitle":"sub","image/vnd.dwg":"dwg","image/vnd.dxf":"dxf","image/vnd.fastbidsheet":"fbs","image/vnd.fpx":"fpx","image/vnd.fst":"fst","image/vnd.fujixerox.edmics-mmr":"mmr","image/vnd.fujixerox.edmics-rlc":"rlc","image/vnd.ms-modi":"mdi","image/vnd.ms-photo":"wdp","image/vnd.net-fpx":"npx","image/vnd.wap.wbmp":"wbmp","image/vnd.xiff":"xif","image/x-3ds":"3ds","image/x-cmu-raster":"ras","image/x-cmx":"cmx","image/x-freehand":"fh","image/x-icon":"ico","image/x-jng":"jng","image/x-mrsid-image":"sid","image/x-ms-bmp":"bmp","image/x-pcx":"pcx","image/x-pict":"pic","image/x-portable-anymap":"pnm","image/x-portable-bitmap":"pbm","image/x-portable-graymap":"pgm","image/x-portable-pixmap":"ppm","image/x-rgb":"rgb","image/x-tga":"tga","image/x-xbitmap":"xbm","image/x-xpixmap":"xpm","image/x-xwindowdump":"xwd","model/vnd.collada+xml":"dae","model/vnd.dwf":"dwf","model/vnd.gdl":"gdl","model/vnd.gtw":"gtw","model/vnd.mts":"mts","model/vnd.vtu":"vtu","text/prs.lines.tag":"dsc","text/vnd.curl":"curl","text/vnd.curl.dcurl":"dcurl","text/vnd.curl.mcurl":"mcurl","text/vnd.curl.scurl":"scurl","text/vnd.dvb.subtitle":"sub","text/vnd.fly":"fly","text/vnd.fmi.flexstor":"flx","text/vnd.graphviz":"gv","text/vnd.in3d.3dml":"3dml","text/vnd.in3d.spot":"spot","text/vnd.sun.j2me.app-descriptor":"jad","text/vnd.wap.wml":"wml","text/vnd.wap.wmlscript":"wmls","text/x-asm":"s","text/x-c":"c","text/x-component":"htc","text/x-fortran":"f","text/x-handlebars-template":"hbs","text/x-java-source":"java","text/x-lua":"lua","text/x-markdown":"mkd","text/x-nfo":"nfo","text/x-opml":"opml","text/x-org":"org","text/x-pascal":"p","text/x-processing":"pde","text/x-sass":"sass","text/x-scss":"scss","text/x-setext":"etx","text/x-sfv":"sfv","text/x-suse-ymp":"ymp","text/x-uuencode":"uu","text/x-vcalendar":"vcs","text/x-vcard":"vcf","video/vnd.dece.hd":"uvh","video/vnd.dece.mobile":"uvm","video/vnd.dece.pd":"uvp","video/vnd.dece.sd":"uvs","video/vnd.dece.video":"uvv","video/vnd.dvb.file":"dvb","video/vnd.fvt":"fvt","video/vnd.mpegurl":"mxu","video/vnd.ms-playready.media.pyv":"pyv","video/vnd.uvvu.mp4":"uvu","video/vnd.vivo":"viv","video/x-f4v":"f4v","video/x-fli":"fli","video/x-flv":"flv","video/x-m4v":"m4v","video/x-matroska":"mkv","video/x-mng":"mng","video/x-ms-asf":"asf","video/x-ms-vob":"vob","video/x-ms-wm":"wm","video/x-ms-wmv":"wmv","video/x-ms-wmx":"wmx","video/x-ms-wvx":"wvx","video/x-msvideo":"avi","video/x-sgi-movie":"movie","video/x-smv":"smv","x-conference/x-cooltalk":"ice"};
    var link = document.createElement('a'); document.body.appendChild(link);
    if (data && data.substr(0, 5) === 'data:') {
      var parts = data.match(/data:(.*?);(.*?),(.*)/);
      link.href = data;
      link.download = name + (parts && mime[parts[1]] ? '.' + mime[parts[1]] : '');
      link.click();
    } else if (data) {
      link.href = data;
      link.target = '_blank';
      link.download = true;
      link.click();
    }
  },

  //
  // Define get storage
  //
  // @private
  // @return {Object}
  //
  __getStorage: function() {

    // Define self
    var self = this;

    // Define adapter
    var adapter = self.params.system.storage ? window[self.params.system.storage] : window.sessionStorage;

    // Define storage
    var storage = {

      // Define prefix
      prefix: self.id + '-',

      // Define has item
      hasItem: function(index) {
        return adapter.getItem(storage.prefix + index) !== null;
      },

      // Define get item
      getItem: function(index) {
        return adapter.getItem(storage.prefix + index);
      },

      // Define set item
      setItem: function(index, value) {
        adapter.setItem(storage.prefix + index, (value || ''));
      },

      // Define remove item
      removeItem: function(index) {
        adapter.removeItem(storage.prefix + index);
      }
    };

    // Return storage
    return storage;
  },

  //
  // Get Content
  //
  // @private
  // @return {String}
  //
  __getContent: function() {

    // Define styles
    var styles = [
      '  <style>',

      // Define global style
      '    #' + this.id + ' * {',
      '      font-family: ' + (this.params.styles.font_family || 'inherit') + ' !important;',
      '      font-size:  ' + (this.params.styles.font_size || '16px') + ' !important;',
      '      line-height: 1 !important;',
      '      width: auto !important;',
      '      width: auto !important;',
      '      min-width: 0 !important;',
      '      max-width: none !important;',
      '      min-height: 0 !important;',
      '      max-height: none !important;',
      '      box-shadow: none !important;',
      '         -webkit-transition: all .15s ease-in-out 0s;',
      '            -moz-transition: all .15s ease-in-out 0s;',
      '              -o-transition: all .15s ease-in-out 0s;',
      '                 transition: all .15s ease-in-out 0s;',
      '      -webkit-border-radius: 0 !important;',
      '           -o-border-radius: 0 !important;',
      '              border-radius: 0 !important;',
      '    }',

      // Define button styles
      '    #' + this.id + '_button {',
      '      display: none;',
      '      position: fixed !important;',
      '      ' + (this.params.button.align ? this.params.button.align : 'right') + ':  ' + (this.params.button.quit_button ? '50px' : '30px') + ' !important;',
      '      bottom: 30px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      z-index: 1999999999 !important;',
      '    }',

      // Define button chat styles
      '    #' + this.id + '_button_chat {',
      '      display: block !important;',
      '      width: 80px !important;',
      '      height: 80px !important;',
      '      border: 0 !important;',
      '      border-radius: 50% !important;',
      '      margin: 0 auto !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: ' + this.params.colors.button_bg + ' !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_button_chat:focus,',
      '    #' + this.id + '_button_chat:hover {',
      '      background-color: ' + this.params.colors.button_bg_active + ' !important;',
      '    }',
      '    #' + this.id + '_button_chat_head {',
      '      text-align: center !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_button_chat_head_icon {',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_button_chat_head_icon .icon {',
      '      fill: ' + this.params.colors.button_fg + ' !important;',
      '      width: 40px !important;',
      '      height: 40px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      margin-top: 10px !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_button_chat_head_text {',
      '      color: ' + this.params.colors.button_fg + ' !important;',
      '      font-size: 80% !important;',
      '      font-weight: bold !important;',
      '      text-align: center !important;',
      '      line-height: 1.5 !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',

      // Define button quit styles
      '    #' + this.id + '_button_quit {',
      '      display: ' + (this.params.button.quit_button ? 'block' : 'none') + ' !important;',
      '      position: absolute !important;',
      '      top: 0 !important;',
      '      right: 0 !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      border: 0 !important;',
      '      border-radius: 50% !important;',
      '      margin: 0 auto !important;',
      '      margin-right: -20px !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: ' + this.params.colors.button_bg + ' !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_button_quit:focus,',
      '    #' + this.id + '_button_quit:hover {',
      '      background-color: ' + this.params.colors.button_bg_active + ' !important;',
      '    }',
      '    #' + this.id + '_button_quit_head {',
      '      text-align: center !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_button_quit_head_icon {',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_button_quit_head_icon .icon {',
      '      fill: ' + this.params.colors.button_fg + ' !important;',
      '      width: 10px !important;',
      '      height: 20px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      opacity: 0.7;',
      '    }',

      // Define dialog styles
      '    #' + this.id + '_dialog {',
      '      display: none;',
      '      overflow: hidden !important;',
      '      position: fixed !important;',
      '      ' + (this.params.dialog.align ? this.params.dialog.align : 'right') + ': 30px !important;',
      '      bottom: 30px !important;',
      '      width: 375px !important;',
      '      height: 500px !important;',
      '      max-height: 90% !important;',
      '      border: 0 !important;',
      '      border-radius: ' + this.params.styles.radius + 'px !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      background-color: #f7f7f7 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 2px ' + this.params.colors.button_bg + ' !important;',
      '      z-index: 1999999999 !important;',
      '    }',
      '    @media (max-width: 767px) {',
      '      #' + this.id + '_dialog {',
      '        top: 0;',
      '        left: 0 !important;',
      '        right: 0 !important;',
      '        bottom: 0 !important;',
      '        width: auto !important;',
      '        height: auto !important;',
      '        max-height: none !important;',
      '        border: 0 !important;',
      '        border-radius: 0px !important;',
      '        margin: 0 !important;',
      '        padding: 0 !important;',
      '        box-sizing: border-box !important;',
      '      }',
      '    }',

      // Define dialog head styles
      '    #' + this.id + '_dialog_head {',
      '      width: 100% !important;',
      '      height: 50px !important;',
      '      border: 0 !important;',
      '      border-bottom: 1px solid #f7f7f7 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 1px ' + this.params.colors.button_bg + ' !important;',
      '    }',

      // Define dialog head text styles
      '    #' + this.id + '_dialog_head_text {',
      '      display: block !important;',
      '      color: ' + this.params.colors.dialog_bg + ' !important;',
      '      font-size: 120% !important;',
      '      font-weight: bold !important;',
      '      line-height: 36px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 6px 10px !important;',
      '      box-sizing: border-box !important;',
      '      cursor: default !important;',
      '    }',
      '    #' + this.id + '_dialog_head_text img {',
      '      height: 36px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',

      // Define dialog head hide styles
      '    #' + this.id + '_dialog_head_hide {',
      '      display: ' + (this.params.dialog.hide_button ? 'block' : 'none') + ' !important;',
      '      position: absolute !important;',
      '      top: 15px !important;',
      '      right: ' + (this.params.dialog.quit_button ? '40px' : '10px') + ' !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_head_hide_control {',
      '      display: block;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_head_hide_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: 80% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_head_hide_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog head quit styles
      '    #' + this.id + '_dialog_head_quit {',
      '      display: ' + (this.params.dialog.quit_button ? 'block' : 'none') + ' !important;',
      '      position: absolute !important;',
      '      top: 15px !important;',
      '      right: 10px !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_head_quit_control {',
      '      display: block;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_head_quit_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: auto !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_head_quit_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog body styles
      '    #' + this.id + '_dialog_body {',
      '      display: none;',
      '      position: absolute !important;',
      '      overflow: auto !important;',
      '      top: 50px !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',

      // Define dialog form styles
      '    #' + this.id + '_dialog_form {',
      '      display: none;',
      '      position: absolute !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      bottom: 0 !important;',
      '      border: 0 !important;',
      '      border-top: 1px solid #f7f7f7 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      background-color: #f7f7f7 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 1px ' + this.params.colors.button_bg + ' !important;',
      '    }',

      // Define dialog form text styles
      '    #' + this.id + '_dialog_form_text {',
      '      position: absolute !important;',
      '      top: 0 !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      bottom: 30px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_text_control {',
      '      display: block;',
      '      overflow: auto !important;',
      '      font-size: 100% !important;',
      '      font-weight: normal !important;',
      '      line-height: 20px !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 8px !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '    }',

      // Define dialog form emojis styles
      '    #' + this.id + '_dialog_form_emojis {',
      '      position: absolute !important;',
      '      left: 10px !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      bottom: 5px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_emojis_control {',
      '      display: none;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_form_emojis_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: auto !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_emojis_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog form attach styles
      '    #' + this.id + '_dialog_form_attach {',
      '      position: absolute !important;',
      '      left: 40px !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      bottom: 5px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_attach_control {',
      '      display: none;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_form_attach_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: auto !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_attach_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog form camera styles
      '    #' + this.id + '_dialog_form_camera {',
      '      position: absolute !important;',
      '      left: 70px !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      bottom: 5px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_camera_control {',
      '      display: none;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_form_camera_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: auto !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_camera_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog form dictate styles
      '    #' + this.id + '_dialog_form_dictate {',
      '      position: absolute !important;',
      '      right: 40px !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      bottom: 5px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_dictate_control {',
      '      display: none;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_form_dictate_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: auto !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_dictate_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog form send styles
      '    #' + this.id + '_dialog_form_send {',
      '      position: absolute !important;',
      '      right: 10px !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      bottom: 5px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_send_control {',
      '      display: block;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_form_send_control .icon {',
      '      fill: #afafaf !important;',
      '      vertical-align: middle !important;',
      '      width: auto !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_form_send_control:hover .icon {',
      '      fill: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      // Define dialog bubble styles
      '    #' + this.id + '_dialog .bubble {',
      '      display: table !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 10px !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .time {',
      '      font-size: 13px !important;',
      '      text-align: right !important;',
      '      margin-top: 5px !important;',
      '      opacity: 0.8 !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .icon {',
      '      display: table-cell !important;',
      '      vertical-align: top !important;',
      '      width: 56px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .icon img {',
      '      width: 46px !important;',
      '      height: 46px !important;',
      '      border: 0 !important;',
      '      border-radius: 50% !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',

      '    #' + this.id + '_dialog .bubble .text {',
      '      display: table-cell !important;',
      '      font-size: 100% !important;',
      '      line-height: 1.3 !important;',
      '      vertical-align: top !important;',
      '      border: 0 !important;',
      '      border-radius: ' + this.params.styles.radius + 'px !important;',
      '      margin: 0 !important;',
      '      margin-right: auto !important;',
      '      padding: 10px !important;',
      '      box-sizing: border-box !important;',
      '         overflow-wrap: break-word;',
      '             word-wrap: break-word;',
      '       -moz-word-break: break-all;',
      '        -ms-word-break: break-all;',
      '          -moz-hyphens: auto;',
      '           -ms-hyphens: auto;',
      '               hyphens: auto;',
      '    }',

      '    #' + this.id + '_dialog .bubble .file {',
      '      display: table-cell !important;',
      '      width: auto !important;',
      '      cursor: pointer;',
      '      border: 0 !important;',
      '      border-radius: ' + this.params.styles.radius + 'px !important;',
      '      margin: 0 !important;',
      '      margin-right: auto !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-image {',
      '      position: relative !important;',
      '      width: 100% !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-image img {',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      border-radius: 5px !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-audio {',
      '      position: relative !important;',
      '      width: 100% !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-audio audio {',
      '      position: absolute !important;',
      '      width: 100% !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-video {',
      '      position: relative !important;',
      '      width: 100% !important;',
      '      padding-bottom: 56.25% !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-video video {',
      '      position: absolute !important;',
      '      top: 0 !important;',
      '      left: 0 !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      border-radius: 5px !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-frame {',
      '      position: relative !important;',
      '      width: 100% !important;',
      '      padding-bottom: 56.25% !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-frame iframe {',
      '      position: absolute !important;',
      '      top: 0 !important;',
      '      left: 0 !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      border-radius: 5px !important;',
      '    }',

      '    #' + this.id + '_dialog .bubble .file.file-slide {',
      '      position: relative !important;',
      '      width: 100% !important;',
      '      padding-bottom: 56.25% !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble .file.file-slide img,',
      '    #' + this.id + '_dialog .bubble .file.file-slide audio,',
      '    #' + this.id + '_dialog .bubble .file.file-slide video,',
      '    #' + this.id + '_dialog .bubble .file.file-slide iframe {',
      '      position: absolute !important;',
      '      top: 0 !important;',
      '      left: 0 !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      border-radius: 5px !important;',
      '    }',

      '    #' + this.id + '_dialog .bubble.slides {',
      '      position: relative !important;',
      '      overflow: hidden !important;',
      '      display: table !important;',
      '      width: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 10px !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.slides .slides-container {',
      '      overflow: scroll;',
      '      display: flex;',
      '      width: 100%;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      scroll-behavior: smooth !important;',
      '      scrollbar-width: none !important;',
      '      -ms-overflow-style: none !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.slides .slides-container::-webkit-scrollbar {',
      '      width: 0 !important;',
      '      height: 0 !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.slides .slide {',
      '      flex: 1 0 100%;',
      '    }',
      '    #' + this.id + '_dialog .bubble.slides .slide-arrow {',
      '      position: absolute;',
      '      display: flex;',
      '      top: 0 !important;',
      '      width: 30px !important;',
      '      bottom: 10px !important;',
      '      background: transparent !important;',
      '      align-items: center;',
      '      font-size: 3rem !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 10px !important;',
      '      cursor: pointer !important;',
      '      z-index: 1;',
      '      opacity: 0.1;',
      '      outline: 0 !important;',
      '      transition: opacity 100ms;',
      '    }',
      '    #' + this.id + '_dialog .bubble.slides .slide-arrow:hover,',
      '    #' + this.id + '_dialog .bubble.slides .slide-arrow:focus {',
      '      background-color: ' + this.params.colors.dialog_bg + ' !important;',
      '      color: ' + this.params.colors.dialog_fg + ' !important;',
      '      opacity: 1;',
      '    }',
      '    #' + this.id + '_dialog .bubble .slide-arrow-prev {',
      '      left: 0;',
      '    }',
      '    #' + this.id + '_dialog .bubble .slide-arrow-next {',
      '      right: 0;',
      '    }',

      // Define dialog bubble left styles
      '    #' + this.id + '_dialog .bubble.bubble-left {',
      '      margin-right: auto !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-left+.bubble.bubble-left {',
      '      padding-top: 0 !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-left+.bubble.bubble-left .icon img {',
      '      display: none !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-left .text {',
      '      color: #444 !important;',
      '      text-align: left !important;',
      '      border-top-left-radius: 0 !important;',
      '      margin-right: auto !important;',
      '      background-color: #e3e3e3 !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-left .text a {',
      '      color: #444 !important;',
      '      font-weight: bold !important;',
      '      text-decoration: none !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-left .text a:focus,',
      '    #' + this.id + '_dialog .bubble.bubble-left .text a:hover {',
      '      color: #000 !important;',
      '      font-weight: bold !important;',
      '      text-decoration: underline !important;',
      '    }',

      // Define dialog bubble right styles
      '    #' + this.id + '_dialog .bubble.bubble-right {',
      '      margin-left: auto !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-right+.bubble.bubble-right {',
      '      padding-top: 0 !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-right+.bubble.bubble-right .icon img {',
      '      display: none !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-right .text {',
      '      color: #fff !important;',
      '      text-align: left !important;',
      '      border-top-right-radius: 0 !important;',
      '      margin-left: 0 !important;',
      '      background-color: ' + this.params.colors.dialog_bg + ' !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-right .text a {',
      '      color: #fff !important;',
      '      text-decoration: none !important;',
      '    }',
      '    #' + this.id + '_dialog .bubble.bubble-right .text a:focus,',
      '    #' + this.id + '_dialog .bubble.bubble-right .text a:hover {',
      '      color: #fff !important;',
      '      text-decoration: underline !important;',
      '    }',

      // Define dialog menu styles
      '    #' + this.id + '_dialog .menu {',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .menu button {',
      '      background-color: #666 !important;',
      '      color: #fff !important;',
      '      font-size: 90% !important;',
      '      font-weight: bold !important;',
      '      text-align: center !important;',
      '      border: 0 !important;',
      '      border-radius: ' + this.params.styles.radius + 'px !important;',
      '      margin: 0 !important;',
      '      margin-right: 5px !important;',
      '      margin-bottom: 5px !important;',
      '      padding: 10px !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .menu button:focus,',
      '    #' + this.id + '_dialog .menu button:hover {',
      '      background-color: #333 !important;',
      '      color: #fff !important;',
      '    }',

      // Define dialog form styles
      '    #' + this.id + '_dialog .form {',
      '      position: absolute !important;',
      '      overflow: auto !important;',
      '      top: 49px;',
      '      left: 0;',
      '      right: 0;',
      '      bottom: 0;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      background-color: #f7f7f7 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .form .form-item-error {',
      '      color: #ff0000 !important;',
      '      font-size: 12px !important;',
      '      font-weight: normal !important;',
      '      box-sizing: border-box !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 3px 5px !important;',
      '    }',
      '    #' + this.id + '_dialog .form label {',
      '      color: #555 !important;',
      '      font-size: 14px !important;',
      '      font-weight: bold !important;',
      '      line-height: 15px !important;',
      '      padding: 5px 0 !important;',
      '    }',
      '    #' + this.id + '_dialog .form input,',
      '    #' + this.id + '_dialog .form select,',
      '    #' + this.id + '_dialog .form textarea {',
      '      display: inline-block;',
      '      background-color: #fff !important;',
      '      background-image: none !important;',
      '      color: #555 !important;',
      '      font-size: 14px !important;',
      '      font-weight: normal !important;',
      '      line-height: 40px !important;',
      '      width: 100% !important;',
      '      border: 1px solid #ccc !important;',
      '      border-radius: 4px !important;',
      '      margin: 0 !important;',
      '      padding: 0 8px !important;',
      '      outline: 0 !important;',
      '      box-shadow: none !important;',
      '      box-sizing: border-box !important;',
      '      -webkit-appearance: none !important;',
      '         -moz-appearance: none !important;',
      '              appearance: none !important;',
      '    }',
      '    #' + this.id + '_dialog .form input:focus,',
      '    #' + this.id + '_dialog .form select:focus,',
      '    #' + this.id + '_dialog .form textarea:focus {',
      '      border-color: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',
      '    #' + this.id + '_dialog .form input[type="checkbox"] {',
      '      vertical-align: middle !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      border-radius: 6px !important;',
      '    }',
      '    #' + this.id + '_dialog .form input[type="checkbox"]:checked {',
      '      background-color: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',
      '    #' + this.id + '_dialog .form input[type="radio"] {',
      '      vertical-align: middle !important;',
      '      width: 20px !important;',
      '      height: 20px !important;',
      '      border-radius: 50% !important;',
      '    }',
      '    #' + this.id + '_dialog .form input[type="radio"]:checked {',
      '      background-color: ' + this.params.colors.dialog_bg + ' !important;',
      '    }',

      '    #' + this.id + '_dialog .form button {',
      '      display: inline-block;',
      '      color: #555 !important;',
      '      font-size: 14px !important;',
      '      line-height: 45px !important;',
      '      width: 100% !important;',
      '      border: 0 !important;',
      '      border-radius: 4px !important;',
      '      margin: 0 !important;',
      '      padding: 0 10px !important;',
      '    }',
      '    #' + this.id + '_dialog .form button[type=submit] {',
      '      background-color: ' + this.params.colors.dialog_bg + ' !important;',
      '      color: #fff !important;',
      '    }',
      '    #' + this.id + '_dialog .form button[type=reset] {',
      '      background-color: #ff0000 !important;',
      '      color: #fff !important;',
      '    }',

      // Define dialog talk styles
      '    #' + this.id + '_dialog .talk {',
      '      display: table-cell !important;',
      '      color: #444 !important;',
      '      text-align: left !important;',
      '      line-height: 1.3 !important;',
      '      vertical-align: top !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      margin-right: auto !important;',
      '      padding: 10px !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog .talk span {',
      '      display: inline-block !important;',
      '      background-color: ' + this.params.colors.dialog_bg + ' !important;',
      '      width: 8px !important;',
      '      height: 8px !important;',
      '      border: 0 !important;',
      '      border-radius: 50% !important;',
      '      margin: 0 !important;',
      '      margin-right: 1px !important;',
      '      opacity: 0.5;',
      '    }',
      '    #' + this.id + '_dialog .talk span:nth-of-type(1) {',
      '      animation: 1s ' + this.id + '-talk-blink infinite 0.3333s !important;',
      '    }',
      '    #' + this.id + '_dialog .talk span:nth-of-type(2) {',
      '      animation: 1s ' + this.id + '-talk-blink infinite 0.6666s !important;',
      '    }',
      '    #' + this.id + '_dialog .talk span:nth-of-type(3) {',
      '      animation: 1s ' + this.id + '-talk-blink infinite 0.9999s !important;',
      '    }',
      '    @keyframes ' + this.id + '-talk-blink {',
      '      50% {',
      '        opacity: 1;',
      '        transform: scale(1.3);',
      '      }',
      '    }',

      // Define dialog body emojis styles
      '    #' + this.id + '_dialog_body_emojis {',
      '      display: none;',
      '      position: absolute !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      height: 120px !important;',
      '      border: 0 !important;',
      '      border-top: 1px solid #f7f7f7 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      background-color: #f7f7f7 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 1px ' + this.params.colors.button_bg + ' !important;',
      '    }',
      '    #' + this.id + '_dialog_body_emojis_toolbar {',
      '      position: absolute !important;',
      '      overflow: hidden !important;',
      '      top: 0 !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      height: 30px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_body_emojis_toolbar > div {',
      '      display: inline-block !important;',
      '      font-size: 16px !important;',
      '      line-height: 30px !important;',
      '      text-align: center !important;',
      '      width: 30px !important;',
      '      height: 30px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',
      '    #' + this.id + '_dialog_body_emojis_content {',
      '      position: absolute !important;',
      '      overflow: hidden !important;',
      '      overflow-y: auto !important;',
      '      top: 30px !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      bottom: 0 !important;',
      '      border: 0 !important;',
      '      border-top: 1px solid #f7f7f7 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 1px ' + this.params.colors.button_bg + ' !important;',
      '    }',
      '    #' + this.id + '_dialog_body_emojis_content > div > div {',
      '      display: inline-block !important;',
      '      font-size: 16px !important;',
      '      line-height: 30px !important;',
      '      text-align: center !important;',
      '      width: 30px !important;',
      '      height: 30px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '      cursor: pointer !important;',
      '    }',

      // Define dialog body attach styles
      '    #' + this.id + '_dialog_body_attach {',
      '      display: none;',
      '      position: absolute !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      height: 200px !important;',
      '      border: 0 !important;',
      '      border-top: 1px solid #f7f7f7 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      background-color: #f7f7f7 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 1px ' + this.params.colors.button_bg + ' !important;',
      '    }',
      '    #' + this.id + '_dialog_body_attach_area {',
      '      position: absolute !important;',
      '      overflow: hidden !important;',
      '      top: 10px !important;',
      '      left: 10px !important;',
      '      right: 10px !important;',
      '      bottom: 10px !important;',
      '      border: 2px dashed #ccc !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_body_attach_area:hover {',
      '      background: #ddd;',
      '    }',
      '    #' + this.id + '_dialog_body_attach_area.active {',
      '      border: 2px dashed #333 !important;',
      '    }',
      '    #' + this.id + '_dialog_body_attach_area label {',
      '      display: block;',
      '      font-size: 90% !important;',
      '      text-align: center !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 15px !important;',
      '    }',

      // Define dialog body camera styles
      '    #' + this.id + '_dialog_body_camera {',
      '      display: none;',
      '      position: absolute !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      height: 200px !important;',
      '      border: 0 !important;',
      '      border-top: 1px solid #f7f7f7 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      background-color: #f7f7f7 !important;',
      '      box-sizing: border-box !important;',
      '      box-shadow: 0 0 1px ' + this.params.colors.button_bg + ' !important;',
      '    }',
      '    #' + this.id + '_dialog_body_camera_area {',
      '      position: absolute !important;',
      '      overflow: hidden !important;',
      '      text-align: center !important;',
      '      top: 10px !important;',
      '      left: 10px !important;',
      '      right: 10px !important;',
      '      bottom: 10px !important;',
      '      border: 2px dashed #ccc !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_dialog_body_camera_area:hover {',
      '      background: #ddd;',
      '    }',
      '    #' + this.id + '_dialog_body_camera_area.active {',
      '      border: 2px dashed #333 !important;',
      '    }',
      '    #' + this.id + '_dialog_body_camera_area label {',
      '      display: block;',
      '      font-size: 90% !important;',
      '      text-align: center !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 15px !important;',
      '    }',

      // Define window styles
      '    #' + this.id + '_window {',
      '      display: none;',
      '      position: absolute !important;',
      '      top: 0 !important;',
      '      left: 0 !important;',
      '      right: 0 !important;',
      '      bottom: 0 !important;',
      '      border: 0 !important;',
      '      margin: 0  !important;',
      '      padding: 0 !important;',
      '      background-color: rgba(0, 0, 0, .5) !important;',
      '      box-sizing: border-box !important;',
      '      z-index: 1 !important;',
      '    }',
      '    #' + this.id + '_window_quit_dialog {',
      '      display: none;',
      '      width: 265px !important;',
      '      border: 0 !important;',
      '      border-radius: ' + this.params.styles.radius + 'px !important;',
      '      margin: 0 auto !important;',
      '      margin-top: 100px !important;',
      '      padding: 10px 0 !important;',
      '      background-color: #fff !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_window_quit_dialog_message {',
      '      display: block;',
      '      color: #afafaf !important;',
      '      font-size: 100% !important;',
      '      font-weight: bold !important;',
      '      line-height: 30px !important;',
      '      vertical-align: middle !important;',
      '      text-align: center !important;',
      '      min-height: 60px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 8px !important;',
      '      box-sizing: border-box !important;',
      '      cursor: default !important;',
      '    }',
      '    #' + this.id + '_window_quit_dialog_negative {',
      '      display: inline-block;',
      '      width: 130px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_window_quit_dialog_negative_control {',
      '      display: block;',
      '      overflow: auto !important;',
      '      color: #afafaf !important;',
      '      font-size: 95% !important;',
      '      font-weight: bold !important;',
      '      line-height: 20px !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 8px !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_window_quit_dialog_positive {',
      '      display: inline-block;',
      '      width: 130px !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 0 !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_window_quit_dialog_positive_control {',
      '      display: block;',
      '      overflow: auto !important;',
      '      color: ' + this.params.colors.dialog_bg + ' !important;',
      '      font-size: 95% !important;',
      '      font-weight: bold !important;',
      '      line-height: 20px !important;',
      '      width: 100% !important;',
      '      height: 100% !important;',
      '      border: 0 !important;',
      '      margin: 0 !important;',
      '      padding: 8px !important;',
      '      outline: 0 !important;',
      '      background-color: transparent !important;',
      '      box-sizing: border-box !important;',
      '    }',

      // Define sm styles
      '    #' + this.id + '_button.sm {',
      '      bottom: 30px !important;',
      '    }',
      '    #' + this.id + '_button.sm #' + this.id + '_button_chat {',
      '      width: 60px !important;',
      '      height: 60px !important;',
      '    }',
      '    #' + this.id + '_button.sm #' + this.id + '_button_chat_head_icon .icon {',
      '      width: 40px !important;',
      '      height: 40px !important;',
      '    }',
      '    #' + this.id + '_button.sm #' + this.id + '_button_chat_head_text {',
      '      display: none !important;',
      '    }',
      '    #' + this.id + '_dialog.sm {',
      '      width: 275px !important;',
      '      height: 300px !important;',
      '    }',
      '    @media (max-width: 767px) {',
      '      #' + this.id + '_dialog.sm {',
      '        width: auto !important;',
      '        height: auto !important;',
      '      }',
      '    }',

      // Define lg styles
      '    #' + this.id + '_button.lg {',
      '      bottom: 80px !important;',
      '    }',
      '    #' + this.id + '_button.lg #' + this.id + '_button_chat_head_icon .icon {',
      '      width: 60px !important;',
      '      height: 60px !important;',
      '    }',
      '    #' + this.id + '_button.lg #' + this.id + '_button_chat_head_text {',
      '      border: 0 !important;',
      '      border-radius: ' + this.params.styles.radius + 'px !important;',
      '      margin: 5px 0 !important;',
      '      margin-top: 15px !important;',
      '      padding: 3px 0 !important;',
      '      outline: 0 !important;',
      '      background-color: ' + this.params.colors.button_bg + ' !important;',
      '      box-sizing: border-box !important;',
      '    }',
      '    #' + this.id + '_button.lg #' + this.id + '_button_chat:focus #' + this.id + '_button_chat_head_text,',
      '    #' + this.id + '_button.lg #' + this.id + '_button_chat:hover #' + this.id + '_button_chat_head_text {',
      '      background-color: ' + this.params.colors.button_bg_active + ' !important;',
      '    }',
      '    #' + this.id + '_dialog.lg {',
      '      height: 85% !important;',
      '    }',
      '    @media (max-width: 767px) {',
      '      #' + this.id + '_dialog.lg {',
      '        height: auto !important;',
      '      }',
      '    }',

      // Define responsive sm styles
      '    @media (max-width: 767px) {',
      '      #' + this.id + '_button.responsive {',
      '        bottom: 30px !important;',
      '      }',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat {',
      '        width: 60px !important;',
      '        height: 60px !important;',
      '      }',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat_head_icon .icon {',
      '        width: 40px !important;',
      '        height: 40px !important;',
      '      }',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat_head_text {',
      '        display: none !important;',
      '      }',
      '    }',

      // Define responsive lg styles
      '    @media (min-width: 992px) {',
      '      #' + this.id + '_button.responsive {',
      '        bottom: 80px !important;',
      '      }',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat_head_icon .icon {',
      '        width: 60px !important;',
      '        height: 60px !important;',
      '      }',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat_head_text {',
      '        border: 0 !important;',
      '        border-radius: ' + this.params.styles.radius + 'px !important;',
      '        margin: 5px 0 !important;',
      '        margin-top: 15px !important;',
      '        padding: 3px 0 !important;',
      '        outline: 0 !important;',
      '        background-color: ' + this.params.colors.button_bg + ' !important;',
      '        box-sizing: border-box !important;',
      '      }',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat:focus #' + this.id + '_button_chat_head_text,',
      '      #' + this.id + '_button.responsive #' + this.id + '_button_chat:hover #' + this.id + '_button_chat_head_text {',
      '        background-color: ' + this.params.colors.button_bg_active + ' !important;',
      '      }',
      '    }',

      // Define custom styles

      '  </style>'
    ].join('\n');

    // Define button
    var button = [
      '  <div id="' + this.id + '_button" class="' + (this.params.button.style ? this.params.button.style : 'md') + '">',
      '    <button id="' + this.id + '_button_chat" type="button">',
      '      <div id="' + this.id + '_button_chat_head">',
      '        <div id="' + this.id + '_button_chat_head_icon">',
      '          ' + (this.params.images.chat ? '<img class="icon" src="' + this.params.images.chat + '">' : '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"></path></svg>'),
      '        </div>',
      '        <div id="' + this.id + '_button_chat_head_text">' + this.params.button.title + '</div>',
      '      </div>',
      '    </button>',
      '    <button id="' + this.id + '_button_quit" type="button">',
      '      <div id="' + this.id + '_button_quit_head">',
      '        <div id="' + this.id + '_button_quit_head_icon">',
      '          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>',
      '        </div>',
      '      </div>',
      '    </button>',

      // Define custom button content

      '  </div>'
    ].join('\n');

    // Define dialog
    var dialog = [
      '  <div id="' + this.id + '_dialog" class="' + (this.params.dialog.style ? this.params.dialog.style : 'md') + '">',
      '    <div id="' + this.id + '_dialog_head">',
      '      <div id="' + this.id + '_dialog_head_text">' + (this.params.images.head ? '<img src="' + this.params.images.head + '">' : this.params.dialog.title) + '</div>',
      '      <div id="' + this.id + '_dialog_head_hide"><button id="' + this.id + '_dialog_head_hide_control" type="button"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></button></div>',
      '      <div id="' + this.id + '_dialog_head_quit"><button id="' + this.id + '_dialog_head_quit_control" type="button"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></button></div>',
      '    </div>',
      '    <div id="' + this.id + '_dialog_body"></div>',
      '    <div id="' + this.id + '_dialog_body_emojis">',
      '      <div id="' + this.id + '_dialog_body_emojis_toolbar"></div>',
      '      <div id="' + this.id + '_dialog_body_emojis_content"></div>',
      '    </div>',
      '    <div id="' + this.id + '_dialog_body_attach">',
      '      <div id="' + this.id + '_dialog_body_attach_area">',
      '        <label>' + this.params.dialog.share_attach_message + '</label>',
      '        <form><input id="' + this.id + '_dialog_body_attach_area_control" type="file" accept="image/*" multiple style="display: none !important;"></form>',
      '      </div>',
      '    </div>',
      '    <div id="' + this.id + '_dialog_body_camera">',
      '      <div id="' + this.id + '_dialog_body_camera_area">',
      '        <label>' + this.params.dialog.share_camera_message + '</label>',
      '        <video id="' + this.id + '_dialog_body_camera_area_control" width="160" height="120"></video>',
      '      </div>',
      '    </div>',
      '    <form id="' + this.id + '_dialog_form">',
      '      <div id="' + this.id + '_dialog_form_text">',
      '        <textarea id="' + this.id + '_dialog_form_text_control" placeholder="' + this.params.dialog.write + '"></textarea>',
      '      </div>',
      '      <div id="' + this.id + '_dialog_form_emojis">',
      '        <button id="' + this.id + '_dialog_form_emojis_control" type="button">',
      '          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm194.8 170.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5 22.4 26.9 55.2 42.2 90.2 42.2s67.8-15.4 90.2-42.2c13.4-16.2 38.1 4.2 24.6 20.5z"></path></svg>',
      '        </button>',
      '      </div>',
      '      <div id="' + this.id + '_dialog_form_attach">',
      '        <button id="' + this.id + '_dialog_form_attach_control" type="button">',
      '          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0 43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292 4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313 34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 60.216-214.77-.485z"></path></svg>',
      '        </button>',
      '      </div>',
      '      <div id="' + this.id + '_dialog_form_camera">',
      '        <button id="' + this.id + '_dialog_form_camera_control" type="button">',
      '          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"></path></svg>',
      '        </button>',
      '      </div>',
      '      <div id="' + this.id + '_dialog_form_send">',
      '        <button id="' + this.id + '_dialog_form_send_control" type="button">',
      '          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></svg>',
      '        </button>',
      '      </div>',
      '      <div id="' + this.id + '_dialog_form_dictate">',
      '        <button id="' + this.id + '_dialog_form_dictate_control" type="button">',
      '          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg>',
      '        </button>',
      '      </div>',
      '    </form>',
      '    <div id="' + this.id + '_window">',
      '      <div id="' + this.id + '_window_quit_dialog">',
      '        <div id="' + this.id + '_window_quit_dialog_message">' + (this.params.dialog.quit_dialog_message || '') + '</div>',
      '        <div id="' + this.id + '_window_quit_dialog_negative"><button id="' + this.id + '_window_quit_dialog_negative_control" type="button">' + (this.params.dialog.quit_dialog_negative || '') + '</button></div>',
      '        <div id="' + this.id + '_window_quit_dialog_positive"><button id="' + this.id + '_window_quit_dialog_positive_control" type="button">' + (this.params.dialog.quit_dialog_positive || '') + '</button></div>',
      '      </div>',
      '    </div>',

      // Define custom dialog content

      '  </div>'
    ].join('\n');

    // Define result
    var result = [
      styles,
      button,
      dialog
    ].join('\n');

    // Return result
    return result;
  },

  //
  // Define close
  //
  // @private
  // @return void
  //
  __close: function() {

    // Verify socket
    if (this.socket) {

      // Disconnect
      this.socket.disconnect();

      // Remove all listeners
      this.socket.removeAllListeners();
    }

    // Define welcome
    this.welcome = false;

    // Define ticket
    this.ticket = null;

    // Remove ticket
    this.system_storage.removeItem('ticket');

    // Define client
    this.client = null;

    // Define socket
    this.socket = null;
  },

  //
  // Define quit
  //
  // @private
  // @return void
  //
  __quit: function() {

    // Define window view
    this.window_quit_dialog.style.display = 'none';
    this.window.style.display = 'none';

    // Define dialog view
    this.dialog.style.display = 'none';
    this.dialog_body.innerHTML = '';

    // Verify socket
    if (this.socket) {

      // Disconnect
      this.socket.disconnect();

      // Remove all listeners
      this.socket.removeAllListeners();
    }

    // Define welcome
    this.welcome = false;

    // Define ticket
    this.ticket = null;

    // Remove ticket
    this.system_storage.removeItem('ticket');

    // Define client
    this.client = null;

    // Define socket
    this.socket = null;
  },

  //
  //
  // Public methods
  //
  //

  //
  // Download file
  //
  // @public
  // @return boolean
  //
  isVisible: function() {
    this.__systemInit();
    this.__clientInit();
    return (this.dialog.style.display === 'block');
  },

  //
  // Define show button
  //
  // @public
  // @return boolean
  //
  showButton: function() {
    this.__systemInit();
    this.__clientInit();
    if (this.button.style.display !== 'block') {
      this.button.style.display = 'block';
      return true;
    } else {
      return false;
    }
  },

  //
  // Define hide button
  //
  // @public
  // @return boolean
  //
  hideButton: function() {
    this.__systemInit();
    this.__clientInit();
    if (this.button.style.display === 'block') {
      this.button.style.display = 'none';
      return true;
    } else {
      return false;
    }
  },

  //
  // Define show dialog
  //
  // @public
  // @return boolean
  //
  showDialog: function() {
    this.__systemInit();
    this.__clientInit();
    if (this.dialog.style.display !== 'block') {
      this.button_chat.click();
      return true;
    } else {
      return false;
    }
  },

  //
  // Define hide dialog
  //
  // @public
  // @return boolean
  //
  hideDialog: function() {
    this.__systemInit();
    this.__clientInit();
    if (this.dialog.style.display === 'block') {
      this.dialog_head_hide_control.click();
      return true;
    } else {
      return false;
    }
  },

  //
  // Define quit dialog
  //
  // @public
  // @return boolean
  //
  quitDialog: function() {
    this.__systemInit();
    this.__clientInit();
    this.__quit();
    return true;
  },

  //
  // Define send
  //
  // @public
  // @param {Object} data
  // @return void
  //
  send: function(data) {
    this.__systemInit();
    this.__clientInit();
    this.__socketInit();
    this.__sendMessage(data);
  },

  //
  // Define send action
  //
  // @public
  // @param {String} action
  // @param {Array} data
  // @return void
  //
  sendAction: function(action, data) {
    this.send({action: action, data: data, ...this.params.global});
  },

  //
  // Define send intent
  //
  // @public
  // @param {String} intent
  // @param {Array} data
  // @return void
  //
  sendIntent: function(intent, data) {
    this.send({intent: intent, data: data, ...this.params.global});
  },

  //
  // Define send text
  //
  // @public
  // @param {String} text
  // @param {Array} data
  // @return void
  //
  sendText: function(text, data) {
    this.send({text: text, data: data, ...this.params.global});
  },

  //
  // Define send file
  //
  // @public
  // @param {String} file
  // @param {Array} data
  // @return void
  //
  sendFile: function(file, data) {
    this.send({file: file, data: data, ...this.params.global});
  },

  //
  // Define send data
  //
  // @public
  // @param {Array} data
  // @return void
  //
  sendData: function(data) {
    this.send({data: data, ...this.params.global});
  }
};

/*!
 * ${prefix}Mask ${version}
 * © Copyright ${new Date().getFullYear()} ${author}
 */

window.${prefix}Mask = {

  //
  // Define apply mask
  //
  // @private
  // @param {String} text
  // @param {String} mask
  // @return void
  //
  __applyMask: function(text, mask) {
    var result = [];
    var c = 0;
    for (var i = 0; i < text.length && c < mask.length; i++) {
      if (mask[c] != 0) {
        result.push(mask[c]);
        c++;
      }
      result.push(text[i]);
      c++;
    }
    return result.join('');
  },

  //
  // Define mask
  //
  // @public
  // @param {Object} event
  // @param {String} mask
  // @return void
  //
  mask: function(event, mask) {
    if (event && event.target && mask) {
      var text = (event.target.value || '').replace(/[^\d]/g, '');
      if (text.match(/^\d{0,20}$/g)) {
        event.target.value = this.__applyMask(text, mask) || '';
        event.target.setSelectionRange(event.target.value.length, event.target.value.length);
      }
    }
  }
};
`;
}
