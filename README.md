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
