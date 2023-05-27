import os
import boto3
import botocore
import nemo.collections.asr as nemo_asr # Import Speech Recognition collection
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv

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
    client.delete_object(os.getenv('SPACES_BUCKET'), os.path.join('sample', file))

def download_file(file, filePath):
    client.download_file(os.getenv('SPACES_BUCKET'), os.path.join('sample', file), filePath)

def verify_same_person(voice, newVoice):
    speaker_model = nemo_asr.models.EncDecSpeakerLabelModel.from_pretrained(model_name="speakerverification_speakernet")
    decision = speaker_model.verify_speakers(voice, newVoice)
    os.remove(newVoice) #no longer need the file
    return decision

@app.route('/', methods=['GET'])
def home():
    return { 'voice-verifier': 'OK' }    

@app.route('/voice-verify', methods=['POST'])
def verify():
    input = request.get_json()
    originalVoice = input['original']
    redeemingVoice = input['redeeming']

    localOriginalPath = os.path.join('./audio', originalVoice)
    if (os.path.exists(localOriginalPath) == False):
        download_file(originalVoice, localOriginalPath)

    localRedeemPath = os.path.join('./audio', redeemingVoice);
    download_file(redeemingVoice, localRedeemPath)

    if verify_same_person(localOriginalPath, localRedeemPath): 
        # delete_file(redeemingVoice)
        return { 'verified': True }
    return { 'verified': False }    

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT"), debug=True)