<div id="top"></div>

<br />
<div align="center">
   <a href="https://github.com/labelflow/labelflow/">
    <img alt="babel" src="typescript/web/public/static/icon-512x512.png" width="160">
  </a>

  <h3 align="center">LabelFlow</h3>

  <p align="center">
    The open platform for image labeling
    <br />
    <a href="https://docs.labelflow.ai/">Explore docs</a>
    ·
    <a href="https://github.com/labelflow/labelflow/issues/new?assignees=&labels=bug&template=bug_report.md&title=">Report Bug</a>
  </p>
</div>
<br />
<br />

---

# ⚠️ This repository is deprecated ⚠️

Unfortunately, we had to stop working on the project 😿

But the project is open source! You're free to reuse the code as you want as-long as it complies with the [license](LICENCE) 🚀

---

## About

<img width="100%" alt="LabelFlow Screenshot" src="https://czeqiukmkichqmwlshce.supabase.in/storage/v1/object/public/labelflow-images/hero-image.jpg">

# Visual Data for absolutely everyone

LabelFlow is an open platform for image labeling. Its source code is entirely available on this Github repository. You are in charge of your own data and workflows.

LabelBox, Roboflow, v7labs and other Image labeling tools are are awesome. They made our lives massively easier when we needed to label data. However, most tools are very limited in terms of control and customisations.

That's where LabelFlow came in. Self-hosted or hosted by us. White-label by design. API-driven and ready to be deployed on your own domain. Full control over your images and labels.

Sterblue was the parent company developing LabelFlow, and commercializing an hosted version.

You can build LabelFlow from source, and serve it from your machine. Read how to [deploy it yourself](#serving-your-own-labelflow).

### Built With

- [TypeScript](https://www.typescriptlang.org/): Main programming language of the web app
- [ReactJS](https://reactjs.org/): View library of the web app
- [NodeJS](https://nodejs.org/en/): Javascript runtime for development and production on docker
- [NextJS](https://nextjs.org/): Web framework of the web app
- [GraphQL](https://graphql.org/): API, communication between client and server
- [Prisma](https://www.prisma.io/): Next-generation Node.js and TypeScript ORM
- [Python](https://www.python.org/) for the machine learning server
- [PyTorch](https://pytorch.org/) for the machine learning server

## Getting Started

### ~~LabelFlow.ai hosted version~~

~~You can use our hosted version now for free, at [labeflow.ai](https://labelflow.ai).~~

**LabelFlow is now discontinued**, you must build it by yourself by following the steps described in the next section.

### Serving your own LabelFlow

You can serve you own LabelFlow server with one of the solutions below.

#### With Docker Compose

This is the simplest way to get everything up and running as it also starts all the required services.

```text
git submodule update --init
docker compose up -d --build
```

> _Depending on your configuration, some services might take some time to start._

#### With Nods 16 and Yarn

Make sure that Postgres and MinIO are installed on your machine, edit the `.env.development` file according to your needs, then run:

```text
yarn
yarn codegen:all
yarn start:web
```

#### A note on environment variables

You can find the full list of environment variables needed for a fully featured app in the [`.env.development`](https://github.com/labelflow/labelflow/blob/feature/workspaces/.env.development) file. As you can see this file contains variables that are secrets and that should not be committed to your repo. In order to still be able to have secrets you should create:

- an `.env.local` file at the root of the repo and make a copy of it inside the folders `typescript/db`, `typescript/infrastructure` and `typescript/db`. We recommend doing symlinks between the files to avoid having to copy/paste again each file when modifying it

- an `.env.production` file that will be a copy of `.env.development` but with the env var values set to the production ones. This file won't be committed either so you can safely store your secrets here

<p align="right">(<a href="#top">back to top</a>)</p>

## License

LabelFlow sources are entirely available on Github, and LabelFlow is primarily distributed under the terms of the Business Source License (BSL), like our friends at [MariaDB](https://mariadb.com/bsl11/), [Sentry](https://blog.sentry.io/2019/11/06/relicensing-sentry) and [CockroachDB](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/).

As they explain very well, the BSL is the closest thing to open source that we can do without being threatened by external companies. LabelFlow source is available on this repository, you can deploy LabelFlow entirely on premises, and you can contribute to LabelFlow here!

See [LICENSE](https://github.com/labelflow/labelflow/blob/main/LICENSE) for details.

<p align="right">(<a href="#top">back to top</a>)</p>
