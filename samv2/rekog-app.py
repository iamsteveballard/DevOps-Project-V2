import json
import boto3
import base64
import urllib.parse
import time

rekog_client = boto3.client('rekognition')
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    # Get the dynamodb table
    table = dynamodb.Table('images-v2')
    
    # Get the bucket and s3 key from the event source mapping
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    # Detect objects in the image
    response = rekog_client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':key}}, MaxLabels=3)

    # Process the labels from the rekognition service
    label_list = {}
    for label in response['Labels']:
        print(label['Name'])
        label_list[label['Name']] = str(round(label['Confidence'], 4))
                
    # Log the data for debugging            
    print('dynamo item')
    user = key.split('/')[0]
    print(user)
    print(key)
    print(label_list)
    
    # Update the DynamoDB entry to include the labels
    table.put_item(
        Item={
        'user': user,
        's3_key': key,
        'labels': label_list,
        'ttl' : 600000 + int(time.time())
    })
    
    print('end')
