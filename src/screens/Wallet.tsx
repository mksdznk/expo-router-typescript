import styled from 'styled-components/native'
import LinkButton from 'src/components/LinkButton'
import ScreenLayout from 'src/layouts/ScreenLayout'
import React from 'react'
import { 
  ScrollView,
  StyleSheet,
} from 'react-native';


export default function Wallet() {
    let totalProfit: number = 0;
    let totalValue: number = 0;
    
    // retrieving saved data from local storage to load onto page
    let storageWallet = localStorage.getItem('wallet');
    if (storageWallet === null) storageWallet = '[{"rank":0,"name":"NO COINS IN WALLET","symbol":"","price":0,"investment":0,"quantity":0,"value":0,"profit":0}]';
    wallet = JSON.parse(storageWallet);
    for (let i = 0; i < wallet.length; i++) {
      totalProfit += wallet[i].profit;
      totalValue += wallet[i].value;
    }
    totalProfit = parseFloat(totalProfit.toFixed(2));
    totalValue = parseFloat(totalValue.toFixed(2));

    // function to set the inputed values in table cell as coins investment value
    const updateI = (e: React.ChangeEvent<HTMLInputElement>, walletCoin: walletCoin): void => {
      walletCoin.investment = parseFloat(e.currentTarget.value);
      walletCoin.profit = parseFloat((walletCoin.value - walletCoin.investment).toFixed(2));
      let stringifiedWallet: string = JSON.stringify(wallet);
      localStorage.setItem('wallet', stringifiedWallet);
    };

    // function to set the inputed values in table cell as coins quantity value
    const updateQ = (e: React.ChangeEvent<HTMLInputElement>, walletCoin: walletCoin): void => {
      walletCoin.quantity = parseFloat(e.currentTarget.value);
      walletCoin.value = parseFloat((walletCoin.price * walletCoin.quantity).toFixed(2));
      walletCoin.profit = parseFloat((walletCoin.value - walletCoin.investment).toFixed(2));
      let stringifiedWallet: string = JSON.stringify(wallet);
      localStorage.setItem('wallet', stringifiedWallet);
    };

  return (
    <ScreenLayout testID="second-screen-layout">
      <S.TableContainer>
      <LinkButton href="/" text="Go To Home Screen" />
        <button type='button' onClick={() => window.location.reload()} >Press to save and calculate investment and quantity</button>
        <ScrollView>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>SYMBOL</th>
              <th>PRICE</th>
              <th>INVESTMENT / $</th>
              <th>QUANTITY</th>
              <th>VALUE</th>
              <th>PROFIT</th>
            </tr>
          </thead>
          <tbody>
            {
            // loops through saved array wallet and puts its properties into each respective cell
            wallet.map((walletCoin =>
            <tr key={walletCoin.name}>
              <td style={styles.table}>{walletCoin.rank}</td>
              <td style={styles.table}>{walletCoin.name}</td>      
              <td style={styles.table}>{walletCoin.symbol}</td>
              <td style={styles.table}>${walletCoin.price}</td>
              <td style={styles.table}><input type='number' onChange={(e) => updateI(e, walletCoin)} defaultValue={walletCoin.investment}></input></td>
              <td style={styles.table}><input type='number' onChange={(e) => updateQ(e, walletCoin)} defaultValue={walletCoin.quantity}></input></td>
              <td style={styles.table}>${walletCoin.value}</td>
              <td style={checkGain(walletCoin.profit)}>${walletCoin.profit}</td>
            </tr>   
            ))
            }
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>TOTAL:</td>
              <td style={styles.table}>${totalValue}</td>
              <td style={checkGain(totalProfit)}>${totalProfit}</td>
            </tr>
          </tbody>
        </table>
        </ScrollView>
        </S.TableContainer>
    </ScreenLayout>
  );
}

interface walletCoin {
  rank: number,
  name: string,
  symbol: string,
  price: number,
  investment: number,
  quantity: number,
  value: number,
  profit: number,
};

let wallet: walletCoin[] = [];

// function to set styling of cell which shows coin profit
function checkGain (value: number) {
  if(value > 0) {
    return styles.cellGreen;
  }
  if(value < 0) {
    return styles.cellRed;
  }
  else {
    return styles.table;
  }
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