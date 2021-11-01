
import * as  expt from '../../lib/asserts.help'
import { Period } from './period'

describe('Period', () => {
  it('should get the next date into period', () => {

    const p = Period.from({
    })

    expt.toBeDefined(p);
    expt.notToBeNull(p);

    

  })
})
