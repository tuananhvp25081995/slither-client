export default class Login extends Phaser.Scene{
    
    preload(){
        this.load.html('loginform', 'assets/html/login.html');
    }

    create(){
        this.cameras.main.setBackgroundColor(0x161c22)

        let x = window.innerWidth / 2;
        let y = window.innerHeight/2;

        localStorage.setItem('username', '');

        this.form = this.add.dom(x, y).createFromCache('loginform');

        this.form.addListener('click');
        this.form.on('click', function(e) {
            if(e.target.name === 'playBtn'){
                let inputText = this.getChildByName('usernameField').value;
                if(inputText !== ''){
                    localStorage.setItem('username', inputText);
                    this.scene.scene.start('boot')
                }
            }
        })
    }
}