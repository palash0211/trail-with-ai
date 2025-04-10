output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = aws_apigatewayv2_stage.lambda.invoke_url
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "ID of the Cognito Client"
  value       = aws_cognito_user_pool_client.client.id
}

output "db_endpoint" {
  description = "Endpoint of the RDS database"
  value       = aws_db_instance.postgres.endpoint
}

output "lambda_function_names" {
  description = "Names of the Lambda functions"
  value = {
    login    = aws_lambda_function.login.function_name
    register = aws_lambda_function.register.function_name
    get_user = aws_lambda_function.get_user.function_name
  }
}
