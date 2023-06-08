provider "azurerm" {
  features {}
}

variable "resource_group_name" {
  type = string
}


variable "app_service_plan_name" {
  type = string
}

variable "app_service_name" {
  type = string
}

data "azurerm_resource_group" "default" {
  name = var.resource_group_name
}

data "azurerm_service_plan" "default" {
  name                = var.app_service_plan_name
  resource_group_name = data.azurerm_resource_group.default.name

}

resource "azurerm_linux_web_app" "default" {
  name                = var.app_service_name
  resource_group_name = data.azurerm_resource_group.default.name
  location            = data.azurerm_service_plan.default.location
  service_plan_id     = data.azurerm_service_plan.default.id

  site_config {
    application_stack {
      docker_image     = "mojitoapp"
      docker_image_tag = "latest"
    }
  }
}
