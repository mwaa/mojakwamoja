import os
import boto3
import botocore
import logging
import nemo.collections.asr as nemo_asr # Import Speech Recognition collection
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv

logging.basicConfig(filename="debug.log", level=logging.DEBUG)
load_dotenv()  # take environment variables from .env.

session = boto3.session.Session()
client = session.client('s3',
                        config=botocore.config.Config(s3={'addressing_style': 'virtual'}),
                        region_name='fra1',
                        endpoint_url='https://fra1.digitaloceanspaces.com',
                        aws_access_key_id=os.getenv('SPACES_KEY'),
                        aws_secret_access_key=os.getenv('SPACES_SECRET'))

app = Flask(__name__)
CORS(app)

def delete_file(file):
    try:
        client.delete_object(os.getenv('SPACES_BUCKET'), os.path.join('sample', file))
    except:
        logging.debug('Unable to delete')

def download_file(file, filePath):
    try:
        logging.debug('We have bucket as {}'.format(os.getenv('SPACES_BUCKET')))
        client.download_file(os.getenv('SPACES_BUCKET'), os.path.join('sample', file), filePath)
    except:
        logging.debug('Unable to download file')

def verify_same_person(voice, newVoice):
    try:
        speaker_model = nemo_asr.models.EncDecSpeakerLabelModel.from_pretrained(model_name="speakerverification_speakernet")
        decision = speaker_model.verify_speakers(voice, newVoice)
        os.remove(newVoice) #no longer need the file
        return decision
    except:
        logging.debug('Unable to verify files')
        return False

@app.route('/', methods=['GET'])
def home():
    return { 'voice-verifier': 'OK' }    

@app.route('/voice-verify', methods=['POST'])
def verify():
    input = request.get_json()
    originalVoice = input['original']
    redeemingVoice = input['redeeming']

    logging.debug('This is our input {}'.format(originalVoice))
    localOriginalPath = os.path.join('./audio', originalVoice)
    logging.debug('This is our path {}'.format(localOriginalPath))
    if (os.path.exists(localOriginalPath) == False):
        download_file(originalVoice, localOriginalPath)

    localRedeemPath = os.path.join('./audio', redeemingVoice);
    download_file(redeemingVoice, localRedeemPath)

    if verify_same_person(localOriginalPath, localRedeemPath): 
        # delete_file(redeemingVoice)
        return { 'verified': True }
    return { 'verified': False }    
