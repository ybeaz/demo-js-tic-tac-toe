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

  private readonly constructorInit: any = () => {
    return {
      gameStateInit: {
        x: new Array(9).fill(-1),
        o: new Array(9).fill(-1),
      },
      playerInit: 'o',
    }
  }

  private readonly gameState: GameState = this.constructorInit().gameStateInit

  private player: string = this.constructorInit().playerInit

  private readonly clearStatusMsg = (): HTMLDivElement => {
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
    let capturePart1Text = `Player&nbsp;&nbsp;`
    let capturePart2Text = `${this.player}`
    let capturePart3Text = `&nbsp;&nbsp;is the winner`

    if (this.countMoves() === 9) {
      capturePart1Text = `Nobody`
      capturePart2Text = ''
      capturePart3Text = `&nbsp;&nbsp;is the winner`
    }

    const tttJsStatus: HTMLDivElement = this.clearStatusMsg()

    const capturePart1: HTMLDivElement = document.createElement('div')
    capturePart1.innerHTML = capturePart1Text
    capturePart1.setAttribute('class', 'TttJs__capture')
    tttJsStatus.appendChild(capturePart1)

    const capturePart2: HTMLDivElement = document.createElement('div')
    capturePart2.innerHTML = capturePart2Text
    capturePart2.setAttribute('class', 'TttJs__capture TttJs__capture_uppercase')
    tttJsStatus.appendChild(capturePart2)

    const capturePart3: HTMLDivElement = document.createElement('div')
    capturePart3.innerHTML = capturePart3Text
    capturePart3.setAttribute('class', 'TttJs__capture')
    tttJsStatus.appendChild(capturePart3)
  }

  private readonly renderSpuareValues = (): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    const tmpObj: any = {}

    squares.forEach((item: HTMLDivElement, i: number) => {
      Object.keys(this.getGameState()).forEach((key: string) => {
        const indexOf: number = this.getGameState()[key].indexOf(i)
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
    this.getGameState()[this.player] = [
      ...this.getGameState()[this.player].slice(0, index),
      index,
      ...this.getGameState()[this.player].slice(index + 1),
    ]
    this.renderSpuareValues()
  }

  public getGameState = (): GameState => {
    return this.gameState
  }

  public clearGameState = (): void => {    
    this.player = this.constructorInit().playerInit
    this.gameState.x = this.constructorInit().gameStateInit.x
    this.gameState.o = this.constructorInit().gameStateInit.o
    this.renderSpuareValues()
    this.clearStatusMsg()
    this.unColorLuckyNum()
  }

  public isClickable = (index: number): boolean => {
    let outcome: boolean = true
    Object.keys(this.getGameState()).forEach((key: string) => {
      if (outcome) {
        outcome = !this.getGameState()[key].includes(index)
      }
    })

    return outcome
  }

  public countMoves =  (): number =>
    this.getGameState().x.filter((item: number) => item > -1).length
    + this.getGameState().o.filter((item: number) => item > -1).length

  public getGameResult = (): boolean => {

    let playeResult: boolean = false
    const playerState: number[] = this.getGameState()[this.player]
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

    if (playeResult || this.countMoves() === 9) {
      this.colorLuckyNum(luckyNum)
      this.appendGameResult()
      EventMangementInst.removeClickSquareEventsToBoard()
      EventMangementInst.addClickBoardEvent()
    }

    return playeResult
  }
}