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

variable "static_site_name" {
  type = string
}

data "azurerm_resource_group" "default" {
  name = var.resource_group_name
}

resource "azurerm_static_site" "default" {
  name                = var.static_site_name
  resource_group_name = data.azurerm_resource_group.default.name
  location            = data.azurerm_resource_group.default.location
}
