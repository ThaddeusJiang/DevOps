# Step1: setup Cosmos DB
# Step2: setup Function App

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.46.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "preview" {
  name = "devops-mojito-preview"
}

# Step1: setup Cosmos DB
resource "azurerm_cosmosdb_account" "preview" {
  name                = "mojito-admin-preview"
  location            = azurerm_resource_group.preview.location
  resource_group_name = azurerm_resource_group.preview.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  enable_automatic_failover = true

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    location          = azurerm_resource_group.preview.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "mojito" {
  name                = "mojito"
  resource_group_name = azurerm_cosmosdb_account.preview.resource_group_name
  account_name        = azurerm_cosmosdb_account.preview.name
}

resource "azurerm_cosmosdb_sql_container" "service_management" {
  name                  = "ServiceManagement"
  resource_group_name   = azurerm_cosmosdb_account.preview.resource_group_name
  account_name          = azurerm_cosmosdb_account.preview.name
  database_name         = azurerm_cosmosdb_sql_database.mojito.name
  partition_key_path    = "/_partition"
  partition_key_version = 1
  default_ttl           = -1

  indexing_policy {
    indexing_mode = "Consistent"

    included_path {
      path = "/*"
    }
  }
}

# Step2: setup Function App
resource "azurerm_storage_account" "preview" {
  name                     = "mojitoadminpreview"
  resource_group_name      = azurerm_resource_group.preview.name
  location                 = azurerm_resource_group.preview.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_app_service_plan" "preview" {
  name                = "devops-admin-functions-preview"
  location            = azurerm_resource_group.preview.location
  resource_group_name = azurerm_resource_group.preview.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "preview" {
  name                       = "mojito-admin-preview"
  location                   = azurerm_resource_group.preview.location
  resource_group_name        = azurerm_resource_group.preview.name
  app_service_plan_id        = azurerm_app_service_plan.preview.id
  storage_account_name       = azurerm_storage_account.preview.name
  storage_account_access_key = azurerm_storage_account.preview.primary_access_key
  os_type                    = "linux"
  version                    = "~3"
}
