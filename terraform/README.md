# Terraform

## Setup

<details>
Install Terraform

```sh
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# To update to the latest, run
brew upgrade hashicorp/tap/terraform

# Verify the installation
terraform -help

# Enable tab completion
terraform -install-autocomplete
```

Install the Azure CLI tool

```sh
brew update && brew install azure-cli

az login  -u username -p password

az account list --output table

az account set --subscription "Name"
```

</details>


## Usage

```sh
terraform init
```
Setup <dev|test|staging|prod> infra

```
terraform workspace new dev
terraform plan -var-file="dev.tfvars.json" -out=dev
terraform apply "dev"

terraform plan -var-file="dev.tfvars.json" -out=dev -destroy
terraform apply "dev"
```