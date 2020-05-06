Commando-covid

## Requirement

- Python 3
- Python 3 PIP
- Python 3 Virtual Env
- NodeJS 12 (LTS)

`sudo apt install python3 python3-pip python3-venv`

## Configure Python environment

In `commando-covid` directory:

```
    python3 -m venv venv
    source venv/bin/activate
```

## To install the project

`make install` to install needed packages

## To start the project

`make -C server start` to run the API
`make start` to run the frontend

## How to configure the initial parameters

Model initial parameters are stored in a JSON file at `src/parameters.json`.

Here is the details explanation of its content:

| Key                      | Type          | Description                                       |
|--------------------------|---------------|---------------------------------------------------|
| population               | Integer       | Initial exposed population                        |
| patient0                 | Integer       | Number of initial infected patients at start      |
| initial_start_date       | ISO 8601 Date | Start date of the experiment                      |
| lockdown_start_date      | ISO 8601 Date | Start date of the lockdown                        |
| deconfinement_start_date | ISO 8601 Date | Start date of the deconfinement                   |
| initial_r0               | Float         | Initial R0 before lockdown                        |
| lockdown_r0              | Float         | R0 during the lockdown                            |
| deconfinement_r0         | Float         | R0 after the lockdown                             |
| initial_tooltip          | String        | Help text displayed besides the initial period R0 |
| lockdown_tooltip         | String        | Help text displayed besides the lockdown R0       |
| deconfinement_tooltip    | String        | Help text displayed besides the deconfinement R0  |
