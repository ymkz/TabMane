function pick ({ title, url, favIconUrl }) {
  return {
    title: title,
    url: url,
    favIconUrl: favIconUrl
  }
}

function add (tab) {
  chrome.storage.sync.get(items => {
    const alo = Object.assign({}, items, { length: Object.keys(items).length })
    const arr = Array.from(alo)
    arr.push(pick(tab))
    const next = Object.assign({}, arr)
    chrome.storage.sync.set(next)
  })
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case 'displayPage':
      chrome.tabs.create({ url: chrome.runtime.getURL('tabmane.html') })
      break
    case 'sendOnly':
      add(tab)
      console.debug('SET')
      break
    case 'sendAll':
      console.debug('SET')
      break
    case 'resetStorage':
      chrome.storage.sync.clear(function () {
        console.debug('CLEAR')
      })
      break
    default:
      console.warn('DEFAULT')
      break
  }
})

chrome.storage.onChanged.addListener(function (changes, areaName) {
  console.debug('CHANGE', changes)
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    'title': 'TabManeを開く',
    'id': 'displayPage'
  })

  chrome.contextMenus.create({
    'type': 'separator'
  })

  chrome.contextMenus.create({
    'title': 'このタブをTabManeに送る',
    'id': 'sendOnly'
  })

  chrome.contextMenus.create({
    'title': 'すべてのタブをTabManeに送る',
    'id': 'sendAll'
  })

  chrome.contextMenus.create({
    'type': 'separator'
  })

  chrome.contextMenus.create({
    'title': 'reset storage(: debug)',
    'id': 'resetStorage'
  })
})

chrome.browserAction.onClicked.addListener(function (tab) {
  // アイコンをクリックした時に表示しているページに関する`tabs.Tab`の情報が引数に入る
  // オプションで現在のページを送るか、すべてのページを送るか選択できるようにしたい
  add(tab)
  console.debug('SET')
})

