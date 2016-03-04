var fs = require('fs');
import { Watcher } from './watcher';
import formatter from './fileNameFormatter';

var watcher = new Watcher(fs, formatter);

var userMessage = document.querySelector("#user-message");
var source = document.querySelector("#source");
var target = document.querySelector("#target");

source.value = '/Users/danfromisrael/Development/dumper';
target.value = '/Users/danfromisrael/Development/dumper2';

var startButton = document.querySelector("#start-button");
var stopButton = document.querySelector("#stop-button");

startButton.addEventListener('click', () => {
    userMessage.textContent = 'watching: ' + source.value + '\ninto: '+target.value;
    watcher.startListening(source.value, target.value);
});

stopButton.addEventListener('click', () => {
    userMessage.textContent = 'stoped watching: ' + source.value;
    watcher.stopListening();
});