import * as pm from '@/_helpers/promise-more'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'

describe('Promise More', () => {
  it('timer', () => {
    const resolveSpy = jest.fn()
    const rejectSpy = jest.fn()
    const catchSpy = jest.fn()

    const p = pm
      .timer(10)
      .then(resolveSpy, rejectSpy)
      .catch(catchSpy)

    expect(setTimeout).toBeCalledWith(expect.any(Function), 10)
    jest.runAllTimers()
    return p.then(() => {
      expect(resolveSpy).toHaveBeenCalledTimes(1)
      expect(rejectSpy).not.toBeCalled()
      expect(catchSpy).not.toBeCalled()
    })
  })

  describe('timeout', () => {
    it('Finish before Timeout', () => {
      const resolveSpy = jest.fn()
      const rejectSpy = jest.fn()
      const catchSpy = jest.fn()

      const job = new Promise((resolve, reject) => {
        setTimeout(() => resolve('job'), 10)
      })

      const p = pm
        .timeout(job, 100)
        .then(resolveSpy, rejectSpy)
        .catch(catchSpy)

      expect(setTimeout).toBeCalledWith(expect.any(Function), 100)
      jest.runAllTimers()
      return p.then(() => {
        expect(resolveSpy).toHaveBeenCalledTimes(1)
        expect(resolveSpy).toBeCalledWith('job')
        expect(rejectSpy).not.toBeCalled()
        expect(catchSpy).not.toBeCalled()
      })
    })
  })
})
