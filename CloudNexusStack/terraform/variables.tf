variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "monorepo-app"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "postgres"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Database port"
  type        = number
  default     = 5432
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "appdb"
}

variable "lambda_functions" {
  description = "List of Lambda functions to create"
  type = list(object({
    name    = string
    handler = string
    runtime = string
    timeout = number
    memory  = number
  }))
  default = [
    {
      name    = "login"
      handler = "functions/auth/login.handler"
      runtime = "nodejs18.x"
      timeout = 30
      memory  = 256
    },
    {
      name    = "register"
      handler = "functions/auth/register.handler"
      runtime = "nodejs18.x"
      timeout = 30
      memory  = 256
    },
    {
      name    = "getUser"
      handler = "functions/user/getUser.handler"
      runtime = "nodejs18.x"
      timeout = 30
      memory  = 256
    }
  ]
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for the database subnets"
  type        = list(string)
  default     = ["10.0.5.0/24", "10.0.6.0/24"]
}

variable "availability_zones" {
  description = "Availability zones to use in the region"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}
