export default class Slot {
    constructor(scene,x ,y) {
        
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.h = 200;
        this.w = 500;
        this.rows = 4;
        this.cols = 10;
        this.visible = false;

        this.cellWidth = this.w / this.cols;
        this.cellHeight = this.h / this.rows;

        this.slot = this.scene.add.image(x - this.w/2, y + this.h/2, 'rectangle');
        this.slot.setScrollFactor(0, 0);
        this.scene.minimap.ignore(this.slot);
        this.slot.visible = false;

        this.items = [];
    }
     
    showGrid(){
        console.log('show grid');
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(4, 0xffffff, 1);
        this.graphics.x = this.slot.x-250;
        this.graphics.y = this.slot.y-100;
        this.graphics.visible = false;

        for (let i = 0; i <= this.w; i += this.cellWidth) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.h);
        }
        for (let i = 0; i <= this.h; i += this.cellHeight) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.w, i);
        }
        this.graphics.strokePath();
        this.graphics.setScrollFactor(0,0);
        this.scene.minimap.ignore(this.graphics)
    }

    click(){
        if(this.visible){
            this.slot.visible = false;
            this.graphics.visible = false;
            for(let i=0; i< this.items.length; i++){
                this.items[i].visible = false;
            }
        }
        else{
            this.slot.visible = true;
            this.graphics.visible = true;
            for(let i=0; i< this.items.length; i++){
                this.items[i].visible = true;
            }
        }
        this.visible = !this.visible;
    }

    placeAt(xx, yy, obj){
        let x2 = this.cellWidth * xx + this.cellWidth / 2 + this.graphics.x;
        let y2 = this.cellHeight * yy + this.cellHeight/2 + this.graphics.y;
        obj.x = x2;
        obj.y = y2;
        obj.displayWidth = this.cellWidth;
        obj.scaleY = obj.scaleX;
        obj.setScrollFactor(0,0);
        this.scene.minimap.ignore(obj);
        if(!this.visible) obj.visible = false;
        this.items.push(obj);
    }
}