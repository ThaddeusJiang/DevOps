modify `terraform.tfvars` file

```sh
cp terraform.tfvars.example terraform.tfvars
```

run terraform

```sh
terraform init
terraform import aws_amplify_app.develop <app-id>

terraform plan -out develop

terraform apply "develop"
```
