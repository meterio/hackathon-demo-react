# Demo for hackathon (July 19-21 Beijing) React version

## Install

```bash
npm install
```

## Run

```bash
# Please execute with exact order

npm start
```

## Web UI

Access [http://localhost:3000](http://localhost:3000) to view.

## Tips

1. private key and public address are stored at the browser. type `localStorage.getItem('private.key')` and `localStorage.getItem('public.address')` in console and you'll find it.
2. abi definition is pre-built, no solidity compilation included in this demo. (`solc` library occupies too much memory and it causes failure)
3. `this.setState` is not available in every `then` function provided by web3.
