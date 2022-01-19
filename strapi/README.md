# Strapi application for LabelFlow CMS

This uses NPM, for compatibility reasons (See https://github.com/strapi/strapi/issues/9109)

## Run

To run it:

```text
cd <this folder>
npm install
npm run develop
```

## Deploy

To deploy it:

Follow this https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/heroku.html

Then once setup is done, to redeploy each time, do:

```text
git subtree push --prefix strapi heroku main
```

To see production logs:

```text
heroku logs --tail 
```

## How was this setup ?

It was setup with:

```text
npx create-strapi-app labelflow --use-npm
```

Then using Custom settings, Preset yes, Preset Blog, database Postgres. See env vars in Heroku LabelFlow organization here https://dashboard.heroku.com/apps/labelflow-strapi/settings.

Then I added the Sendgrid plugin to send emails (See https://strapi.io/documentation/developer-docs/latest/development/plugins/email.html)
