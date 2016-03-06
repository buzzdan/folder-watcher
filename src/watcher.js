var id = 1;

export class Watcher {
    constructor(fileSystem, formatFileName) {
        this._id = id ++;
        console.log("initializing watcher..."+ this._id);
        
        this._formatFileName = formatFileName;
        this._fs = fileSystem;
        this._watcher = null;
        this.finishedAction = () => { };
    }
    
    onCopiedFinished(finishedAction){
        this.finishedAction = finishedAction;
    }
    
    startListening(sourceDir, targetDir) {
        console.log(`${this._id}: listening to: ${sourceDir} Into: ${targetDir}`);
        
        if(this._watcher) 
            throw new Error("Already listening, listener must be stopped first");
        
        this._watcher = this._fs.watch(sourceDir, (event, filename) => {
            console.log(`${this._id}: ${event} event for ${filename}`);
            
            if (!filename) {
                console.log('filename not provided');
                return;
            }

            if (event !== 'rename') {
                console.log(`${this._id}: cant handle ${event} event`);
                return;
            }

            console.log(`${this._id}: copying ${filename} file to target`);

            let targetPath = targetDir + '/' + this._formatFileName(filename);
            this._copy(sourceDir + '/' + filename, targetPath);
        });
    }

    _copy(source, target) {
        this._fs.rename(source,target, err=> {
            if(err){
                console.log(err);
                return;
            } 
            console.log(`${this._id}: copied ${source} into ${target}`);
            this.finishedAction();
        });
    }

    stopListening() {
        if (this._watcher) {
            console.log(`${this._id}: Closing watcher`);
            this._watcher.close();
            this._watcher = null;
        }
    }
}