# labelflow

The open standard image labeling tool

## How to start the docker compose

_The workflow needs to be improved_

1. Make sure you have docker installed and started

2. Run the docker compose in detached mode

```bash
docker compose up -d
```

3. Apply the database migrations

```bash
cd typescript/db
yarn install
yarn push
```

4. Restart the api container

```bash
docker restart labelflow_api_1
```

You should now be able to visit [http://localhost:5001/graphql/](http://localhost:5001/graphql/)
