import Ember from 'ember'
import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

const { run } = Ember

moduleForComponent('pdf-js', 'Integration | Component | pdf js', {
  integration: true
})

test('it renders', function (assert) {
  assert.expect(4)
  let done = assert.async()

  // assertions for then the pdf has been loaded and shown
  this.set('documentChanged', () => {
    run.next(() => {
      assert.equal(this.$('.toolbar label:last').text(), 'page 1 of 14', 'Has 14 pages')

      this.$('.toolbar button:first').click()
      assert.equal(this.$('.toolbar label:last').text(), 'page 2 of 14', 'Is on second page')

      done()
    })
  })

  this.render(hbs`{{pdf-js pdf="/compressed.tracemonkey-pldi-09.pdf" documentChanged=(action documentChanged)}}`)

  assert.equal(this.$('.toolbar').length, 1, 'Toolbar included')
  assert.equal(this.$('.toolbar button').length, 2, 'Next/Prev buttons exist')
})
