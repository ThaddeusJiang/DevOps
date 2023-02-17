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


resource "azurerm_frontdoor" "app" {
  name                                         = "jjaa-jiang"
  resource_group_name                          = "application-jjaa-dev"
  enforce_backend_pools_certificate_name_check = false

  # Front door must always contain the default associated frontend endpoint: 'jjaa-jiang.azurefd.net'.
  frontend_endpoint {
    name                     = "defaultHostName"
    host_name                = "jjaa-jiang.azurefd.net"
    session_affinity_enabled = true
  }

  frontend_endpoint {
    name                     = "frontdoor1"
    host_name                = "frontdoor1.jjaa.dev"
    session_affinity_enabled = true
  }

  frontend_endpoint {
    name                     = "jiang-dev"
    host_name                = "jiang-dev.jjaa.dev"
    session_affinity_enabled = true
  }

  backend_pool_load_balancing {
    name = "devLoadBalancingSettings"
  }

  backend_pool_health_probe {
    name = "devHealthProbeSetting"
    path = "/api/version"
  }

  backend_pool {
    name = "backend"
    backend {
      host_header = "jjaa-dev.azurewebsites.net"
      address     = "jjaa-dev.azurewebsites.net"
      http_port   = 80
      https_port  = 443
    }

    load_balancing_name = "devLoadBalancingSettings"
    health_probe_name   = "devHealthProbeSetting"
  }

  routing_rule {
    name               = "https"
    accepted_protocols = ["Https"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["frontdoor1", "jiang-dev"]
    forwarding_configuration {
      forwarding_protocol = "HttpsOnly"
      backend_pool_name   = "backend"
    }
  }

  # only allow https
  routing_rule {
    name               = "http-redirect-https"
    accepted_protocols = ["Http"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["frontdoor1", "jiang-dev"]
    redirect_configuration {
      redirect_protocol = "HttpsOnly"
      redirect_type     = "Found"
    }
  }

}

data "azurerm_key_vault" "vault" {
  name                = "jjaa-dev"
  resource_group_name = "application-jjaa-dev"
}

resource "azurerm_frontdoor_custom_https_configuration" "frontdoor1" {
  frontend_endpoint_id              = azurerm_frontdoor.app.frontend_endpoints["frontdoor1"]
  custom_https_provisioning_enabled = true

  custom_https_configuration {
    certificate_source                      = "AzureKeyVault"
    azure_key_vault_certificate_secret_name = "certwithpk"
    azure_key_vault_certificate_vault_id    = data.azurerm_key_vault.vault.id
  }
}

resource "azurerm_frontdoor_custom_https_configuration" "jiang-dev" {
  frontend_endpoint_id              = azurerm_frontdoor.app.frontend_endpoints["jiang-dev"]
  custom_https_provisioning_enabled = true

  custom_https_configuration {
    certificate_source                      = "AzureKeyVault"
    azure_key_vault_certificate_secret_name = "certwithpk"
    azure_key_vault_certificate_vault_id    = data.azurerm_key_vault.vault.id
  }
}
