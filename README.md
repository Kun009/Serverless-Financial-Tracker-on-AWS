# Personal Finance Tracker

A serverless single-page web application to track income and expenses. This project uses AWS Amplify, AWS Lambda, API Gateway, and DynamoDB to create a scalable and fully managed solution.

## Table of Contents

+ [Overview](#overview)
+ [Features](#features)
+ [Architecture](#architecture)
+ [Setup and Deployment](#setup-and-deployment)
+ [Usage](#usage)
+ [Troubleshooting](#troubleshooting)
+ [License](#license)

## Overview

The Personal Finance Tracker allows users to add, edit, and delete transactions. It displays transaction data in a table and visualizes monthly income/expenses and expense breakdown using charts.

## Features

+ Add income and expense transactions  
+ Edit existing transactions  
+ Delete transactions  
+ Display transaction history in a table  
+ Visualize data with monthly bar charts and expense breakdown pie charts  

## Architecture

+ **AWS Amplify**: Hosts and deploys the front-end single-page application.  
+ **AWS API Gateway**: Exposes RESTful endpoints and routes HTTP requests to Lambda.  
+ **AWS Lambda**: Implements CRUD operations (create, read, update, delete) using Node.js.  
+ **AWS DynamoDB**: Stores transaction data in a NoSQL table named `finance_tracker`.

## Setup and Deployment

### 1. Deploy the Front-End with Amplify

+ Connect your GitHub repository to the AWS Amplify Console.
+ Configure the build settings and deploy the app.

### 2. Set Up the Backend

### DynamoDB Table:
+ Create a table named finance_tracker with a primary key id (string).
  
### Lambda Function:
+ Deploy the Lambda function using your preferred method (AWS SAM, Serverless Framework, or via the AWS Console).
+ Set an environment variable finance_tracker if needed.
+ Ensure the Lambda function returns CORS headers.

### API Gateway:
+ Create a new REST API in API Gateway.
+ Set up resources and methods (GET, POST, PATCH, DELETE) to integrate with your Lambda function.
+ Enable Lambda Proxy Integration and configure CORS to allow your front-end access.

### Testing
+ Open the deployed Amplify URL in a web browser.
+ Use the provided form to add a new transaction.
+ Edit a transaction by clicking the Edit button; the form will populate with the selected record's data.
+ Delete a transaction by clicking the Delete button.
+ The transactions table and charts update automatically to reflect the current data in DynamoDB.

### Result from Testing
![Screenshot 2025-02-24 234747](https://github.com/user-attachments/assets/b4762c53-cd31-450b-8b4c-971ad705b315)
![Screenshot 2025-02-24 232217](https://github.com/user-attachments/assets/16ea8b95-b500-46e2-9a68-3f1f12075600)


