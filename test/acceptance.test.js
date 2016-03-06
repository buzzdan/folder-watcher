import {Watcher} from '../src/watcher'
import formatter from '../src/fileNameFormatter';
import expect from 'expect'
var fs = require('fs');
var sinon = require('sinon');


describe('When Watcher is listening to source folder', () => {
    let watcher = null;

    before(() => {
        mkdirSync("tmp");
        mkdirSync("tmp2");
        mkdirSync("tmp3");
    });

    beforeEach(() => {
        watcher = new Watcher(fs, formatter);
        watcher.startListening("tmp", "tmp2");
    });

    it('should copy the new file into target folder when creating a new file in source folder', (done) => {
        
        //Assert
        watcher.onCopiedFinished(() => {
            var content = fs.readFileSync("tmp2/dan.txt", "utf8");
            if (content === "Dan was here!")
                done();
        });
        
        //Act
        fs.writeFileSync("tmp/dan.txt", "Dan was here!", { encoding: 'utf8' });
    });
    
     it('should copy a file into target folder when the file is copied into the source folder', (done) => {
        
        //Assert
        watcher.onCopiedFinished(() => {
            var content = fs.readFileSync("tmp2/copied.txt", "utf8");
            if (content === "Dan was here!")
                done();
        });
        
        //Act
        fs.writeFileSync("tmp3/copied.txt", "Dan was here!", { encoding: 'utf8' });
        fs.createReadStream('tmp3/copied.txt').pipe(fs.createWriteStream('tmp/copied.txt'));
    });
    
    afterEach(() => {
        watcher.stopListening();
    });

    after(() => {
        deleteFolder("tmp");
        deleteFolder("tmp2");
        deleteFolder("tmp3");
    });
});


//Helpers:

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
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};