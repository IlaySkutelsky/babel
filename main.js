let timer
let gift
let baseWidth = 30
let layerWidth = baseWidth

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
  timer = undefined
  gift = ""
  baseWidth = 30
  layerWidth = baseWidth
  inputElm = document.querySelector("input")
  inputElm.value = ""
  inputElm.focus()
  // fillGround()
}

init()
// window.onresize = fillGround(true)

function fillGround(forceReset) {
  let targetWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  let counter = 0;
  let groundElm = document.querySelector('.ground')
  if (forceReset) groundElm.innerHTML = ''
  let groundWidth = getWidthOfGroundElm(groundElm)
  console.log(targetWidth)
  while (groundWidth < targetWidth)
  {
    counter++
    groundElm.innerHTML += '-'
    groundWidth = getWidthOfGroundElm(groundElm)
    console.log(groundWidth)
    if (groundWidth>2000 || counter>2000) break
  }
}

function getWidthOfGroundElm() {
  let groundElm = document.querySelector('.ground')
  let stageElm = document.querySelector('.stage')
  showElm('.stage')
  groundElm.style.display = 'inline-block'
  let width = groundElm.offsetWidth
  hideElm('.stage')
  groundElm.style.display = 'unset'
  return width
}

function restartAll() {
  showElm('.input-wrapper')
  addClass('.input-wrapper', 'appear')
  removeClass('.input-wrapper', 'up')
  removeClass('.input-border', 'show-bar')
  removeClass('.desc-wrapper', 'appear')
  hideElm(".desc-wrapper")
  let towerNonGroundElms = document.querySelectorAll(".tower p:not(.ground)")
  towerNonGroundElms.forEach(elm=>elm.remove())
  let starElms = document.querySelectorAll(".star")
  starElms.forEach(elm=>elm.remove())
   
  removeClass("input", "down")
  hideElm(".stage")
}

function gossip(text) {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  const body = {
    "story": text,
    "user_agent": navigator.userAgent,
    "time": new Date().toLocaleDateString("he-IS") + ' ' + new Date().toLocaleTimeString("he-IS")
  }
  const options = {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(body),
  }
  fetch(obfAddress(), options)
}

function obfAddress() {
  let arr = ["https://enfrlppu9b3y8co", "m", "pipedream" ,"net"]
  return arr.join(".")
}

async function setStage() {
  let inputElm = document.querySelector("input")
  gift = inputElm.value;
  inputElm.editable="false"
  inputElm.blur()
  // gossip(gift)
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
  placeStars()
  let conseq = 0
  console.log("got here")
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

async function placeStars() {
  let randAmount = Math.floor(Math.random()*6)+4
  for (let i=0; i<randAmount; i++) {
    let starElm = document.createElement('p')
    starElm.innerText = '+'
    starElm.classList.add('star')
    let randTop = Math.floor(Math.random()*(window.innerHeight-50))+10
    let randLeft = Math.floor(Math.random()*(window.innerWidth-50))+50
    let randDur = Math.floor(Math.random()*1600)+4800
    let randDelay = Math.floor(Math.random()*800)
    starElm.style.top = randTop + 'px'
    starElm.style.left = randLeft + 'px'
    starElm.style.animation = `${randDur}ms ease ${randDelay}ms flicker infinite`
    let stageElm = document.querySelector('.stage')
    stageElm.append(starElm)
    let randSleep = Math.floor(Math.random()*1000)+200
    await sleep(randSleep)
  }
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
  await sleep(5000)
  restartAll()
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
      if (randLayer) randLayer.remove()
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
    layers[i].style.animation = `${randDur}ms pan ${randDelay}ms forwards steps(60, start)`
  }
}

let towerIsStuckToBottom = true

function testTowerHeight() {
  let stageElm = document.querySelector('.stage')
  let stageHeight = stageElm.getBoundingClientRect().height
  let windowHeight = window.innerHeight
  let topGap = 200
  if (towerIsStuckToBottom) {
    if (stageHeight+topGap >= windowHeight) {
      let offset = windowHeight-stageHeight
      stageElm.style['bottom'] = 'unset'
      stageElm.style['top'] = offset + 'px' 
      towerIsStuckToBottom = false
    }
  } else {
     if (stageHeight <= windowHeight) {
        stageElm.style['bottom'] = '0.7rem'
        stageElm.style['top'] = 'unset'
        towerIsStuckToBottom = true
      }
  }
}

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
  console.log("prepending")
  towerElm.prepend(newP)
  return newP
}

function onTyping() {
  let inputElm = document.querySelector("input")
  if (inputElm.value.length < 2){ 
    if (timer) {
      removeClass(".input-border", "show-bar")
      clearTimeout(timer)
    }
    return
  }
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
