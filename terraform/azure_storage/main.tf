terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 2.26"
    }
  }

  required_version = ">= 0.14.9"
}

provider "azurerm" {
  features {}
}

variable "resource_group_name" {
  type = string
}

variable "storage_account_name" {
  type = string
}

data "azurerm_resource_group" "dev" {
  name = var.resource_group_name
}

resource "azurerm_storage_account" "staging" {
  name                     = var.storage_account_name
  resource_group_name      = data.azurerm_resource_group.dev.name
  location                 = data.azurerm_resource_group.dev.location
  account_tier             = "Standard"
  account_replication_type = "RAGRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }
}

