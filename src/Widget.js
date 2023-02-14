import React from 'react'
import './App.css'
import transakSDK from '@transak/transak-sdk'
import Pusher from 'pusher-js'

const onRampParams = {
  apiKey: 'YOUR_API_KEY', // Your API Key
  environment: 'STAGING', // Environment : STAGING or PRODUCTION
  cryptoCurrencyCode: 'MATIC',
  disableWalletAddressForm: true,
  fiatAmount: '43',
  fiatCurrency: 'EUR',
  network: 'polygon',
  walletAddress: 'USER_WALLET_ADDRESS',
  widgetHeight: '700px',
}

const nftParams = {
  apiKey: 'YOUR_API_KEY', // Your API Key
  environment: 'STAGING', // Environment : STAGING or PRODUCTION
  network: 'polygon',
  walletAddress: 'USER_WALLET_ADDRESS',
  widgetHeight: '700px',
  fiatCurrency: 'GBP',
  tokenId: 0,
  isNFT: true,
  tradeType: "secondary",
  contractAddress: "NFT_CONTRACT_ADDRESS"
}
export function openTransak() {
  let transak = new transakSDK(nftParams)
  let orderId

  transak.init()

  transak.on(transak.ALL_EVENTS, (data) => {
    console.log('ALL_EVENTS', data)
  })

  transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
    console.log('TRANSAK_WIDGET_CLOSE', orderData)
    transak.close()
  })

  // This will trigger when the user marks payment is made.
  transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, async (orderData) => {
    console.log(orderData, "TRANSAK_ORDER_SUCCESSFUL" )
    //close the widget after placing order
    transak.close()

    let pusher = new Pusher('1d9ffac87de599c61283', { cluster: 'ap2' })
    orderId = orderData.status.id

    if (orderId) {
      //to subscribe
      console.log('Subscribing Pusher', "PUSHER_EVENT")
      let channel = pusher.subscribe(orderId)

      //receive updates of all the events
      pusher.bind_global((eventId, orderData) => {
        console.log(eventId, orderData, 'BIND_GLOBAL', "PUSHER_EVENT")
      })

      channel.bind(`ORDER_COMPLETED`, (orderData) => {
        console.log(orderData, 'ORDER_COMPLETED', "PUSHER_EVENT")
        //to unsubscribe
        console.log('Un Subscribing Pusher', "PUSHER_EVENT")
        pusher.unsubscribe(orderId)
      })

      channel.bind(`ORDER_FAILED`, (orderData) => {
        console.log(orderData, 'ORDER_FAILED', "PUSHER_EVENT")
        //to unsubscribe
        console.log('Un Subscribing Pusher', "PUSHER_EVENT")
        pusher.unsubscribe(orderId)
      })
    }
  })
}

function App() {
  return (
    <div>
      <h2> Home Page</h2>
      <button onClick={() => openTransak()}>open trasak</button>
    </div>
  )
}

export default App
