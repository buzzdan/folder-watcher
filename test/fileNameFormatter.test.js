import formatter from '../src/fileNameFormatter'
import expect from 'expect'
var sinon = require('sinon');

describe('formatFileName', function () {
    it('should return same file name for txt extention', (done) => {
        var filename = formatter('something.txt');
        expect(filename).toBe('something.txt');
        done();
    });
});

describe('formatFileName', function () {
    before(() => {
        this.clock = sinon.useFakeTimers(new Date("25 Dec, 1995 23:15:00").getTime());
    });
    it('should return file name with time prefix for non-txt extension', (done) => {
        var filename = formatter('something.pdf');
        expect(filename).toBe('2315something.pdf');
        done();
    });
    after(()=>{
       this.clock.restore(); 
    });
});