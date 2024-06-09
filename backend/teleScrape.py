from telethon import TelegramClient
from flask import Flask, jsonify, current_app
from werkzeug.serving import run_simple
import nest_asyncio
import os
from dotenv import load_dotenv
import logging
import asyncio
from threading import Thread

# Load environment variables from .env file
load_dotenv()

api_id = os.getenv('API_ID')
api_hash = os.getenv('API_HASH')
phone_number = os.getenv('PHONE_NUMBER')

client = TelegramClient('NextClass', api_id, api_hash)

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Function to start the client and authenticate with the user account
async def start_client():
    await client.start(phone_number)

async def fetch_messages(channel_username):
    messages = []
    async for message in client.iter_messages(channel_username, limit=10):
        messages.append(message.text)
    return messages

@app.route('/')
def index():
    return jsonify({"message": "Server is running"}), 200

@app.route('/messages/<channel_username>', methods=['GET'])
def get_messages_route(channel_username):
    try:
        loop = current_app.loop
        future = asyncio.run_coroutine_threadsafe(fetch_messages(channel_username), loop)
        messages = future.result()
        return jsonify(messages)
    except ValueError as ve:
        logging.error(f"Invalid channel username: {channel_username}")
        return jsonify({"error": f"Invalid channel username: {channel_username}"}), 400
    except Exception as e:
        logging.error(f"Error while fetching messages: {e}")
        return jsonify({"error": str(e)}), 500

def run_flask():
    nest_asyncio.apply()
    with app.app_context():
        app.loop = asyncio.get_event_loop()
        run_simple('0.0.0.0', 5001, app)

if __name__ == '__main__':
    # Initialize the event loop
    loop = asyncio.get_event_loop()
    
    # Start the Telethon client in the event loop
    loop.run_until_complete(start_client())
    
    # Run Flask in a separate thread
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Run the event loop forever
    loop.run_forever()
