#!/bin/bash

kubectl rollout restart statefulset postgres-statefulset -n idp
kubectl rollout restart statefulset keycloak -n idp
kubectl rollout restart deployment gateway-istio -n istio-ingress