from otree.api import *


doc = """
A flexible JavaScript-based soft-timer for oTree that can span multiple pages and that does NOT reset on page refresh.
Author: Faith Bague-Sampson; September 2022
"""


class C(BaseConstants):
    NAME_IN_URL = 'soft_timer_many_rounds'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 10
    time_on_multispan_task = 90 # time in number of seconds: 1.5 minutes * 60 seconds per minute = 90 seconds
    time_on_per_page_task = 15 # just 15 seconds here
    rounds_in_multispan_task = NUM_ROUNDS-4 # just used to conditionally display pages; not used for the timer itself
    
class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass

class Player(BasePlayer):
    yes_no = models.BooleanField(label='Select Yes or No in order to proceed.') # included just for context with a task


# ===== PAGES ===== 

 # === General overview of the soft-timer and its features ===
class Introduction(Page): 
    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == 1


 # === Timer that spans multiple pages ===
class TimerSpansMultiplePages(Page):
    form_model = 'player'
    form_fields = ['yes_no']

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number <= C.rounds_in_multispan_task

    def js_vars(player: Player):
        return dict(
                round_number = player.round_number,
                time_on_task = C.time_on_multispan_task, # duration of timer in seconds
                time_is_per_page = 'False', # 'True' or 'False'; False == timer spans multiple pages
                onpage_hasAlert = 'True', # 'True' or 'False'; do you want a persistent on-page message after time expires?
                onpage_AlertText = "The suggested time for this task has expired. Please make your selection and proceed.",
                popup_hasAlert = 'False', # 'True' or 'False'; do you want a pop-up notification when time expires?
                popup_AlertText = " ", # Even if unused, this variable MUST be sent to the page!!
            )

    def vars_for_template(player: Player): # spaces in the html tags in order for them to be treated as literals
        rounds_left_in_task = C.rounds_in_multispan_task - player.round_number
        return dict (
            rounds_left_in_task = rounds_left_in_task,
            html_span_clock = '< span id="CountdownClock" >< / span >',
            html_span_timer = '< span style="display:none;" id="timer" >< /span >',
        )


 # === Timer that resets every page ===
class TimerEachPage(Page):
    form_model = 'player'
    form_fields = ['yes_no']

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number > C.rounds_in_multispan_task

    def js_vars(player: Player):
        return dict(
                round_number = player.round_number,
                time_on_task = C.time_on_per_page_task, # duration of timer in seconds
                time_is_per_page = 'True', # 'True' or 'False'; False == timer spans multiple pages
                onpage_hasAlert = 'True', # 'True' or 'False'; do you want a persistent on-page message after time expires?
                onpage_AlertText = "The suggested time for this question has expired. Please make a selection.",
                popup_hasAlert = 'True', # 'True' or 'False'; do you want a pop-up notification when time expires?
                popup_AlertText = "Time has run out. Please make a selection.", # Even if unused, this variable MUST be sent to the page!!
            )

    def vars_for_template(player: Player):
        rounds_left_in_task = C.NUM_ROUNDS - player.round_number
        return dict (
            rounds_left_in_task = rounds_left_in_task,
        )


 # === Clearing items from sessionStorage ===
class ClearTheTimerPage(Page): # page is included in order to clear items from sessionStorage
    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == C.NUM_ROUNDS



page_sequence = [Introduction, TimerSpansMultiplePages, TimerEachPage, ClearTheTimerPage]
