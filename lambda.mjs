import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.finance_tracker || "finance_tracker";

export const handler = async (event, context) => {
  let response;

  switch (event.httpMethod) {
    case "GET":
      // Return a single transaction if an ID is provided
      if (event.pathParameters && event.pathParameters.id) {
        response = await handleGetSingleRequest(event.pathParameters.id);
      } else {
        response = await handleGetRequest();
      }
      break;
    case "POST":
      response = await handlePostRequest(event, context);
      break;
    case "PATCH":
      response = await handlePatchRequest(event);
      break;
    case "DELETE":
      response = await handleDeleteRequest(event);
      break;
    default:
      response = {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid request type",
          event,
          context,
        }),
      };
  }

  return response;
};

const handleGetRequest = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });
  const result = await docClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

const handleGetSingleRequest = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });
  const result = await docClient.send(command);

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Transaction not found" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
};

const handlePostRequest = async (event, context) => {
  const { date, description, category, amount, type } = JSON.parse(event.body);

  if (!date || !description || !category || !amount || !type) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required fields" }),
    };
  }

  // Use context.awsRequestId as a unique identifier
  const transaction = {
    id: context.awsRequestId,
    date,
    description,
    category,
    amount: Number(amount),
    type,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: transaction,
  });

  await docClient.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify(transaction),
  };
};

export const handlePatchRequest = async (event) => {
  const { id, date, description, category, amount, type } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing transaction id" }),
    };
  }

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "set #d = :d, description = :desc, category = :cat, amount = :amt, #t = :t",
    ExpressionAttributeNames: {
      "#d": "date",
      "#t": "type",
    },
    ExpressionAttributeValues: {
      ":d": date,
      ":desc": description,
      ":cat": category,
      ":amt": Number(amount),
      ":t": type,
    },
    ReturnValues: "ALL_NEW",
  });

  const result = await docClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Transaction updated successfully",
      transaction: result.Attributes,
    }),
  };
};

const handleDeleteRequest = async (event) => {
  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing transaction id" }),
    };
  }

  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  });

  const result = await docClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Transaction deleted successfully",
      transaction: result.Attributes,
    }),
  };
};
