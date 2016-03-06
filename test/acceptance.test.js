import {Watcher} from '../src/watcher'
import formatter from '../src/fileNameFormatter';
import expect from 'expect'
var fs = require('fs');
var sinon = require('sinon');


describe('When Watcher is listening to source folder', () => {
    let watcher = new Watcher(fs, formatter);

    before(() => {
    });

    beforeEach(() => {
    });

    it('should copy the new file into target folder when creating a new file in source folder', (done) => {
        
        //Arrange
        resetFolder("from1");
        resetFolder("to1");
        
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
    });
    
     it('should copy a file into target folder when the file is copied into the source folder', (done) => {
        
        //Arrange
        resetFolder("from2");
        resetFolder("to2");
        resetFolder("tmp");
        
        watcher.startListening("from2", "to2");
       
        watcher.onCopiedFinished(() => {
            console.log('2');
            var content = fs.readFileSync("to2/copied.txt", "utf8");
            
            //Assert
            if (content === "Dan was here!")
                done();
        });
        
        //Act
        fs.writeFileSync("tmp/copied.txt", "Dan was here!", { encoding: 'utf8' });
        fs.createReadStream('tmp/copied.txt').pipe(fs.createWriteStream('from2/copied.txt'));
    });
    
    afterEach(() => {
        watcher.stopListening();
        
    });

    after(() => {
        deleteFolder("from1");
        deleteFolder("to1");
        deleteFolder("from2");
        deleteFolder("to2");
        deleteFolder("tmp");
    });
});


//Helpers:
function resetFolder(path){
    deleteFolder(path);
    mkdirSync(path);
}
function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

function deleteFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                console.log('deleting file: '+ curPath);
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};