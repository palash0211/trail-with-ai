provider "aws" {
  region = var.aws_region
}

# Create a random string for resource naming
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# Create an S3 bucket for Lambda deployment packages
resource "aws_s3_bucket" "lambda_bucket" {
  bucket = "lambda-deployment-${random_string.suffix.result}"
  
  tags = {
    Name        = "Lambda Deployment Bucket"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Block public access to the S3 bucket
resource "aws_s3_bucket_public_access_block" "lambda_bucket_block_public" {
  bucket = aws_s3_bucket.lambda_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Create IAM role for Lambda execution
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda-exec-role-${random_string.suffix.result}"

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

  tags = {
    Name        = "Lambda Execution Role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach policies to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Create CloudWatch log group for Lambda functions
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Create a shared security group for Lambda functions
resource "aws_security_group" "lambda_sg" {
  name        = "lambda-sg-${random_string.suffix.result}"
  description = "Security group for Lambda functions"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "Lambda Security Group"
    Environment = var.environment
    Project     = var.project_name
  }
}
