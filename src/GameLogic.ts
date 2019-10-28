import { DomMangementInst } from './DomMangement'

import * as Interfaces from './Shared/interfaces'

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
      playerInit: 'x',
    }
  }

  private luckyNum: number[] = []
  private player: string = this.constructorInit().playerInit
  private prevGameState: Interfaces.GameState =  this.constructorInit().gameStateInit
  private readonly gameState: Interfaces.GameState = this.constructorInit().gameStateInit

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

  private readonly colorLuckyNum = (luckyNum: number[] | []): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    squares.forEach((elem: HTMLDivElement, i: number) => {
      if (luckyNum.includes(i)) {
        elem.classList.add('TttJs__square_green');
      }
    })
  }

  private readonly appendGameResult = (luckyNum: number[] | []): void => {
    // Player X is the winner
    let capturePart1Text = `Player&nbsp;&nbsp;`
    let capturePart2Text = `${this.player}`
    let capturePart3Text = `&nbsp;&nbsp;is the winner`

    if (this.countMoves() === 9 && luckyNum.length === 0) {
      capturePart1Text = `No one won`
      capturePart2Text = ''
      capturePart3Text = ''
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
    const squares: NodeListOf<HTMLDivElement> = document.querySelectorAll('.TttJs__square')
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

  private readonly isNegativeZero = (x: number): boolean => {
    return x === 0 && (1 / x < 0)
  }

  private readonly randMinMax = (min: number, max: number): number => {
    const mathRandom: number = Math.random()

    return Math.floor(min + mathRandom * (max - min + 1))
  }

  private readonly getOMoveOpt = (
    getGameState: Interfaces.GameState,
    isNegativeZero: Function,
  ): number[] => {
    return getGameState.o.map((item: number, i: number) => {
      let output: number = i === 0 ? -100 : -i * 10

      if (getGameState.x[i] > -1 || item > -1) {
        output = getGameState.x[i] > -1 ? getGameState.x[i] : item
      }

      return output
    })
      .filter((item: number) => item < 0)
      .map((item: number) => {
        const output: number = item === -100 ? 0 : item * -1 / 10

        return isNegativeZero(output) === true ? 0 : output
      })
  }

  // tslint:disable-next-line: promise-function-async
  private readonly timeout = (ms: number): any => {
    return new Promise((res: Function): any => {
      setTimeout(res, ms)
    })
  }

  public setGameState = (index: number = -1): void => {
    let caseWatch: string = ''
    if (index === -1) {
      caseWatch = 'prev'
      const prevGameStateX: number[] = this.prevGameState.x
      const prevGameStateO: number[] = this.prevGameState.o
      this.gameState.x = [...prevGameStateX]
      this.gameState.o = [...prevGameStateO]
      this.player = this.constructorInit().playerInit
      DomMangementInst.removeClickBoardEvent()
      DomMangementInst.addClickSquareEventsToBoard()
      this.clearStatusMsg()
      this.unColorLuckyNum()
    }
    else {
      if (this.player === 'x' && this.luckyNum.length === 0) {
        caseWatch = 'setPrev'
        const prevGameStateX: number[] = this.getGameState().x
        const prevGameStateO: number[] = this.getGameState().o
        this.prevGameState.x = [...prevGameStateX]
        this.prevGameState.o = [...prevGameStateO]
      }

      this.gameState[this.player] = [
        ...this.gameState[this.player].slice(0, index),
        index,
        ...this.gameState[this.player].slice(index + 1),
      ]

      this.getGameResult()
      // console.info('setGameState [10]', { countMoves: this.countMoves(), luckyNum: this.luckyNum, caseWatch, player: this.player, pres: this.gameState, prev: this.prevGameState })

      this.setPlayer()

      if (this.getPlayer() === 'o'
        && this.luckyNum.length === 0
        && this.countMoves() !== 9
      ) {
        caseWatch = 'oMove'
        // tslint:disable-next-line: no-floating-promises
        this.timeout(500)
          .then(() => {
            const presGameState: Interfaces.GameState = this.getGameState()
            const oMoveOpt: number[] = this.getOMoveOpt(
              presGameState,
              this.isNegativeZero,
              )
            const rand: number = this.randMinMax(0, oMoveOpt.length - 1)
            const oMove: number = oMoveOpt[rand]
            this.setGameState(oMove)
          })
      }
    }

    this.renderSpuareValues()
  }

  public getGameState = (): Interfaces.GameState => {
    return this.gameState
  }

  public clearGameState = (): void => {
    this.player = this.constructorInit().playerInit
    this.gameState.x = this.constructorInit().gameStateInit.x
    this.gameState.o = this.constructorInit().gameStateInit.o
    this.renderSpuareValues()
    this.clearStatusMsg()
    this.unColorLuckyNum()
    this.luckyNum = []
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

    this.luckyComb.forEach((arr: number[]) => {
      const isComb: boolean[] = []
      arr.forEach((item: number) => {
        const isNum: boolean = playerState.includes(item)
        if (isNum) {
          isComb.push(isNum)
        }
      })

      if (!playeResult && isComb.length === 3) {
        playeResult = true
        this.luckyNum = [ ...arr ]
      }
    })

    if (playeResult || this.countMoves() === 9) {
      this.colorLuckyNum(this.luckyNum)
      this.appendGameResult(this.luckyNum)
      setTimeout(() => {
        DomMangementInst.removeClickSquareEventsToBoard()
        DomMangementInst.addClickBoardEvent()
      }, 0)
    }

    return playeResult
  }
}