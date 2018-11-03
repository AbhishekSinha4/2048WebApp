	var tiles=document.querySelectorAll("td"),
		start=document.querySelector("#start"),
		undo=document.querySelector("#undo"),
		altCount1=0,
		altCount2=1,
		gameBoard,
		previousBoard,
		undoBoard,
		beginBoard=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
		newVal=[2,2,2,4],
		highTile,
		score,
		toAdd,
		lastAdded,
		lastMax;

	start.addEventListener("click",startGame);

	function startGame(){
		document.querySelector("#gameOver").style.display="none";
		document.querySelector("#gameOver").textContent="Game Over!";
		document.addEventListener("keydown",game);
		undo.addEventListener("click",undoByOne);
		gameBoard=beginBoard.map(function(e){return e.map(function(f){return f;});});
		previousBoard=beginBoard.map(function(e){return e.map(function(f){return f;});});
		undoBoard1=beginBoard.map(function(e){return e.map(function(f){return f;});});
		undoBoard2=beginBoard.map(function(e){return e.map(function(f){return f;});});
		highTile=0;
		score=0;
		lastAdded=0;
		lastMax=0;
		scoreUpdate();
		rewriteBoard();
	}


	function undoByOne(){
		if(!altCount1){
			gameBoard=undoBoard1.map(function(e){return e.map(function(f){return f;});});
		}
		if(!altCount2){
			gameBoard=undoBoard2.map(function(e){return e.map(function(f){return f;});});
		}
		score-=lastAdded;
		highTile=lastMax;
		scoreUpdate();
		rewriteBoard();
	}


	function game(e){
		toAdd=0;
		if(e.key=="z" && e.ctrlKey)undoByOne();
		if(e.key==="ArrowDown"||e.key==="ArrowUp"||e.key==="ArrowRight"||e.key==="ArrowLeft"){
			previousBoard=gameBoard.map(function(e){return e.map(function(f){return f;});});
			if(altCount1){
				undoBoard1=previousBoard.map(function(e){return e.map(function(f){return f;});});
			}
			if(altCount2){
				undoBoard2=previousBoard.map(function(e){return e.map(function(f){return f;});});

			}

			if(e.key==="ArrowDown"){
				for(var j=0;j<4;j++){
				[gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]]=changeBoardArray([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]],0);
			}
			}
			if(e.key==="ArrowUp"){
				for(var j=0;j<4;j++){
				[gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]]=changeBoardArray([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]].reverse(),1);
			}
				
			}
			if(e.key==="ArrowRight"){
				for(var i=0;i<4;i++){
				gameBoard[i]=changeBoardArray(gameBoard[i],0);
			}
			}
			if(e.key==="ArrowLeft"){
				for(var i=0;i<4;i++){
				gameBoard[i]=changeBoardArray(gameBoard[i].reverse(),1);
				}
			}
			rewriteBoard();
			var emptyTiles=[]
			for(var i=0;i<tiles.length;i++){
				if(!tiles[i].textContent)emptyTiles.push(tiles[i]);
			}
			if(!previousBoard.equals(gameBoard) || gameBoard.equals(beginBoard)){

				altCount1=(altCount1+1)%2
				altCount2=(altCount2+1)%2

				var randomIndex= Math.floor(Math.random()*emptyTiles.length);
				var newValue= newVal[Math.floor(Math.random()*newVal.length)];
				var colNo=Number(emptyTiles[randomIndex].classList[0][emptyTiles[randomIndex].classList[0].length-1]);
				var rowNo=Number(emptyTiles[randomIndex].classList[1][emptyTiles[randomIndex].classList[1].length-1]);
				emptyTiles[randomIndex].classList.remove(emptyTiles[randomIndex].classList[2]);
				emptyTiles[randomIndex].classList.add("val_"+newValue);
				emptyTiles[randomIndex].classList.add("new");
				emptyTiles[randomIndex].textContent=newValue;
				gameBoard[rowNo][colNo]=newValue;
				lastAdded=toAdd;
				score+=toAdd;
				scoreUpdate();
				if(highTile===2048){
					document.querySelector("#gameOver h2").textContent="You Win!";
					document.querySelector("#gameOver").style.display="block";
					document.querySelector("#gameOver").style.background="#59447b";
					document.removeEventListener("keydown",game);
					undo.removeEventListener("click",undoByOne);
					return;
				}

			}



			// rewriteBoard();



			if(emptyTiles.length===1){
				if(checkGameOver()){
					document.querySelector("#gameOver").style.display="block";
					document.removeEventListener("keydown",game);
					undo.removeEventListener("click",undoByOne);
					return;
				}
			}
		}		

	}

function checkGameOver(){
			for(var j=0;j<4;j++){
				if([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]].equals(changeBoardArray([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]].map(function(f){return f;}),0)) &&
				[gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]].equals(changeBoardArray([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]].map(function(f){return f;}).reverse(),1)) &&
				gameBoard[j].equals(changeBoardArray(gameBoard[j].map(function(f){return f;}),0)) &&
				gameBoard[j].equals(changeBoardArray(gameBoard[j].map(function(f){return f;}).reverse(),1))){continue;}
				else{
					return 0;
				}
			}
			return 1;
}

function changeBoardArray(a,b){
	
		var merged=merge(a);
		if(b){
			merged.reverse();
		}
		return merged;
	
}

function rewriteBoard(){
	for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				var tile=document.querySelector("#t_"+String((i*4)+j));
				if(gameBoard[i][j]!==0){
					tile.textContent=gameBoard[i][j];
				}
				else{
					tile.textContent="";
				}
				tile.classList.remove(tile.classList[2]);
				tile.classList.remove("new");
				tile.classList.add("val_"+gameBoard[i][j]);
			}
	}		
}

function merge(a){
	var container=0,flag=0;
	for(var i=0;i<a.length;i++){
		if(a[i]===0){
			a.unshift(a.splice(i,1)[0]);
		}
	}
	a.reverse();
	for(var i=0;i<a.length;i++){
		if(a[i]!==0 && (i+1<a.length)){
			if(a[i+1]===a[i]){
				a[i]*=2;
				toAdd+=a[i];
				if(a[i]>highTile){
					lastMax=highTile;
					highTile=a[i];
				}
				a[i+1]=0;
			}
		}
	}
	for(var i=0;i<a.length;i++){
		if(a[i]===0){
			a.push(a.splice(i,1)[0]);
		}
	}
	a.reverse();
	return a;
}


function scoreUpdate(){
	document.querySelector("#score").textContent=score;
	document.querySelector("#max-tile").textContent=highTile;
}


// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});