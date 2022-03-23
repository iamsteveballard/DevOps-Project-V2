import json
import boto3
import base64
import urllib.parse
import time

rekog_client = boto3.client('rekognition')
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    table = dynamodb.Table('images-v2')
    
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    response = rekog_client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':key}}, MaxLabels=3)

    label_list = {}
    for label in response['Labels']:
        print(label['Name'])
        label_list[label['Name']] = str(label['Confidence'])
        
    for x in key.split('/'):
        print(x)
        
    print('dynamo item')
    user = key.split('/')[0]
    print(user)
    print(key)
    print(label_list)
    
    table.put_item(
        Item={
        'user': user,
        's3_key': key,
        'labels': label_list,
        'ttl' : 600000 + int(time.time())
    })
    
    print('end')
