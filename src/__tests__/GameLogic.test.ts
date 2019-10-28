
import * as Interfaces from '../Shared/interfaces'

describe('Game logic test', () => {

  it('should generate the right next O move, stage 2.', () => {

    const isNegativeZero: Function = (x: number): boolean => {
      return x === 0 && (1 / x < 0)
    }

    const randMinMax: Function = (min: number, max: number): number => {
      const mathRandom: number = Math.random()

      return Math.floor(min + mathRandom * (max - min + 1))
    }

    const getOMoveOpt: Function = (
      getGameState: Interfaces.GameState,
      isNegativeZero: Function,
    ): number[] => {
      return getGameState.o.map((item: number, i: number) => {
        let output: number = i === 0 ? -100 : -i * 10

        if (getGameState.x[i] > -1 || item > -1) {
          output = getGameState.x[i] > -1 ? getGameState.x[i] : item
        }
        if (i === 0) {
          console.info('map', { output, o: item, x: getGameState.x[i], i })
        }

        return output
      })
        .filter((item: number) => item < 0)
        .map((item: number) => {
          const output: number = item === -100 ? 0 : item * -1 / 10

          return isNegativeZero(output) === true ? 0 : output
        })
    }

    const gameState0: Interfaces.GameState = {
      x: [ 0, -1, -1, -1, -1, -1, -1, -1, -1],
      o: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    }

    const oMoveOpt: number[] = getOMoveOpt(gameState0, isNegativeZero)
    const rand: number = 0 // randMinMax(0, oMoveOpt.length - 1)
    const oMove: number = oMoveOpt[rand]
    // console.info('', { oMove, rand, oMoveOpt, gameState0 })
    expect(rand).toBe(0)
    expect(oMove).toBe(1)
  })

  it('should generate the right next O move, stage 1.', () => {

    const isNegativeZero: Function = (x: number): boolean => {
      return x === 0 && (1 / x < 0)
    }

    const randMinMax: Function = (min: number, max: number): number => {
      const mathRandom: number = Math.random()

      return Math.floor(min + mathRandom * (max - min + 1))
    }

    const getGameStateOTmp = (
      getGameState: Interfaces.GameState,
      isNegativeZero: Function,
    ): number[] => {
      return getGameState.o.map((item: number, i: number) => {
        let output: number = -i * 10

        if (getGameState.x[i] > -1 || item > -1) {
          output = getGameState.x[i] > -1 ? getGameState.x[i] : item
        }
        return output
      })
        .filter((item: number) => item < 0)
        .map((item: number) => {
          let output = item * -1 / 10

          return isNegativeZero(output) === true ? 0 : output
        })
    }

    const generateGameMove: Function = (
      gameStateOTmp: number[],
      randMinMax: Function,
    ): any => {

      const rand: number = randMinMax(0, gameStateOTmp.length - 1)
      const oPlayerMove: number = gameStateOTmp[rand]

      return { oPlayerMove, rand, gameStateOTmp }
    }

    const gameState0 = {
      x: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      o: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    }
    const gameState1 = {
      x: [0, -1, -1, -1, -1, -1, -1, -1, -1],
      o: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    }
    const gameState2 = {
      o: [-1, -1, -1, 3, -1, -1, -1, -1, -1],
      x: [0, -1, -1, -1, -1, -1, -1, -1, -1],
    }
    const gameState3 = {
      o: [-1, -1, 2, 3, 4, -1, -1, -1, 8],
      x: [0, 1, -1, -1, -1, -1, 6, 7, -1],
    }

    let gameStateOTmp1 = getGameStateOTmp(gameState3, isNegativeZero)
    let playerMove1 = generateGameMove(gameStateOTmp1, randMinMax)
    let { oPlayerMove, rand, gameStateOTmp } = playerMove1
    expect(rand).toBe(0)
    expect(oPlayerMove).toBe(5)

    gameStateOTmp1 = getGameStateOTmp(gameState2, isNegativeZero)

    // console.info('stage 1 [0]', { gameStateOTmp1 })
    for (let i: number = 0; i < 100; i += 1) {
      playerMove1 = generateGameMove(gameStateOTmp1, randMinMax)
      oPlayerMove = playerMove1.oPlayerMove
      rand = playerMove1.rand
      if (0 > rand || rand > 6
        || 1 > oPlayerMove || oPlayerMove > 7) {
        // console.info('stage 1 [9]', { oPlayerMove, rand })
        expect(rand >= 0 && rand <= 6).toBeTruthy()
        expect(oPlayerMove >= 1 && oPlayerMove <= 9).toBeTruthy()
      }
    }

  })

  test('adds 1 + 2 to equal 3', () => {
    const sum = (a, b) => { return a + b }
    expect(sum(1, 2)).toBe(3);
  })

})
