from flask import Flask, request, jsonify
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
import firebase_admin
from firebase_admin import credentials, storage, firestore
import json
import openai
import cv2
import time
from variables import apiKey, defaultContexts, defaultOutputs

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
# CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

def chatGPTOutput(msgHistory, newInput):
    msgHistoryJson = json.loads(msgHistory)
    msgHistoryJson.append({'role': 'user', 'content': newInput})

    fullQuery = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = msgHistoryJson
    )
    
    response = fullQuery["choices"][0]["message"]["content"]

    msgHistoryJson.append({'role': 'assistant', 'content': response})

    return json.dumps(msgHistoryJson), response

def obtainDocID(personality):
    if personality == "Cat":
        documentId = "YsIBtN7cl7YNjXsv6zHe"
    elif personality == "Pirate":
        documentId = "7SjRlKVnNjl2Ep2cFrCe"
    elif personality == "Gym Bro":
        documentId = "fBYiP60gbIFoqVytTesV"
    return documentId

def machineVision(input_image_path):

    ##Important Links: 
    ##Main Source: https://www.kaggle.com/code/chienhsianghung/object-detection-using-opencv-inference/notebook
    ##For Actual Labels.txt: https://github.com/amikelive/coco-labels/blob/master/coco-labels-paper.txt

    output_image_path = 'objectImage.jpg' ##CAN CHANGE

    MINIMUM_THRESHOLD=0.5 #This is the minimum confidence threshold of which the model will show detected objects
    config_file  = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
    frozen_model = 'frozen_inference_graph.pb'
    file_name    = 'labels.txt' 

    model = cv2.dnn_DetectionModel(frozen_model,config_file )
    model.setInputSize(320,320)
    model.setInputScale(1.0/127.5) #255/2
    model.setInputMean((127.5,127.5,127.5)) # setting input between -1 and 1
    model.setInputSwapRB(True)

    classLabels = []
    with open(file_name, 'rt') as fpt:
        classLabels = fpt.read().rstrip('\n').split('\n')

    ##Read Image
    img = cv2.imread(input_image_path)

    ClassIndex, confidence, bbox = model.detect(img, confThreshold=MINIMUM_THRESHOLD)


    box_color=(255,0,0)
    box_thickness=2

    font_scale=1.5
    font_thickness=2
    font_color=(0,255,0) #Green
    font= cv2.FONT_HERSHEY_PLAIN

    for ClassInd, conf, boxes in zip(ClassIndex.flatten(), confidence.flatten(), bbox):
        if conf>=MINIMUM_THRESHOLD:
            cv2.rectangle(img,boxes,box_color,box_thickness)
            if ClassInd >= len(classLabels):
                print("Out of Bounds", ClassInd, conf, boxes)
            else:
                #print("Object Detected:", classLabels[ClassInd-1],ClassInd, conf, boxes)
                cv2.putText(img,classLabels[ClassInd-1],(boxes[0], boxes[1]), font, fontScale=font_scale,color=font_color,thickness=font_thickness)

    cv2.imwrite(output_image_path, img)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/testing", methods=['GET'])
# @cross_origin()
def testing_endpoint():
    print("Hello It worked")
    return jsonify({"Success": "Yay"})

@app.route("/objectDetection", methods=['GET'])
# @cross_origin()
def objectDetection_endpoint():
    bucket = storage.bucket()

    def spamUpdate():
        imgFire = bucket.blob("streaming/latestImage.jpg")
        imgFireProcessed = bucket.blob('streaming/objectImage.jpg')

        imgFire.download_to_filename('latestImage.jpg')
        print("Latest image downloaded.")

        machineVision('latestImage.jpg')
        print("Image processed.")

        imgFireProcessed.upload_from_filename("objectImage.jpg")
        print("Processed image uploaded.")

    while True:
        spamUpdate()
        time.sleep(2)

@app.route("/initialize", methods=['GET'])
# @cross_origin()
def initialize_endpoint():
    # cred = credentials.Certificate("capstonecat-firebase.json") 
    # firebase_admin.initialize_app(cred)

    cred = credentials.Certificate("capstonecat-firebase.json") 
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'capstonecat.appspot.com'
    })

    db = firestore.client()
    return jsonify({"Success": "Yay I initialized"})

@app.route('/chatGPTResponse', methods=['POST', 'OPTIONS'])
# @cross_origin()
def chatGPTResponse_endpoint():
    # Firebase initalization
    # cred = credentials.Certificate("capstonecat-firebase.json") 
    # firebase_admin.initialize_app(cred)
    db = firestore.client()

    # ChatGPT
    openai.api_key = apiKey

    data = request.form
    print(data)
    newInput = data['transcript']
    personality = data['personality']

    collectionName = "Conversations"
    docId = obtainDocID(personality)

    docRef = db.collection(collectionName).document(docId)
    doc = docRef.get()
    docData = doc.to_dict()
    
    docData["History"], docData["Output"] =  chatGPTOutput(docData["History"], newInput)

    docRef.update(docData)

    print(docData["Output"])
    print("Document updated successfully!")

    response = jsonify({"Response" : docData["Output"]})
    # response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')

    return response

@app.route('/chatGPTReset', methods=['POST'])
# @cross_origin()
def chatGPTReset_endpoint():
    # Firebase initalization
    # cred = credentials.Certificate("capstonecat-firebase.json") 
    # firebase_admin.initialize_app(cred)
    db = firestore.client()

    # ChatGPT
    openai.api_key = apiKey

    data = request.form
    personality = data['personality']

    collectionName = "Conversations"
    docId = obtainDocID(personality)
    
    docRef = db.collection(collectionName).document(docId)
    doc = docRef.get()
    docData = doc.to_dict()

    docData["History"], docData["Output"] =  defaultContexts[personality], defaultOutputs[personality]

    docRef.update(docData)
    
    print("Document updated successfully!")

    return jsonify({'success': "Nice Job"})

if __name__ == '__main__':
    # Firebase initalization
    # cred = credentials.Certificate("capstonecat-firebase.json") 
    # firebase_admin.initialize_app(cred, {
    #     'storageBucket': 'capstonecat.appspot.com'
    # })
    # db = firestore.client()

    # ChatGPT
    openai.api_key = apiKey

    # Start flask 
    # app.run(debug=True)
    app.run()
