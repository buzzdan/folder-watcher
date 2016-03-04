import {formatter} from '../src/fileNameFormatter'
import {expect} from 'expect'

describe('formatFileName', function(){
  it('should return same file name for txt extention', (done) => {
    let filename = formatter('something.txt');
    expect(filename).toBe('something.txt');
    done();
  });
});