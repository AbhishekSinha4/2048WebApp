//NAME:  ABHISHEK SINHA
//USN: 01FB16ECS014
//TOPIC: 2048
//DESCRIPTION: This is a game based on the classic original 2048 app game. Aim of the game is to get the 2048 tile. 
//			   Swiping or using arrow keys causes tiles to move. Same numbered tiles merge to form a tile of the 
//			   next power of 2.
//			
//The following logic has been developed by me.

//Variables

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
	lastMax,
	justChanged,
	justStarted,
	gameWon,
	instructionCount=0,
	lastTouchY = 0;

//to enable swiping events

document.body.addEventListener('touchstart', function(e){
	if (e.touches.length != 1) { return;}
    lastTouchY = e.touches[0].clientY;
    preventPullToRefresh = window.pageYOffset == 0;}, false);        
document.body.addEventListener('touchmove', function(e){
	var touchY = e.touches[0].clientY;
    var touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;
        if (touchYDelta > 0) {
            e.preventDefault();
            return;
        }
    }, {passive: false});
	

//event listeners to start game

start.addEventListener("click",startGame);
document.querySelector("#instructions").addEventListener("click",function(){
	document.querySelector("#instruction-board").classList.toggle("appear");
	if(!instructionCount){
		var li=document.createElement("li");
		li.textContent="Tap here to make instructions hidden."
		document.querySelector("#instruction-board ol").appendChild(li);
		instructionCount=1;
	}
})
document.querySelector("#instruction-board").addEventListener("click",function(){
	document.querySelector("#instruction-board").classList.toggle("appear");
})

//Function that starts and initializes the game.
function startGame(){
	document.querySelector("#gameOver").addEventListener("click",continueGame)
	document.removeEventListener("keydown",function(e){game(e,false,"noDir");});
	document.querySelector("#game-board").removeEventListener('touchstart', handleTouchStart, false);        
	document.querySelector("#game-board").removeEventListener('touchmove', handleTouchMove, false);
	beginBoard=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	gameBoard=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	document.querySelector("#gameOver").style.display="none";
	document.querySelector("#gameOver h2").innerHTML="Game Over!";
	document.querySelector("#gameOver").removeEventListener("click",continueGame);
	document.querySelector("#game-board").addEventListener('touchstart', handleTouchStart, false);        
	document.querySelector("#game-board").addEventListener('touchmove', handleTouchMove, false);
	document.addEventListener("keydown",function(e){game(e,false,"noDir");});
	undo.addEventListener("click",undoByOne);
	gameBoard=beginBoard.map(function(e){return e.map(function(f){return f;});});
	previousBoard=beginBoard.map(function(e){return e.map(function(f){return f;});});
	undoBoard1=beginBoard.map(function(e){return e.map(function(f){return f;});});
	undoBoard2=beginBoard.map(function(e){return e.map(function(f){return f;});});
	console.log(beginBoard);
	console.log("gameBoard: ")
	console.log(gameBoard);
	justChanged=0;
	justStarted=1;
	highTile=0;
	score=0;
	lastAdded=0;
	lastMax=0;
	gameWon=0;
	scoreUpdate();
	rewriteBoard();
}

//Undo Function to undo the game by one step.

function undoByOne(){
	document.querySelector("#gameOver").style.display="none";
	document.querySelector("#gameOver h2").innerHTML="Game Over!";
	document.querySelector("#gameOver").removeEventListener("click",continueGame);


	if(!altCount1){
		gameBoard=undoBoard1.map(function(e){return e.map(function(f){return f;});});
	}
	if(!altCount2){
		gameBoard=undoBoard2.map(function(e){return e.map(function(f){return f;});});
	}
	score-=lastAdded;
	lastAdded=0;
	highTile=lastMax;
	scoreUpdate();
	rewriteBoard();
}

//The Game function, called on swiping and on using arrowkeys
function game(e,ifSwipe,dir){
	toAdd=0;
	if(e.key=="z" && e.ctrlKey)undoByOne();
	if(e.key==="ArrowDown"||e.key==="ArrowUp"||e.key==="ArrowRight"||e.key==="ArrowLeft" || ifSwipe){
		console.log(e.key);
		previousBoard=gameBoard.map(function(e){return e.map(function(f){return f;});});
		if(altCount1){
			undoBoard1=previousBoard.map(function(e){return e.map(function(f){return f;});});
		}
		if(altCount2){
			undoBoard2=previousBoard.map(function(e){return e.map(function(f){return f;});});
			}
		if(e.key==="ArrowDown" || dir==="down"){
			for(var j=0;j<4;j++){
				[gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]]=changeBoardArray([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]],0);
			}
		}
		if(e.key==="ArrowUp" || dir==="up"){
			for(var j=0;j<4;j++){
				[gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]]=changeBoardArray([gameBoard[0][j],gameBoard[1][j],gameBoard[2][j],gameBoard[3][j]].reverse(),1);
			}
		}
		if(e.key==="ArrowRight" || dir==="right"){
			for(var i=0;i<4;i++){
				gameBoard[i]=changeBoardArray(gameBoard[i],0);
			}
		}
		if(e.key==="ArrowLeft" || dir==="left"){
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
			if(justStarted){
				if(newValue>highTile){
					justChanged=1;
					highTile=newValue;

				}
			}
			scoreUpdate();
			if(!justChanged){
				lastMax=highTile;
			}
			justChanged=0;
			if(highTile===2048 && !gameWon){
				gameWon=1;
				document.querySelector("#gameOver h2").innerHTML="You Win!<br>Click here to continue";
				document.querySelector("#gameOver").style.display="block";
				document.querySelector("#gameOver").style.background="rgba(89,68,123,0.3)";
				document.querySelector("#gameOver").addEventListener("click",continueGame)
				document.removeEventListener("keydown",game);
				document.querySelector("#game-board").removeEventListener('touchstart', handleTouchStart, false);        
				document.querySelector("#game-board").removeEventListener('touchmove', handleTouchMove, false);
				return;
			}

		}



		if(emptyTiles.length===1){
			if(checkGameOver()){
				document.querySelector("#gameOver").style.display="block";
				document.removeEventListener("keydown",game);
				undo.removeEventListener("click",undoByOne);
				document.querySelector("game-board").removeEventListener('touchstart', handleTouchStart, false);        
				document.querySelector("game-board").removeEventListener('touchmove', handleTouchMove, false);
					return;
			}
		}
	}		

}

//function to continue game after game has been won(2048)

function continueGame(){
	document.querySelector("#gameOver h2").innerHTML="Game Over!";
	document.querySelector("#gameOver").style.display="none";
	document.querySelector("#gameOver").style.background="rgba(0,0,0,0.3)";
	document.querySelector("#gameOver").removeEventListener("click",continueGame);
	document.addEventListener("keydown",function(e){game(e);});
	document.querySelector("game-board").addEventListener('touchstart', handleTouchStart, false);        
	document.querySelector("game-board").addEventListener('touchmove', handleTouchMove, false);


}

//Checking whether the game has ended

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

//Function to manipulate the game board array.

function changeBoardArray(a,b){
	
		var merged=merge(a);
		if(b){
			merged.reverse();
		}
		return merged;
	
}

//Function to change the board on swipe or arrow press event

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

//function to merge same bumping tiles into the next power of 2 as the game requires.

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
				justStarted=0;
				if(a[i]>highTile){
					lastMax=highTile;
					highTile=a[i];
					justChanged=1;
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

//Function to update the game Score.

function scoreUpdate(){
	document.querySelector("#score").textContent=score;
	document.querySelector("#max-tile").textContent=highTile;
}


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





var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
        	game(evt,true,"left");
            /* left swipe */ 
        } else if(xDiff<0){
        	game(evt,true,"right");
            /* right swipe */
        }                       
    } 
    else {
        if ( yDiff > 0 ) {
        	game(evt,true,"up");
            /* up swipe */ 
        } else  if(yDiff<0) { 
        	game(evt,true,"down");
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};