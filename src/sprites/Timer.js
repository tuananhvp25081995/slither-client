export default class Timer {
    constructor(scene){
        this.scene = scene;
        
        this.timeInSeconds = 10*60;
        this.timeText = this.scene.add.text(window.innerWidth/2, 30, "00:00", { fontSize: 48 }).setOrigin(0.5, 0.5);
        this.timeText.setScrollFactor(0, 0);
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.countdown,
            callbackScope: this,
            loop: true
        }) 
    }

    countdown(){
        this.timeInSeconds--;
        var minutes = Math.floor(this.timeInSeconds / 60);
        var seconds = this.timeInSeconds - (minutes * 60);
        var timeString = this.addZeros(minutes) + ":" + this.addZeros(seconds);
        this.timeText.text = timeString;
        if (this.timeInSeconds == 0) {
            this.timer.remove();
        }
    }

    addZeros(num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    }
}