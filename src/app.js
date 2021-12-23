const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Web3 = require('web3');
const _abi = require('./abi/token.json');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.get('/getTotalSupply', async (req, res) => {
  var web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
  const tokenContract = new web3.eth.Contract(_abi, process.env.CONSTRACT_ADDRESS);
  // get TotalSupply of token
  const total_supply = await tokenContract.methods.totalSupply().call();
  // get BalanceOf address1
  const user1 = await tokenContract.methods.balanceOf('0x01e4cacea98c1425f4fbeb4911a9a92dc8559f98').call();
  // get BalanceOf address2
  const user2 = await tokenContract.methods.balanceOf('0x893fe6a059137b05e4be82c3fe1739e776ff00f1').call();
  const retVal = (total_supply - user1 - user2);

  res.json({
    message: retVal
  });
})

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
