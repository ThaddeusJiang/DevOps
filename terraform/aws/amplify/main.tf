
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-northeast-1"
}

variable "NEXT_PUBLIC_AWS_COGNITO_REGION" {
  type = string
}

variable "NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID" {
  type = string
}

variable "NEXT_PUBLIC_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID" {
  type = string
}

variable "NEXT_PUBLIC_GRAPHQL_URI" {
  type = string
}

variable "NEXT_PUBLIC_SENTRY_DSN" {
  type = string
}

variable "NEXT_PUBLIC_SENTRY_ORG" {
  type = string
}

variable "NEXT_PUBLIC_SENTRY_PROJECT" {
  type = string
}

variable "basic_auth_credentials" {
  type      = string
  sensitive = true
}

variable "access_token" {
  type      = string
  sensitive = true
}

resource "aws_amplify_app" "develop" {
  name         = "hello-amplify-nextjs"
  repository   = "https://github.com/ThaddeusJiang/DevOps"
  access_token = var.access_token

  enable_auto_branch_creation = true
  enable_branch_auto_build    = true
  enable_branch_auto_deletion = true
  enable_basic_auth           = true
  basic_auth_credentials      = base64encode(var.basic_auth_credentials)


  # The default patterns added by the Amplify Console.
  auto_branch_creation_patterns = [
    "*",
    "*/**",
  ]

  auto_branch_creation_config {
    # Enable auto build for the created branch.
    enable_auto_build = true
  }

  # The default build_spec added by the Amplify Console for React.
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  environment_variables = {
    NEXT_PUBLIC_AWS_COGNITO_REGION                  = var.NEXT_PUBLIC_AWS_COGNITO_REGION
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID            = var.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID = var.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID
    NEXT_PUBLIC_GRAPHQL_URI                         = var.NEXT_PUBLIC_GRAPHQL_URI
    NEXT_PUBLIC_SENTRY_DSN                          = var.NEXT_PUBLIC_SENTRY_DSN
    NEXT_PUBLIC_SENTRY_ORG                          = var.NEXT_PUBLIC_SENTRY_ORG
    NEXT_PUBLIC_SENTRY_PROJECT                      = var.NEXT_PUBLIC_SENTRY_PROJECT
    "_LIVE_UPDATES" = jsonencode(
      [
        {
          name    = "Amplify CLI"
          pkg     = "@aws-amplify/cli"
          type    = "npm"
          version = "latest"
        },
      ]
    )
  }

  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }

}

resource "aws_amplify_branch" "develop" {
  app_id      = aws_amplify_app.develop.id
  branch_name = "develop"
}

resource "aws_amplify_domain_association" "develop" {
  app_id      = aws_amplify_app.develop.id
  domain_name = "thaddeusjiang.com"

  sub_domain {
    branch_name = aws_amplify_branch.develop.branch_name
    prefix      = "develop"
  }
}
