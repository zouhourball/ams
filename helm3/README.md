# Sso

Sso is an identity service that uses OpenID Connect to drive authentication for other apps.
Sso acts as a portal to other identity providers through "connectors." This lets sso defer authentication to LDAP servers, SAML providers, or established identity providers like GitHub, Google, and Active Directory. Clients write their authentication logic once to talk to sso, then sso handles the protocols for a given backend.

## TL;DR

```bash
$ helm install  meeraspace/sso-be
```

## Introduction

This chart bootstraps a Sso deployment on a Kubernetes cluster using the Helm package manager.

## Dependencies

- Postgres

- AccessControl

## Installing the Chart

To install the chart with the release name `my-release`:

```bash
$ helm install --name my-release stable/redis
```

The command deploys Redis on the Kubernetes cluster in the default configuration.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```bash
$ helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.
