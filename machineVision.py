import cv2
import firebase_admin
from firebase_admin import credentials, storage
import time

def machineVision(input_image_path):

    ##Important Links: 
    ##Main Source: https://www.kaggle.com/code/chienhsianghung/object-detection-using-opencv-inference/notebook
    ##For Actual Labels.txt: https://github.com/amikelive/coco-labels/blob/master/coco-labels-paper.txt

    output_image_path = 'objectImage.jpg' ##CAN CHANGE

    MINIMUM_THRESHOLD=0.5 #This is the minimum confidence threshold of which the model will show detected objects
    config_file  = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
    frozen_model = 'frozen_inference_graph.pb'
    file_name    = 'Labels.txt' 

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
    #img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

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

cred = credentials.Certificate("capstonecat-firebase.json") 
firebase_admin.initialize_app(cred, {
    'storageBucket': 'capstonecat.appspot.com'
})

# Reference to the storage bucket
bucket = storage.bucket()

def spamUpdate():
    imgFire = bucket.blob("streaming/latestImage.jpg")
    imgFireProcessed = bucket.blob('streaming/objectImage.jpg')

    # Download the latest image
    imgFire.download_to_filename('latestImage.jpg')
    print("Latest image downloaded.")

    # Process the image (assuming machineVision() is your processing function)
    machineVision('latestImage.jpg')
    print("Image processed.")

    # Upload the processed image
    imgFireProcessed.upload_from_filename("objectImage.jpg")
    print("Processed image uploaded.")

    # # Close the file handles
    # imgFire.close()
    # imgFireProcessed.close()

while True:
    spamUpdate()
    time.sleep(2)