/*  ==== Flexible Soft-timer Script for Otree ==== */
// Timer stores the round number, time remaining, and time-units for display in the browser's
 // sessionStorage so that the timer does not reset on page refresh. 
// html page must have the following elements:
  // id="CountdownClock" (countdown timer display)
  // id="timer" (hidden element tracks the passage of time)
  // id="alertmessage" (optionally displays on-page expiration message)
// the following styles should be included and specified:
  // .softTimeOut (sets the style of displayed timer upon time expiration)
  // #alertmessage (sets the style for on-page time expiration message)
// script must receive the following variables from the page template:
 // use the def js_vars(player: Player) method and return dict()
  // js_vars.time_on_task (total time in seconds)
  // js_vars.time_is_per_page (set to 'False' if timer spans multiple pages; set to 'True' if timer is per-page)
  // js_vars.round_number (player.round_number)
  // js_vars.onpage_hasAlert (set to 'False' if no on-page post-expiration message; set to 'True' for an on-page post-expiration message)
  // js_vars.onpage_AlertText (string with text of the desired message; must include, even if empty)
  // js_vars.popup_hasAlert (set to 'False' if no one-time pop-up message on expiration; set to 'True' for a one-time pop-up message on expiration)
  // js_vars.popup_AlertText (string with text of the desired message; must include, even if empty)

    const popup_AlertText = js_vars.popup_AlertText;
    var start_time, countAmt, interval;
    var tickingTimer = document.getElementById("CountdownClock");
    var timeOverMsg = document.getElementById("alertmessage"); 

    function addZero(obj) {
        if (obj < 10) {obj = "0" + obj}
        return obj;
    }

    function makeitBaseSixty(remainingTime) {
        var hoursLeft = Math.floor(remainingTime/3600);
        var minutesLeft = Math.floor((remainingTime - hoursLeft*3600)/60);
        var secondsLeft = remainingTime - Math.floor(remainingTime/60)*60;
        let h = addZero(hoursLeft);
        let m = addZero(minutesLeft);
        let s = addZero(secondsLeft);
        return {h, m, s};
    }

    function now() {
        return ((new Date()).getTime());
    }
    
    function tick() {
        var elapsed = now() - start_time;
        var cnt = countAmt - elapsed;
        let timeLeftOver = Math.round(cnt / 1000);
        let displayClock = makeitBaseSixty(timeLeftOver);
        sessionStorage.setItem('timeLeftOver', timeLeftOver);
        if (cnt > 0) {
            if (js_vars.time_on_task > 3599) {
                tickingTimer.innerHTML = displayClock.h + ":" + displayClock.m + ":" + displayClock.s;
            } else if (js_vars.time_on_task < 3600 && js_vars.time_on_task > 59) {
                tickingTimer.innerHTML = displayClock.m + ":" + displayClock.s;
            } else {
                tickingTimer.innerHTML = 0 + ":" + displayClock.s;
            }
        } else {
            if (js_vars.time_on_task > 3599) {
                tickingTimer.innerHTML = "00:00:00";
            } else if (js_vars.time_on_task < 3600 && js_vars.time_on_task > 59) {
                tickingTimer.innerHTML = "00:00";
            } else {tickingTimer.innerHTML = "0:00";}
            tickingTimer.classList.add('softTimeOut');
            if (js_vars.onpage_hasAlert == 'True'){
                timeOverMsg.innerHTML = js_vars.onpage_AlertText; // on-page message
            }
            if (js_vars.popup_hasAlert == 'True'){
                alert(popup_AlertText); // popup message
            }
            clearInterval(interval);
        }
        sessionStorage.setItem('clockLeftOver', tickingTimer.innerHTML);
    }
        
    function startTimer(secs) {
        clearInterval(interval);
        if (js_vars.time_on_task > 59) {
            document.getElementById("timer").innerHTML = secs; // NECESSARY for "ticking" to function
        } else {
            document.getElementById("CountdownClock").innerHTML = 0 + ":" + addZero(secs);
        }
        countAmt = secs * 1000;
        start_time = now();
        interval = setInterval(tick, 1000);
    }
   
    document.addEventListener('DOMContentLoaded', (event) => {
        if (!sessionStorage.getItem('roundNumber')) { 
            sessionStorage.setItem('roundNumber', js_vars.round_number);
            sessionStorage.setItem('timeLeftOver', js_vars.time_on_task);
            sessionStorage.removeItem('clockLeftOver');
            startTimer(js_vars.time_on_task); 
        } else if (js_vars.time_is_per_page == 'True' && sessionStorage.getItem('roundNumber') < js_vars.round_number) {
            sessionStorage.setItem('roundNumber', js_vars.round_number);
            sessionStorage.setItem('timeLeftOver', js_vars.time_on_task);
            sessionStorage.removeItem('clockLeftOver');
            startTimer(js_vars.time_on_task); 
        } else {
            let newTime = sessionStorage.getItem('timeLeftOver');
            let oldClock = sessionStorage.getItem('clockLeftOver');
            if (newTime <= 0) {
                if (js_vars.time_on_task > 3599) {
                    tickingTimer.innerHTML = "00:00:00";
                } else if (js_vars.time_on_task < 3600 && js_vars.time_on_task > 59) {
                    tickingTimer.innerHTML = "00:00";
                } else {tickingTimer.innerHTML = "0:00";}
                tickingTimer.classList.add('softTimeOut');
                if (js_vars.onpage_hasAlert == 'True'){
                    timeOverMsg.innerHTML = js_vars.onpage_AlertText; 
                }
            } else {
                tickingTimer.innerHTML = oldClock;
                startTimer(newTime);
            }
        }
    });
   
