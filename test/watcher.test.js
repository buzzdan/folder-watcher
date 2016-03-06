import {Watcher} from '../src/watcher'
import expect from 'expect'
var fs = require('fs');
var mock = require('mock-fs');

let mockFormatter = filename => {
    return filename;
};

describe('When Watcher is listening to source folder', () => {
    let watcher = new Watcher(fs, mockFormatter);
    let callback = (event, filename) => {};
    
    before(() => {
        mock({
            'to1':{
                'dan.txt': 'Dan was here!'
            },
            'from1' : {},
            'tmp': {
                'dan2.txt': 'Dan2 was here!'
            },
            'to2':{},
            'from2':{}
        });
        
        fs.watch = function fakeWatch(source, action) {
            callback = action;
            return { close: () => console.log('Closing fake fs watcher!') }
        };
    });

    beforeEach(() => {
    });

    it('should copy the new file into target folder when creating a new file in source folder', (done) => {
        
        //Arrange
        watcher.startListening("from1", "to1");
        
        watcher.onCopiedFinished(() => {
            console.log('1');
            var content = fs.readFileSync("to1/dan.txt", "utf8");
            
            //Assert
            if (content === "Dan was here!")
                done();
        });
        
        //Act
        fs.writeFileSync("from1/dan.txt", "Dan was here!", { encoding: 'utf8' });
        callback('rename', 'dan.txt');
    });
    
   
    
    afterEach(()=>{
        watcher.stopListening();    
    });
    
    after(()=>{
        mock.restore();
    });
});