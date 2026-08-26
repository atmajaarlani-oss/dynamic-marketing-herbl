# dokumentasi Midtrans Node.js Client
https://github.com/midtrans/midtrans-nodejs-client




### Manage Subscriptions with Midtrans Core API (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Illustrates how to create, retrieve, enable, and update subscriptions using the Midtrans Core API in Node.js. This example covers setting up comprehensive subscription parameters including name, amount, currency, payment type, token, schedule details (interval, unit, max interval, start time), metadata, and customer details. It then demonstrates the API calls for creating, getting, enabling, and updating subscriptions.

```javascript
const midtransClient = require('midtrans-client');
// Create Core API / Snap instance (both have shared `transactions` methods)
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });
// prepare parameter 
let parameter = {
  "name": "MONTHLY_2021",
  "amount": "14000",
  "currency": "IDR",
  "payment_type": "credit_card",
  "token": "521111gmWqMegyejqCQmmopnCFRs1117",
  "schedule": {
    "interval": 1,
    "interval_unit": "month",
    "max_interval": 12,
    "start_time": "2021-11-25 07:25:01 +0700"
  },
  "metadata": {
    "description": "Recurring payment for A"
  },
  "customer_details": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@email.com",
    "phone": "+62812345678"
  }
};

core.createSubscription(parameter)
        .then((response)=>{
          // do something to `response` object
        });

// get subscription by subscriptionId
core.getSubscription(subscriptionId)
        .then((response)=>{
          // do something to `response` object
        });

// enable subscription by subscriptionId
core.enableSubscription(subscriptionId)
        .then((response)=>{
          // do something to `response` object
        });

// update subscription by subscriptionId and updateSubscriptionParam
let updateSubscriptionParam = {
  "name": "MONTHLY_2021",
  "amount": "300000",
  "currency": "IDR",
  "token": savedTokenId,
  "schedule": {
    "interval": 1
  }
}
core.updateSubscription(subscriptionId, updateSubscriptionParam)
        .then((response)=>{
          // do something to `response` object
        });
```

--------------------------------

### Create Snap Transaction and Get Token

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to create a Snap transaction using the `createTransaction` method and retrieve the transaction token. It includes an example parameter object specifying transaction details and credit card settings, and shows how to handle the promise resolution.

```JavaScript
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "transaction_details": {
        "order_id": "test-transaction-123",
        "gross_amount": 200000
    }, "credit_card":{
        "secure" : true
    }
};


snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
    })

// alternative way to create transactionToken
// snap.createTransactionToken(parameter)
//     .then((transactionToken)=>{
//         console.log('transactionToken:',transactionToken);
//     })
```

--------------------------------

### Install Midtrans Client via NPM

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Installs the Midtrans Node.js client library as a dependency in your project using npm, saving it to your package.json file.

```Shell
npm install --save midtrans-client
```

--------------------------------

### Create Direct Debit Payment with Midtrans Node.js Client (Gopay, Dana, Shopeepay)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This example illustrates how to initiate a direct debit payment using the Midtrans Node.js client. It constructs a comprehensive request body including partner reference, URL parameters for notification, validity period, payment option details (e.g., GOPAY), customer information, and item details. The snippet then calls the `createPayment` method on the `SnapBi` service to process the transaction.

```javascript
const midtransClient = require('midtrans-client');

const externalId = randomUUID();
let directDebiRequestBody = {
  "partnerReferenceNo": externalId,
  "chargeToken": "",
  "merchantId": merchantId,
  "urlParam": {
    "url": "https://midtrans-test.com/api/notification",
    "type": "PAY_RETURN",
    "isDeeplink": "N"
  },
  "validUpTo": "2030-07-20T20:34:15.452305Z",
  "payOptionDetails": [
    {
      "payMethod": "GOPAY",
      "payOption": "GOPAY_WALLET",
      "transAmount": {
        "value": "1500",
        "currency": "IDR"
      }
    }
  ],
  "additionalInfo": {
    "customerDetails": {
      "firstName": "Merchant",
      "lastName": "Operation",
      "email": "merchant-ops@midtrans.com",
      "phone": "+6281932358123",
      "billingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      },
      "shippingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      }
    },
    "items": [
      {
        "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
        "price": {
          "value": "1500.00",
          "currency": "IDR"
        },
        "quantity": 1,
        "name": "test item name",
        "brand": "test item brand",
        "category": "test item category",
        "merchantName": "Merchant Operation"
      }
    ]
  }
};
midtransClient.SnapBi.directDebit()
        .withBody(directDebiRequestBody)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        );
```

--------------------------------

### Get Midtrans Snap Redirect URL in Node.js

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Illustrates how to use the `midtrans-client` library in Node.js to create a Snap API instance and generate a redirection URL for a payment page. It includes setting up transaction details and handling the promise for the redirect URL.

```javascript
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "transaction_details": {
        "order_id": "test-transaction-123",
        "gross_amount": 200000
    }, "credit_card":{
        "secure" : true
    }
};

snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction redirect_url
        let redirectUrl = transaction.redirect_url;
        console.log('redirectUrl:',redirectUrl);
    })

// alternative way to create redirectUrl
// snap.createTransactionRedirectUrl(parameter)
//     .then((redirectUrl)=>{
//         console.log('redirectUrl:',redirectUrl);
//     })
```

--------------------------------

### Manually Require Midtrans Client

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to manually require the Midtrans client library in a Node.js application if it's not installed via npm, assuming the repository has been cloned and the index.js file is accessible.

```JavaScript
let midtransClient = require('./midtrans-client-nodejs/index.js');
```

--------------------------------

### Publish Node.js Package to npmjs.com

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/Maintaining.md

Command to publish the current Node.js package to the npm registry. This action makes the package available for others to install via npm. Users may be prompted for npmjs.com login credentials.

```bash
npm publish
# You may be asked for login username and password for npmjs.com
```

--------------------------------

### Create Beneficiaries using Midtrans Iris API

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Illustrates how to use the initialized `midtransClient.Iris` instance to create a new beneficiary for disbursements. The example shows the required payload parameters including name, account number, bank code, alias name, and email address.

```javascript
let iris = new midtransClient.Iris({
        isProduction : false,
        serverKey : 'YOUR_API_KEY'
    });

iris.createBeneficiaries({
  "name": "Budi Susantoo",
  "account": "0611101146",
  "bank": "bca",
  "alias_name": "budisusantoo",
  "email": "budi.susantoo@example.com"
})
  .then((res)=>{
    // do something based on the API response
  })
  .catch((err)=>{
    // do something based on the Error object & message
  })
```

--------------------------------

### Get QRIS Transaction Status (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Provides an example of retrieving the status of a QRIS transaction using the Midtrans Node.js client. It defines the request body with `originalReferenceNo`, `originalPartnerReferenceNo`, `merchantId`, and `serviceCode`, and calls the `getStatus` method. Note: `externalId` in `getStatus(externalId)` refers to the transaction's external ID, and `merchantId` needs to be defined.

```javascript
const midtransClient = require('midtrans-client');

let qrisStatusBody = {
  "originalReferenceNo": "A120240930074508BIDP4QaNnJID",
  "originalPartnerReferenceNo": "b7d2bc2e-9d5b-4cec-a39f-4244c11e1b98",
  "merchantId": merchantId,
  "serviceCode": "47"
}

/**
 * 
 * Example code for Qris getStatus
 */
midtransClient.SnapBi.qris()
        .withBody(qrisStatusBody)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Cancel QRIS Transaction (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Provides an example of cancelling a QRIS transaction using the Midtrans Node.js client. It defines the request body with `originalReferenceNo`, `merchantId`, and `reason`, and calls the `cancel` method. `externalId` is generated using `randomUUID()` for this example, and `merchantId` needs to be defined.

```javascript
const midtransClient = require('midtrans-client');

const externalId = randomUUID();

let qrisCancelBody = {
  "originalReferenceNo": "A120240930075936LUOBMHxvPOID",
  "merchantId": merchantId,
  "reason": "cancel reason"
}
/**
 * Basic implementation of Qris to cancel transaction
 */
midtransClient.SnapBi.qris()
        .withBody(qrisCancelBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Configure Custom Axios HTTP Client Settings

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to customize the underlying Axios HTTP client's default settings within the Midtrans client instance. This example shows how to set a global request timeout and add a custom HTTP header for all requests made by that specific client instance.

```javascript
// create instance of api client
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

// set Axios timeout config to 2500
snap.httpClient.http_client.defaults.timeout = 2500; 

// set custom HTTP header for every request from this instance
snap.httpClient.http_client.defaults.headers.common['My-Header'] = 'my-custom-value';
```

--------------------------------

### Handle Midtrans HTTP Transaction Notifications (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This example demonstrates how to set up a notification handler using the Midtrans Snap API client to process incoming HTTP POST notifications. It shows how to parse the notification JSON and implement logic to update transaction statuses in a backend system based on different fraud and transaction statuses (e.g., capture, settlement, deny, cancel, expire, pending).

```javascript
const midtransClient = require('midtrans-client');
// Create Core API / Snap instance (both have shared `transactions` methods)
let apiClient = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

apiClient.transaction.notification(notificationJson)
    .then((statusResponse)=>{
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // Sample transactionStatus handling logic

        if (transactionStatus == 'capture'){
            // capture only applies to card transaction, which you need to check for the fraudStatus
            if (fraudStatus == 'challenge'){
                // TODO set transaction status on your databaase to 'challenge'
            } else if (fraudStatus == 'accept'){
                // TODO set transaction status on your databaase to 'success'
            }
        } else if (transactionStatus == 'settlement'){
            // TODO set transaction status on your databaase to 'success'
        } else if (transactionStatus == 'deny'){
            // TODO you can ignore 'deny', because most of the time it allows payment retries
            // and later can become success
        } else if (transactionStatus == 'cancel' ||
          transactionStatus == 'expire'){
            // TODO set transaction status on your databaase to 'failure'
        } else if (transactionStatus == 'pending'){
            // TODO set transaction status on your databaase to 'pending' / waiting payment
        }
    });
```

--------------------------------

### Cancel Direct Debit Transaction by Reference Number (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to cancel a Direct Debit transaction using its reference number via the Midtrans Node.js client. It prepares the request body with `originalReferenceNo` and then calls the `cancel` method. `externalId` is generated using `randomUUID()` for this example.

```javascript
const midtransClient = require('midtrans-client');

const externalId = randomUUID();

let directDebitCancelByReferenceNoBody = {
  "originalReferenceNo" : "A120240930075800vyWwxohb5WID"
}

/**
 * Basic implementation to cancel transaction using referenceNo
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitCancelByReferenceNoBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Cancel Direct Debit Transaction by External ID (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Illustrates how to cancel a Direct Debit transaction using its external ID with the Midtrans Node.js client. It sets up the request body with `originalExternalId` and executes the `cancel` method. `externalId` is generated using `randomUUID()` for this example.

```javascript
const midtransClient = require('midtrans-client');

const externalId = randomUUID();

let directDebitCancelByExternalIdBody = {
  "originalExternalId" : "8a074fc8-4eac-4b06-959a-95aeb91c7920"
}

/**
 * Basic implementation to cancel transaction using externalId
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitCancelByExternalIdBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Get Direct Debit Transaction Status by Reference Number (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Illustrates how to fetch the status of a Direct Debit transaction using its reference number with the Midtrans Node.js client. It sets up the request body with `originalReferenceNo` and `serviceCode`, and executes the `getStatus` method. Note: `externalId` in `getStatus(externalId)` refers to the transaction's external ID.

```javascript
const midtransClient = require('midtrans-client');

let directDebitStatusBodyByReferenceNo = {
  "originalReferenceNo": "A120240930071006pW0gbFMTguID",
  "serviceCode": "54"
}

/**
 * Example code for Direct Debit getStatus using referenceNo
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitStatusBodyByReferenceNo)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Get Direct Debit Transaction Status by External ID (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to retrieve the status of a Direct Debit transaction using its external ID via the Midtrans Node.js client. It initializes the client, prepares the request body with the `originalExternalId` and `serviceCode`, and then calls the `getStatus` method. Note: `externalId` in `getStatus(externalId)` refers to the transaction's external ID.

```javascript
const midtransClient = require('midtrans-client');

let directDebitStatusBodyByExternalId = {
  "originalExternalId": "67fd4d9e-5fe6-477c-ab99-026a9ab88c34",
  "serviceCode": "54"
}

/**
 * Example code for Direct Debit getStatus using externalId
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitStatusBodyByExternalId)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Cancel Virtual Account (VA) Transaction (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Shows how to cancel a Virtual Account (Bank Transfer) transaction using the Midtrans Node.js client. It constructs the request body with `partnerServiceId`, `customerNo`, `virtualAccountNo`, `trxId`, and `additionalInfo`, then invokes the `cancel` method. `externalId` is generated using `randomUUID()` for this example, and `merchantId` needs to be defined.

```javascript
const midtransClient = require('midtrans-client');

const externalId = randomUUID();

let vaCancelBody = {
  "partnerServiceId": "    1234",
  "customerNo": "564902",
  "virtualAccountNo": "    1234564902",
  "trxId": "18f2bd6d-e1be-43e2-89e4-8f9088251f60",
  "additionalInfo": {
    "merchantId": merchantId
  }
}

/**
 * Basic implementation of VA (Bank Transfer) to cancel transaction
 */
midtransClient.SnapBi.va()
        .withBody(vaCancelBody)
        .cancel(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Get Virtual Account (VA) Transaction Status (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Shows how to check the status of a Virtual Account (Bank Transfer) transaction using the Midtrans Node.js client. It constructs the request body with `partnerServiceId`, `customerNo`, `virtualAccountNo`, `inquiryRequestId`, and `additionalInfo`, then invokes the `getStatus` method. Note: `externalId` in `getStatus(externalId)` refers to the transaction's external ID, and `merchantId` needs to be defined.

```javascript
const midtransClient = require('midtrans-client');

let vaStatusBody = {
  "partnerServiceId": "    1234",
  "customerNo": "356899",
  "virtualAccountNo": "    1234356899",
  "inquiryRequestId": "5a5597d1-615d-4df0-875d-aa429b2b1b68",
  "additionalInfo": {
    "merchantId": merchantId
  }
}

/**
 * Example code for VA (Bank Transfer) getStatus
 */
midtransClient.SnapBi.va()
        .withBody(vaStatusBody)
        .getStatus(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Build and Run Express App with Docker

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/examples/expressApp/README.md

These commands demonstrate how to containerize and run the Express application using Docker. The first command builds the Docker image and runs it for the first time, while the second command is for subsequent runs, both mapping port 3000.

```bash
docker build -t midexpress . && docker run -p 3000:3000 --rm -it midexpress
docker run -p 3000:3000 --rm -it midexpress
```

--------------------------------

### Initialize Midtrans Snap JS on Frontend

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to integrate Midtrans Snap JS on the client-side using HTML and JavaScript. It shows how to embed the Snap script, set the client key, and handle the payment button click to initiate the Snap payment flow with success, pending, and error callbacks.

```html
<html>
  <body>
    <button id="pay-button">Pay!</button>
    <pre><div id="result-json">JSON result will appear here after payment:<br></div></pre> 

<!-- TODO: Remove ".sandbox" from script src URL for production environment. Also input your client key in "data-client-key" -->
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="<Set your ClientKey here>"></script>
    <script type="text/javascript">
      document.getElementById('pay-button').onclick = function(){
        // SnapToken acquired from previous step
        snap.pay('PUT_TRANSACTION_TOKEN_HERE', {
          // Optional
          onSuccess: function(result){
            /* You may add your own js here, this is just example */ document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
          },
          // Optional
          onPending: function(result){
            /* You may add your own js here, this is just example */ document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
          },
          // Optional
          onError: function(result){
            /* You may add your own js here, this is just example */ document.getElementById('result-json').innerHTML += JSON.stringify(result, null, 2);
          }
        });
      };
    </script>
  </body>
</html>
```

--------------------------------

### Initialize Midtrans Snap API Client

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Initializes a new instance of the Midtrans Snap API client. This client is used for customizable payment popups and requires a server key and client key for authentication, along with a production status setting.

```JavaScript
const midtransClient = require('midtrans-client');
// Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });
```

--------------------------------

### Midtrans Snap Class Available Methods

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Documents the available methods for the `Snap` class in the Midtrans client library, including their return types and parameter requirements for creating transactions or retrieving tokens/redirect URLs.

```APIDOC
Snap:
  createTransaction(parameter)
    parameter: Object or String of JSON of SNAP Parameter
    returns: Promise of Object (Snap API /transaction response)
  createTransactionToken(parameter)
    parameter: Object or String of JSON of SNAP Parameter
    returns: Promise of String (Snap API /transaction token)
  createTransactionRedirectUrl(parameter)
    parameter: Object or String of JSON of SNAP Parameter
    returns: Promise of String (Snap API /transaction redirect_url)
```

--------------------------------

### Initialize Midtrans Core API Client

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Initializes a new instance of the Midtrans Core API client. This client is used for direct backend implementations and requires a server key and client key for authentication, along with a production status setting.

```JavaScript
const midtransClient = require('midtrans-client');
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });
```

--------------------------------

### Initialize Midtrans Iris Disbursement API Client

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Provides instructions for initializing the `midtransClient.Iris` object, which is used to interact with the Midtrans Iris Disbursement API. It requires setting the `isProduction` flag and providing your `serverKey` (API key) obtained from the Midtrans Iris Dashboard.

```javascript
const midtransClient = require('midtrans-client');
// Create Core API instance
let iris = new midtransClient.Iris({
        isProduction : false,
        serverKey : 'YOUR_API_KEY'
    });
```

--------------------------------

### Midtrans Core API (VT-Direct) Available Methods

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Documents the available methods of the `CoreApi` class in the `midtrans-client` library for direct API interactions. It details methods like `charge`, `capture`, `cardRegister`, `cardToken`, and `cardPointInquiry`, including their parameters and return types.

```APIDOC
CoreApi:
  charge(parameter={})
    description: Do `/charge` API request to Core API
    parameters:
      parameter: Object - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
    returns: Promise - Promise contains Object from JSON decoded response

  capture(parameter={})
    description: Do `/capture` API request to Core API
    parameters:
      parameter: Object - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
    returns: Promise - Promise contains Object from JSON decoded response

  cardRegister(parameter={})
    description: Do `/card/register` API request to Core API
    parameters:
      parameter: Object - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
    returns: Promise - Promise contains Object from JSON decoded response

  cardToken(parameter={})
    description: Do `/token` API request to Core API
    parameters:
      parameter: Object - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://api-docs.midtrans.com)
    returns: Promise - Promise contains Object from JSON decoded response

  cardPointInquiry(tokenId)
    description: Do `/point_inquiry/<tokenId>` API request to Core API
    parameters:
      tokenId: String - tokenId of credit card (more params detail refer to: https://api-docs.midtrans.com)
    returns: Promise - Promise contains Object from JSON decoded response
```

--------------------------------

### Configure Midtrans Node.js Client General Settings

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This snippet demonstrates how to configure the general settings for the Midtrans Node.js client. It includes setting the environment (production/sandbox), merchant client ID, private key, client secret, partner ID, channel ID, and enabling/disabling logging. These configurations are essential for authenticating and interacting with the Midtrans API.

```javascript
const midtransClient = require('midtrans-client');

midtransClient.SnapBiConfig.isProduction = true;
midtransClient.SnapBiConfig.snapBiClientId = "your client id";
midtransClient.SnapBiConfig.snapBiPrivateKey = "your private key";
midtransClient.SnapBiConfig.snapBiClientSecret = "your client secret";
midtransClient.SnapBiConfig.snapBiPartnerId = "your partner id";
midtransClient.SnapBiConfig.snapBiChannelId = "your channel id";
midtransClient.SnapBiConfig.enableLogging = true;
```

--------------------------------

### Process Credit Card Charge with Midtrans Core API (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to initiate a credit card charge using the Midtrans Core API in Node.js. It initializes the Core API client with production status and API keys, then sets up transaction parameters including payment type, gross amount, order ID, and credit card token for the charge operation. The result of the charge is logged to the console.

```javascript
const midtransClient = require('midtrans-client');
// Create Core API instance
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "payment_type": "credit_card",
    "transaction_details": {
        "gross_amount": 12145,
        "order_id": "test-transaction-54321",
    },
    "credit_card":{
        "token_id": 'CREDIT_CARD_TOKEN', // change with your card token
        "authentication": true
    }
};

// charge transaction
core.charge(parameter)
    .then((chargeResponse)=>{
        console.log('chargeResponse:');
        console.log(chargeResponse);
    });
```

--------------------------------

### Create Virtual Account (VA) Payment with Midtrans Node.js Client

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This snippet demonstrates how to initiate a Virtual Account (VA) bank transfer payment using the Midtrans Node.js client. It constructs a comprehensive request body including partner service ID, customer details, virtual account information, total amount, expiration date, and item details. The payment is then created using `midtransClient.SnapBi.va().withBody().createPayment()`.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

const externalId = randomUUID();
let vaRequestBody = {
  "partnerServiceId": "    1234",
  "customerNo": "0000000000",
  "virtualAccountNo": "    12340000000000",
  "virtualAccountName": "Merchant Operation",
  "virtualAccountEmail": "merchant-ops@midtrans.com",
  "virtualAccountPhone": "6281932358123",
  "trxId": externalId,
  "totalAmount": {
    "value": "1500.00",
    "currency": "IDR"
  },
  "expiredDate": "2030-07-20T20:50:04Z",
  "additionalInfo": {
    "merchantId": merchantId,
    "bank": "bca",
    "flags": {
      "shouldRandomizeVaNumber": true
    },
    "customerDetails": {
      "firstName": "Merchant",
      "lastName": "Operation",
      "email": "merchant-ops@midtrans.com",
      "phone": "+6281932358123",
      "billingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      },
      "shippingAddress": {
        "firstName": "Merchant",
        "lastName": "Operation",
        "phone": "+6281932358123",
        "address": "Pasaraya Blok M",
        "city": "Jakarta",
        "postalCode": "12160",
        "countryCode": "IDN"
      }
    },
    "items": [
      {
        "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
        "price": {
          "value": "1500.00",
          "currency": "IDR"
        },
        "quantity": 1,
        "name": "test item name",
        "brand": "test item brand",
        "category": "test item category",
        "merchantName": "Merchant Operation"
      }
    ]
  }
}


/**
 * basic implementation to create payment using va
 */
midtransClient.SnapBi.va()
        .withBody(vaRequestBody)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Manage Payment Accounts with Midtrans Core API (Node.js)

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This snippet illustrates how to initialize the Midtrans Core API client and perform operations related to payment accounts. It demonstrates linking a GoPay account with specific parameters, retrieving an existing payment account by its ID, and unlinking a payment account.

```javascript
const midtransClient = require('midtrans-client');
// Create Core API / Snap instance (both have shared `transactions` methods)
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

// prepare parameter 
let parameter = {
  "payment_type": "gopay",
  "gopay_partner": {
    "phone_number": "81212345678",
    "country_code": "62",
    "redirect_url": "https://www.gojek.com"
  }
};

// link Payment Account
core.linkPaymentAccount(parameter)
        .then((response)=>{
          // do something to `response` object
        });

// Get payment account by account id
core.getPaymentAccount(activeAccountId)
        .then((response)=>{
          // do something to `response` object
        });

// unlink payment account by accountId
core.unlinkPaymentAccount(activeAccountId)
        .then((response)=>{
          // do something to `response` object
        });
```

--------------------------------

### Reconfigure Midtrans Snap API Client using set()

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to reconfigure an existing Snap API client instance using the `apiConfig.set()` method. This allows for updating specific configuration options like production status, server key, or client key without re-instantiating the client.

```JavaScript
const midtransClient = require('midtrans-client');

// Create Snap API instance, empty config
let snap = new midtransClient.Snap();
snap.apiConfig.set({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

// You don't have to re-set using all the options, 
// i.e. set serverKey only
snap.apiConfig.set({serverKey : 'YOUR_SERVER_KEY'});
```

--------------------------------

### Refund Midtrans Transactions (Direct Debit, QRIS) with Node.js

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to initiate refunds for Direct Debit and QRIS payments using the Midtrans Node.js client. It shows the structure of refund request bodies and the `refund` method call for different payment types.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

 let directDebitRefundBody = {
  "originalReferenceNo": "A1202409300808041pswnOt7wMID",
  "reason" : "refund reason"
}

let qrisRefundBody = {
  "merchantId": merchantId,
  "originalPartnerReferenceNo": "488fd30e-64d7-4236-9e7a-82d55d9efad3",
  "originalReferenceNo": "A1202409300907114b5RZRNSRuID",
  "partnerRefundNo": "is-refund-12345",
  "reason": "refund reason",
  "refundAmount": {
    "value": "100.00",
    "currency": "IDR"
  },
  "additionalInfo": {
    "foo": "bar"
  }
}
/**
 * Example code for refund using Direct Debit
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebitRefundBody)
        .refund(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )

/**
 * Example code for refund using Qris
 */
midtransClient.SnapBi.qris()
        .withBody(qrisRefundBody)
        .refund(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Create QRIS Payment with Midtrans Node.js Client

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This snippet illustrates how to create a QRIS payment using the Midtrans Node.js client. It prepares a request body including a partner reference number, merchant ID, amount, validity period, and additional details such as acquirer, customer information, and items. The payment is processed by calling `midtransClient.SnapBi.qris().withBody().createPayment()`.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

const externalId = randomUUID();

let additionalHeader = {
  "X-device-id": "your device id",
  "debug-id": "your debug id"
}

let qrisRequestBody = {
  "partnerReferenceNo": externalId,
  "merchantId": merchantId,
  "amount": {
    "value": "1500.00",
    "currency": "IDR"
  },
  "validityPeriod": "2030-07-03T12:08:56-07:00",
  "additionalInfo": {
    "acquirer": "gopay",
    "customerDetails": {
      "firstName": "Merchant",
      "lastName": "Operation",
      "email": "merchant-ops@midtrans.com",
      "phone": "+6281932358123"
    },
    "items": [
      {
        "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
        "price": {
          "value": "1500.00",
          "currency": "IDR"
        },
        "quantity": 1,
        "name": "test item name",
        "brand": "test item brand",
        "category": "test item category",
        "merchantName": "Merchant Operation"
      }
    ],
    "countryCode": "ID",
    "locale": "id_ID"
  }
}

/**
 * basic implementation to create payment using Qris
 */
midtransClient.SnapBi.qris()
        .withBody(qrisRequestBody)
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Reconfigure Midtrans Snap API Client via Direct Attributes

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Shows an alternative way to reconfigure an existing Snap API client instance by directly setting properties on the `apiConfig` attribute. This method provides direct access to modify `isProduction`, `serverKey`, and `clientKey`.

```JavaScript
const midtransClient = require('midtrans-client');

// Create Snap API instance, empty config
let snap = new midtransClient.Snap();

snap.apiConfig.isProduction = false;
snap.apiConfig.serverKey = 'YOUR_SERVER_KEY';
snap.apiConfig.clientKey = 'YOUR_CLIENT_KEY';
```

--------------------------------

### Run Specific Mocha Tests

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/Maintaining.md

Commands to execute specific test files or tests matching a pattern using Mocha. This allows developers to focus on particular test cases during development or debugging.

```bash
# specific single test
mocha --grep "fail to create transaction with zero gross_amount"
# or everything inside single `describe`
mocha --grep "Iris.js"
```

--------------------------------

### Reuse Existing Access Token for Midtrans Payments in Node.js

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Shows how to reuse a previously obtained access token for Midtrans payment creation (Direct Debit) using the `.withAccessToken()` method, avoiding repeated token generation and improving efficiency.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM
/**
 * Example reusing your existing accessToken by using .withAccessToken()
 */
midtransClient.SnapBi.directDebit()
        .withBody(directDebiRequestBody)
        .withAccessToken("your access token")
        .createPayment(externalId)
        .then(r =>
                console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
        )
```

--------------------------------

### Test Midtrans Notification Handler with cURL

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/examples/expressApp/README.md

This cURL command simulates a Midtrans payment notification by sending a POST request with a sample JSON payload to the application's `/notification_handler` endpoint. It's useful for testing webhook processing without a live transaction.

```bash
curl -X POST \
  http://localhost:3000/notification_handler \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
  "transaction_time": "2018-11-05 12:16:53",
  "transaction_status": "capture",
  "transaction_id": "9a83774c-b56b-4724-acf2-c35d73834a36",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "d302bfcb2db008f17343e4c3b56cb20a0b22d0951ede6a7cdbfcd31f4a5d0d89d0a5230c333dd2fc5803cfbe8567ad146fb3c574d4050a87b4d81661e5d870de",
  "payment_type": "credit_card",
  "order_id": "order-id-node-1541395013",
  "masked_card": "481111-1114",
  "gross_amount": "200000.00",
  "fraud_status": "accept",
  "eci": "05",
  "channel_response_message": "Approved",
  "channel_response_code": "00",
  "card_type": "credit",
  "bank": "mandiri",
  "approval_code": "1541395013424"
}'
```

--------------------------------

### Verify Midtrans Snap-Bi Webhook Notification in Node.js

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

This code demonstrates how to verify a webhook notification received from Midtrans using the `midtrans-client` library. It shows how to use the `SnapBi.notification()` method with the payload, signature, timestamp, and notification URL path to determine if the webhook is legitimate. This is crucial for securely processing payment notifications.

```javascript
const midtransClient = require('midtrans-client'); // use this if installed via NPM

// The request body/ payload sent by the webhook
// Sample notification body, replace with actual data you receive from Midtrans
let notificationPayload = "{\"originalPartnerReferenceNo\":\"GP24043015193402809\",\"originalReferenceNo\":\"A120240430081940S9vu8gSjaRID\",\"merchantId\":\"G099333790\",\"amount\":{\"value\":\"102800.00\",\"currency\":\"IDR\"},\"latestTransactionStatus\":\"00\",\"transactionStatusDesc\":\"SUCCESS\",\"additionalInfo\":{\"refundHistory\":[]}}";

// To get the signature value, you need to retrieve it from the webhook header called X-Signature
let signature = "CgjmAyC9OZ3pB2JhBRDihL939kS86LjP1VLD1R7LgI4JkvYvskUQrPXgjhrZqU2SFkfPmLtSbcEUw21pg2nItQ0KoX582Y6Tqg4Mn45BQbxo4LTPzkZwclD4WI+aCYePQtUrXpJSTM8D32lSJQQndlloJfzoD6Rh24lNb+zjUpc+YEi4vMM6MBmS26PpCm/7FZ7/OgsVh9rlSNUsuQ/1QFpldA0F8bBNWSW4trwv9bE1NFDzliHrRAnQXrT/J3chOg5qqH0+s3E6v/W21hIrBYZVDTppyJPtTOoCWeuT1Tk9XI2HhSDiSuI3pevzLL8FLEWY/G4M5zkjm/9056LTDw==";

// To get the timeStamp value, you need to retrieve it from the webhook header called X-Timestamp
let timeStamp = "2024-10-07T15:45:22+07:00";

// The url path is based on the webhook url of the payment method for example for direct debit is `/v1.0/debit/notify`
let notificationUrlPath = "/v1.0/debit/notify";
/**
 * Example verifying the webhook notification
 */
let isVerified = midtransClient.SnapBi.notification()
        .withNotificationPayload(notificationPayload)
        .withSignature(signature)
        .withTimeStamp(timeStamp)
        .withNotificationUrlPath(notificationUrlPath)
        .isWebhookNotificationVerified()
```

--------------------------------

### Refund Midtrans Transaction

Source: https://github.com/midtrans/midtrans-nodejs-client/blob/master/README.md

Demonstrates how to initiate a standard refund for a Midtrans transaction using the `apiClient.transaction.refund` method. It requires a transaction ID or order ID and a parameter object specifying the refund key, amount, and reason.

```javascript
let parameter = {
    "refund_key": "order1-ref1",
    "amount": 5000,
    "reason": "Item out of stock"
}
apiClient.transaction.refund('YOUR_ORDER_ID OR TRANSACTION_ID',parameter)
    .then((response)=>{
        // do something to `response` object
    });
```
