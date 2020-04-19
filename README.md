Commando-covid

## Requirement

- Python 3
- Python 3 PIP
- Python 3 Virtual Env
- NodeJS 12 (LTS)
- PostgreSql 11.6

`sudo apt install python3 python3-pip python3-venv`

## Configure Python environment

In `commando-covid` directory:

```
    python3 -m venv venv
    source venv/bin/activate
```

##Configure backend environment:

Copy the file below onto ```server/.env``` with your proper settings.

```shell script
export APP_SETTINGS="config.DevelopmentConfig"
export PG_COVID_USER="covid"
export PG_COVID_PASSWORD="dummy"
export PG_COVID_HOST="localhost"
export PG_COVID_PORT="5555"
export PG_COVID_DB_NAME="commando_db"
```

Then run

```shell script
source server/.env
```


## To install the project

`make install` to install needed packages

## To start the project

`make -C server start` to run the API
`make start` to run the frontend


## Base de données:

Les modèles de bases de données sont situés dans le répertoire server/db_model/models

On utilise alembic https://alembic.sqlalchemy.org/en/latest/autogenerate.html pour les migrations/évolutions de la base de données  

Pour appliquer une mise à jour du schéma de la base de données il faut donc faire:

```bash
python server d_manege.py db migrate
python server d_manege.py db upgrade
```

**Attention:** Comme le précise Alembic certains changements ne sont pas détectés par la migration automatique:
*  Changes of table name. These will come out as an add/drop of two different tables, and should be hand-edited into a name change instead.

*  Changes of column name. Like table name changes, these are detected as a column add/drop pair, which is not at all the same as a name change.

*  Anonymously named constraints. Give your constraints a name, e.g. UniqueConstraint('col1', 'col2', name="my_name"). See the section The Importance of Naming Constraints for background on how to configure automatic naming schemes for constraints.


Dans ce cas il faudra effectuer une migration manuelle (cf. lien ci-dessus)
