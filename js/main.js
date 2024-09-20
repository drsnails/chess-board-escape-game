'use strict'
var gBoard
const gSize = 13
var gIsPower = false
var gIsShowContent = false
function onInitGame() {
    gBoard = buildBoard()
    renderBoard()
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gSize; i++) {
        board[i] = []
        for (var j = 0; j < gSize; j++) {
            const powerTwo = (gSize - i - 1) + j
            board[i][j] = { classNames: [], powerTwo: powerTwo === 1 ? '1' : powerTwo }
            if (powerTwo > 13) board[i][j].powerTwo = 0
        }
    }

    board[gSize - 2][0].classNames = ['piece', 'start-up']
    board[gSize - 1][0].classNames = ['piece', 'start-center']
    board[gSize - 1][1].classNames = ['piece', 'start-right']

    return board
}

function renderBoard() {
    var strHtml = ''
    for (var i = 0; i < gBoard.length; i++) {
        const row = gBoard[i]
        strHtml += '<tr>'
        for (var j = 0; j < row.length; j++) {
            const cell = row[j]
            let className = ((i + j) % 2 === 0) ? 'white' : 'black'
            className += ` ${cell.classNames.join(' ')}`
            let powerTwo = gIsPower ? `2<sup>${(cell.powerTwo > 1 ? cell.powerTwo : '')}</sup>` : 2 ** cell.powerTwo
            let tdHTML = `<sup>1</sup>&frasl;<sub>${(powerTwo)}</sub>`
            if (cell.powerTwo === 0) {
                tdHTML = '...'
            }
            if (i === gSize - 1 && j === 0) tdHTML = '1'
            const tdId = `cell-${i}-${j}`
            if (!gIsShowContent) tdHTML = ''
            strHtml += `<td id="${tdId}" onclick="cellClicked(this, ${i}, ${j})" class="${className}">${tdHTML}</td>`
        }
        strHtml += '</tr>'
    }
    const elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function togglePowerDisplay() {
    gIsPower = !gIsPower
    renderBoard()
}

function toggleShowPower(elBtn) {
    gIsShowContent = !gIsShowContent
    elBtn.querySelector('span').innerText = gIsShowContent ? 'Hide' : 'Show'
    renderBoard()
}


function cellClicked(elCell, cellI, cellJ) {
    const cell = gBoard[cellI]?.[cellJ]
    if (!cell) return
    if (isOccupied(cell)) {
        const cellTop = gBoard[cellI - 1]?.[cellJ]
        const cellRight = gBoard[cellI]?.[cellJ + 1]
        if (!isOccupied(cellTop) && !isOccupied(cellRight)) {
            addClassToCell(cellTop, 'piece')
            addClassToCell(cellRight, 'piece')
            removeClassFromCell(cell, 'piece')
            renderBoard(gBoard)
        } else {
            if (isOccupied(cellTop)) animateCSS(`#cell-${cellI - 1}-${cellJ}`, 'shake')
            if (isOccupied(cellRight)) animateCSS(`#cell-${cellI}-${cellJ + 1}`, 'shake')
        }
    }

}

function isOccupied(cell) {
    if (!cell) return true
    return cell.classNames.includes('piece')
}

function removeClassFromCell(cell, className) {
    const classIdx = cell.classNames.indexOf(className)
    if (classIdx === -1) return
    cell.classNames.splice(classIdx, 1)
}

function addClassToCell(cell, className) {
    cell.classNames.push(className)
}


function animateCSS(selector, animation) {

    // We create a Promise and return it
    return new Promise((resolve, reject) => {
        const animationName = animation;
        const el = document.querySelector(selector);
        if (!el) return resolve('No element found')
        el.classList.add(animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            el.classList.remove(animationName);
            resolve('Animation ended');
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true });
    })
}
