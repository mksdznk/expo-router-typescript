// * imports
import styled from 'styled-components/native'
import LinkButton from 'src/components/LinkButton'
import ScreenLayout from 'src/layouts/ScreenLayout'
import { StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  //function makes call to API to get coin data
  getCoins();

  
  // retrieving saved data from local storage to load onto page
  let storageCoins = localStorage.getItem('coins');
  if (storageCoins === null) storageCoins = '[{"rank":0,"name":"NO COINS, RELOAD PAGE","symbol":"","price":0,"change":0}]';
  coins = JSON.parse(storageCoins);

  let storageWallet = localStorage.getItem('wallet');
  if (storageWallet !== null) storageWallet = wallet = JSON.parse(storageWallet);//'[{"rank":0,"name":"NO COINS IN WALLET","symbol":"","price":0,"investment":0,"quantity":0,"value":0,"profit":0}]';

  return (
    <ScreenLayout testID="home-screen-layout">
      <S.TableContainer>
      <LinkButton href="/wallet" text="Go To Wallet"/>
        <ScrollView>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>RANK</th>
              <th>COIN</th>
              <th>SYMBOL</th>
              <th>PRICE / $</th>
              <th>24 HOUR CHANGE</th>
              <th></th>
            </tr>
          </thead>
          <tbody style={styles.table}>
          {
          // loops through saved array wallet and puts its properties into each respective cell
          coins.map((coin =>
            <tr key={coin.symbol}>
              <td style={styles.table}>{coin.rank}</td>
              <td style={styles.table}>{coin.name}</td>      
              <td style={styles.table}>{coin.symbol}</td>
              <td style={styles.table}>{coin.price}</td>
              <td style={checkGain(coin)}>{coin.change}%</td>
              <td style={styles.table}> <input type="button" value="ADD" onClick={ () => addCoin(coin)} /> </td>
            </tr>   
          ))
          }
          </tbody>
        </table>
        </ScrollView>
      </S.TableContainer>
    </ScreenLayout>
  )
}

interface coin {
  rank: number,
  name: string,
  symbol: string,
  price: number,
  change: number,
};

interface walletCoin {
  rank: number,
  name: string,
  symbol: string,
  price: number,
  quantity: number,
  investment: number,
  value: number,
  profit: number,
};

let coins: coin[] = [];
let wallet: walletCoin[] = [];

// function called on app load which gets coin data from API and saves it local storage
function getCoins () {
  const options = {
    headers: {
      'x-access-token': 'coinranking6de46b4f20a0ba7934a052c7e8f2b9c7ca5823bd6b724cb7',
    },
  };
  
  fetch('https://api.coinranking.com/v2/coins', options)
    .then((response) => response.json())
    .then((result) => {
      coins = result.data.coins
      for(let i = 0; i < coins.length; i++) {
        if(coins[i].price >= 1){
          coins[i].price = parseFloat(Number(coins[i].price).toFixed(2)); 
        }
        else {
          coins[i].price = parseFloat(Number(coins[i].price).toPrecision(3));
        }
        updateWalletCoin(coins[i]);
      }
      var stringifiedCoins = JSON.stringify(result.data.coins);
      var stringifiedWallet = JSON.stringify(wallet);
      localStorage.setItem('coins', stringifiedCoins);
      localStorage.setItem('wallet', stringifiedWallet);
    });

};

// function called in getData function to update the prices of coins in the walletCoin array
function updateWalletCoin (coin: coin) {
  for (let i = 0; i < wallet.length; i++){
    if(wallet[i].name === coin.name){
      wallet[i].rank = coin.rank;
      wallet[i].price = coin.price;
    }
  }
}

// function to set styling of cells showing the daily coin change
function checkGain (coin: coin) {
  if(coin.change > 0) {
    return styles.cellGreen;
  }
  if(coin.change < 0) {
    return styles.cellRed;
  }
  else {
    return styles.table;
  }
}

// adds coin from selected row the wallet array
function addCoin (coin: coin) {
  for (let i = 0; i < wallet.length; i++) {
    if (wallet[i].name === coin.name) {
      alert('This coin is already in your wallet');
      return;
    }
  }
  const coinToAdd: walletCoin = {
    rank: coin.rank,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    investment: 0,
    quantity: 0,
    value: 0,
    profit: 0,
  }
  wallet.push(coinToAdd);
  localStorage.setItem('wallet', '');
  const stringifiedWallet: string = JSON.stringify(wallet);
  localStorage.setItem('wallet', stringifiedWallet);
}

const styles = StyleSheet.create({
  table: {
    borderColor: 'black',
    border: '1px solid',
    justifyContent: 'center',
  },
  cellGreen: {
    borderColor: 'black',
    border: '1px solid',
    justifyContent: 'center',
    color: 'green',  
  },
  cellRed: {
    borderColor: 'black',
    border: '1px solid',
    justifyContent: 'center',
    color: 'red',  
  },
});

const S = {
  Content: styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    heigth: 100%;
  `,
  TableContainer: styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    color: white;
  `,
}
