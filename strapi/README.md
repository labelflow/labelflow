# Strapi application for Labelflow CMS

This uses NPM, for compatibility reasons (See https://github.com/strapi/strapi/issues/9109)

## Run

To run it:

```
cd <this folder>
npm install
npm run develop
```

## Deploy

To deploy it:

Follow this https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/heroku.html

Then once setup is done, to redeploy each time, do:

```
git subtree push --prefix strapi heroku main
```

## How was this setup ?

It was setup with:

```
npx create-strapi-app labelflow --use-npm
```

Then: using Custom settings, Preset yes, Preset Blog, database Postgres

