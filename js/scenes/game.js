class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.secondClick = null;
		this.score = 100;
		this.correct = 0;
    }

    preload (){
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){
		var json = localStorage.getItem("config") || '{"cards":2,"difficulty":"hard"}';
		this.options_data = JSON.parse(json);

		let arraycards = ['co', 'co', 'sb', 'sb', 'so', 'so', 'tb', 'tb'].slice (0, this.options_data.cards * 2);
		console.log (arraycards);
		arraycards.sort (function() {return Math.random() - 0.5});
		this.cameras.main.setBackgroundColor(0xBFFCFF);
		
		this.add.image(300, 200, arraycards[0]);
		this.add.image(300, 400, arraycards[1]);
		this.add.image(500, 200, arraycards[2]);
		this.add.image(500, 400, arraycards[3]);
		if (this.options_data.cards >= 3) {
			this.add.image(200, 300, arraycards[4]);
			this.add.image(600, 300, arraycards[5]);
			if (this.options_data.cards >= 4) {
				this.add.image(400, 100, arraycards[6]);
				this.add.image(400, 500, arraycards[7]);
			}
		}

		this.cards = this.physics.add.staticGroup();
		
		this.cards.create(300, 200, 'back');
		this.cards.create(300, 400, 'back');
		this.cards.create(500, 200, 'back');
		this.cards.create(500, 400, 'back');
		if (this.options_data.cards >= 3) {
			this.cards.create(200, 300, 'back');
			this.cards.create(600, 300, 'back');
			if (this.options_data.cards >= 4) {
				this.cards.create(400, 100, 'back');
				this.cards.create(400, 500, 'back');
			}
		}
		
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = arraycards[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.secondClick) {
					card.enableBody(false, 0, 0, true, true);
					this.firstClick.enableBody(false, 0, 0, true, true);
					this.secondClick.enableBody(false, 0, 0, true, true);
					this.firstClick = null;
					this.secondClick = null;
				}
				else if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score -= 20;
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
						this.secondClick = card;
					}
					else{
						this.correct++;
						if (this.correct >= this.options_data.cards){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
						this.firstClick = null;
					}
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}
	
	update (){	}
}

