# Mediapart RSS
Mediapart RSS est un petit serveur HTTP créé pour créer des flux RSS à partir de Médiapart.

## Pourquoi ?
Lorsque j'ai voulu configuré un système de flux RSS pour mon [glance](https://github.com/glanceapp/glance), j'ai voulu ajouter Médiapart dans ces flux. J'ai donc créé ces flux RSS qui récupèrent les dernières publications de Médiapart et les convertissent en flux RSS.

## Installation
### Prérequis
- Bun

### Installation
1. Clonez le dépôt : `git clone https://github.com/oriionn/mediapart-rss.git`
2. Installez les dépendances : `bun install`
3. Lancez le serveur : `bun start`

### Utilisation
Il y a deux flux RSS disponibles :
- `/investigation` qui récupère les dernières enquêtes de Médiapart.
- `/news` qui récupère les dernières dépêches AFP publiés sur Médiapart.

Il y a également deux paramètres disponibles (optionnels) :
- `limit` : limite le nombre d'articles retournés (par défaut : 10)
- `format` : format de sortie (par défaut : rss)
  Les formats disponibles sont :
  - `json` : retourne les données au format JSON
  - `rss` : retourne les données au format RSS 2.
  - `atom` : retourne les données au format Atom 1.0.
