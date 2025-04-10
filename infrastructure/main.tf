provider "aws" {
  region = var.aws_region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "terraform-state-bucket"
    key    = "monorepo/terraform.tfstate"
    region = "us-east-1"
  }
}

# Create a random string for resources that need unique names
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Common tags for all resources
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
