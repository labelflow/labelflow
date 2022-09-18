#!/usr/bin/env bash

export KEYCLOAK_HOME=/opt/jboss/keycloak
export PATH="$PATH:$KEYCLOAK_HOME/bin"

export ADMIN_CREDENTIALS="--no-config --server http://keycloak:8080/auth --user ${KEYCLOAK_USER} --password ${KEYCLOAK_PASSWORD} --realm master"

kcadm.sh create users \
    $ADMIN_CREDENTIALS \
    -r LabelFlow \
    -s username=labelflow \
    -s enabled=true

kcadm.sh set-password \
    $ADMIN_CREDENTIALS \
    -r LabelFlow \
    --username labelflow \
    --new-password labelflow
