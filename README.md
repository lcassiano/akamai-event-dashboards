# Akamai Reporting API - todaytraffic-by-time

The project intends to provide a easy way get Akamai todaytraffic-by-time [Reporting API](https://techdocs.akamai.com/reporting/reference/api) and save on Opensearch/Elasticsearch.

## Prerequisites

### Install NodeJS

To Run this project, you will need to install [nodejs](https://nodejs.org/en/download) on your machine.

### Credentials

Before you begin, you need to [Create authentication credentials](https://techdocs.akamai.com/developer/docs/set-up-authentication-credentials) in [Control Center](https://control.akamai.com).

## Get source files

- `git clone https://github.com/lcassiano/akamai-event-dashboards.git`

### Create file .edgerc authentication

Create `.edgerc` file on src folder and put your credentials, an `.edgerc` file contains sections for each of your API client credentials and is usually hosted in your home directory:


```plaintext
[default]
host = akaa-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.luna.akamaiapis.net/
client_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
client_secret = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
access_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
max-body = 131072

[section-name]
host = akaa-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.luna.akamaiapis.net/
client_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
client_secret = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
access_token = akab-XXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXX
max-body = 131072
```

### Create file .env

Create `.env` file on src folder with the following informations :

```plaintext
ELK_USER="testeuser"
ELK_PASS="teste123"
ELK_URL="http://elastic:9200/"
ELK_INDEX_PREFIX="akamai-blackfriday"
```

## Install

- `cd consumer/src`
- `npm install`
- `node main.js`


## Maintainers

- [Leandro Cassiano](https://contacts.akamai.com/lcassian) - Solution Architect LATAM
