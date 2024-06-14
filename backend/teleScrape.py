from flask import Flask, jsonify, current_app
from telethon import TelegramClient
from threading import Thread
import asyncio
import logging
from dotenv import load_dotenv
import os
from telethon.sessions import MemorySession


app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize the Telegram client
load_dotenv()

api_id = os.getenv('API_ID')
api_hash = os.getenv('API_HASH')
phone_number = os.getenv('PHONE_NUMBER')
client = TelegramClient(MemorySession(), api_id, api_hash)

# Function to start the client and authenticate with the user account
async def start_client():
    await client.start()

# Function to fetch messages from a channel
async def fetch_messages(channel_username):
    client = TelegramClient(MemorySession(), api_id, api_hash)
    await client.start()
    channel = await client.get_entity(channel_username)
    messages = await client.get_messages(channel, limit=10)
    return [message.to_dict() for message in messages]
@app.route('/')
def index():
    return jsonify({"message": "Server is running"}), 200

@app.route('/messages/<channel_username>', methods=['GET'])
def get_messages_route(channel_username):
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        messages = loop.run_until_complete(fetch_messages(channel_username))
        return jsonify(messages)
    except ValueError as ve:
        logging.error(f"Invalid channel username: {channel_username}")
        return jsonify({"error": f"Invalid channel username: {channel_username}"}), 400
    except Exception as e:
        logging.error(f"Error while fetching messages: {e}")
        return jsonify({"error": f"Error while fetching messages: {e}"}), 500

def run_flask(loop, run_func):
    asyncio.set_event_loop(loop)
    run_func()

if __name__ == '__main__':
    # Run Flask in a separate thread with its own event loop
    loop = asyncio.new_event_loop()
    flask_thread = Thread(target=run_flask, args=(loop, app.run))
    flask_thread.start()

    # Start the Telethon client in the main thread
    asyncio.run(start_client())