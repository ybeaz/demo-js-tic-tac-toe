import { icon } from '@fortawesome/fontawesome-svg-core'
import { faUndo } from '@fortawesome/free-solid-svg-icons'

import { GameLogic } from './GameLogic'

const GameLogicInst: any = new GameLogic()

class DomMangement {

  private readonly eventHandler = (e: Event, action: any): void => {
    e.preventDefault()

    switch (action.type) {
      case 'clickUndo':
      {
        console.info('DomMangement->eventHandler', { type: action.type, action })
        GameLogicInst.setGameState()
      }
      break

      case 'clickSquare':
      {
        if (!GameLogicInst.isClickable(action.i)) {
          break
        }

        GameLogicInst.setGameState(action.i)
      }
      break

      case 'clickTable':
      {
        DomMangementInst.removeClickBoardEvent()
        GameLogicInst.clearGameState()
        DomMangementInst.addClickSquareEventsToBoard()
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
      item.addEventListener('click', (e: Event) => this.eventHandler(e, {type: 'clickSquare', i}))
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
      this.eventHandler(e, {type: 'clickTable'}),
      true
    )
  }

  public removeClickBoardEvent = (): void => {
    const table: HTMLDivElement = document.querySelectorAll('.TttJs__table')[0]
    const newElem: HTMLDivElement = table.cloneNode(true)
    table.parentNode.replaceChild(newElem, table)
  }

  public addUndo = (): void => {
    const elem: HTMLElement = document.createElement('i')
    elem.setAttribute('class', 'fas fa-undo')
    const tttJsUndo: HTMLElement = document.querySelectorAll('.TttJs__undo')[0]
    tttJsUndo.appendChild(icon(faUndo).node[0])
    tttJsUndo.addEventListener('click', (e: Event) => {
      this.eventHandler(e, {type: 'clickUndo'})
    })
  }

}

export const DomMangementInst: any = new DomMangement()
