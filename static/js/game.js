Array.prototype.filterInts = function(deleteValue){
  for(var i = 0; i < this.length; i ++)
    if(parseInt(this[i])){
      this[i] = parseInt(this[i]);
    }else{
      this.splice(i,1)
      i --;
    }
  return this;
}
function Puzzle(p){
  this.S = p.S.sort();
  this.target = p.target;
  this.solution = p.solution;
  this.id = 0;
  this.expr = "";
  this.expr_val = "";

  this.puzzleDisplaySelector = $(".game-puzzle");
  this.inputSelector = $("input.game-input-box");
  this.inputDisplaySelector = $(".game-display");
  this.solutionSelector = $(".game-solution");

  // updates this.expr
  this.updateExpr = function(){
    // TODO: strip garbage
    this.expr = this.inputSelector.val().replace(/[^\(\)\+\-\*\/0-9]/g,'');
    try{
      this.expr_val = math.eval(this.expr);
    }catch(e){
      this.expr_val = "??";
    }
    
    // get the arguments being used in the expression
    this.expr_args = this.expr
      .split(/[^0-9]/)
      .filterInts()
      .sort();

    console.log(this);
    
    //hack
    this.expr_args_ok = (this.expr_args.length == this.S.length);
    for(var i = 0; i < this.expr_args.length; i ++)
      if(this.expr_args[i] != this.S[i]) {
        this.expr_args_ok = false;
      }
  }
  
  // returns true or false based on input value
  // TODO: check eps
  this.check = function(){
    var hasCorrectValue = (this.expr_val == this.target);
    var hasAllInputs = this.expr_args_ok;
    console.log(this);
    //console.log(hasCorrectValue, hasAllInputs, this.expr_args.sort(), this.S.sort());

    return hasCorrectValue && hasAllInputs;
  }

  // Updates the display of the current puzzle
  this.updateInputDisplay = function(){
    if(this.expr != "")
      this.inputDisplaySelector.html(this.expr + " = " + this.expr_val);
    else
      this.inputDisplaySelector.html("");

    var correct = this.check(this.expr);
    if(correct){
      this.inputDisplaySelector.addClass("correct");
    }else{
      this.inputDisplaySelector.removeClass("correct");
    }
  }
  // function for handling typing events 
  this.onkeyup = function(){
    this.updateExpr();
    this.updateInputDisplay();
  }

  // Display the puzzle
  this.display = function(){
    // scope hack
    puzzle = this;

    this.puzzleDisplaySelector.html(
      this.S.join(" ") + " -> " + this.target.toString());

    this.inputSelector.val("");
    this.inputSelector.keyup(function(e){
      puzzle.onkeyup();
    });

    this.inputDisplaySelector.html("");
  }
}

function PuzzlePlayer(puzzles){
  this.puzzles = []
  if (puzzles){
    for (var i = 0; i < puzzles.length; i ++){
      this.puzzles.push(new Puzzle(puzzles[i]));
    }
  }
  this.index = 0;

  this.play = function(){
    this.displayPuzzle();
  }

  this.displayPuzzle = function(){
    // no puzzles left
    if (this.index >= this.puzzles.length) {
      this.gameOver();
      return
    }
    var puzzle = this.puzzles[this.index]
    puzzle.display();

    $(".score").html(this.index);  

    /* Enter key listener */
    // scope hack
    var pp = this;
    // function for handling enter button
    pp.puzzles[pp.index].inputSelector.keyup(function(e){
      if(e.keyCode == 13){
        var correct = pp.puzzles[pp.index].check()
        if(correct){
          pp.index ++;
          pp.displayPuzzle();
        }
      }
    });
  }

  this.gameOver = function(){
    alert("Game over!");
  }

  this.loadPuzzles = function(json_str){
    parsed = JSON.parse(json_str);
    for (var i = 0; i < parsed.length; i ++){
      this.puzzles.push(
        new Puzzle(parsed[i].target, parsed[i].S, parsed[i].solution)
      );
    }
  }
}
