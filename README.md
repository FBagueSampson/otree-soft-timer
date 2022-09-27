# otree-soft-timer
A flexible JavaScript-based soft-timer for oTree that can span multiple pages and that does NOT reset on page refresh.
Author: Faith Bague-Sampson

The folder otree_soft_timer_app contains a working, 10-round oTree app demonstrating both a multi-page and a per-page timer.
The two script files contain just the javascript used for the timer.

Feature overview:
* Each page/submit can have its own timer or the timer can span multiple pages
* The soft-timer does NOT reset on page refresh
* Each subsection/page class of an experiment can have its own timer
* Timer can be set for hours, minutes, or just seconds; its display adjusts accordingl
* Two different (and entirely optional) user-notification methods
* Primary features are controlled in the __init__.py; look-and-feel settings are adjusted via stylesheet (included at the page here)
        
