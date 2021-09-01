# LabelFlow

LabelFlow is an open-source image labelling tool.

If you want to try the deployed version, you can visit [labeflow.ai](https://labelflow.ai).

You can also build the web application from its source, and serve it from your machine.

## Serving your own LabelFlow

This guide walks you through the steps needed to run a production-ready version of LabelFlow locally.

Before continuing, please have a look at our <a href="./LICENSE">License</a> ⬅️.

**Prerequisites**: You need to have Git, Node (v15.5.0 or above) and Yarn (v1.22.4 or above) installed on your machine.

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
