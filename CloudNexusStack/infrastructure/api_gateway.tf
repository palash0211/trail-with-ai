# API Gateway HTTP API
resource "aws_apigatewayv2_api" "lambda" {
  name          = "${var.project_name}-${var.environment}-api-gateway"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["http://localhost:5000", "https://yourdomain.com"]
    allow_methods = ["GET", "POST", "PUT", "DELETE"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
  
  tags = local.common_tags
}

# API Gateway stage
resource "aws_apigatewayv2_stage" "lambda" {
  api_id      = aws_apigatewayv2_api.lambda.id
  name        = var.environment
  auto_deploy = true
  
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    
    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
  
  tags = local.common_tags
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"
  
  retention_in_days = 30
  
  tags = local.common_tags
}

# API Gateway integration for login Lambda
resource "aws_apigatewayv2_integration" "login" {
  api_id             = aws_apigatewayv2_api.lambda.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.login.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

# API Gateway route for login
resource "aws_apigatewayv2_route" "login" {
  api_id    = aws_apigatewayv2_api.lambda.id
  route_key = "POST /auth/login"
  target    = "integrations/${aws_apigatewayv2_integration.login.id}"
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "login" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.login.function_name
  principal     = "apigateway.amazonaws.com"
  
  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

# API Gateway integration for register Lambda
resource "aws_apigatewayv2_integration" "register" {
  api_id             = aws_apigatewayv2_api.lambda.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.register.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

# API Gateway route for register
resource "aws_apigatewayv2_route" "register" {
  api_id    = aws_apigatewayv2_api.lambda.id
  route_key = "POST /auth/register"
  target    = "integrations/${aws_apigatewayv2_integration.register.id}"
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "register" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register.function_name
  principal     = "apigateway.amazonaws.com"
  
  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

# API Gateway integration for get user Lambda
resource "aws_apigatewayv2_integration" "get_user" {
  api_id             = aws_apigatewayv2_api.lambda.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_user.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

# API Gateway route for get user
resource "aws_apigatewayv2_route" "get_user" {
  api_id    = aws_apigatewayv2_api.lambda.id
  route_key = "GET /user/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.get_user.id}"
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "get_user" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_user.function_name
  principal     = "apigateway.amazonaws.com"
  
  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}
