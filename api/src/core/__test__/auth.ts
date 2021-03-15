import { createSession } from '@core/auth'

describe('Auth', () => {
  describe('Session', () => {
    it('should insert a new session with given data', async () => {
      await createSession({
        data: {
          userId: 1,
          role: 'user',
          roles: ['user', 'admin'],
        },
      })
    })
  })
})
