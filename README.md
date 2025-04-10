# Monorepo Project with Next.js Frontend and Lambda Backend

This project is a monorepo containing a Next.js frontend with Shadcn UI and a TypeScript Lambda backend with AWS infrastructure defined in Terraform.

## Project Structure

- `/backend` - Lambda functions with TypeScript
- `/frontend` - Next.js application with TailwindCSS and Shadcn UI
- `/shared` - Shared types and schemas
- `/terraform` - AWS infrastructure configuration

## Features

### Backend
- AWS Lambda functions
- Node.js with TypeScript
- PostgreSQL database connection
- Lint pre-commit hooks

### Frontend
- Next.js with React
- TailwindCSS for styling
- Shadcn UI component library
- State management with Zustand
- Test cases with Jest
- Internationalization with i18n
- SonarQube setup for code quality analysis

## Getting Started

### Prerequisites

- Node.js 16+
- AWS CLI configured
- Terraform installed
- PostgreSQL (for local development)

### Setup

1. Install dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd frontend
npm install
