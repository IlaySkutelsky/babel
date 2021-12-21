let timer
let gift = "מחשב"
let testing = false;

function restartBarAnimation() {
  removeClass(".input-border", "show-bar")
  setTimeout(addClass, 1, ".input-border", "show-bar")
}

function debounce(fn, d) {
  if (timer) {
    clearTimeout(timer)
    restartBarAnimation()
  }
  timer = setTimeout(fn, d);
}

function init() {
  let inputElm = document.querySelector("input")
  inputElm.value = ""
  inputElm.focus()
  if (testing) {
    addClass("body", "dark")
    hideElm(".input-wrapper")
    showElm(".stage")
    startShow()
  }
}

init()


async function setStage() {
  let inputElm = document.querySelector("input")
  gift = inputElm.value;
  addClass("input", "down")
  await sleep(1600)
  addClass(".input-wrapper", "up")
  await sleep(1000)
  addClass("body", "dark")
  await sleep(2000)
  hideElm(".input-wrapper")
  showElm(".stage")
  startShow()
}

async function startShow() {
  await sleep(1000)
  let conseq = 0
  while (layerWidth > 0) {
    let layer = addLayer()
    await updateLayer(layer)
    let chanceOfDecrease = layerWidth/(baseWidth*1.275)+(conseq/480)
    let randomDecrease = (Math.random()<chanceOfDecrease)
    if (!randomDecrease) conseq++
    else conseq=0
    layerWidth = layerWidth-randomDecrease
    if (towerIsStuckToBottom) testTowerHeight()
  }
  await sleep(12000)
  let groundElm = document.querySelector('.ground')
  groundElm.scrollIntoView({behavior: "smooth", block: "end"});
  await ruinTower()
  await sleep(5000)
  moveScene()
  await sleep(7000)
  rollInDesc()
}

async function rollInDesc() {
  showElm('.desc-wrapper')
  addClass('.desc-wrapper', 'appear')
  await sleep(7000)
  removeClass("body", "dark")
  await sleep(1200)
  addClass('.desc p.dark', 'appear')
  await sleep(5000)
  removeClass('.desc p.dark', 'appear')
  addClass('.desc p.dark', 'disappear')
  await sleep(8000)
  showElm('.input-wrapper')
  addClass('.input-wrapper', 'appear')
  removeClass('.input-wrapper', 'up')
  removeClass('.input-border', 'show-bar')
  init()
}

async function ruinTower() {
  return new Promise(async function(resolve) {
    let layers = document.querySelectorAll('.tower p:not(.ground)')
    let amountOfLayers = layers.length
    while (amountOfLayers - 5) {
      let randDelay = Math.random() * 100 + 50
      await sleep(randDelay)
      let randIndex = Math.floor(Math.random()*amountOfLayers)
      let randLayer = layers[randIndex]
      randLayer.remove()
      layers = document.querySelectorAll('.tower p:not(.ground)')
      amountOfLayers = layers.length
      if (!towerIsStuckToBottom) {
        testTowerHeight()
      }
    }
    resolve()
  })
}

function moveScene() {
  let layers = document.querySelectorAll('.tower p:not(.ground')
  for (let i=0; i< layers.length; i++) {
    let randDur = Math.floor(Math.random() * 500) + 36000
    let randDelay = Math.floor(Math.random() * 100)
    layers[i].style.animation = `${randDur}ms pan ${randDelay}ms forwards steps(80, start)`
  }
}

let towerIsStuckToBottom = true

function testTowerHeight() {
  let towerElm = document.querySelector('.tower')
  let towerHeight = towerElm.getBoundingClientRect().height
  let windowHeight = window.innerHeight
  let topGap = 200
  if (towerIsStuckToBottom) {
    if (towerHeight+topGap >= windowHeight) {
      let offset = windowHeight-towerHeight
      towerElm.style['bottom'] = 'unset'
      towerElm.style['top'] = offset + 'px' 
      towerIsStuckToBottom = false
    }
  } else {
     if (towerHeight <= windowHeight) {
        towerElm.style['bottom'] = 0
        towerElm.style['top'] = 'unset'
        towerIsStuckToBottom = true
      }
  }
}

let baseWidth = 30
let layerWidth = baseWidth

function getRandomChar() {
  let chars = gift.replace(" ", "")
  let randomIdx = Math.floor(Math.random()*chars.length)
  return chars[randomIdx]
}

async function updateLayer(layerElm) {
  return new Promise(async function(resolve) {
    let resolved = false
    let txt = layerElm.innerText
    let foreignChars = 0
    do {
      foreignChars = 0
      for (let i = 0; i < txt.length; i++) {
        if (gift.includes(txt[i])) continue
        else {
          if (Math.random()>0.725) {
            let randomChar = getRandomChar()
            txt = replaceAt(txt, i, randomChar)
          }
          foreignChars++
        }
        foreignChars -= Math.floor(Math.random()*Math.random()*3.5)
      }
      layerElm.innerHTML = txt
      let randomDelay = Math.random()*Math.random()*Math.random()*1450
      await sleep(randomDelay)
      if (!resolved) {
        if (Math.random() > 0.5) {
          resolve()
          resolved = true;
        }
      }
    } while (foreignChars!=0)
    if (!resolved) resolve()
  })
}

function addLayer() {
  let towerElm = document.querySelector(".tower")
  let newP = document.createElement("p")
  let layerTxt = ""
  for (let i = 0; i < layerWidth; i++) {
    layerTxt += "&ensp;"
  }
  newP.innerHTML = layerTxt
  towerElm.prepend(newP)
  return newP
}

function onTyping() {
  debounce(setStage, 4000)
}

function hideElm(selector) {
  addClass(selector, "hidden")
}

function showElm(selector) {
  removeClass(selector, "hidden")
}

function addClass(selector, className) {
  let elm = document.querySelector(selector)
  elm.classList.add(className)
}

function removeClass(selector, className) {
  let elm = document.querySelector(selector)
  elm.classList.remove(className)
}

function addAtrribute(selector, attributeName, attributeValue) {
  let elm = document.querySelector(selector)
  elm.setAttribute(attributeName, attributeValue)
}

function replaceAt(string, index, replacement) {
    return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
