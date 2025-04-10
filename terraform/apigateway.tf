# Create an HTTP API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-${var.environment}-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }

  tags = {
    Name        = "${var.project_name} API Gateway"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create a stage for the API Gateway
resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.environment
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 100
    throttling_rate_limit  = 50
  }

  tags = {
    Name        = "${var.project_name} API Stage"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create routes for the API Gateway
resource "aws_apigatewayv2_route" "login_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /auth/login"
  target    = "integrations/${aws_apigatewayv2_integration.login_integration.id}"
}

resource "aws_apigatewayv2_route" "register_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /auth/register"
  target    = "integrations/${aws_apigatewayv2_integration.register_integration.id}"
}

resource "aws_apigatewayv2_route" "get_user_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /user"
  target    = "integrations/${aws_apigatewayv2_integration.get_user_integration.id}"
}

# Create integrations between API Gateway and Lambda functions
resource "aws_apigatewayv2_integration" "login_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.lambda_functions[0].invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "register_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.lambda_functions[1].invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_user_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.lambda_functions[2].invoke_arn
  payload_format_version = "2.0"
}
