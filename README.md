# DevOps-Project-V2

See version 1 here:

https://github.com/iamsteveballard/DevOps-Project

## What does it do?

Version 2 of my AWS Cloudformation project. 

Uses AWS Cloudformation to build and deploy a React App to an S3 bucket and served with a Cloudfront Origin Access Identity. 

Serverless set up with API Gateway, Cognito, DynamoDB and Lambda. 

User can login and upload photos and app will run an image recognition function to identify objects in the image. 

Version 1 video walkthrough and installation instructions:

https://www.youtube.com/watch?v=RAxxRytInzo

Version 2 video walkthrough and code review:

TBD

Version 2 Live Demo:

https://d3smd0g91sm2b2.cloudfront.net/


## Prerequisites: 

- AWS CLI installed

- AWS profile with IAM role configured

Note: Everything is run from AWS::Region us-west-2

Click here for instructions on how to set up your AWS profile:

https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html

```
aws configure
```

## Step 1: Clone Repository

```
git clone https://github.com/iamsteveballard/DevOps-Project-V2.git
```

## Step 2: Create a new CodeCommit Repository

``` 
cd DevOps-Project-V2
aws cloudformation deploy --template-file create-repo-v2.yml --stack-name create-repo-v2
```

## Step 3: Add new CodeCommit Repo as a remote branch
Navigate to AWS CloudFormation console under Stacks 

https://us-west-2.console.aws.amazon.com/cloudformation/home 

Navigate to the Outputs section in the create-repo stack

Copy the CloneRepoUrl and add it as a remote repository
```
git remote add cc <CloneRepoUrl>
```

## Step 4: Push changes to new CodeCommit repository
```
git add .
git commit -m "first upload to CodeCommit repo"
git push cc main
```

## Step 5: Run CloudFormation commands

Then run launch-v2.sh bash script. Will take a while, head to the AWS CloudFormation console to follow along with the progress.
```
bash launch-v2.sh
```
