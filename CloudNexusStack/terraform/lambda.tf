# Create a zip file for each Lambda function
data "archive_file" "lambda_zip" {
  count = length(var.lambda_functions)

  type        = "zip"
  source_dir  = "${path.module}/../backend/dist"
  output_path = "${path.module}/build/${var.lambda_functions[count.index].name}.zip"
}

# Upload the Lambda zip files to S3
resource "aws_s3_object" "lambda_code" {
  count = length(var.lambda_functions)

  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "${var.lambda_functions[count.index].name}/${filemd5(data.archive_file.lambda_zip[count.index].output_path)}.zip"
  source = data.archive_file.lambda_zip[count.index].output_path
  etag   = filemd5(data.archive_file.lambda_zip[count.index].output_path)
}

# Create Lambda functions
resource "aws_lambda_function" "lambda_functions" {
  count = length(var.lambda_functions)

  function_name = "${var.project_name}-${var.environment}-${var.lambda_functions[count.index].name}"
  description   = "Lambda function for ${var.lambda_functions[count.index].name}"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = var.lambda_functions[count.index].handler
  runtime       = var.lambda_functions[count.index].runtime
  
  s3_bucket         = aws_s3_bucket.lambda_bucket.id
  s3_key            = aws_s3_object.lambda_code[count.index].key
  source_code_hash  = filemd5(data.archive_file.lambda_zip[count.index].output_path)
  
  memory_size = var.lambda_functions[count.index].memory
  timeout     = var.lambda_functions[count.index].timeout

  environment {
    variables = {
      PGHOST     = aws_db_instance.postgres.address
      PGUSER     = var.db_username
      PGPASSWORD = var.db_password
      PGDATABASE = var.db_name
      PGPORT     = tostring(var.db_port)
      NODE_ENV   = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private_subnet[*].id
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.lambda_logs
  ]

  tags = {
    Name        = "${var.project_name}-${var.environment}-${var.lambda_functions[count.index].name}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Allow API Gateway to invoke Lambda functions
resource "aws_lambda_permission" "api_gateway" {
  count = length(var.lambda_functions)

  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_functions[count.index].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
