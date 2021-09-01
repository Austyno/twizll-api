const rewire = require('rewire')
const algo = rewire('./algo')
const harmlessRansomeNote = algo.__get__('harmlessRansomeNote')
// @ponicode
describe('harmlessRansomeNote', () => {
  test('0', () => {
    let result = harmlessRansomeNote(
      'I love you always and love',
      'true love comes from always loving him and i and you'
    )
    expect(result).toBe(true)
  })
})
