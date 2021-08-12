import firebase from 'firebase'

export default class {
  constructor (game) {
    this.game = game
    // Initialize Firebase
    const config = {
      apiKey: 'AIzaSyBKKt3qDQuxYu4wMxzSvJWdVduhPtB9tlk',
      authDomain: 'tulpoi.firebaseapp.com',
      databaseURL: 'https://tulpoi-default-rtdb.firebaseio.com',
      projectId: 'tulpoi',
      storageBucket: 'tulpoi.appspot.com',
      messagingSenderId: '525233401692'
    }
    firebase.initializeApp(config)
    firebase.auth().signInAnonymously()
      .then(() => {
        // Signed in..
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log(firebaseUser.uid)
        this.uid = firebaseUser.uid
        this.loadData(this.uid)
      }
    })
  }

  loadData (uid) {
    try {
      const rootRef = firebase.database().ref(`snake/${uid}`)
      rootRef.on('value', (snapshot) => {
        const pos = snapshot.val()
        console.log(snapshot.val())
        this.game.playerSnake.mouseX = pos.mouseX
        this.game.playerSnake.mouseY = pos.mouseY
      })
    } catch (ex) {
      console.log(ex)
    }
  }

  updatePos (mouseX, mouseY, snakeX, snakeY) {
    const posData = {
      mouseX: mouseX,
      mouseY: mouseY,
      snakeX: snakeX,
      snakeY: snakeY
    }
    const key = this.uid ? `snake/${this.uid}` : null
    firebase.database().ref(key).update(posData)
  }
}
