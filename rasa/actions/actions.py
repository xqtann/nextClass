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
                message = f"The nearest toilet is located at {toilet_location[0]},{toilet_location[1]} . \nClick on this message to navigate there."
            else:
                message = "Sorry, I couldn't find any toilets nearby."

        else:
            message = "I couldn't determine your location. Please try again later."

        dispatcher.utter_message(text=message)
        return []
    
    class ActionFetchBusTimings(Action):
        def name(self) -> Text:
            return "action_fetch_bus_timings"

        def run(self, dispatcher: CollectingDispatcher,
                tracker: Tracker,
                domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            bus_stop_query = next(tracker.get_latest_entity_values("bus_stop_name"), None)
            valid_bus_stops = ["KRB", "LT13", "AS5", "BIZ2", "TCOMS-OPP", "PGP", "KR-MRT", "LT27", "UHALL", "UHC-OPP", "YIH", "CLB", "COM3", "MUSEUM", "UTOWN", "UHC", "UHALL-OPP", "S17", "KR-MRT-OPP", "PGPR", "TCOMS", "HSSML-OPP", "NUSS-OPP", "LT13-OPP", "IT", "YIH-OPP", "SDE3-OPP", "JP-SCH-16151", "KV", "OTH", "BG-MRT", "RAFFLES", "CG"]


            if bus_stop_query and bus_stop_query in valid_bus_stops:
                url = "https://nnextbus.nus.edu.sg/ShuttleService"
                params = {"busstopname": bus_stop_query}
                headers = {
                    "accept": "application/json",
                    "Authorization": "Basic TlVTbmV4dGJ1czoxM2RMP3pZLDNmZVdSXiJU"
                }

                # Make the GET request
                response = requests.get(url, headers=headers, params=params)
                bus_timings = response.json()['ShuttleServiceResult']['shuttles']

                if bus_timings:
                    messages = [f"Bus timings for {bus_stop_query}:\n"]
                    for bus in bus_timings:
                        bus_name = bus['name']
                        arrival_time = bus['arrivalTime']
                        messages.append(f"Bus {bus_name} will arrive in {arrival_time} minutes.\n")

                    message = "".join(messages)
                else:
                    message = "Sorry, I couldn't find the bus timings for your stop."
            else:
                message = f"Please provide a valid NUS bus stop to get timings. \nValid bus stops: \n"
                for bs in valid_bus_stops:
                    message += f"{bs}, "

            dispatcher.utter_message(text=message)
            return []
        
class ActionFetchExamDate(Action):

    def name(self) -> Text:
        return "action_fetch_exam_date"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        academic_year = "2024-2025"

        module_code_query = next(tracker.get_latest_entity_values("module_code"), None)

        if module_code_query:
            url = f"https://api.nusmods.com/v2/{academic_year}/modules/{module_code_query.upper()}.json"
        
            response = requests.get(url)
            data = response.json()

            exam_date = data.get('semesterData', [])[0].get('examDate', None)
            if exam_date:
                exam_date_utc = dt.datetime.strptime(exam_date, '%Y-%m-%dT%H:%M:%S.%fZ')
                sgt = pytz.timezone('Asia/Singapore')
                exam_date_sgt = exam_date_utc.replace(tzinfo=pytz.utc).astimezone(sgt)
                exam_date_output = exam_date_sgt.strftime('%Y-%m-%d, %H:%M:%S')
                message = f"The exam for {module_code_query} is on {exam_date_output}."
            else:
                message = f"There is no exam for {module_code_query}!"
        else:
            message = "Please provide a valid NUS module code."

        dispatcher.utter_message(text=message)
        return []
    
    # def test():
    #     academic_year = "2024-2025"
    #     url = f"https://api.nusmods.com/v2/{academic_year}/modules/ST2334.json"
    #     response = requests.get(url)
    #     data = response.json()
    #     print(data)
    #     exam_date = data.get('semesterData', [])[0].get('examDate', None)
    #     exam_date_utc = dt.datetime.strptime(exam_date, '%Y-%m-%dT%H:%M:%S.%fZ')
    #     sgt = pytz.timezone('Asia/Singapore')
    #     exam_date_sgt = exam_date_utc.replace(tzinfo=pytz.utc).astimezone(sgt)
    #     exam_date_output = exam_date_sgt.strftime('%Y-%m-%d, %H:%M:%S')
    #     print(exam_date_output)
    # test()
