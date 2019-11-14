# Give your logs more context

This repository is the implementation of the ideas from "Give your logs more context" article series:

- [Part 1] (https://itnext.io/give-your-logs-more-context-7b43ea6b4ae6) 
- [Part 2] (https://medium.com/@hbarcelos/give-your-logs-more-context-part-2-c2c952724e04).

## Requirements

- [Yarn](https://yarnpkg.com/en/docs/install)

## Setup

If you are following follow the article, after cloning this repository, I checkout the `initial` tag:

```bash
git clone https://github.com/hbarcelos/give-your-logs-more-context
git checkout initial
```

Each step on the article is a subsequent commit, which you can reference by the commit hash. 

The final version is under the `final` tag, which is also the `HEAD` of the master branch.

```bash
git checkout final
# or...
git checkout master
```

After choosing what you want to see, run:

```bash
yarn install
yarn test
```
