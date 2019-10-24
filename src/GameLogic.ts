import { EventMangementInst } from './EventMangement'

interface GameState {
  x: number[],
  o: number[],
}

export class GameLogic {
  private readonly luckyComb: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  private readonly gameState: GameState = {
    x: new Array(9).fill(10),
    o: new Array(9).fill(10),
  }
  private player: string = 'o'

  private readonly clearGameResult = (): HTMLDivElement => {
    const tttJsStatus: HTMLDivElement = document.querySelectorAll('.TttJs__status')[0]
    tttJsStatus.innerHTML = ''
    return tttJsStatus
  }

  private readonly unColorLuckyNum = (): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    squares.forEach((elem: HTMLDivElement, i: number) => {
      elem.classList.remove('TttJs__square_green');
    })
  }

  private readonly colorLuckyNum = (luckyNum: number[]): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    squares.forEach((elem: HTMLDivElement, i: number) => {
      if (luckyNum.includes(i)) {
        elem.classList.add('TttJs__square_green');
      }
    })
  }

  private readonly appendGameResult = (): void => {
    // Player X is the winner
    const tttJsStatus: HTMLDivElement = this.clearGameResult()

    const capturePart1: HTMLDivElement = document.createElement('div')
    capturePart1.innerHTML = `Player&nbsp;&nbsp;`
    capturePart1.setAttribute('class', 'TttJs__capture')
    tttJsStatus.appendChild(capturePart1)

    const capturePart2: HTMLDivElement = document.createElement('div')
    capturePart2.innerHTML = `${this.player}`
    capturePart2.setAttribute('class', 'TttJs__capture TttJs__capture_uppercase')
    tttJsStatus.appendChild(capturePart2)

    const capturePart3: HTMLDivElement = document.createElement('div')
    capturePart3.innerHTML = `&nbsp;&nbsp;is the winner`
    capturePart3.setAttribute('class', 'TttJs__capture')
    tttJsStatus.appendChild(capturePart3)
  }

  private readonly renderSpuareValues = (): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    const tmpObj: any = {}

    squares.forEach((item: HTMLDivElement, i: number) => {
      Object.keys(this.gameState).forEach((key: string) => {
        const indexOf: number = this.gameState[key].indexOf(i)
        if (indexOf > -1) {
          tmpObj[i] = key
          squares[i].innerHTML = key
        }
        else if (!tmpObj[i] || tmpObj[i] === '') {
          tmpObj[i] = ''
          squares[i].innerHTML = ''
        }
      })
    })
  }

  public setPlayer = (): void => {
    this.player = this.player === 'x' ? 'o' : 'x'
  }
  public getPlayer = (): string => {
    return this.player
  }

  public setGameState = (index: number): void => {
    this.gameState[this.player] = [
      ...this.gameState[this.player].slice(0, index),
      index,
      ...this.gameState[this.player].slice(index + 1),
    ]
    this.renderSpuareValues()
  }

  public clearGameState = (): void => {
    this.player = 'o'
    this.gameState.x = new Array(9).fill(10)
    this.gameState.o = new Array(9).fill(10)
    this.renderSpuareValues()
    this.clearGameResult()
    this.unColorLuckyNum()
  }

  public isClickable = (index: number): boolean => {
    let outcome: boolean = true
    Object.keys(this.gameState).forEach((key: string) => {
      if (outcome) {
        outcome = !this.gameState[key].includes(index)
      }
    })

    return outcome
  }

  public getGameResult = (): boolean => {

    let playeResult: boolean = false
    const playerState: number[] = this.gameState[this.player]
    let luckyNum: number[] = []

    this.luckyComb.forEach((arr: number[]) => {
      const isComb: boolean[] = []
      arr.forEach((item: number) => {
        const isNum: boolean = playerState.includes(item)
        if (isNum) {
          isComb.push(isNum)
        }
      })

      if (!playeResult) {
        isComb.length === 3 ? playeResult = true : playeResult = false
        luckyNum = [ ...arr ]
      }
    })

    if (playeResult) {
      this.colorLuckyNum(luckyNum)
      this.appendGameResult()
      EventMangementInst.removeClickSquareEventsToBoard()
      EventMangementInst.addClickBoardEvent()
    }

    return playeResult
  }
}