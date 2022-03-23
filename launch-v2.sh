#!/bin/bash


echo 'Please enter name for new s3 bucket (must be unique)'

read s3bucketname
s3bucketname=${s3bucketname:-devops-project-steve-v2}

echo $s3bucketname

aws s3 mb s3://$s3bucketname --region us-west-2

aws s3api put-bucket-versioning --bucket $s3bucketname --versioning-configuration Status=Enabled --region us-west-2

aws cloudformation package --s3-bucket $s3bucketname --template-file samv2/api-template.yaml --output-template-file samv2/gen/template-generated.yaml

aws cloudformation deploy --template-file samv2/gen/template-generated.yaml --stack-name Serverless-Apps-v2 --capabilities CAPABILITY_IAM

aws cloudformation deploy --template-file create-repo-v2.yml --stack-name create-repo-v2

aws cloudformation deploy --template-file pipeline-v2.yaml --stack-name CICD-Pipeline-v2 --capabilities CAPABILITY_IAM