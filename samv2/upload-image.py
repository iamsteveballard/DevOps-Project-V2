import json
import base64
import boto3
import logging
from botocore.exceptions import ClientError
import os

s3_client = boto3.client('s3')

def lambda_handler(event, context):

    # Get JWT Token from header and decode it to get username
    jwt = event['headers']['Authorization']
    header, payload, signature = jwt.split(".")
    encoded_payload = payload.encode()
    padding = b'=' * (4 - (len(encoded_payload) % 4))
    padded_payload = encoded_payload + padding
    decoded_payload = base64.urlsafe_b64decode(padded_payload)
    decoded_username = json.loads(decoded_payload)['cognito:username']
    
    try:
        filename=json.loads(event['body'])['filename']
        
        # Which s3 bucket to look in
        bucket_name = os.environ['IMAGES_BUCKET']
        print(bucket_name)
        # How long the presigned_url will be valid for
        expiration = 1000
        # Get filename from Event body
        filename=json.loads(event['body'])['filename']
        # Create s3_key
        s3_key = decoded_username+'/'+filename
        print(s3_key)
        # Get list of all images in user's prefix with one s3 API call to minimize extra calls
        getList = s3_client.list_objects_v2(Bucket=bucket_name,Prefix=decoded_username)
        print(getList)

        # Check to see if user has any uploads
        if 'Contents' not in getList:
            print('First upload from user')
            presigned_url = s3_client.generate_presigned_post(bucket_name, s3_key, Fields=None, Conditions=None, ExpiresIn=expiration)
            response = json.dumps({'imageExists': False, 'postData': presigned_url})
        # Check to see if user has reached photo limit
        elif getList['KeyCount'] > 9:
            print('Maximum number of images reached')
            response =json.dumps({'maxLimit': True})       
        # Check to see if photo exists in s3 bucket
        # Return presigned_url link if it does
        elif any(i['Key'] == s3_key for i in getList['Contents'][:]):
            print("Key exists in the bucket.")
            getImage = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name,'Key': s3_key}, ExpiresIn=expiration)
            response = json.dumps({'imageExists': True, 'url': getImage})    
        # Or if it doesn't exist, return presigned_post link for user to upload photo             
        else:
            print("Key doesn't exist in the bucket.")
            presigned_url = s3_client.generate_presigned_post(bucket_name, s3_key, Fields=None, Conditions=None, ExpiresIn=expiration)
            response = json.dumps({'imageExists': False, 'postData': presigned_url})
        
    except ClientError as e:
        logging.error(e)
        print('signed url failed')

    print('response:',response)
    statusCode = 200
    return {
        "statusCode": statusCode,
        "body": response,
        "headers": {
            'Access-Control-Allow-Origin': '*',
        }
    }