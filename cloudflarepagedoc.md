# Cloudflare Pages Configuration Documentation

This document provides an overview and step-by-step guide to configuring Cloudflare Pages using a `wrangler.toml` file. It is intended to be self-contained for environments where the reader does not have previous context about Cloudflare Pages or Wrangler configuration.

## Overview

Cloudflare Pages is a platform for building and deploying static sites and full-stack applications. When deploying with Cloudflare Pages, you can use a configuration file (typically named `wrangler.toml`) to specify project settings, build output directories, environment variables, and resource bindings (such as KV namespaces).

## Configuration File Format

Cloudflare Pages supports using both JSON and TOML for configuration. In this guide, we focus on the TOML format. The configuration file acts as the single source of truth for your project’s settings and must contain certain required keys to be valid for Pages deployments.

## Required Fields

The following keys must be included in your `wrangler.toml` file for Cloudflare Pages:

- **`name`**:  
  A unique identifier for your project. This should only include alphanumeric characters and dashes.  
  _Example:_ `name = "my-pages-app"`

- **`pages_build_output_dir`**:  
  Specifies the relative path to the directory where your site’s build process outputs static files. This directory is used by Cloudflare Pages for asset deployment.  
  _Example:_ `pages_build_output_dir = "./dist"`

- **`compatibility_date`**:  
  A date string in the format `YYYY-MM-DD` which tells Cloudflare which version of the Workers runtime to use.  
  _Example:_ `compatibility_date = "2024-10-12"`

## Optional Configuration Sections

### Environment Variables

You can define environment variables that will be accessible in your Pages Functions. They are declared in the `[vars]` section:

```toml
[vars]
API_KEY = "your_api_key"
```

### Resource Bindings

If your project needs to interact with Cloudflare resources (such as KV namespaces), you can declare these bindings. For example, to bind a KV namespace:

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your_kv_namespace_id"
```

### Environment-Specific Overrides

For different deployment environments (such as production or preview), you can override settings using `[env.<environment>]` blocks. For instance:

```toml
[env.production]
pages_build_output_dir = "./build/prod"

[env.production.vars]
API_KEY = "prod_api_key"
```

## Example `wrangler.toml` File

Below is a complete example configuration file:

```toml
# Project settings
name = "my-pages-app"
pages_build_output_dir = "./dist"
compatibility_date = "2024-10-12"

# Global environment variables
[vars]
API_KEY = "your_api_key"

# KV namespace binding (if needed)
[[kv_namespaces]]
binding = "MY_KV"
id = "your_kv_namespace_id"

# Environment-specific configuration for production
[env.production]
pages_build_output_dir = "./build/prod"

[env.production.vars]
API_KEY = "prod_api_key"
```

## Deployment Considerations

- **Build Directory**:  
  Ensure that your build command (e.g., in your CI/CD pipeline) outputs static files to the directory specified by `pages_build_output_dir`.

- **Version Requirements**:  
  Use Wrangler version 3.45.0 or higher to ensure compatibility with Cloudflare Pages configuration.

- **Dashboard Synchronization**:  
  If you have existing settings in the Cloudflare dashboard, you can download them using `npx wrangler pages download config` to help align your `wrangler.toml` file with current project settings.

## Conclusion

By following the guidelines above, you can create a valid `wrangler.toml` configuration file for Cloudflare Pages. This file centralizes your project’s configuration and ensures that your build output and resource bindings are correctly deployed to Cloudflare’s global network.

