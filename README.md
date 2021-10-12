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
    <a href="https://labelflow.ai/local"><strong>Try it now »</strong></a>
    <br />
    <br />
    <a href="https://labelflow.gitbook.io/labelflow/">Explore docs</a>
    ·
    <a href="https://github.com/labelflow/labelflow/issues/new?assignees=&labels=bug&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://labelflow.canny.io/">Request Feature</a>
    ·
    <a href="https://discord.gg/sHtanUQA2V">Join the Community</a>
  </p>
</div>
<br />
<br />

## About

LabelFlow is an open platform for image labeling. Its source is entirely available on this Github repository.

[Labelflow.ai](https://labelflow.ai) is the parent company developing LabelFlow, and commercializing a Hosted version. 

You can also build LabelFlow from source, and serve it from your machine. Read how to [deploy it yourself](#running-labelflow-on-your-machine).

### Built With

* [TypeScript](https://www.typescriptlang.org/): Main programming language of the web app
* [ReactJS](https://reactjs.org/): View library of the web app
* [NextJS](https://nextjs.org/): Web framework of the web app
* [GraphQL](https://graphql.org/): API, communication between client and server, and service worker
* [NodeJS](https://nodejs.org/en/): Javascript runtime for development and production on docker 
* [Python](https://www.python.org/) for the machine learning server
* [PyTorch](https://pytorch.org/) for the machine learning server

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### LabelFlow.ai hosted version

You can use our hsoted version now for free, at [labeflow.ai](https://labelflow.ai).

### Serving your own LabelFlow

This guide walks you through the steps needed to run a production-ready version of LabelFlow locally.

Before continuing, please have a look at our <a href="./LICENSE">License</a> ⬅️.

#### Prerequisites

You need to have below listed softwares installed on your machine to run labelflow.
     
   - ✔️ Git 📦
   - ✔️ Node (v15.5.0 or above) 📦
   - ✔️ Yarn (v1.22.4 or above) 📦


#### Running LabelFlow on your machine

1. Clone the repository on your machine using  

   ```shell
   git clone https://github.com/labelflow/labelflow.git
   ```

2. Go into the labelflow folder

    ```shell
    cd labelflow
    ```

3. Install dependencies using yarn

    ```shell
    yarn install
    ```

4. Build the web app

    ```shell
    yarn build:web
    ```

5. Start the web server

    ```shell
    yarn start:web
    ```

6. Open your browser and visit [http://localhost:3000](http://localhost:3000).

<p align="right">(<a href="#top">back to top</a>)</p>


## Roadmap

* The short term road map is on Github https://github.com/labelflow/labelflow/projects/1
* The longer term feature road map is on Canny https://labelflow.canny.io/

<p align="right">(<a href="#top">back to top</a>)</p>

## License

LabelFlow sources is entirely available on Github, and LabelFlow is primarily distributed under the terms of the Business Source License (BSL), like our friends at [MariaDB](https://mariadb.com/bsl11/), [Sentry](https://blog.sentry.io/2019/11/06/relicensing-sentry) and [CockroachDB](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/). As they explain very well, the BSL is the closest thing to open source that we can do without being threatened by external companies.

See [LICENSE](https://github.com/labelflow/labelflow/blob/main/LICENSE) for details.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

* Discord Community https://discord.gg/sHtanUQA2V
* Website https://labelflow.ai/website
* Twitter https://twitter.com/labelflowai
* LinkedIn https://www.linkedin.com/company/labelflow/
* Facebook https://facebook.com/labelflow-102033695440701

<p align="right">(<a href="#top">back to top</a>)</p>
