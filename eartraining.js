var ctx = new (window.AudioContext || window.webkitAudioContext)();


function resize() { //----------------------------
 
  //keyboard
  var cw = $(window).width();
  var ch = $(window).height();
  var keyboardWidth = cw * 0.75;
  var whiteWidth = keyboardWidth / 14 - 2;
  var whiteHeight = whiteWidth / 0.45;
  var blackHeight = whiteHeight / 2;
  var blackWidth = blackHeight * 0.4;
  var blackMarginRight = blackWidth * 1.24;
  //for black keys wrapper
  var blackMarginLeft = blackHeight * 0.78;
  
  
  //keyboard
  $(".blackKeys").css("margin-left", blackMarginLeft);
  $(".whiteKeys div").css("width", whiteWidth);
  $(".whiteKeys div").css("height", whiteHeight);
  $(".blackKeys div").css("width", blackWidth);
  $(".blackKeys div").css("height", blackHeight);
  $(".blackKeys div").css("margin-right", blackMarginRight);
  
  //scoring
  var achieveWidth = cw / 13;
  var achieveMargin = achieveWidth / 18;
  //circle width
  $(".achievement").css("width", achieveWidth);
  //space under keyboard
  $("#badgeBar").css("margin", achieveMargin*25);
  //check box margin
  $(".achievement").css("margin-right", achieveMargin);
 
  //controls
  $(".control").css("margin", achieveMargin);
  //controls margin top
  $("#controls").css("margin-top", achieveMargin*7);
   $("#levelName").css("margin-top", achieveMargin*7);
  
  //popup circle width
  var badgeDivWidth = achieveWidth * 1.7;
  $("#badgeDiv").css("width", badgeDivWidth);
  
  //badges
  $("#barTitle").css("margin-top", achieveMargin * 17 * -1);
  
  //set font size & material icon size 
  //based on window size
  //icon font size = main font size; level = larger; cont. button = smaller
  
  var fontSizes = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];
  var iconfontsize = 1;
  var minWind = 1;
  
  for (var i = 0; i < fontSizes.length; i++) {
    if (cw >= minWind) {
      iconfontsize = fontSizes[i];
    }
    minWind +=200;
  }
  
  //set font sizes
  
  //level text = bigger than main font
 var levelfontsize = iconfontsize * 1.2 + "em";
  //pop up size slighty smaller
  var popUpfontsize = iconfontsize * 0.6 + "em";
  //continue font size = smaller
  var popButtonfontsize = iconfontsize * 0.5 + "em";
  //badge icon size = slightly larger
  var badgeIconfontsize = iconfontsize * 1.5 + "em";
  
 iconfontsize += "em";
  
  $(".material-icons").css("font-size", iconfontsize);
  //level font size
  $("#levelName").css("font-size", levelfontsize);
  $("#kicker").css("font-size", popUpfontsize);
  //pop up font sizes--use the same as material icon size for main text
  $("h2").css("font-size", popUpfontsize);
 // $("#popUp h1").css("font-size", popUpfontsize); //no longer using h2
  $(".popButton").css("font-size", popButtonfontsize);
  $("#badgeIcon").css("font-size", badgeIconfontsize);
  $("#barTitle").css("font-size", popButtonfontsize);
} //------------------------------------------------




//--- Resize window upon user resize----------------------
$(window).resize(function() {
  resize();
});



















var score = { //--------------------------------------
  
  //if going back over missed questions
  //starts w/value of true that is instantly turned off
  reviewing: false,
  retry_enabled: false,
  
  //----checking results---------------------------
  is_user_correct: function() {
    //return true if correct, else false
    if (piano.user_playing.length == 0) {return false;}
    for (var i = 0; i < piano.level_notes[piano.currentItem].notes.length; i++) {
      if (piano.user_playing[i] != piano.level_notes[piano.currentItem].notes[i]) {return false;}
    }
    return true;
  },
  
  correct_answer: function() {
    
    score.retry_enabled = false;
    
    //check off current item
    score.check_off_item(piano.currentItem);
    
    //correct pop up
    var buttonText;
    if (score.reviewing) {buttonText = "I'm reviewing like a pro!"}
    else {buttonText = "Keep on keepin' on!"}
    
    score.update_popUp("Nice job, ear trainer!", "You heard <em>that </em> &nbsp; right! &nbsp; Sweet listening.", score.badge.default.icon, buttonText);
    
    $("#popUpWrapper").css("display", "inline-block");
    
    //set answer as correct
    piano.level_notes[piano.currentItem].correct = true;
  },
  
  wrong_answer: function() {
    
    score.retry_enabled = true;
    
    //show popup
    //if reviewing, you don't have the option to skip the level
    var wrongMssg; var buttOrFalse;
    if (score.reviewing) {wrongMssg = "Click on the cap to retry."; buttOrFalse = false}
    else {wrongMssg = "Click on the cap to retry or Skip to move ahead."; buttOrFalse = "Skip"}
    
    score.update_popUp("Sorry, that's not correct.", wrongMssg, score.badge.default.icon, buttOrFalse);
    $("#popUpWrapper").css("display", "inline-block");
    
    //update info in obj
    piano.level_notes[piano.currentItem].correct = false;
    
  },

  
  //------check if level done--------------------
  //return true or false
  is_level_complete: function() {
    if (piano.used_notes.length == 4) {
      return true;
    }
    return false;
  },
  
  is_level_correct: function() {
    
    for (var item in piano.level_notes) {
      if (!piano.level_notes[item].correct) {return false;}
    }
    return true;
  },

  
  //-----end of level messages---------------
  level_success: function() {
    
    //retrieve badge
    var badgeName = score.badge[piano.currentLevel].text;
    var badgeIcon = score.badge[piano.currentLevel].icon;
    
    var button_text = "Level up!";
    
    //if you just did last level, change button text
    if (piano.currentLevel + 1 == 5) {button_text = "I did it!"}

    //popup
    var badgeMsg = "You received the " + badgeName + " Badge!";
    score.update_popUp("Congratulations!", badgeMsg, badgeIcon, button_text);
    $("#popUpWrapper").css("display", "inline-block");
},
  
  //won the game functions----------------
  won_game: function() {

    //stow badge
    score.stow_badge();
    
    score.update_popUp("Victory is yours!", "You are an ear-training champion!", "cake", "Play again");
    $("#freePlay").css("display", "block");
    $("#popUpWrapper").css("display", "inline-block");
    
    
  },
  
  restart: function() {
    
    piano.currentLevel = 1;
    piano.level_number_of_notes = 1; 
    score.reset();
    
    //clear badgebar
    document.getElementById("badgeBar").innerHTML = "<div id='barTitle'>My Badges</div>";
  //  $("#badgeBar").html = "<div id='barTitle'>My Badges</div>";
    $("#badgeBar").css("display", "none");
    
    //hide buttons used in free play
    $("#freePlay").css("display", "none");
    $("#playAgain2").css("display", "none");
    
    //restore level text
    $("#kicker").css("display", "inline-block");
    $("#score").css("display", "block");
    
    //select first item & play
    $("#popUpWrapper").css("display", "none");
    score.select_current_item();
    piano.initialize_training();
    piano.play_item();
  },
  
  //-----------review functions -------------------
  
  level_review: function() {
    
    score.reviewing = true;
    //turn retry off when use icon again in popup
    score.retry_enabled = false;
    
    score.update_popUp("You're almost there!", "Click below to correct any missed questions.", score.badge.default.icon, "On to the review!");
    $("#popUpWrapper").css("display", "inline-block");
  },
  
  next_review_item: function() {
    $("#popUpWrapper").css("display", "none");

    //find first wrong answer
    for (var itemNumber in piano.level_notes) {
      if (!piano.level_notes[itemNumber].correct) {
        piano.currentItem = itemNumber;
        score.select_current_item();
        piano.play_item();
        //(break)
        return true;
      }
    }
  },
  
  //----------------other item functions-------------------------
  
  next_item: function() {
    $("#popUpWrapper").css("display", "none");
    piano.currentItem++;
    score.select_current_item();
    piano.initialize_training();
    piano.play_item();
   // console.log(piano.level_notes);
  },
  
  
  retry: function() {
    $("#popUpWrapper").css("display", "none");
    
    piano.play_item();
  },
  
  //----------------badges and leveling up-------------------------------------------
  
  stow_badge: function() {
    //add badge to badge bar
    $("#badgeBar").css("display", "block");
    var badges = $("#badgeBar").html();
    //get badge name for tooltip
    var bName = score.badge[piano.currentLevel].text;
    badges += "<div class='badgeDiv' style='margin-right: 10px' title = " + bName + "><i class='material-icons'>" +  score.badge[piano.currentLevel].icon + "</i></div>";
    $("#badgeBar").html(badges);
    //size the badge
    resize();
  },
  
  start_new_level: function() {
    $("#popUpWrapper").css("display", "none");
    piano.currentLevel++;
    piano.level_number_of_notes++; 
    score.reset();
    
    //select first item & play
    score.select_current_item();
    piano.initialize_training();
    piano.play_item();
  },
  
  
  //for use in restart & new level--clear saved values,
  //reset checkmarks, level name, etc
  reset: function() {
    
    piano.currentItem = 1;
    piano.used_notes = [];
    
    //clear all saved note values
    for (var i = 1; i < 5; i++) {
      piano.level_notes[i].notes = [];
      piano.level_notes[i].correct = false;
    }
   
    //restore checkbox colors
    $(".achievement").css("background-color", "lightgrey");
    $(".achievement").css("border", "none");
    $(".achievement").css("border-bottom", "3px solid darkgrey");
    $(".achievement .material-icons").css("color", "grey");
    
    //level name & subheader
    document.getElementById("levelName").innerHTML = "Level " + piano.currentLevel;
    document.getElementById("kicker").innerHTML = score.badge[piano.currentLevel].text;
    
  },
  
  //--------------------------pop up ----------------------------------
  
  update_popUp: function(header, message, icon, button) {
    
    button = button || false;
 
    document.getElementById("introHeader").innerHTML = header;
    document.getElementById("badgeNameText").innerHTML = message;
    document.getElementById("badgeIcon").innerHTML = icon;

    //sometimes no button @ bottom
    if (button != false) {
      $("#continueButton").css("display", "block");
      document.getElementById("continueButton").innerHTML = button;
    } else {
      $("#continueButton").css("display", "none");
    }
    
    
  },
  
  //----------------check marks-------------------------------------------
  
  check_off_item: function(item_number) {
    
    $("#achieve_" + item_number + " i").css("color", "limegreen");
    document.getElementById("achieve_" + item_number).style.backgroundColor = "forestgreen";
    document.getElementById("achieve_" + item_number).style.borderBottom = "3px solid darkgreen";
  },
  
  
  select_current_item: function() {
    
    document.getElementById("achieve_" + piano.currentItem).style.borderBottom = "3px solid black";
    
    //deselect everything else of the four items
    for (var i = 1; i < 5; i++) {
      if (!piano.level_notes[i].correct && i != piano.currentItem) {
        document.getElementById("achieve_" + i).style.borderBottom = "3px solid darkgrey";
      }
      if (piano.level_notes[i].correct && i != piano.currentItem) {
        document.getElementById("achieve_" + i).style.borderBottom = "3px solid darkgreen";
      }
    }
  },
  
  /////////////////score variables///////////////////////////////////////////////////////
  
  //material icons used for badges
  badge: {
   1: {icon: "music_note", text: "Single-Note Training"},
   2: {icon: "queue_music", text: "Double-Note Training"},
   3: {icon: "library_music", text: "Triple-Note Training"},
   4: {icon: "hearing", text: "Quadruple-Note Training"},
    
    //level 5 is out of commission because it's too darn hard.
   5: {icon: "equalizer", text: "Melodic Training"},
    //for when you miss a question
   default: {icon: "school"}
  }
  
}






























var piano  =  { //------------------------------------
  
  recording: false,
  user_playing: [],
  used_notes: [],
  level_number_of_notes: 1,
  //save the notes for each item in level
  level_notes: {1: {"notes": [], "correct": false},
                 2: {"notes": [], "correct": false},
                 3: {"notes": [], "correct": false},
                 4: {"notes": [], "correct": false}
               },
  currentLevel: 1,
  currentItem: 1,

  check_for_same_notes: function(notes) {
   if (piano.used_notes == []) {
    return false;
    } else {
     for (var i = 0; i < piano.used_notes.length; i++) {
       var sameThing = true;
       for (var j = 0; j < piano.used_notes[i].length; j++) {
         if (notes[j] != piano.used_notes[i][j]) {sameThing = false;}
       }
       if (sameThing) {return true;}
     }
    }
  },
  
  
  sharps: [2, 4, 7, 9, 11, 14, 16, 19, 21, 23],
  scale: [0, 2, 4, 5, 7, 9, 11, 12],
  
  notes:  {
  1: 261.625, //C
  2: 277.183, //C#
  3: 293.665,
  4: 311.127,
  5: 329.628,
  6: 349.228,
  7: 369.994,
  8: 391.995,
  9: 415.305,
  10: 440,
  11: 466.164,
  12: 493.883,
  13: 523.251,
  14: 554.365,
  15: 587.330,
  16: 622.254,
  17: 659.255,
  18: 698.456,
  19: 739.989,
  20: 783.991,
  21: 830.609,
  22: 880,
  23: 932.328,
  24: 987.767
}, //--------------------------------------------
  
  //--free play-------------
  free_play() {
 
    $("#popUpWrapper").css("display", "none");
    document.getElementById("levelName").innerHTML = "Free Play";
    $("#kicker").css("display", "none");
    $("#playAgain2").css("display", "block");
    $("#score").css("display", "none");
    
    //deselect item #4
    document.getElementById("achieve_4").style.borderBottom = "3px solid darkgreen";

  },
  //-------------------------------------------------------------------
  
  //play the notes stored in this level's notes
  play_item: function() {
    piano.play_in_succession(this.level_notes[this.currentItem].notes, 1);
   
    var waitTime = 1000;
    waitTime *= piano.level_number_of_notes;
    
  //  console.log("the wait time equals " + waitTime);
    
    var enableRecord = setTimeout(function() {
      $("#record").css("backgroundColor", "#00cc00");
    }, waitTime); 
  },
  
  //set up notes based on how many notes to search for,
  //save data in object
  initialize_training: function() {

    var notes = piano.return_notes(piano.level_number_of_notes);
    
    //check notes against used notes
    while (piano.check_for_same_notes(notes)) {
      notes = piano.return_notes(piano.level_number_of_notes)
    }
    
    piano.used_notes.push(notes);
    //save notes for current level
   // console.log("the current item is " + piano.currentItem);
    piano.level_notes[piano.currentItem].notes = notes;
   
    
  }, //----------------------------------------------
  
  return_notes: function(number) {
  
    //pick start key integer
    var key = Math.floor(Math.random() * 24 - 1) + 1;
    //must have at least an octave available above it
     if (24 - key < 12) {
      key -= 7;
    }  
    
    var notes = [];
    var position;
    for (var i = 0; i < number; i++) {
      position = Math.floor(Math.random() * 8); //between 0 & 7
      
      var keyIndex = piano.scale[position] + key;
      if (keyIndex > 24) {keyIndex = 24;}
      if (keyIndex < 1) {keyIndex = 1;}
      
      notes.push(keyIndex);
    }
  
  return notes;
  }, //-------------------------------
  
  play_in_succession: function(notes_arr, beginTime) {
  
    beginTime = beginTime || 0;
    var location;
    var noteVal;
    for (var i = 0; i < notes_arr.length; i++) {
      location = notes_arr[i];
      noteVal = piano.notes[location];
      
    //  console.log("notes_arr: "); console.log(notes_arr);
    //  console.log("location of noteval is " + location);
    //  console.log("note val is " + noteVal);
      piano.play_freq(noteVal, ctx, beginTime);
      beginTime+= 0.7;
    }
   }, //----------------------------------------
  
  play_freq: function(freq, ctx, beginTime) {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    beginTime = beginTime || 0;
    var osc = ctx.createOscillator();
    osc.type = "sine";
 //   console.log("freq val: " + freq);
    osc.frequency.value = freq;
    var gainVal = 0.5;
    //adjust gain values for very high & low notes
    if (freq < 260) {gainVal += 0.3;}
    if (freq > 1000) {gainVal -= 0.1;}
    if (freq > 1400) {gainVal -= 0.1;}
    if (freq > 2000) {gainVal -= 0.1;}
    
    gainVal = Math.floor(gainVal*10)/10;
//    console.log("Gainval: " + gainVal);

    var now = ctx.currentTime;
    var startTime = now + beginTime; //0 would be if want delay
    var noteLength = .5;

    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    
    //round these in case of misreading the decimals
    //& getting nonfinite vals
    var rampUp = startTime + 0.001;
    rampUp = Math.floor(rampUp * 10000)/10000;
    var rampDown = startTime + (noteLength - 0.001);
    rampDown = Math.floor(rampDown * 10000)/10000;
    
   // console.log("rampup val: " + rampUp);
   // console.log("rampdown val: " + rampDown);
    
    
    gain.gain.linearRampToValueAtTime(gainVal, rampUp);
    gain.gain.linearRampToValueAtTime(0, rampDown);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + noteLength);
    // osc.noteOff(1);
   }, //-------------------------------------------------
  
  touchKey: function(key, shade1, shade2, shade3, shade4) {
    shade1 = shade1 || 0; shade2 = shade2 || 0; shade3 = shade3 || 0; 
    shade4 = shade4 || 0;
    $(key).css("box-shadow", shade1 + " " + shade2 + " " + shade3 + " " + shade4 + " black");
  } //---------------------------------------------------
}
  




//---playing keys--boxshadow & note sounds --------------------
$(document).mousedown(function(e) {
   //if it's a key
  if (parseInt(e.target.id)) {
    //shade the key
    piano.touchKey(e.target);
    //play the key
    piano.play_freq(piano.notes[e.target.id], ctx);
    
    //if recording......
    if (piano.recording) {
      piano.user_playing.push(parseInt(e.target.id));
    }
    
  }
})

$(".keyboard").mouseup(function(e) {
 if (parseInt(e.target.id)) {
  setTimeout(function() {
    //white keys
    if (piano.sharps.indexOf(parseInt(e.target.id)) == -1) {
     piano.touchKey(e.target, "5px", "5px", "4px", "-2px");
     //sharps
    } else {
      piano.touchKey(e.target, "5px", "5px", "4px", "-4px");
    }
   }, 100);
 }
}); //-------------------------------------------------




//training controls----------------------------------


$("#record").click(function() {
  
  //button must be enabled
  if (this.style.backgroundColor == "#00cc00" || this.style.backgroundColor == "rgb(0, 204, 0)") {
    if (!piano.recording) {
      piano.user_playing = [];
      piano.recording = true;
      this.style.backgroundColor = "#00cc00";

      $("#recordIcon").html("mic_off");

    } else {

      $("#recordIcon").html("mic");

      piano.recording = false;
      document.getElementById("playback").style.backgroundColor = "#00cc00";
      document.getElementById("submit").style.backgroundColor = "#00cc00";
    }
  }
})

$("#playback").click(function() {
  if (this.style.backgroundColor == "#00cc00" || this.style.backgroundColor == "rgb(0, 204, 0)") {
    piano.recording = false;
    piano.play_in_succession(piano.user_playing, 0.3);
    var rec = $("#record");
    document.getElementById("record").style.backgroundColor = "#00cc00";
  }
})

$("#submit").click(function() {
  
  if (this.style.backgroundColor == "#00cc00" || this.style.backgroundColor == "rgb(0, 204, 0)") {
    
    this.style.backgroundColor = "lightgrey";
    piano.recording = false;
    document.getElementById("record").style.backgroundColor = "lightgrey";
    $("#recordIcon").html("mic");
    document.getElementById("playback").style.backgroundColor = "lightgrey";
   
    var correct = true;
    //first check if user answered anything at all-----------
    if (piano.user_playing.length != piano.level_notes[piano.currentItem].notes.length) {
      correct = false;
    }
    if (correct) {
      if (!score.is_user_correct()) {correct = false;}
    }
    //correct answer-------------------------------------------
    if (correct) { 
      score.correct_answer();
    //wrong answer
    } else {
      score.wrong_answer();
    }
 }
})



//buttons to initialize training/movement through program
//(clicking the button in response to the popup)

$("#continueButton").click(function() {
  
  var label = this.innerHTML;
  
  switch(label) {
      
    case "Let's get started!":  
      
      //start the training
      $("#popUpWrapper").css("display", "none");
      piano.initialize_training();
      piano.play_item();
      break;
      
     //next review question
    case "I'm reviewing like a pro!":
      //correct answer by mark answer right
      piano.level_notes[piano.currentItem].correct = true;
      
      //check if done w/review. else, next item for review
      if (score.is_level_correct()) { score.level_success();}
      else {score.next_review_item();}

      break;
    
    //starting the review
    case "On to the review!":
      score.next_review_item();
      break;
      
    //skipped question
    case "Skip":
      //check if level complete
      if (score.is_level_complete()) {
        //go to level review
        score.level_review();
      } else {
        score.next_item();
      }
      break;
    
     
      
      //got answer right
    case "Keep on keepin' on!":
      //check if level complete
      if (score.is_level_complete()) {
        
        //check if got all answers right
        if (score.is_level_correct()) {
          
          score.level_success();
          
          
         } else {
           //not all correct--review wrong answers popup
           score.level_review();
         }
      } else {
        
        //not done with level. go to next item
     //   console.log("moving to next item");
        score.next_item();
      }

      break;
      
     
      //start new level
    case "Level up!":
        
      //turn off any reviewing
      score.reviewing = false;

      //stow badge
      score.stow_badge();

      //set up next level
      score.start_new_level();
      
      break;
      
      
    case "I did it!":
      
      score.won_game();
      break;
      
      
   //restart
    case "Play again":
      
      score.restart();
      
      break;
      
  }
});


//retry button---------------------------
$("#badgeIcon").click(function() {
  if (score.retry_enabled) {score.retry();}
});

//free play-----------------------------
$("#freePlay").click(function() {
  piano.free_play();
})

//play again free play button---------
$("#playAgain2").click(function() {
  score.restart();
})




//------------ Main --------------------------------
resize();
