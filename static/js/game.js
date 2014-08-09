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
  if (p) {
    this.inputs = p.inputs.sort();
    this.target = p.target;
    this.solution = p.solution;
  }
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
      this.expr_val = math.round(math.eval(this.expr), 7);
    }catch(e){
      this.expr_val = "??";
    }
    
    // get the arguments being used in the expression
    this.expr_args = this.expr
      .split(/[^0-9]/)
      .filterInts()
      .sort();

    //hack
    this.expr_args_ok = (this.expr_args.length == this.inputs.length);
    for(var i = 0; i < this.expr_args.length; i ++)
      if(this.expr_args[i] != this.inputs[i]) {
        this.expr_args_ok = false;
      }
  }
  
  // returns true or false based on input value
  // TODO: check eps
  this.check = function(){
    var hasCorrectValue = (this.expr_val == this.target);
    var hasAllInputs = this.expr_args_ok;
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
      this.inputs.join(" ") + " -> " + this.target.toString());

    this.inputSelector.val("");
    this.inputSelector.keyup(function(e){
      puzzle.onkeyup();
    });

    this.inputDisplaySelector.html("");
  }
}



/*
 * PuzzlePlayer - module that loads puzzles
 */
function PuzzlePlayer(puzzles){
  this.puzzles = [];
  this.index = 0;
  this.size = 4;

  this.setSize = function(size) {
    this.size = size;
  }

  this.play = function(){
    this.displayPuzzle();
  }

  this.nextPuzzle = function(){
    this.index ++;
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
    this.puzzles[this.index].inputSelector.keyup(function(e) {
      if (e.keyCode == 13) {
        var correct = pp.puzzles[pp.index].check()
        if (correct)
          pp.nextPuzzle();
      }
    });
  }

  this.giveUp = function(){
    var p = this.puzzles[this.index];
    alert("Solution: " + p.target + " = " + p.solution);
    this.nextPuzzle();
  }

  this.gameOver = function(){
    alert("Finished!");
  }

  // input is list of object puzzles
  var pp = this;
  this.loadPuzzles = function(obj_puzzles){
    if (!obj_puzzles) return;

    pp.puzzles = pp.puzzles.concat(
      obj_puzzles.map(function(x){
        return new Puzzle(x);
      })
    );
  }

  this.loadPuzzleFromAjax = function(number){
    var size = this.size;
    var number = (number ? number : 1);

    var query = {
      "q": "getPuzzles",
      "size": size,
      "number": number
    };
    ajaxQuerySync(query, function(response){
      pp.loadPuzzles(response.output.puzzles);
    });
  }

  this.loadPuzzles(puzzles);
}

function ContinuousPuzzlePlayer(puzzles){
  PuzzlePlayer.call(this, puzzles);

  // hack: override the play function to fetch a number puzzle each time
  this.play = function () {
    this.loadPuzzleFromAjax();
    this.displayPuzzle();
  }

  this.gameOver = function(){
    this.play();
  }

  this.play();
}

function FinitePuzzlePlayer(puzzles) {
  PuzzlePlayer.call(this, puzzles);

  this.loadPuzzleFromAjax(5);
  this.play();
}
