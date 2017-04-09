function makeItem ({ title, url, favIconUrl }) {
  return {
    title: title,
    url: url,
    favIconUrl: favIconUrl
  }
}

function makeItemWithChange ({ title, url, favIconUrl }) {
  return {
    title: title.newValue,
    url: url.newValue,
    favIconUrl: favIconUrl.newValue
  }
}

function addItemToLocalstorage (item) {
  const items = JSON.parse(window.localStorage.getItem('items')) || []
  items.push(item)
  window.localStorage.setItem('items', JSON.stringify(items))
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case 'displayPage':
      chrome.tabs.create({url: chrome.runtime.getURL('tabmane.html')})
      break
    case 'sendOnly':
      chrome.storage.sync.set(makeItem(tab))
      console.debug('SET')
      break
    case 'resetStorage':
      chrome.storage.sync.clear(function () {
        window.localStorage.clear()
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
  addItemToLocalstorage(makeItemWithChange(changes))
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
  chrome.storage.sync.set(makeItem(tab))
  console.debug('SET')
})

