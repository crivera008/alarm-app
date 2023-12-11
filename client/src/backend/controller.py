import os
from flask import Flask, jsonify

import sys
import time
sys.path.append("./")
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import audio_processing 
from flask import Flask
import traceback
import requests
app = Flask(__name__)

def song_uploaded(folder_path):
    files_in_uploads = os.listdir(folder_path)

    # if a song has been uploaded:
    if files_in_uploads:
        return True
    else:
        return False


def main():

    folder_path = "../../../server/uploads"

    file_name = ""
    prev_file_name = ""

    while True:
        file_name = ""
        prev_file_name = ""

        if song_uploaded(folder_path):
            file_name =  os.listdir(folder_path)[0]
            file_path = folder_path + "/" + file_name

            if file_path != prev_file_name:
                print('new wav file detected, updating bpm now...')

                # if a song has been uploaded, compute the bpm 
                bpm = audio_processing.extract_bpm(file_path)

                with open("../../../server/bpm/bpm.txt", 'w') as file:
                    file.write(str(bpm))

                # update 
                prev_file_name = file_name
        else:
            print('no file found in uploads')
            time.sleep(5)
        
if __name__ == "__main__":
    print('running contorller.py')
    main()