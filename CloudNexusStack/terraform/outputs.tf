output "api_gateway_url" {
  description = "Base URL for API Gateway stage"
  value       = aws_apigatewayv2_stage.api_stage.invoke_url
}

output "database_endpoint" {
  description = "The connection endpoint for the PostgreSQL database"
  value       = aws_db_instance.postgres.endpoint
}

output "lambda_function_names" {
  description = "Names of the deployed Lambda functions"
  value       = [for f in aws_lambda_function.lambda_functions : f.function_name]
}

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket used for Lambda deployment packages"
  value       = aws_s3_bucket.lambda_bucket.bucket
}
