import { GameLogic } from './GameLogic'

const GameLogicInst: any = new GameLogic()

class EventMangement {

  private readonly eventHandler = (action: any): void => {
    switch (action.type) {
      case 'clickSquare':
      {
        if (!GameLogicInst.isClickable(action.i)) { 
          break
        }

        GameLogicInst.setPlayer()
        const player: string = GameLogicInst.getPlayer()
        GameLogicInst.setGameState(action.i)
        GameLogicInst.getGameResult()
      }
      break

      case 'clickTable':
      {
        EventMangementInst.removeClickBoardEvent()
        GameLogicInst.clearGameState()
        EventMangementInst.addClickSquareEventsToBoard()
      }
      break

      default: {
        console.info('...->eventHandler', 'Strange action', { action })
      }
    }
  }

  public addClickSquareEventsToBoard = (): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    squares.forEach((item: HTMLElement | null, i: number) => {
      item.addEventListener('click', (e: Event) => this.eventHandler({type: 'clickSquare', e, i}))
    })
  }

  public removeClickSquareEventsToBoard = (): void => {
    const squares: NodeList = document.querySelectorAll('.TttJs__square')
    squares.forEach((item: HTMLElement | null, i: number) => {
      const newElem: HTMLElement | null = item.cloneNode(true)
      item.parentNode.replaceChild(newElem, item)
    })
  }

  public addClickBoardEvent = (): void => {
    const table: HTMLDivElement = document.querySelectorAll('.TttJs__table')[0]
    table.addEventListener('click', (e: Event): void =>
      this.eventHandler({type: 'clickTable'}),
      true
    )
  }

  public removeClickBoardEvent = (): void => {
    const table: HTMLDivElement = document.querySelectorAll('.TttJs__table')[0]
    const newElem: HTMLDivElement = table.cloneNode(true)
    table.parentNode.replaceChild(newElem, table)
  }
}

export const EventMangementInst: any = new EventMangement()
