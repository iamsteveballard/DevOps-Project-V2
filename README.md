# DevOps-Project

## What does it do?

Uses AWS Cloudformation to build and deploy a React App to a single EC2 Instance and connects it to API Gateway, Cognito, and a Lambda function. 

Video walkthrough:

https://www.youtube.com/watch?v=RAxxRytInzo

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
git clone https://github.com/iamsteveballard/DevOps-Project.git
```

## Step 2: Create a new CodeCommit Repository

``` 
cd DevOps-Project
aws cloudformation deploy --template-file create-repo.yml --stack-name create-repo
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

Then run launch.sh bash script. Will take a while, head to the AWS CloudFormation console to follow along with the progress.
```
bash launch.sh
```