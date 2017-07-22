//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
	// for tool tip
	//$('{data-toggle="tooltip"]').tooltip();

	    var currentPage = null;
		var startTimeStamp = null;
		var processedUnload = false;
		var reachedEnd = false;

		//record the time that the learner started the SCO so that we can report the total time
        startTimeStamp = new Date();

		//initialize communication with the LMS
		ScormProcessInitialize();
		
		//it's a best practice to set the lesson status to incomplete when
		//first launching the course (if the course is not already completed)
		var completionStatus = ScormProcessGetValue("cmi.core.lesson_status");
		if (completionStatus == "not attempted"){
			ScormProcessSetValue("cmi.core.lesson_status", "incomplete");
		}
	
	
	//Get the Div Ids into Array
	var arrayOfDivIds = $.map($(".featurette"), function(n, i){
		return n.id;	
		});
	//Hide All Div Except first Div
	$.map($(".featurette"), function(n, i){
			if (i>0){
				$(n).hide();
				//alert(n.id + "Hided");
			}	
		});

//PgrNext Click Event
	$('#PgrNext').click(function(){
		//alert(arrayOfDivIds);
		var lsCurShowingDivID
		//Find out what div is in showing (or what div is currently displayed)
		$.map($(".featurette"), function(n, i){
				if ($(n).css('display') == 'block'){
					lsCurShowingDivID = n.id;
					//alert(lsCurShowingDivID);
				}	
			});
		//Get the Next Div ID from the Divs Array and show the next and hide current showing
		var liCurrArrayIndex = getPosition(arrayOfDivIds,lsCurShowingDivID);
		if (liCurrArrayIndex+1 < arrayOfDivIds.length){
			$('#'+arrayOfDivIds[liCurrArrayIndex]).hide();
			$('#'+arrayOfDivIds[liCurrArrayIndex+1]).show();
		}
		//$('#divPreHistory').hide();
		//$('#divEuropeanArrival').show();
	});

	$('#PgrPrevious').click(function(){
		var lsCurShowingDivID
		//Find out what div is in showing (or what div is currently displayed)
		$.map($(".featurette"), function(n, i){
				if ($(n).css('display') == 'block'){
					lsCurShowingDivID = n.id;
				}	
			});
		//Get the Next Div ID from the Divs Array and show the next and hide current showing
		var liCurrArrayIndex = getPosition(arrayOfDivIds,lsCurShowingDivID);
		if (liCurrArrayIndex-1 >=0){
			$('#'+arrayOfDivIds[liCurrArrayIndex]).hide();
			$('#'+arrayOfDivIds[liCurrArrayIndex-1]).show();
		}
	});

//mnuSinglePageView Click Event
	$('#mnuSinglePageView').click(function(){
		//Display all divs in single page.
		//DivID Array loads in loading event having all the divs so loop through and show
		for (var i = 0; i < arrayOfDivIds.length; ++i) {
			$('#'+arrayOfDivIds[i]).show();
		}		
		$('#divTestYourKnowledge').hide();
	});

//mnuCourseView Click Event
	$('#mnuCourseView').click(function(){
		//Display all divs in single page.
		//DivID Array having all the divs so loop through and show
		for (var i = 0; i < arrayOfDivIds.length; ++i) {
			if (i==0){
				$('#'+arrayOfDivIds[i]).show();
			}else{
				$('#'+arrayOfDivIds[i]).hide();
			}
		}
		$('#navPager').show();
	});

//mnuTestYourKnowledge Click Event
	$('#mnuTestYourKnowledge').click(function(){
		//Display all divs in single page.
		//DivID Array having all the divs so loop through and show
		for (var i = 0; i < arrayOfDivIds.length; ++i) {
				$('#'+arrayOfDivIds[i]).hide();
			}
		$('#navPager').hide();
		$('#divTestYourKnowledge').show();
	});


	function getPosition(arrayName, arrayItem) {
		for(var i=0;i<arrayName.length;i++){ 
			if(arrayName[i]==arrayItem){
				return i;
			}
		}
	}

///////////////////////JSQioz////////////////////////////////
 var questions = [{
    question: "Which is the capital of Australia?",
    choices: ["Melbourne", "Canberra", "Sydney", "Brisbane", "Perth"],
    correctAnswer: 1
  }, {
    question: "Which of these cities lies in the north of Australia?",
    choices: ["Perth", "Brisbane", "Canberra", "Adelide", "Darwin"],
    correctAnswer: 4
  }, {
    question: "What’s the name of the large island south of Australia?",
    choices: ["Queens Island", "Victoria Island", "Tasmania", "George Island", "Sydney Island"],
    correctAnswer: 2
  }, {
    question: "What are Australia’s native people called?",
    choices: ["Irish", "Welsh", "Indian", "Aborigines", "Australians"],
    correctAnswer: 3
  }, {
    question: "What’s the Aboriginal name for Ayers Rock?",
    choices: ["Ururu", "Uluru", "Ububu", "Manitu", "Gibubu"],
    correctAnswer: 1
  }];
  
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  
  // Display initial question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();
    
    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
    var question = $('<p>').append(questions[index].question);
    qElement.append(question);
    
    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
		ScormProcessSetValue("cmi.core.lesson_status", "completed");
      }
    });
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>',{id: 'question'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    
    score.append('You got ' + numCorrect + ' questions out of ' +
                 questions.length + ' right!!!');
    return score;
  }

	//////////////////SCORM Functions //////////////////////////////
    //SCORM requires time to be formatted in a specific way
    function ConvertMilliSecondsToSCORMTime(intTotalMilliseconds, blnIncludeFraction){
	
	    var intHours;
	    var intintMinutes;
	    var intSeconds;
	    var intMilliseconds;
	    var intHundredths;
	    var strCMITimeSpan;
    	
	    if (blnIncludeFraction == null || blnIncludeFraction == undefined){
		    blnIncludeFraction = true;
	    }
    	
	    //extract time parts
	    intMilliseconds = intTotalMilliseconds % 1000;

	    intSeconds = ((intTotalMilliseconds - intMilliseconds) / 1000) % 60;

	    intMinutes = ((intTotalMilliseconds - intMilliseconds - (intSeconds * 1000)) / 60000) % 60;

	    intHours = (intTotalMilliseconds - intMilliseconds - (intSeconds * 1000) - (intMinutes * 60000)) / 3600000;

	    /*
	    deal with exceptional case when content used a huge amount of time and interpreted CMITimstamp 
	    to allow a number of intMinutes and seconds greater than 60 i.e. 9999:99:99.99 instead of 9999:60:60:99
	    note - this case is permissable under SCORM, but will be exceptionally rare
	    */

	    if (intHours == 10000) 
	    {	
		    intHours = 9999;

		    intMinutes = (intTotalMilliseconds - (intHours * 3600000)) / 60000;
		    if (intMinutes == 100) 
		    {
			    intMinutes = 99;
		    }
		    intMinutes = Math.floor(intMinutes);
    		
		    intSeconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000)) / 1000;
		    if (intSeconds == 100) 
		    {
			    intSeconds = 99;
		    }
		    intSeconds = Math.floor(intSeconds);
    		
		    intMilliseconds = (intTotalMilliseconds - (intHours * 3600000) - (intMinutes * 60000) - (intSeconds * 1000));
	    }

	    //drop the extra precision from the milliseconds
	    intHundredths = Math.floor(intMilliseconds / 10);

	    //put in padding 0's and concatinate to get the proper format
	    strCMITimeSpan = ZeroPad(intHours, 4) + ":" + ZeroPad(intMinutes, 2) + ":" + ZeroPad(intSeconds, 2);
    	
	    if (blnIncludeFraction){
		    strCMITimeSpan += "." + intHundredths;
	    }

	    //check for case where total milliseconds is greater than max supported by strCMITimeSpan
	    if (intHours > 9999) 
	    {
		    strCMITimeSpan = "9999:99:99";
    		
		    if (blnIncludeFraction){
			    strCMITimeSpan += ".99";
		    }
	    }

	    return strCMITimeSpan;
    	
    }

    function ZeroPad(intNum, intNumDigits){
 
	    var strTemp;
	    var intLen;
	    var i;
    	
	    strTemp = new String(intNum);
	    intLen = strTemp.length;
    	
	    if (intLen > intNumDigits){
		    strTemp = strTemp.substr(0,intNumDigits);
	    }
	    else{
		    for (i=intLen; i<intNumDigits; i++){
			    strTemp = "0" + strTemp;
		    }
	    }
    	
	    return strTemp;
    }

	$(window).on('beforeunload', function(){
        //don't call this function twice
        if (processedUnload == true){return;}
        
        processedUnload = true;
        
        //record the session time
        var endTimeStamp = new Date();
        var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp.getTime());
        var scormTime = ConvertMilliSecondsToSCORMTime(totalMilliseconds, false);
        
        ScormProcessSetValue("cmi.core.session_time", scormTime);
        
        //if the user just closes the browser, we will default to saving 
        //their progress data. If the user presses exit, he is prompted.
        //If the user reached the end, the exit normall to submit results.
        if (pressedExit == false && reachedEnd == false){
            ScormProcessSetValue("cmi.core.exit", "suspend");
        }
        
        ScormProcessFinish();
   });
});  //end of document load event

