# Give your logs more context

This repository is the implementation of the ideas from [this article](https://itnext.io/give-your-logs-more-context-7b43ea6b4ae6) and was implemented following the steps of this [another one](https://medium.com/@hbarcelos/give-your-logs-more-context-part-2-c2c952724e04).

## Requirements

```
npm install -g yarn
```

## Setup

To follow the article, after cloning this repository, I recommend you to checkout the `initial` tag:

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
