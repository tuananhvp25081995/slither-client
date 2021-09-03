export default class Slot {
    constructor(scene, x ,y) {
        
        this.scene = scene;
        this.x = 30 ;
        this.y = y - 30;

        console.log(this.scene.sys.game.width);
        
        this.skill1 = this.scene.add.image(this.x, this.y, 'skill1').setScrollFactor(0, 0);
        this.skill2 = this.scene.add.image(this.skill1.x + this.skill1.width + 10, this.y, 'skill2').setScrollFactor(0, 0);
        this.skill3 = this.scene.add.image(this.skill2.x + this.skill2.width + 10, this.y, 'skill3').setScrollFactor(0, 0);
        this.skill4 = this.scene.add.image(this.skill3.x + this.skill3.width + 10, this.y, 'skill4').setScrollFactor(0, 0);

        
        this.keys = this.scene.input.keyboard.addKeys('Q,W,E,R');
        console.log(this.scene.cameras.main);
    }

    activeSkill(){
        if(this.alpha !== 1) this.setAlpha(1)
        this.scene.cameras.main.setZoom(1);
    }
     
    update(){
        if(this.keys.Q.isDown) {
            this.skill1.setAlpha(0.5);
            this.scene.cameras.main.setZoom(0.9);
            this.scene.time.addEvent({ delay: 3000, callback: this.activeSkill, callbackScope: this.skill1});
        } 
        if(this.keys.W.isDown){
            this.skill2.setAlpha(0.5);
            this.scene.time.addEvent({ delay: 3000, callback: this.activeSkill, callbackScope: this.skill2});
        }
        if(this.keys.E.isDown){
            this.skill3.setAlpha(0.5);
            this.scene.time.addEvent({ delay: 3000, callback: this.activeSkill, callbackScope: this.skill3});
        }
        if(this.keys.R.isDown){
            this.skill4.setAlpha(0.5);
            this.scene.time.addEvent({ delay: 3000, callback: this.activeSkill, callbackScope: this.skill4});
        }
    }
}