

export class Watcher {
    constructor(fileSystem, formatFileName) {
        console.log("initializing watcher...");
        this._formatFileName = formatFileName;
        this._fs = fileSystem;
        this._watcher = null;
    }

    startListening(sourceDir, targetDir) {
        console.log(`listening to: ${sourceDir} \nInto: ${targetDir}`);

        this._watcher = this._fs.watch(sourceDir, (event, filename) => {
            console.log(`${event} for ${filename}`);

            if (!filename) {
                console.log('filename not provided');
                return;
            }

            if (event !== 'rename') {
                console.log(`cant handle ${event} event`);
                return;
            }

            console.log(`copying ${filename} file to target`);

            let targetPath = targetDir + '/' + this._getCorrectFileName(filename);
            this._copy(sourceDir + '/' + filename, targetPath);
        });
    }

    _getCorrectFileName(currentFileName) {
        if (!currentFileName.endsWith('.txt')) {
            var now = new Date().toLocaleTimeString().split(':',2);
            return now[0].toString() + now[1].toString() + currentFileName;
        }
        return currentFileName;
    }

    _copy(source, target) {
        this._fs.createReadStream(source)
                .pipe(this._fs.createWriteStream(target));
    }

    stopListening() {
        if (this._watcher) {
            console.log('Closing watcher');
            this._watcher.close();
        }
    }
}


