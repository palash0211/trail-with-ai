# IAM role for Lambda functions
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Attach policies to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Lambda function for login
resource "aws_lambda_function" "login" {
  function_name = "${var.project_name}-${var.environment}-login"
  
  s3_bucket = "lambda-deployment-bucket"
  s3_key    = "login.zip"
  
  handler = "login.handler"
  runtime = var.lambda_runtime
  
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout
  
  environment {
    variables = {
      PGDATABASE = var.db_name
      PGHOST     = aws_db_instance.postgres.address
      PGUSER     = var.db_username
      PGPASSWORD = var.db_password
      PGPORT     = aws_db_instance.postgres.port
      DATABASE_URL = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.db_name}"
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.client.id
    }
  }
  
  tags = local.common_tags
}

# Lambda function for register
resource "aws_lambda_function" "register" {
  function_name = "${var.project_name}-${var.environment}-register"
  
  s3_bucket = "lambda-deployment-bucket"
  s3_key    = "register.zip"
  
  handler = "register.handler"
  runtime = var.lambda_runtime
  
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout
  
  environment {
    variables = {
      PGDATABASE = var.db_name
      PGHOST     = aws_db_instance.postgres.address
      PGUSER     = var.db_username
      PGPASSWORD = var.db_password
      PGPORT     = aws_db_instance.postgres.port
      DATABASE_URL = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.db_name}"
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.client.id
    }
  }
  
  tags = local.common_tags
}

# Lambda function for getting user
resource "aws_lambda_function" "get_user" {
  function_name = "${var.project_name}-${var.environment}-get-user"
  
  s3_bucket = "lambda-deployment-bucket"
  s3_key    = "getUser.zip"
  
  handler = "getUser.handler"
  runtime = var.lambda_runtime
  
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout
  
  environment {
    variables = {
      PGDATABASE = var.db_name
      PGHOST     = aws_db_instance.postgres.address
      PGUSER     = var.db_username
      PGPASSWORD = var.db_password
      PGPORT     = aws_db_instance.postgres.port
      DATABASE_URL = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.db_name}"
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.client.id
    }
  }
  
  tags = local.common_tags
}
