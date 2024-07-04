# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

import requests
import geocoder
import datetime as dt
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
import pytz

class ActionTimeNow(Action):

    def name(self) -> Text:
        return "action_time_now"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        singapore_timezone = pytz.timezone('Asia/Singapore')
        current_time = dt.datetime.now(singapore_timezone).strftime('%Y-%m-%d, %H:%M:%S')
        dispatcher.utter_message(text=f"It is {current_time}.")

        return []
    
class ActionFindNearestToilet(Action):

    def name(self) -> Text:
        return "action_find_nearest_toilet"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        g = geocoder.ip('me')
        my_lat = g.latlng[0]
        my_long = g.latlng[1]

        if my_lat and my_long:
            query = f"""
            [out:json];
            (
              node["amenity"="toilets"](around:1000,{my_lat},{my_long});
            );
            out body;
            """
            response = requests.post('http://overpass-api.de/api/interpreter', data={'data': query})
            data = response.json()

            if 'elements' in data and data['elements']:
                nearest_toilet = data['elements'][0]
                toilet_location = nearest_toilet['lat'], nearest_toilet['lon']
                message = f"The nearest toilet is located at latitude: {toilet_location[0]}, longitude: {toilet_location[1]}"
            else:
                message = "Sorry, I couldn't find any toilets nearby."

        else:
            message = "I couldn't determine your location. Please try again later."

        dispatcher.utter_message(text=message)
        return []
