export default class Leaderboard {
  constructor(scene) {
    this.scene = scene;

    const x = -this.scene.sys.game.width;
    const y = 0;

    this.board = this.scene.add.dom(x, y).createFromCache('leaderboard');
    this.board.setOrigin(0, 0);
        
    this.scene.cameras.main.setVisible(this.board);
    const table = this.board.getChildByID('myTable');
        
    const list = [
      {
        name: 'aaa',
        score: 10000
      },
      {
        name: 'bbb',
        score: 9000
      },
      {
        name: 'ccadsc',
        score: 8000
      },
      {
        name: 'adsds',
        score: 8000
      },
      {
        name: 'ccsfzcxzadsc',
        score: 8000
      },
      {
        name: 'adsaads',
        score: 8000
      },
      {
        name: 'vcxv',
        score: 7000
      },
      {
        name: 'ccasadsdsc',
        score: 6000
      },
      {
        name: 'ccadsc',
        score: 5000
      },
      {
        name: 'ccadsc',
        score: 4500
      }
    ];
        
    for (const i in list) {
      const row = table.insertRow(table.rows.length);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      cell1.innerHTML = `#${Number(i) + 1}`;
      cell2.innerHTML = list[i].name;
      cell3.innerHTML = list[i].score;
    }
  }
}
