import json
import boto3
import base64
from boto3.dynamodb.conditions import Key, Attr
import os

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    
    # Get JWT Token from header and decode it to get username
    jwt = event['headers']['Authorization']
    header, payload, signature = jwt.split(".")
    encoded_payload = payload.encode()
    padding = b'=' * (4 - (len(encoded_payload) % 4))
    padded_payload = encoded_payload + padding
    decoded_payload = base64.urlsafe_b64decode(padded_payload)
    decoded_username = json.loads(decoded_payload)['cognito:username']

    # Which s3 bucket to look in
    bucket_name = os.environ['IMAGES_BUCKET']
    # How long the presigned_url will be valid for
    expiration = 1000
    
    # Get list of all entries in DynamoDB table
    table = dynamodb.Table('images-v2')
    response = table.query(KeyConditionExpression=Key('user').eq(decoded_username))
    items = response['Items']
    
    # Get list of all images in user's prefix with one s3 API call to minimize extra calls
    getList = s3_client.list_objects_v2(Bucket=bucket_name,Prefix=decoded_username)

    # Note: S3 bucket has a lifecycle policy which will delete photos on a schedule
    #       DynamoDB keeps entries a little bit longer but has a TTL

    image_list = {}
    for x in items:
        print(x['s3_key'])
        # Check to see if DynamoDB entry actually exists in s3
        if 'Contents' not in getList:
            print('image not found in s3')
        elif any(i['Key'] == x['s3_key'] for i in getList['Contents'][:]):
            # Create presigned_url link and add it to image_list dictionary
            image_list[x['s3_key']] = {'s3_link':s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name,'Key': x['s3_key']}, ExpiresIn=expiration), 'labels' : x['labels']}
        else:
            print('image not found in s3')
    return {
        'statusCode': 200,
        # return image list in json form
        'body': json.dumps(image_list),
        'headers': {
            'Access-Control-Allow-Origin': '*',
        }
    }
