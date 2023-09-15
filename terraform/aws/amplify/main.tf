resource "aws_amplify_app" "app" {
  name        = var.app_name
  repository  = var.repository
  oauth_token = var.oauth_token
}

resource "aws_amplify_branch" "dev" {
  app_id      = aws_amplify_app.app.id
  branch_name = "dev"
}

resource "aws_amplify_domain_association" "dev" {
  app_id                = aws_amplify_app.app.id
  domain_name           = var.domain_name
  wait_for_verification = false

  sub_domain {
    branch_name = aws_amplify_branch.dev.branch_name
    prefix      = "dev"
  }
}
