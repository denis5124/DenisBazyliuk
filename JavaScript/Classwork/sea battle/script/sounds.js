let fone = document.getElementById('foneSound');

const audio = new Audio();
audio.src = "sea battle/sound/fone.mp3";
audio.load();
audio.loop = true;

fone.addEventListener('change', function (event) {
    if (event.target.checked) {
        audio.play();
    }
    else {
        audio.pause();
        audio.currentTime = 0;
    }
}, false);