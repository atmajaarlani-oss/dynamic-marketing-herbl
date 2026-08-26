# dokumentasi Midtrans
https://context7.com/websites/midtrans/llms.txt?tokens=10000

### Initiate GoPay Transaction with Node.js

Source: https://docs.midtrans.com/docs/coreapi-e-money-integration

This Node.js example shows how to initiate a GoPay transaction using the midtrans-client NPM package. Make sure to install the package and configure your server and client keys.

```javascript
/*Install midtrans-client (https://github.com/Midtrans/midtrans-nodejs-client) NPM package.
npm install --save midtrans-client*/

//SAMPLE REQUEST START HERE

const midtransClient = require('midtrans-client');
// Create Core API instance
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'YOUR_SERVER_KEY',
        clientKey : 'YOUR_CLIENT_KEY'
    });

let parameter = {
    "payment_type": "gopay",
    "transaction_details": {
        "gross_amount": 12145,
        "order_id": "test-transaction-54321",
    },
    "gopay": {
        "enable_callback": true,                // optional
        "callback_url": "someapps://callback"   // optional
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

### Example Request to Get Partner Token

Source: https://docs.midtrans.com/docs/getting-an-authentication-token

Use this cURL command to request a partner token from the authentication endpoint. Ensure you replace the placeholder client-id and pass-key with your actual credentials.

```bash
curl -X GET "https://onekyc-token.sandbox.gopayapi.com/v1/esign/partner/authentication" \
  -H "client-id: b31fa508-331c-4e9e-9a60-b0f28c3f7e13" \
  -H "pass-key: 2c7b2893-e49f-4cf3-89e6-1b9c5bf0500b"
```

--------------------------------

### Example Esign API Header Block

Source: https://docs.midtrans.com/docs/understanding-esign-apis-headers

This bash example demonstrates how to include all required headers for Esign API requests. Replace placeholders with your actual token, partner IDs, and session ID.

```bash
-H "x-onekyc-token: <TOKEN>" \
-H "x-esign-onboarding-partner: <ONBOARDING_PARTNER>" \
-H "x-partner-user-id: <PARTNER_USER_ID>" \
-H "x-partner-user-id-type: <PARTNER_USER_ID_TYPE>" \
-H "x-partner-session-id: <UNIQUE_SESSION_ID>"
```

--------------------------------

### Migrate Face Verification Configuration and Launch (Before)

Source: https://docs.midtrans.com/docs/migration-guide

Example of the previous configuration and launch for Face Verification using the Digital Identity SDK.

```kotlin
val config = DigitalIdentitySelfieVerificationConfig(
	baseUrl = <base_url_string>,
  token = <token_string>,
  correlationId = <correlation_id_string>,
  theme = <DigitalIdentitySelfieVerificationFlowTheme>
)

val helpCenter: DigitalIdentityHelpCenter = object : DigitalIdentityHelpCenter {
	override fun isHelpCTAVisible(helpCenterType: HelpCenterType): Boolean {
    return when(helpCentertype) { ... } // true or false
	}

  override fun onHelpCTAClicked(helpCenterType: HelpCenterType): Boolean {
		// Handle helpcenter loading
    return false // or true
	}
}

sdkInstance.launchSelfieVerification(
	activity = <Activity>,
	config = config,
	helpCenter = helpCenter
)

sdkInstance.observeSelfieVerification(
	owner = <Activity as LifeCycleOwner>
) { result ->
		// Handle Completion
}
```

--------------------------------

### EnterpriseKTPScanConfig with Theme

Source: https://docs.midtrans.com/docs/kyc-sdk

Example of initializing EnterpriseKTPScanConfig with a custom theme.

```APIDOC
## EnterpriseKTPScanConfig with Theme

### Description
This code snippet demonstrates how to initialize the `EnterpriseKTPScanConfig` with a custom `DigitalIdentityKTPScanFlowTheme`.

### Method
Initializer

### Parameters
- **baseUrl** (string) - Required - The base URL for the KYC service.
- **token** (string) - Required - The JWT token for user authentication.
- **correlationId** (string) - Required - A unique identifier for tracking the request.
- **language** (enum) - Required - The language for the KYC flow.
- **theme** (DigitalIdentityKTPScanFlowTheme) - Optional - A custom theme object for visual appearance.

### Request Example
```swift
import DigitalIdentity

let theme = DigitalIdentityKTPScanFlowTheme(/* customise as needed */)

let config = EnterpriseKTPScanConfig(
    baseUrl: "https://kyc.example.com",
    token: "user-jwt-token",
    correlationId: "user-correlation-id",
    language: .id,
    theme: theme
)
```
```

--------------------------------

### Example KYC Verification Flow

Source: https://docs.midtrans.com/docs/features

Demonstrates how to initiate a KYC verification flow using the SDK. Requires setting up a FeatureRequest and a CredentialReceiver to handle credentials and exchange them.

```kotlin
val request = FeatureRequest.Builder()
    .requestId("REQ-${System.currentTimeMillis()}")
    .userCorrelationId("user-correlation-id")
    .token("short-term-linking-token")
    .additionalData(mapOf("phone_number" to "+628123456789"))
    .build()

val credentialReceiver = CredentialReceiver.Exchange { credential, requestId ->
    if (credential is GoPayCredential.AuthCode) {
        val correlationId = myBackend.exchangeAuthCode(credential.code, requestId)
        ExchangeResult.Success(userCorrelationId = correlationId)
    } else {
        ExchangeResult.Failure(reason = "Unexpected credential type")
    }
}

sdk.getFeatureManager().verify(
    activity = this,
    request = request,
    credentialReceiver = credentialReceiver,
    callback = object : FeatureCallback<VerifyResult> {
        override fun onComplete(result: VerifyResult, data: Map<String, Any?>) {
            Log.d(TAG, "Submission ID: ${result.submissionId}")
        }
        override fun onError(error: GoPayEnterpriseError) {
            Log.e(TAG, "Error ${error.code}: ${error.message}")
        }
    }
)
```

--------------------------------

### Sample Charge API Request - Offline Installment (Whitelist BINs)

Source: https://docs.midtrans.com/docs/snap-advanced-feature

This cURL example shows how to send a charge API request for offline installment transactions using a whitelist of BINs. Verify the authorization header and JSON payload for accuracy.

```curl
curl -X POST \
  https://app.sandbox.midtrans.com/snap/v1/transactions \
  -H 'Accept: application/json'\
  -H 'Authorization: Basic U0ItTWlkLXNlcnZlci1UT3ExYTJBVnVpeWhoT2p2ZnMzVV7LZU87' \
  -H 'Content-Type: application/json' \
  -d '{
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 120000
  },
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "offline": [3,6,12]
      }
    },
    "whitelist_bins": [
      "481111",
      "410505"
    ],
    "bank": "mandiri"
  }
}'
```

--------------------------------

### Migrate Selfie Liveness Configuration and Launch (After)

Source: https://docs.midtrans.com/docs/migration-guide

Example of the updated configuration and launch for Selfie Liveness using the Enterprise SDK.

```kotlin
val config = EnterpriseSelfieLivenessConfig(
	baseUrl = <base_url_string>,
  token = <token_string>,
  correlationId = <correlation_id_string>,
  theme = <DigitalIdentitySelfieLivenessFlowTheme>
)

val helpCenter: EnterpriseHelpCenter = object : EnterpriseHelpCenter {
	override fun isHelpCTAVisible(helpCenterType: EnterpriseHelpCenterType): Boolean {
    return when(helpCentertype) { ... } // true or false
	}

  override fun onHelpCTAClicked(helpCenterType: EnterpriseHelpCenterType): Boolean {
		// Handle helpcenter loading
    return false // or true
	}
}

kycManager.launchSelfieLiveness(
	activity = <Activity>,
	config = config,
	helpCenter = helpCenter
)

kycManager.observeSelfieLiveness(
	owner = <Activity as LifeCycleOwner>
) { result ->
		// Handle Completion
}
```

--------------------------------

### Constructing Authorization Header Value

Source: https://docs.midtrans.com/docs/api-authorization-headers

This example shows the step-by-step process to create the Authorization header value for backend API requests using a Server Key.

```text
SB-Mid-server-abc123cde456:
```

```text
U0ItTWlkLXNlcnZlci1hYmMxMjNjZGU0NTY6
```

```text
Basic U0ItTWlkLXNlcnZlci1hYmMxMjNjZGU0NTY6
```

--------------------------------

### JSON Parameters for Online Installment

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Example of JSON parameters for a backend API request to enable online installments. This includes transaction details and credit card installment configurations for multiple banks.

```json
{
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 120000
  },
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "bca": [3,6,12],
        "bni": [3,6,12],
        "mandiri": [3,6,12],
        "cimb": [3,6,12],
        "bri": [3,6,12]
      }
    }
  }
}
```

--------------------------------

### Backend API Request - Offline Installment (Offline BINs)

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Example of a backend API request to initiate a transaction with offline installment enabled using specific offline BINs. This includes transaction details, credit card configuration, and the list of applicable BINs.

```json
{
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 120000
  },
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "offline": [3,6,12]
      }
    },
   	  "offline_bins": [
      "481111",
      "410505"
    ],
    "bank": "mandiri"
  }
}
```

--------------------------------

### Migrate Selfie Liveness Configuration and Launch (Before)

Source: https://docs.midtrans.com/docs/migration-guide

Example of the previous configuration and launch for Selfie Liveness using the Digital Identity SDK.

```kotlin
val config = DigitalIdentitySelfieLivenessConfig(
	baseUrl = <base_url_string>,
  token = <token_string>,
  correlationId = <correlation_id_string>,
  theme = <DigitalIdentitySelfieLivenessFlowTheme>
)

val helpCenter: DigitalIdentityHelpCenter = object : DigitalIdentityHelpCenter {
	override fun isHelpCTAVisible(helpCenterType: HelpCenterType): Boolean {
    return when(helpCentertype) { ... } // true or false
	}

  override fun onHelpCTAClicked(helpCenterType: HelpCenterType): Boolean {
		// Handle helpcenter loading
    return false // or true
	}
}

sdkInstance.launchSelfieLiveness(
	activity = <Activity>,
	config = config,
	helpCenter = helpCenter
)

sdkInstance.observeSelfieLiveness(
	owner = <Activity as LifeCycleOwner>
) { result ->
		// Handle Completion
}
```

--------------------------------

### Install Midtrans Skills with CLI

Source: https://docs.midtrans.com/docs/building-on-midtrans-with-ai

Use this command to automatically add the Midtrans agent skills to your project. Ensure you have the skills CLI installed.

```bash
npx skills add https://github.com/veritrans/midtrans-agent-skills --yes
```

--------------------------------

### Initiate Snap Payment with Callbacks (Pop Up Mode)

Source: https://docs.midtrans.com/docs/snap-snap-integration-guide.md

This example demonstrates how to initiate the Snap checkout modal and handle payment status updates using callback functions. It includes handlers for success, pending, error, and close events. Remember to replace placeholders with your client key and transaction token.

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- @TODO: replace SET_YOUR_CLIENT_KEY_HERE with your client key -->
    <script type="text/javascript"
      src="https://app.sandbox.midtrans.com/snap/snap.js"
      data-client-key="SET_YOUR_CLIENT_KEY_HERE"></script>
    <!-- Note: replace with src="https://app.midtrans.com/snap/snap.js" for Production environment -->
  </head>

  <body>
    <button id="pay-button">Pay!</button>

    <script type="text/javascript">
      // For example trigger on button clicked, or any time you need
      var payButton = document.getElementById('pay-button');
      payButton.addEventListener('click', function () {
        // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token
        window.snap.pay('TRANSACTION_TOKEN_HERE', {
          onSuccess: function(result){
            /* You may add your own implementation here */
            alert("payment success!"); console.log(result);
          },
          onPending: function(result){
            /* You may add your own implementation here */
            alert("wating your payment!"); console.log(result);
          },
          onError: function(result){
            /* You may add your own implementation here */
            alert("payment failed!"); console.log(result);
          },
          onClose: function(){
            /* You may add your own implementation here */
            alert('you closed the popup without finishing the payment');
          }
        })
      });
    </script>
  </body>
</html>
```

--------------------------------

### Sample Request (Backend)

Source: https://docs.midtrans.com/docs/api-authorization-headers

Example cURL request demonstrating the use of Content-Type, Accept, and Authorization headers for a backend API call.

```APIDOC
### Sample Request

```curl
curl -X POST \
  https://app.sandbox.midtrans.com/snap/v1/transactions \
  -H 'Accept: application/json'\
  -H 'Authorization: Basic U0ItTWlkLXNlcnZlci1hYmMxMjNjZGU0NTY6' \
  -H 'Content-Type: application/json' \
  -d '{
    "transaction_details": {
        "order_id": "YOUR-ORDERID-123456",
        "gross_amount": 10000
    }
}'
```
```

--------------------------------

### Initialize Digital Identity SDK (Android)

Source: https://docs.midtrans.com/docs/face-verification-flow

Use the `getInstance` method of the `DigitalIdentityProvider` class to get the SDK instance for Android. Refer to the provided link for detailed instructions.

```java
Use the [getInstance](https://docs.midtrans.com/docs/digital-identity-getting-started-android#initialise-sdk-instance) method of DigitalIdentityProvider class to get Sdk instance.
```

--------------------------------

### Correct Item Details Structure with Bundled Adjustments

Source: https://docs.midtrans.com/docs/technical-faq?id=how-should-i-include-internal-fee-tax-discount-in-item_details-api-params

This example shows how to bundle multiple adjustments like fees, taxes, and discounts into a single 'Misc Fee' item. The price can be negative for discounts.

```json
{
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 10400
  },
  "item_details": [
    {
      "name": "Apple",
      "price": 7000,
      "quantity": 1,
      "id": "SKU-01"
    },
    {
      "name": "Orange",
      "price": 3000,
      "quantity": 1,
      "id": "SKU-02"
    },
    {
      "name": "Misc Fee",
      "price": 400, 
      "quantity": 1,
      "id": "D01"
    }
  ]
}
```

--------------------------------

### Initialise SDK Instance

Source: https://docs.midtrans.com/docs/digital-identity-getting-started-android

This snippet shows how to get an instance of the DigitalIdentitySdk using the DigitalIdentityProvider.getInstance() method. It requires the application context, client configuration, an event tracker, and an optional HTTP client.

```APIDOC
## Initialise SDK Instance

### Description

This method initializes and returns an instance of the DigitalIdentitySdk. This instance is used to start various SDK flows.

### Method

`DigitalIdentityProvider.getInstance()`

### Parameters

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

### Request Example

```kotlin
private val myClientConfig: DigitalIdentityClientConfig
private val myEventTracker: IDigitalIdentityEventTracker
private val myHttpClient: OkHttpClient

val instance: DigitalIdentitySdk = DigitalIdentityProvider.getInstance(
   appContext = applicationContext,
   clientConfig = myClientConfig,
   eventTracker = myEventTracker,
   httpClient = myHttpClient
)
```

### Response

#### Success Response

- **DigitalIdentitySdk** - The initialized DigitalIdentitySdk instance.

#### Response Example

```kotlin
// The returned instance is of type DigitalIdentitySdk
val digitalIdentitySdkInstance: DigitalIdentitySdk = ... // result of getInstance call
```

### Properties Details:

*   **appContext**: Application context.
*   **clientConfig**: Instance of **DigitalIdentityClientConfig** for user configuration.
    *   **userId** (Int) - Required - The unique identifier for the user.
    *   **userName** (String) - Optional - The username associated with the user. Defaults to an empty string.
    *   **environment** (ClientEnvironment) - Optional - The environment to use for the SDK. Defaults to `ClientEnvironment.PRODUCTION`.
        *   Enum values: `STAGING`, `PRODUCTION`.
*   **eventTracker**: Implementation of `IDigitalidentityEventTracker` for tracking events.
*   **httpClient**: Optional parameter to provide a custom `OkHttpClient` implementation.
```

--------------------------------

### Install Midtrans Snap Plugin via Composer

Source: https://docs.midtrans.com/docs/install-cms-plugins

Use these commands to install the Midtrans Snap plugin using Composer. Ensure Composer is installed and you have a Magento Marketplace account.

```bash
composer require midtrans/snap
```

```bash
bin/magento module:enable Midtrans_Snap
```

```bash
bin/magento setup:upgrade
```

```bash
bin/magento cache:flush
```

--------------------------------

### Register Card Endpoint Demo

Source: https://docs.midtrans.com/docs/technical-faq

Frontend integration example for the Core API /register card endpoint. This demo shows how to initiate card registration from a web interface.

```html
<!DOCTYPE html>
<html>
<head>
<title>Midtrans - Register Card</title>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://app.midtrans.com/snap/snap.js" data-client-key="YOUR_CLIENT_KEY"></script>
</head>
<body>

<button id="pay-button">Pay!</button>

<script type="text/javascript">
  $("#pay-button").click(function(event) {
    event.preventDefault();
    // Sample data for registration
    var payload = {
      "card_number": "4111111111111111",
      "card_exp_month": "12",
      "card_exp_year": "2025",
      "card_cvv": "123",
      "gross_amount": 10000,
      "order_id": "order_id_" + Math.random().toString(36).substr(2, 9),
      "customer_details": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "081234567890"
      }
    };

    $.ajax({
      url: 'https://api.midtrans.com/v1/cards/register',
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic <YOUR_SERVER_KEY_BASE64>'
      },
      data: JSON.stringify(payload),
      success: function(response) {
        console.log('Registration successful:', response);
        // Handle success, e.g., display a message or redirect
      },
      error: function(xhr, status, error) {
        console.error('Registration failed:', error, xhr.responseText);
        // Handle error
      }
    });
  });
</script>

</body>
</html>
```

--------------------------------

### Configure Installment Options with Minimum Amount

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Set up installment payment requirements, specify bank terms, and define minimum transaction amounts for both online (e.g., BNI) and offline installments.

```json
{
  "transaction_details": {
    "order_id": "ORDER-101",
    "gross_amount": 10000
  },
  "credit_card": {
    "installment": {
      "required": false,
      "terms": {
        "bni": [3, 6, 12]
      },
      "minimum_amount": {
        "bni": 100000,
			  "offline" : 50000
      }
    }
  }
}
```

--------------------------------

### Configure Online Installment in JSON

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Use this JSON structure to configure online installment options. Set 'required' to true to enforce installment payments or false to offer it as an option. Specify bank names and their available installment terms.

```json
{
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "<bank-name>": [ <installment terms as array of integers> ]
      }
    }
  }
}
```

--------------------------------

### GoPay Transaction Response Example

Source: https://docs.midtrans.com/docs/gopay-qris-pos-integration

This example shows a typical API response when creating a GoPay transaction, including status messages and channel response codes.

```text
...
"status_message":"GO-PAY transaction is rejected"
"transaction_status":"deny"
"channel_response_code":"900"
...
```

--------------------------------

### Card Payment Notification Example

Source: https://docs.midtrans.com/docs/https-notification-webhooks

This example demonstrates the structure of a notification webhook for a card payment, including transaction details and masked card information.

```APIDOC
## POST /webhooks/notification

### Description
Receives notification from Midtrans about transaction status updates.

### Method
POST

### Endpoint
/webhooks/notification

### Request Body
- **transaction_time** (String) - Required - Time at which the transaction initiated. Format: YYYY-MM-DD HH:MM:SS.
- **transaction_status** (String) - Required - The transaction status. Refer to [Transaction Status](#b-status-definition-b).
- **transaction_id** (String) - Required - The unique identifier for the transaction.
- **status_message** (String) - Required - A message describing the transaction status.
- **status_code** (String) - Required - The code representing the transaction status.
- **signature_key** (String) - Required - A key to verify the authenticity of the notification. Refer to [Verifying Notification Authenticity](#b-verifying-notification-authenticity-b).
- **payment_type** (String) - Required - The type of payment method used.
- **order_id** (String) - Required - The order ID associated with the transaction.
- **merchant_id** (String) - Required - The ID of the merchant initiating the transaction.
- **masked_card** (String) - Optional - The first six and last four digits of the customer's credit card number.
- **gross_amount** (String) - Required - The total amount of the transaction.
- **fraud_status** (String) - Required - The fraud status of the transaction.
- **currency** (String) - Required - The currency used for the transaction.

### Request Example
```json
{
  "transaction_time": "2021-06-23 10:55:24",
  "transaction_status": "settlement",
  "transaction_id": "b3a40398-d95d-4bb9-afe8-9a57bc0786ea",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "35c4111539e184b268b7c1cd62a9c254e5d27c992c8fd55084f930b69b09eaafcfe14b0d512c697648295fdb45de777e1316b401f4729846a91b3de88cde3f05",
  "payment_type": "akulaku",
  "order_id": "akulaku-01",
  "merchant_id": "G141532850",
  "masked_card": "411111******1111",
  "gross_amount": "130000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```

### Response
#### Success Response (200)
- **transaction_time** (String) - Time at which the transaction initiated.
- **transaction_status** (String) - The transaction status of the transaction.
- **transaction_id** (String) - The transaction id of the specific transaction.
- **status_message** (String) - The status message.
- **status_code** (String) - The transaction status code.
- **signature_key** (String) - The Signature Key.
- **settlement_time** (String) - Time when the transaction was settled.
- **payment_type** (String) - The type of payment method used.
- **order_id** (String) - The order id of the transaction.
- **merchant_id** (String) - Merchant ID which initiated the transaction.
- **masked_card** (String) - The first six-digit and last four-digit of customer's credit card number.
- **gross_amount** (String) - Total amount for which the transaction was done.
- **fraud_status** (String) - The fraud status of the transaction.
- **currency** (String) - The currency used for the transaction.

#### Response Example
```json
{
  "transaction_time": "2021-06-23 10:55:24",
  "transaction_status": "settlement",
  "transaction_id": "b3a40398-d95d-4bb9-afe8-9a57bc0786ea",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "35c4111539e184b268b7c1cd62a9c254e5d27c992c8fd55084f930b69b09eaafcfe14b0d512c697648295fdb45de777e1316b401f4729846a91b3de88cde3f05",
  "settlement_time": "2021-06-23 10:56:55",
  "payment_type": "akulaku",
  "order_id": "akulaku-01",
  "merchant_id": "G141532850",
  "masked_card": "411111******1111",
  "gross_amount": "130000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```
```

--------------------------------

### iOS: Initialize WKWebView Configuration

Source: https://docs.midtrans.com/docs/digital-identity-integration-web-webview

Create a WKWebView with a configuration that allows inline media playback, disables user action for playback, and enables JavaScript. This setup is crucial for embedding the H5 flow.

```swift
let configuration = WKWebViewConfiguration()
configuration.allowsInlineMediaPlayback = true
configuration.mediaTypesRequiringUserActionForPlayback = []
configuration.preferences.javaScriptEnabled = true
configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
webView = WKWebView(frame: self.view.bounds, configuration: configuration)

webView.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(webView)
webView.topAnchor.constraint(equalTo: view.topAnchor).isActive = true
webView.leftAnchor.constraint(equalTo: view.leftAnchor).isActive = true
webView.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true
webView.rightAnchor.constraint(equalTo: view.rightAnchor).isActive = true
```

--------------------------------

### Configure Offline Installment with Whitelist BINs

Source: https://docs.midtrans.com/docs/snap-advanced-feature

This JSON structure configures offline installment payments using a whitelist of specific card BINs. Ensure 'required' is set appropriately to enforce or allow installment payments.

```json
{
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "offline": [ <installment terms as array of integers> ]
      }
    },
    "whitelist_bins": [ <card BINs as array of strings> ],
    "bank": <specify acquirer bank> 
  }
}
```

--------------------------------

### Snap Redirect URL with Options

Source: https://docs.midtrans.com/docs/snap-advanced-feature

When using Snap Redirect mode, append options as query parameters to the Snap redirect_url. This example shows how to set language and GoPay mode.

```text
[redirect_url]?[options1]=[value]&[options2]=[value]
```

```text
https://app.sandbox.midtrans.com/snap/v2/vtweb/cf9534e3-ddf7-43f9-a1b7-5f618d2d1c96?language=en&gopayMode=deeplink
```

--------------------------------

### Sample Failure Response (409 Conflict)

Source: https://docs.midtrans.com/docs/payment-link-api-reference

Example of a failure response when the Order ID has already been taken.

```json
{
   "error_messages": [
       "The Order ID 'order-123' has been taken"
   ]
}
```

--------------------------------

### Register Card API Response Example

Source: https://docs.midtrans.com/docs/coreapi-advanced-features

Example JSON response from the Register Card API. The 'saved_token_id' should be stored for subsequent transactions.

```json
"status_code": "200",
    "saved_token_id": "5211111111111117",
    "transaction_id": "cbd3ff55-2ead-43e9-84c5-5c3b7a8a1814",
    "masked_card": "52111111-1117"
}
```

--------------------------------

### Charge API Response Example

Source: https://docs.midtrans.com/docs/gopay-qris-pos-integration

This is an example of a successful Charge API response for a QRIS transaction. The response includes transaction details and an action to generate the QR code image.

```javascript
{
    "status_code": "201",
    "status_message": "QRIS transaction is created",
    "transaction_id": "1015a919-b03f-450a-bc85-b38202a79a96",
    "order_id": "order102",
    "merchant_id": "G490526303",
    "gross_amount": "789000.00",
    "currency": "IDR",
    "payment_type": "qris",
    "transaction_time": "2021-06-23 15:25:24",
    "transaction_status": "pending",
    "fraud_status": "accept",
    "actions": [
        {
            "name": "generate-qr-code",
            "method": "GET",
            "url": "https://api.midtrans.com/v2/qris/1015a919-b03f-450a-bc85-b38202a79a96/qr-code"
        }
    ],
    "qr_string": "00020101021226620014COM.GO-JEK.WWW011993600914349052630340210G4905263030303UKE51440014ID.CO.QRIS.WWW0215AID0607336128660303UKE5204341453033605802ID5904Test6007BANDUNG6105402845409789000.0062475036c032f87c-f773-4619-aefa-675e1f06f9210703A016304A623",
    "acquirer": "gopay"
}
```

--------------------------------

### Implement and Use FeatureCallback

Source: https://docs.midtrans.com/docs/feature-manager

Example of creating a concrete `FeatureCallback` and wrapping it with `AnyFeatureCallback` for use with the SDK. Ensure a strong reference to the callback instance is maintained.

```swift
final class VerifyFeatureCallback: FeatureCallback {
    typealias Result = VerifyResult

    func onComplete(result: VerifyResult, data: [String: Any]) {
        if let correlationId = result.result[GPEConstants.correlationId] as? String {
            print("Correlation ID: \(correlationId)")
        } else {
            print("Missing CORRELATION_ID in VerifyResult")
        }
    }

    func onError(error: GoPayEnterpriseError) {
        print("Error [\(error.code)]: \(error.message)")
    }
}

let callback = VerifyFeatureCallback()

try sdk.getFeatureManager().verify(
    viewController: self,
    request: request,
    credentialReceiver: credentialReceiver,
    callback: AnyFeatureCallback(wrapping: callback)
)
```

--------------------------------

### Online Installment Payment

Source: https://docs.midtrans.com/docs/coreapi-advanced-features

This section describes how to process online installment payments. Online installments occur when the card issuing bank and the acquiring bank are the same. To enable this, you need a special installment MID from the bank and must include `installment_term` and `bank` parameters in your API request.

```APIDOC
## POST /v2/charge - Online Installment

### Description
Processes an online installment payment using a credit card. This requires a pre-arranged installment MID and specific parameters in the request body.

### Method
POST

### Endpoint
https://api.sandbox.midtrans.com/v2/charge

### Parameters
#### Request Body
- **payment_type** (string) - Required - Set to "credit_card".
- **transaction_details** (object) - Required - Contains order details.
  - **order_id** (string) - Required - Unique identifier for the order.
  - **gross_amount** (integer) - Required - The total transaction amount.
- **credit_card** (object) - Required - Contains credit card payment details.
  - **token_id** (string) - Required - Token ID obtained from the Get Card Token step.
  - **authentication** (boolean) - Optional - Flag to enable 3DS authentication. Defaults to false if not provided.
  - **bank** (string) - Required - The name of the Card Issuing Bank or Acquiring Bank (e.g., "bni"). If omitted, it's treated as Offline Installment.
  - **installment_term** (integer) - Required - The tenor of the installment in months (e.g., 3).

### Request Example
```json
{
  "payment_type": "credit_card",
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 120000
  },
  "credit_card": {
    "token_id": "<token_id from Get Card Token Step>",
    "authentication": true,
    "bank": "bni",
    "installment_term": 3
  }
}
```

### Response
#### Success Response (200)
- **token** (string) - Transaction token.
- **transaction_status** (string) - Status of the transaction.
- **order_id** (string) - Order ID.
- **payment_type** (string) - Type of payment.
- **gross_amount** (string) - Total amount.
- **installment_terms** (object) - Details about installment terms if applicable.
  - **bank** (string) - The bank used for installment.
  - **installment_term** (string) - The selected installment tenor.
  - **installment_rate** (string) - The installment interest rate.
  - **total_amount** (string) - The total amount including interest.

#### Response Example
```json
{
  "token": "some-transaction-token",
  "transaction_status": "pending",
  "order_id": "CustOrder-102",
  "payment_type": "credit_card",
  "gross_amount": "120000",
  "installment_terms": {
    "bni": {
      "3": {
        "installment_rate": "0.1",
        "total_amount": "121200"
      }
    }
  }
}
```
```

--------------------------------

### Initialize DigitalIdentitySdk Instance

Source: https://docs.midtrans.com/docs/digital-identity-getting-started-android

Instantiate the DigitalIdentitySdk using the provided application context, client configuration, event tracker, and an optional HTTP client. This instance is used to start SDK flows.

```kotlin
private val myClientConfig: DigitalIdentityClientConfig
private val myEventTracker: IDigitalIdentityEventTracker
private val myHttpClient: OkHttpClient

val instance: DigitalIdentitySdk = DigitalIdentityProvider.getInstance(
   appContext = applicationContext,
   clientConfig = myClientConfig,
   eventTracker = myEventTracker,
   httpClient = myHttpClient
)
```

--------------------------------

### Sample Charge API Request with Online Installment

Source: https://docs.midtrans.com/docs/snap-advanced-feature

A cURL command demonstrating a POST request to the Snap API for creating a transaction with online installment options. It specifies transaction details and limited installment terms for selected banks.

```curl
curl -X POST \
  https://app.sandbox.midtrans.com/snap/v1/transactions \
  -H 'Accept: application/json'\
  -H 'Authorization: Basic U0ItTWlkLXNlcnZlci1UT3ExYTJBVnVpeWhoT2p2ZnMzVV7LZU87' \
  -H 'Content-Type: application/json' \
  -d '{
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 120000
  },
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "bca": [6,12],
        "bni": [6,12],
        "mandiri": [3,6,12]
      }
    }
  }
}'
```

--------------------------------

### Sample API Request with 3D Secure Enabled

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Example of a cURL request to the Snap API with 3D Secure enabled for the credit card transaction.

```curl
curl -X POST \
  https://app.sandbox.midtrans.com/snap/v1/transactions \
  -H 'Accept: application/json'\
  -H 'Authorization: Basic U0ItTWlkLXNlcnZlci1UT3ExYTJBVnVpeWhoT2p2ZnMzVV7LZU87' \
  -H 'Content-Type: application/json' \
  -d '{ \
  "transaction_details": { \
    "order_id": "CustOrder-102", \
    "gross_amount": 9000 \
  }, \
  "credit_card": { \
    "secure": true \
  } \
}'
```

--------------------------------

### Akulaku Payment Notification Example

Source: https://docs.midtrans.com/docs/https-notification-webhooks

Example JSON payload for an Akulaku payment notification. This structure includes transaction details, status, and amounts.

```json
{
  "transaction_time": "2021-06-23 10:55:24",
  "transaction_status": "settlement",
  "transaction_id": "b3a40398-d95d-4bb9-afe8-9a57bc0786ea",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "35c4111539e184b268b7c1cd62a9c254e5d27c992c8fd55084f930b69b09eaafcfe14b0d512c697648295fdb45de777e1316b401f4729846a91b3de88cde3f05",
  "settlement_time": "2021-06-23 10:56:55",
  "payment_type": "akulaku",
  "order_id": "akulaku-01",
  "merchant_id": "G141532850",
  "gross_amount": "130000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```

--------------------------------

### Backend API Request - Offline Installment (Whitelist BINs)

Source: https://docs.midtrans.com/docs/snap-advanced-feature

This JSON payload demonstrates a backend API request for a transaction using offline installment with a predefined whitelist of card BINs. It specifies transaction details and credit card installment settings.

```json
{
  "transaction_details": {
    "order_id": "CustOrder-102",
    "gross_amount": 120000
  },
  "credit_card": {
    "secure": true,
    "installment": {
      "required": true,
      "terms": {
        "offline": [3,6,12]
      }
    },
    "whitelist_bins": [
      "481111",
      "410505"
    ],
    "bank": "mandiri"
  }
}
```

--------------------------------

### Initiate GoPay Transaction with Python

Source: https://docs.midtrans.com/docs/coreapi-e-money-integration

This Python code snippet shows how to initiate a GoPay transaction using the midtransclient PIP package. Install the package and configure your API credentials.

```python
#Install [**midtransclient**](https://github.com/Midtrans/midtrans-python-client) PIP package.
#pip install midtransclient

#SAMPLE REQUEST START HERE


import midtransclient
# Create Core API instance
core_api = midtransclient.CoreApi(
    is_production=False,
    server_key='YOUR_SERVER_KEY',
    client_key='YOUR_CLIENT_KEY'
)
# Build API parameter
param = {
    "payment_type": "gopay",
    "transaction_details": {
        "gross_amount": 12145,
        "order_id": "test-transaction-54321",
    },
    "gopay": {
        "enable_callback": true,                # optional
        "callback_url": "someapps://callback"   # optional
    }
}

# charge transaction
charge_response = core_api.charge(param)
```

--------------------------------

### Launch Full KYC Verification with EnterpriseKYCVerificationConfig

Source: https://docs.midtrans.com/docs/kyc-sdk

Start the complete KYC verification flow. This requires an EnterpriseKYCVerificationConfig object with essential parameters and handles completion or error states by printing relevant information.

```swift
// 5. KYC verification (full flow)
let kycConfig = EnterpriseKYCVerificationConfig(
    baseUrl: "https://kyc.example.com",
    token: "user-jwt-token",
    correlationId: "user-correlation-id",
    language: .id
)

kycManager.launchKYCVerification(config: kycConfig, from: self, helpCenter: self) { result in
    switch result.status {
    case .completed:
        print("KYC complete. Submission ID: \(result.submissionId ?? \"")")
    case .notCompleted, .error:
        let code = result.extra?.errorCode?.rawValue ?? "none"
        let message = result.extra?.errorMessage ?? ""
        print("KYC did not complete [\(code)]: \(message)")
    }
}
```

--------------------------------

### Embed Snap Modal - Basic Example

Source: https://docs.midtrans.com/docs/snap-snap-integration-guide.md

This snippet demonstrates the basic integration of the Snap modal. Ensure you replace 'SET_YOUR_CLIENT_KEY_HERE' with your actual client key and 'YOUR_SNAP_TOKEN' with your transaction token. The script loads the Snap.js library and embeds the modal into a div with the ID 'snap-container' when a button is clicked.

```html
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- @TODO: replace SET_YOUR_CLIENT_KEY_HERE with your client key -->
  <script type="text/javascript"
		src="https://app.stg.midtrans.com/snap/snap.js"
    data-client-key="SET_YOUR_CLIENT_KEY_HERE"></script>
  <!-- Note: replace with src="https://app.midtrans.com/snap/snap.js" for Production environment -->
</head>

<body>
  <button id="pay-button">Pay!</button>

  <!-- @TODO: You can add the desired ID as a reference for the embedId parameter. -->
  <div id="snap-container"></div>

  <script type="text/javascript">
    // For example trigger on button clicked, or any time you need
    var payButton = document.getElementById('pay-button');
    payButton.addEventListener('click', function () {
      // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token.
      // Also, use the embedId that you defined in the div above, here.
      window.snap.embed('YOUR_SNAP_TOKEN', {
        embedId: 'snap-container'
      });
    });
  </script>
</body>

</html>
```

--------------------------------

### Initialize GoPayEnterprise SDK (After)

Source: https://docs.midtrans.com/docs/migration-guide

Demonstrates the initialization of the new GoPayEnterprise SDK using GoPayEnterpriseFactory.createEnterpriseSdk(). Includes obtaining the KycManager.

```kotlin
val configuration = GoPayEnterpriseConfiguration(
	clientID = <client_id_string>,
  environment = GoPayEnterpriseEnvironment.PRODUCTION, // or .GoPayEnterpriseEnvironment.STAGING
  enableDebugLogs = true, // or false
  additionalData = emptymap(),
  locale = GoPayEnterpriseLocale.en // or GoPayEnterpriseLocale.id
)

val sdk = GoPayEnterpriseFactory.createEnterpriseSdk(
	context = applicationContext,
  configuration = configuration,
  callbackDelegate = <GoPayEnterpriseCallbackDelegate>
)

// Obtain KycManager from the initialized SDK instance
val kycManager = sdk.getKycManager()
```

--------------------------------

### Sample API Request with Card Saving Enabled

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Example of a cURL request to the Snap API to enable card saving for future transactions.

```curl
curl -X POST \
  https://app.sandbox.midtrans.com/snap/v1/transactions \
  -H 'Accept: application/json'\
  -H 'Authorization: Basic U0ItTWlkLXNlcnZlci1UT3ExYTJBVnVpeWhoT2p2ZnMzVV7LZU87' \
  -H 'Content-Type: application/json' \
  -d '{ \
  "transaction_details": { \
    "order_id": "CustOrder-102", \
    "gross_amount": 9000 \
  }, \
  "credit_card": { \
    "secure": true, \
    "save_card": true \
  }, \
  "user_id": "budiSusanto201" \
}'
```

--------------------------------

### Configure Offline Installment with Offline BINs

Source: https://docs.midtrans.com/docs/snap-advanced-feature

Use this JSON structure to configure offline installment payments by specifying an array of card BINs that support this feature. Set 'required' to true to enforce installment payment or false to allow regular full payment.

```json
{
    "credit_card": {
        "secure": true,
        "installment": {
            "required": true,
            "offline_bins": [<card BINs as array of strings>],
            "terms": {
                "offline": [ <installment terms as array of integers>]
            }
        },
        "bank": <specify acquirer bank> 
    }
}
```
