# dokumentasi midtrans
https://biteship.com/id/docs/intro
https://context7.com/websites/biteship_id/llms.txt?tokens=10000

################
### API Response Example

Source: https://biteship.com/id/docs/api/draft_orders/retrieve_rates

This is an example of a successful API response when retrieving draft order rates. It details origin, destination, and available courier pricing.

```json
{
    "success": true,
    "object": "courier_pricing",
    "message": "Success to retrieve courier pricing",
    "code": 20001003,
    "origin": {
        "location_id": null,
        "latitude": null,
        "longitude": null,
        "postal_code": 12430,
        "country_name": "Indonesia",
        "country_code": "ID",
        "administrative_division_level_1_name": "DKI Jakarta",
        "administrative_division_level_1_type": "province",
        "administrative_division_level_2_name": "Jakarta Selatan",
        "administrative_division_level_2_type": "city",
        "administrative_division_level_3_name": "Cilandak",
        "administrative_division_level_3_type": "district",
        "administrative_division_level_4_name": "Cilandak Barat",
        "administrative_division_level_4_type": "subdistrict",
        "address": null
    },
    "stops": [],
    "destination": {
        "location_id": null,
        "latitude": null,
        "longitude": null,
        "postal_code": 10210,
        "country_name": "Indonesia",
        "country_code": "ID",
        "administrative_division_level_1_name": "DKI Jakarta",
        "administrative_division_level_1_type": "province",
        "administrative_division_level_2_name": "Jakarta Pusat",
        "administrative_division_level_2_type": "city",
        "administrative_division_level_3_name": "Tanah Abang",
        "administrative_division_level_3_type": "district",
        "administrative_division_level_4_name": "Bendungan Hilir",
        "administrative_division_level_4_type": "subdistrict",
        "address": null
    },
    "pricing": [
        {
            "available_collection_method": [
                "pickup"
            ],
            "available_for_cash_on_delivery": false,
            "available_for_proof_of_delivery": false,
            "available_for_instant_waybill_id": true,
            "available_for_insurance": true,
            "company": "grab",
            "courier_name": "GRAB",
            "courier_code": "grab",
            "courier_service_name": "Instant",
            "courier_service_code": "instant",
            "description": "Instant service for on demand needs.",
            "duration": "1 - 3 Hours",
            "shipment_duration_range": "1 - 3",
            "shipment_duration_unit": "hours",
            "service_type": "same_day",
            "shipping_type": "parcel",
            "price": 11000,
            "type": "instant"
        },
        {
            "available_collection_method": [
                "pickup"
            ],
            "available_for_cash_on_delivery": true,
            "available_for_proof_of_delivery": false,
            "available_for_instant_waybill_id": true,
            "available_for_insurance": true,
            "company": "anteraja",
            "courier_name": "AnterAja",
            "courier_code": "anteraja",
            "courier_service_name": "Reguler",
            "courier_service_code": "reg",
            "description": "Regular shipment",
            "duration": "2 days",
            "shipment_duration_range": "2",
            "shipment_duration_unit": "days",
            "service_type": "standard",
            "shipping_type": "parcel",
            "price": 10000,
            "type": "reg"
        },
        {
            "available_collection_method": [
                "pickup"
            ],
            "available_for_cash_on_delivery": true,
            "available_for_proof_of_delivery": false,
            "available_for_instant_waybill_id": true,
            "available_for_insurance": true,
            "company": "sicepat",
            "courier_name": "SiCepat",
            "courier_code": "sicepat",
            "courier_service_name": "Reguler",
            "courier_service_code": "reg",
            "description": "Layanan reguler",
            "duration": "1 - 2 days",
            "shipment_duration_range": "1 - 2",
            "shipment_duration_unit": "days",
            "service_type": "standard",
            "shipping_type": "parcel",
            "price": 11500,
            "type": "reg"
        },
        {
            "available_collection_method": [
                "pickup"
            ],
            "available_for_cash_on_delivery": true,
            "available_for_proof_of_delivery": false,
            "available_for_instant_waybill_id": true,
            "available_for_insurance": true,
            "company": "sap",
            "courier_name": "SAP",
            "courier_code": "sap",
            "courier_service_name": "Regular Service",
            "courier_service_code": "reg"
        }
    ]
}
```

--------------------------------

### API Response Example

Source: https://biteship.com/id/docs/api/locations/retrieve

This is an example of a successful API response when retrieving location data. It includes the location's ID, name, contact information, and address.

```JSON
{
   "success": true,
   "id": "61d565c69a3211036a05f3f8",
   "name": "Apotek Gambir",
   "contact_name": "Ahmad",
   "contact_phone": "08123456789",
   "address": "Jl. Gambir Selatan no 5. Blok F 92. Jakarta Pusat."
}
```

--------------------------------

### Courier Pricing API Response Example

Source: https://biteship.com/id/docs/api/rates/retrieve

This is an example of a successful API response for retrieving courier pricing. It includes details about the origin and destination, as well as a list of pricing options from different couriers. Each option specifies fees, discounts, surcharges, and the final price.

```json
{
  "success": true,
  "object": "courier_pricing",
  "message": "Success to retrieve courier pricing",
  "code": 20001007,
  "origin": {
    "location_id": "5dad2bf246d52d72b87378f6",
    "latitude": -6.3031123,
    "longitude": 106.7794934999,
    "postal_code": 12440,
    "country_name": "Indonesia",
    "country_code": "ID",
    "administrative_division_level_1_name": "DKI Jakarta",
    "administrative_division_level_1_type": "province",
    "administrative_division_level_2_name": "Jakarta Selatan",
    "administrative_division_level_2_type": "city",
    "administrative_division_level_3_name": "Cilandak",
    "administrative_division_level_3_type": "district",
    "administrative_division_level_4_name": "Lebak bulus",
    "administrative_division_level_4_type": "subdistrict",
    "address": "Jl. RS. Fatmawati Raya No.29, RT.8/RW.4, Cilandak Bar., Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430, Indonesia"
  },
  "destination": {
    "location_id": "5dad2bf246d52d72b87378f6",
    "latitude": -6.2441792,
    "longitude": 106.783529,
    "postal_code": 12240,
    "country_name": "Indonesia",
    "country_code": "ID",
    "administrative_division_level_1_name": "DKI Jakarta",
    "administrative_division_level_1_type": "province",
    "administrative_division_level_2_name": "Jakarta Selatan",
    "administrative_division_level_2_type": "city",
    "administrative_division_level_3_name": "Cilandak",
    "administrative_division_level_3_type": "district",
    "administrative_division_level_4_name": "Lebak bulus",
    "administrative_division_level_4_type": "subdistrict",
    "address": "Jl. RS. Fatmawati Raya No.29, RT.8/RW.4, Cilandak Bar., Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430, Indonesia"
  },
  "pricing": [
    {
      "available_collection_method": ["pickup"],
      "available_for_cash_on_delivery": true,
      "available_for_proof_of_delivery": true,
      "available_for_instant_waybill_id": true,
      "available_for_insurance": false,
      "company": "jne",
      "courier_name": "JNE",
      "courier_code": "jne",
      "courier_service_name": "City to City (CTC)",
      "courier_service_code": "ctc",
      "currency": "IDR",
      "description": "Pengiriman city to city",
      "duration": "2 - 3 days",
      "shipment_duration_range": "2 - 3",
      "shipment_duration_unit": "days",
      "service_type": "standard",
      "shipping_type": "parcel",
      "shipping_fee": 9000,
      "shipping_fee_discount": 0,
      "shipping_fee_surcharge": 0,
      "insurance_fee": 0,
      "cash_on_delivery_fee": 2000,
      "price": 11000,
      "tax_lines": [],
      "type": "ctc"
    },
    {
      "available_collection_method": ["pickup"],
      "available_for_cash_on_delivery": true,
      "available_for_proof_of_delivery": false,
      "available_for_instant_waybill_id": true,
      "available_for_insurance": true,
      "company": "sicepat",
      "courier_name": "SiCepat",
      "courier_code": "sicepat",
      "courier_service_name": "Reguler",
      "courier_service_code": "reg",
      "currency": "IDR",
      "description": "Layanan reguler",
      "duration": "1 - 2 days",
      "shipment_duration_range": "1 - 2",
      "shipment_duration_unit": "days",
      "service_type": "standard",
      "shipping_type": "parcel",
      "shipping_fee": 32000,
      "shipping_fee_discount": 0,
      "shipping_fee_surcharge": 0,
      "insurance_fee": 1000,
      "cash_on_delivery_fee": 2000,
      "price": 35000,
      "tax_lines": [],
      "type": "reg"
    },
    {
      "available_collection_method": ["pickup"],
      "available_for_cash_on_delivery": true,
      "available_for_proof_of_delivery": false,
      "available_for_instant_waybill_id": true,
      "available_for_insurance": true,
      "company": "sicepat",
      "courier_name": "SiCepat",
      "courier_code": "sicepat",

```

--------------------------------

### API Response Example

Source: https://biteship.com/id/docs/api/draft_orders/confirm

This is an example of a successful API response when a draft order is confirmed. It includes details of the newly created order, such as its ID, reference ID, shipper, origin, destination, courier information, and the items included.

```json
{
    "success": true,
    "message": "Order successfully created",
    "object": "order",
    "id": "66eba364e2e5a64816928197",
    "draft_order_id": "ef18275c-02a9-4887-a56b-f374edb96ec4",
    "shipper": {
        "name": "Amir",
        "email": "amir@example.com",
        "phone": "081234567901",
        "organization": "Biteship Test"
    },
    "origin": {
        "contact_name": "John Doe",
        "contact_phone": "081234567902",
        "coordinate": {
            "latitude": null,
            "longitude": null
        },
        "address": "CITOS - Cilandak Town Square, Kota Jakarta Selatan, Jakarta 12430",
        "note": "-",
        "postal_code": 12430,
        "collection_method": "pickup"
    },
    "destination": {
        "contact_name": "Jack Doe",
        "contact_phone": "081234567903",
        "contact_email": "jackdoe@example.com",
        "address": "Jl. Contoh No. 123",
        "note": "-",
        "proof_of_delivery": {
            "use": false,
            "fee": 0,
            "note": null,
            "link": null
        },
        "cash_on_delivery": {
            "id": null,
            "amount": 0,
            "fee": 0,
            "amount_currency": "IDR",
            "fee_currency": "IDR",
            "note": null,
            "type": null,
            "status": null,
            "payment_status": "pending",
            "payment_method": "cash"
        },
        "coordinate": {
            "latitude": null,
            "longitude": null
        },
        "postal_code": 10210
    },
    "stops": [],
    "courier": {
        "tracking_id": "66eba364e2e5a642a092819a",
        "waybill_id": "000000000000",
        "company": "sicepat",
        "name": null,
        "phone": null,
        "type": "reg",
        "link": "https://track.biteship.com?waybill_id=000000000000",
        "insurance": {
            "amount": 0,
            "fee": 0,
            "amount_currency": "IDR",
            "fee_currency": "IDR",
            "note": ""
        },
        "routing_code": null
    },
    "delivery": {
        "datetime": "2024-09-19T11:07+07:00",
        "note": null,
        "type": "now",
        "distance": null,
        "distance_unit": "kilometer"
    },
    "reference_id": "0000000000",
    "items": [
        {
            "name": "Black Leather Bag",
            "description": "Goods",
            "category": "others",
            "sku": null,
            "value": 30,
            "quantity": 1,
            "length": 1,
            "width": 1,
            "height": 1,
            "weight": 1
        }
    ],
    "extra": [],
    "currency": "IDR",
    "tax_lines": [],
    "price": 11500,
    "metadata": null,
    "note": null,
    "status": "confirmed"
}

```

--------------------------------

### API Response Example

Source: https://biteship.com/id/docs/api/trackings/retrieve

This is an example of the JSON response you will receive when successfully retrieving tracking information. It includes details about the shipment, courier, origin, destination, and a history of tracking events.

```json
{
  "success": true,
  "messsage": "Successfully get tracking info",
  "object": "tracking",
  "id": "6051861741a37414e6637fab",
  "waybill_id": "0123082100003094",
  "courier": {
    "company": "grab",
    "name": "John Doe", // Deprecated
    "phone": "0888888888", // Deprecated
    "driver_name": "John Doe",
    "driver_phone": "0888888888",
    "driver_photo_url": "https://picsum.photos/200",
    "driver_plate_number": "B 1234 ABC"
  },
  "origin": {
    "contact_name": "John Doe",
    "address": "Jl. Medan Merdeka Barat, Gambir, Jakarta Pusat"
  },
  "destination": {
    "contact_name": "Doe John",
    "address": "Jl. Medan Merdeka Timur, Gambir, Jakarta Pusat"
  },
  "history": [
    {
      "note": "Order has been confirmed. Locating nearest driver to pick up.",
      "service_type": "instant",
      "updated_at": "2021-03-16T18:17:00+07:00",
      "status": "confirmed"
    },
    {
      "note": "Courier has been allocated. Waiting to pick up.",
      "service_type": "instant",
      "updated_at": "2021-03-16T21:15:00+07:00",
      "status": "allocated"
    },
    {
      "note": "Courier is on the way to pick up item.",
      "service_type": "instant",
      "updated_at": "2021-03-16T23:12:00+07:00",
      "status": "picking_up"
    },
    {
      "note": "Item has been picked and ready to be shipped.",
      "service_type": "instant",
      "updated_at": "2021-03-16T23:43:00+07:00",
      "status": "picked"
    },
    {
      "note": "Item has been picked and ready to be shipped.",
      "service_type": "instant",
      "updated_at": "2021-03-17T09:29:00+07:00",
      "status": "dropping_off"
    },
    {
      "note": "Item is on the way to customer.",
      "service_type": "instant",
      "updated_at": "2021-03-17T11:15:00+07:00",
      "status": "delivered"
    }
  ],
  "link": "https://example.com/01803918209312093",
  "order_id": "6251863341sa3714e6637fab",
  "status": "delivered"
}
```

--------------------------------

### Example Search Area Request

Source: https://biteship.com/id/docs/api/maps/search_area

Example of a GET request to the Search Area API with parameters for country, input, and type. Trigger calls after user input is complete to avoid excessive requests.

```http
GET /v1/maps/areas?countries=ID&input=Jakarta+Selatan&type=single  
```

--------------------------------

### Draft Order API Response Example

Source: https://biteship.com/id/docs/api/draft_orders/retrieve

This is an example of the JSON response you will receive when successfully retrieving a draft order. It contains all details of the order, including origin, destination, items, and status.

```json
{
  "success": true,  
  "code": 20011004,  
  "object": "draft_order",  
  "id": "ef18275c-02a9-4887-a56b-f374edb96ec4",  
  "order_id": null,  
  "origin": {
    "area_id": "IDNP6IDNC148IDND836IDNZ12430",  
    "address": "CITOS - Cilandak Town Square, Kota Jakarta Selatan, Jakarta 12430",  
    "note": null,  
    "contact_name": "John Doe",  
    "contact_phone": "081234567901",  
    "contact_email": "johndoe@example.com",  
    "coordinate": {
      "latitude": null,  
      "longitude": null  
    },
    "province_name": "DKI Jakarta",  
    "city_name": "Jakarta Selatan",  
    "district_name": "Cilandak",  
    "postal_code": 12430,  
    "collection_method": "pickup"  
  },
  "destination": {
    "area_id": "IDNP6IDNC147IDND835IDNZ10210",  
    "address": "Jl. Contoh No. 12",  
    "note": null,  
    "contact_name": "Jake Doe",  
    "contact_phone": "0812345678902",  
    "contact_email": "jakedoe@example.com",  
    "coordinate": {
      "latitude": null,  
      "longitude": null  
    },
    "province_name": "DKI Jakarta",  
    "city_name": "Jakarta Pusat",  
    "district_name": "Tanah Abang",  
    "postal_code": 10210,  
    "proof_of_delivery": {
      "use": false,  
      "fee": 0,  
      "fee_currency": "IDR",  
      "note": null,  
      "link": null  
    },
    "cash_on_delivery": {
      "payment_method": null,  
      "amount": null,  
      "amount_currency": "IDR",  
      "note": null,  
      "type": null  
    }
  },
  "courier": {
    "name": null,  
    "phone": null,  
    "company": "sicepat",  
    "type": "reg",  
    "link": null,  
    "tracking_id": null,  
    "waybill_id": null,  
    "insurance": {
      "amount": 0,  
      "amount_currency": "IDR",  
      "fee": 0,  
      "fee_currency": "IDR",  
      "note": ""  
    },
    "routing_code": null  
  },
  "delivery": {
    "type": "now",  
    "datetime": "2024-09-19T03:40:22.810Z",  
    "note": null,  
    "distance": null,  
    "distance_unit": "kilometer"  
  },
  "extra": [],  
  "tags": [],  
  "metadata": null,  
  "items": [
    {
      "name": "Black Leather Bag",  
      "description": "Goods",  
      "value": 30,  
      "currency": "IDR",  
      "quantity": 1,  
      "height": 1,  
      "width": 1,  
      "length": 1,  
      "weight": 1  
    }
  ],
  "currency": "IDR",  
  "tax_lines": [],  
  "price": 11500,  
  "status": "ready",  
  "reference_id": "example/35ef876e-3902-4186-873a-e9012ea1e354",  
  "invoice_id": "1209839012839012",  
  "user_id": "6448e9d77ff7510bbadfa605",  
  "created_at": "2024-09-19T03:40:22.802Z",  
  "updated_at": "2024-09-19T03:40:22.802Z",  
  "placed_at": null,  
  "ready_at": "2024-09-19T03:40:22.802Z",  
  "confirmed_at": null,  
  "deleted_at": null  
}
```

--------------------------------

### API Response Example

Source: https://biteship.com/id/docs/api/locations/update

The API will return a JSON object confirming the update, including the modified location details.

```json
{
   "success": true,
   "id": "61d565c69a3211036a05f3f8",
   "name": "Apotek Monas",
   "contact_name": "Ahmad",
   "contact_phone": "08123456789",
   "address": "Jl. Gambir Selatan no 5. Blok F 92. Jakarta Pusat."
}

```

--------------------------------

### Cancellation Reasons Response (English)

Source: https://biteship.com/id/docs/api/orders/delete

Example JSON response when retrieving cancellation reasons in English.

```json
{
    "success": true,
    "message": "Order cancellation reasons successfully retrieved",
    "cancellation_reasons": [
        {
            "code": "change_courier",
            "reason": "Want to change courier"
        },
        {
            "code": "pickup_delay",
            "reason": "Pickup time too long"
        },
        {
            "code": "change_address",
            "reason": "Want to change address"
        },
        {
            "code": "others",
            "reason": "Order cancelled by merchant for other reason"
        }
    ]
}

```

--------------------------------

### Cancellation Reasons Response (Bahasa)

Source: https://biteship.com/id/docs/api/orders/delete

Example JSON response when retrieving cancellation reasons in Bahasa.

```json
{
    "success": true,
    "message": "Order cancellation reasons successfully retrieved",
    "cancellation_reasons": [
        {
            "code": "change_courier",
            "reason": "Ingin mengganti kurir"
        },
        {
            "code": "pickup_delay",
            "reason": "Waktu penjemputan terlalu lama"
        },
        {
            "code": "change_address",
            "reason": "Ingin mengganti alamat"
        },
        {
            "code": "others",
            "reason": "Pesanan dibatalkan oleh pedagang karena alasan lain"
        }
    ]
}

```

--------------------------------

### Get Cancellation Reasons (English)

Source: https://biteship.com/id/docs/api/orders/delete

Retrieve a list of order cancellation reason codes and their descriptions in English.

```http
GET    /v1/orders/cancellation_reasons?lang=en // in english  
```

--------------------------------

### Example Draft Order Rates Response

Source: https://biteship.com/id/docs/api/draft_orders/retrieve_rates

This JSON structure represents the rates available for a draft order. It includes details about each service, such as description, duration, price, and courier information.

```json
{
    "rates": [
        {
            "available_for_cash_on_delivery": false,
            "available_for_proof_of_delivery": false,
            "available_for_instant_waybill_id": true,
            "available_for_insurance": true,
            "company": "jne",
            "courier_name": "JNE",
            "courier_code": "jne",
            "courier_service_name": "OKE",
            "courier_service_code": "oke",
            "description": "Regular Service",
            "duration": "4 days",
            "shipment_duration_range": "4",
            "shipment_duration_unit": "days",
            "service_type": "standard",
            "shipping_type": "parcel",
            "price": 8000,
            "type": "reg"
        },
        {
            "available_for_cash_on_delivery": false,
            "available_for_proof_of_delivery": false,
            "available_for_instant_waybill_id": true,
            "available_for_insurance": true,
            "company": "ninja",
            "courier_name": "Ninja Express",
            "courier_code": "ninja",
            "courier_service_name": "Reguler",
            "courier_service_code": "standard",
            "description": "Layanan reguler",
            "duration": "2 - 3 days",
            "shipment_duration_range": "2 - 3",
            "shipment_duration_unit": "days",
            "service_type": "standard",
            "shipping_type": "parcel",
            "price": 7777,
            "type": "standard"
        }
    ]
}
```

--------------------------------

### Get Cancellation Reasons (Bahasa)

Source: https://biteship.com/id/docs/api/orders/delete

Retrieve a list of order cancellation reason codes and their descriptions in Bahasa Indonesia.

```http
GET    /v1/orders/cancellation_reasons?lang=id // in bahasa  
```

--------------------------------

### Location API Endpoints

Source: https://biteship.com/id/docs/api/locations/overview

Overview of available endpoints for interacting with the Location API. Use POST to create or update, GET to retrieve, and DELETE to remove location data.

```bash
POST    /v1/locations  
GET     /v1/locations/:id  
POST    /v1/locations/:id  
DELETE  /v1/locations/:id  
```

--------------------------------

### Retrieve Draft Order by ID

Source: https://biteship.com/id/docs/api/draft_orders/retrieve

Use this endpoint to get detailed information about a specific draft order. Replace ':id' with the actual ID of the draft order you want to retrieve.

```bash
GET /v1/draft_orders/:id  
```

--------------------------------

### Create Order Parameters

Source: https://biteship.com/id/docs/api/orders/create

This section outlines all the parameters available for creating an order. Each parameter includes its type, whether it's required or optional, and a description of its purpose.

```APIDOC
## Create Order

### Description
This API allows you to create a new order by providing comprehensive details about the shipment, including shipper, origin, destination, courier, and delivery preferences.

### Parameters
#### Shipper Information
- **shipper_contact_name** (string) - Optional - The name of the shipper.
- **shipper_contact_phone** (string) - Optional - The phone number of the shipper.
- **shipper_contact_email** (string) - Optional - The email of the shipper.
- **shipper_organization** (string) - Optional - The organization of the shipper.

#### Origin Information
- **origin_contact_name** (string) - REQUIRED - The name of the person in the pickup location.
- **origin_contact_phone** (string) - REQUIRED - The phone number of the person in the pickup location.
- **origin_contact_email** (string) - Optional - The email of the person in the pickup location.
- **origin_address** (string) - REQUIRED - Complete address of the pickup location.
- **origin_note** (string) - Optional - Additional information of the pickup location to ease pickup process.
- **origin_postal_code** (number) - REQUIRED / OPTIONAL - Postal code of the pickup location.
- **origin_coordinate** (object) - REQUIRED / OPTIONAL - Coordinates of the pickup location. If you use an instant courier, you must use coordinate.
  - **origin_coordinate.latitude** (double) - REQUIRED / OPTIONAL - Latitude of the pickup location.
  - **origin_coordinate.longitude** (double) - REQUIRED / OPTIONAL - Longitude of the pickup location.
- **origin_area_id** (string) - REQUIRED / OPTIONAL - Use area_id from Maps API.
- **origin_location_id** (string) - Optional - Use location_id from Locations API.
- **origin_collection_method** (string) - Optional - Use the available_collection_method from Rates API. Value can be **pickup**, or **drop_off**. Default to **pickup**.

#### Destination Information
- **destination_contact_name** (string) - REQUIRED - The name of the person in the destination location.
- **destination_contact_phone** (string) - REQUIRED - The phone number of the person in the destination location.
- **destination_contact_email** (string) - Optional - The email of the person in the destination location.
- **destination_address** (string) - REQUIRED - Complete address of the destination location.
- **destination_note** (string) - Optional - Additional information of the destination location to ease destination process.
- **destination_postal_code** (number) - REQUIRED / OPTIONAL - Postal code of the destination location.
- **destination_coordinate** (object) - REQUIRED / OPTIONAL - Coordinates of the destination location. If you use an instant courier, you must use coordinate.
  - **destination_coordinate.latitude** (double) - REQUIRED / OPTIONAL - Latitude of the destination location.
  - **destination_coordinate.longitude** (double) - REQUIRED / OPTIONAL - Longitude of the destination location.
- **destination_area_id** (string) - REQUIRED / OPTIONAL - Use area_id from Maps API.
- **destination_location_id** (string) - Optional - Use location_id from Locations API.
- **destination_cash_on_delivery** (number) - Optional - State the COD Amount if you want to activate COD delivery.
- **destination_cash_on_delivery_type** (string) - Optional - The COD disbursement window. Value can be 7_days, 5_days, or 3_days.
- **destination_proof_of_delivery** (boolean) - Optional - Proof of delivery feature.
- **destination_proof_of_delivery_note** (string) - REQUIRED / OPTIONAL - Notes for proof of delivery. It is required if proof of delivery feature is activated.

#### Courier Information
- **courier_company** (string) - REQUIRED - Shipping provider that will be used for this particular shipment. List of available courier can be found using Couriers API.
- **courier_type** (string) - REQUIRED - Courier type based on the courier company used. Value of type can be found within the Rates API and Couriers API.
- **courier_insurance** (number) - Optional - The amount of the insurance value. This is optional if you want to insured your shipment.

#### Delivery Information
- **delivery_type** (string) - REQUIRED - Type of delivery order is now and scheduled. Value can be **now** or **scheduled**.
- **delivery_date** (string) - Optional - The delivery date format: “YYYY-MM-DD”.
- **delivery_time** (string) - Optional - The delivery time format: “HH:mm”.

#### Additional Information
- **order_note** (string) - Optional - Additional information for the shipment.
- **metadata** (object) - Optional - You can insert any kind of data through this object for internal purposes.
- **reference_id** (string) - Optional - You can insert your internal order id here. Must unique for each order id.
- **tags** (array) - Optional -
```

--------------------------------

### GET /v1/draft_orders/:id/rates

Source: https://biteship.com/id/docs/api/draft_orders/error

This endpoint is used to get rates for a draft order. The following error codes can be returned.

```APIDOC
## GET /v1/draft_orders/:id/rates

### Description
Retrieves shipping rates for a specific draft order.

### Method
GET

### Endpoint
/v1/draft_orders/:id/rates

### Errors
- **40011001**: Bad request.
- **40411007**: Draft order with 'id=$DRAFT_ORDER_ID' is not found.
- **42211006**: Draft order with 'id=$DRAFT_ORDER_ID' has been confirmed.

```

--------------------------------

### GET /v1/orders/:id Error Codes

Source: https://biteship.com/id/docs/api/orders/error

These error codes are returned when retrieving order details via the GET /v1/orders/:id endpoint.

```APIDOC
## GET /v1/orders/:id Error Codes

### Description
This section details the error codes associated with the `GET /v1/orders/:id` endpoint.

### Method
GET

### Endpoint
/v1/orders/:id

### Error Codes
- **40002042**: Something went wrong when getting the order's details.
- **40002057**: Order not found
```

--------------------------------

### Create Order

Source: https://biteship.com/id/docs/api/orders/create

Request a new order to be picked up by the courier. Ensure sufficient Biteship Balance and consider invoice payment for custom ordering. Staging environments will simulate the process without actual courier pickup.

```APIDOC
## POST /v1/orders

### Description
To request a new order to be picked up by the courier, you need to create a new order object. Make sure your Biteship Balance is sufficient when making this request. Try to request for invoice payment for more custom ordering.
If your environment is still in Staging, the courier will not pick up your request, though everything else will occur as if in live mode.

### Method
POST

### Endpoint
/v1/orders
```

--------------------------------

### GET /v1/couriers Endpoint

Source: https://biteship.com/id/docs/api/couriers/retrieve

Use this GET endpoint to list all available couriers and their associated services. The response includes details such as courier name, code, service name, and shipping parameters.

```http
GET /v1/couriers  

```

--------------------------------

### Key for Testing

Source: https://biteship.com/id/docs/api/authentication

Guidance on generating and using API keys specifically for testing purposes, including enabling testing mode.

```APIDOC
### Key for Testing

1. Activate the "Testing Mode" toggle in the sidebar for testing purposes.
2. Follow the same process as generating a new API key to obtain a testing API key.
3. For Testing Mode, your Order API will be active by default, allowing you to test functionalities.
```

--------------------------------

### Create Location

Source: https://biteship.com/id/docs/api/locations/overview

Creates a new location in your list.

```APIDOC
## POST /v1/locations

### Description
Creates a new location.

### Method
POST

### Endpoint
/v1/locations
```

--------------------------------

### Order Response Object

Source: https://biteship.com/id/docs/api/orders/retrieve

This is a sample response object for a retrieved order. It contains detailed information about the order, including its status, pricing, items, and courier tracking details. All fields are nullable.

```json
{
  "success": true,
  "message": "Order successfully retrieved",
  "object": "order",
  "id": "5dd599ebdefcd4158eb8470b",
  "draft_order_id": null,
  "short_id": "URf_UO2nY3V",
  "shipper": {
    "name": "Amir",
    "email": "biteship@example.com",
    "phone": "088888888888",
    "organization": "Biteship Org"
  },
  "origin": {
    "contact_name": "Amir",
    "contact_phone": "088888888888",
    "address": "Plaza Senayan, Jalan Asia Afrik...",
    "note": "Deket pintu masuk STC",
    "postal_code": 10270,
    "coordinate": {
      "latitude": -6.2253114,
      "longitude": 106.7993735
    }
  },
  "destination": {
    "contact_name": "John Doe",
    "contact_phone": "088888888888",
    "contact_email": "jon@example.com",
    "address": "Lebak Bulus MRT...",
    "note": "Near the gas station",
    "proof_of_delivery": {
      "use": false,
      "fee": 0,
      "note": null,
      "link": null
    },
    "postal_code": 12310,
    "coordinate": {
      "latitude": -6.28927,
      "longitude": 106.77492000000007
    },
    "cash_on_delivery": {
      "id": null,
      "amount": 0,
      "amount_currency": "IDR",
      "fee": 0,
      "fee_currency": "IDR",
      "note": null,
      "type": null
    }
  },
  "delivery": {
    "datetime": "2023-09-24T12:00+07:00",
    "note": null,
    "type": "now",
    "distance": 15.2,
    "distance_unit": "kilometer"
  },
  "voucher": {
    "id": null,
    "name": null,
    "value": null,
    "type": null
  },
  "courier": {
    "tracking_id": "65ddac3879699035b83dc561",
    "waybill_id": "WYB-1112223333442",
    "company": "jnt",
    "history": [
      {
        "service_type": "-",
        "status": "confirmed",
        "note": "Order has been confirmed. Locating nearest driver to pickup.",
        "updated_at": "2021-01-11T14:03:41+07:00"
      },
      {
        "service_type": "-",
        "status": "allocated",
        "note": "Courier has been allocated. Waiting to pick up.",
        "updated_at": "2021-01-11T15:49:25+07:00"
      }
    ],
    "link": "https://example.com/10298309123809",
    "name": "John Doe",
    "phone": "0888888888",
    "driver_name": "John Doe",
    "driver_phone": "0888888888",
    "driver_photo_url": "https://picsum.photos/200",
    "driver_plate_number": "B 1234 ABC",
    "type": "instant",
    "shipment_fee": 25000,
    "insurance": {
      "amount": 500000,
      "amount_currency": "IDR",
      "fee": 2500,
      "fee_currency": "IDR",
      "note": null
    },
    "routing_code": "123-JKT45A-67"
  },
  "reference_id": null,
  "invoice_id": null,
  "items": [
    {
      "name": "Black L",
      "description": "Feast/Bangkok'19 Invasion",
      "sku": null,
      "value": 165000,
      "quantity": 1,
      "length": 72,
      "width": 54,
      "height": 1,
      "weight": 200
    }
  ],
  "extra": null,
  "metadata": null,
  "tags": [],
  "note": "Please be careful",
  "currency": "IDR",
  "tax_lines": [],
  "price": 27500,
  "status": "allocated",
  "ticket_status": null
}
```

--------------------------------

### GET /v1/orders/:id

Source: https://biteship.com/id/docs/api/orders/overview

Retrieves details for a specific order by its ID.

```APIDOC
## GET /v1/orders/:id

### Description
Retrieves the details of an existing order using its unique ID.

### Method
GET

### Endpoint
/v1/orders/:id

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the order.
```

--------------------------------

### Create Draft Order Parameters

Source: https://biteship.com/id/docs/api/draft_orders/create

This section details all the parameters available for creating a draft order. These parameters cover shipper and receiver contact information, addresses, package specifics, and delivery options.

```APIDOC
## Create Draft Order

### Description
This API allows you to create a draft order for a shipment. You need to provide details about the shipper, destination, and the items being shipped.

### Parameters

#### Shipper Information
- **shipper_contact_name** (string) - Optional - The name of the shipper.
- **shipper_contact_phone** (string) - Optional - The phone number of the shipper.
- **shipper_contact_email** (string) - Optional - The email of the shipper.
- **shipper_organization** (string) - Optional - The organization of the shipper.

#### Origin Information
- **origin_contact_name** (string) - REQUIRED - The name of the person in the pickup location.
- **origin_contact_phone** (string) - REQUIRED - The phone number of the person in the pickup location.
- **origin_contact_email** (string) - Optional - The email of the person in the pickup location.
- **origin_address** (string) - REQUIRED - Complete address of the pickup location.
- **origin_note** (string) - Optional - Additional information of the pickup location to ease pickup process.
- **origin_postal_code** (number) - REQUIRED/ OPTIONAL - Postal code of the pickup location.
- **origin_coordinate** (object) - REQUIRED/ OPTIONAL - Coordinates of the pickup location. If you use an instant courier, you must use coordinate.
  - **origin_coordinate.latitude** (double) - REQUIRED/ OPTIONAL - Latitude of the pickup location.
  - **origin_coordinate.longitude** (double) - REQUIRED/ OPTIONAL - Longitude of the pickup location.
- **origin_collection_method** (string) - Optional - Use the **available_collection_method** from **Rates API**. Value can be **pickup**, or **drop_off**. Default to **pickup**.

#### Destination Information
- **destination_contact_name** (string) - REQUIRED - The name of the person in the destination location.
- **destination_contact_phone** (string) - REQUIRED - The phone number of the person in the destination location.
- **destination_contact_email** (string) - Optional - The email of the person in the destination location.
- **destination_address** (string) - REQUIRED - Complete address of the destination location.
- **destination_note** (string) - Optional - Additional information of the destination location to ease destination process.
- **destination_postal_code** (number) - REQUIRED/ OPTIONAL - Postal code of the destination location.
- **destination_coordinate** (object) - REQUIRED/ OPTIONAL - Coordinates of the destination location. If you use an instant courier, you must use coordinate.
  - **destination_coordinate.latitude** (double) - REQUIRED/ OPTIONAL - Latitude of the destination location.
  - **destination_coordinate.longitude** (double) - REQUIRED/ OPTIONAL - Longitude of the destination location.
- **destination_cash_on_delivery** (number) - Optional - State the COD Amount if you want to activate COD delivery.
- **destination_cash_on_delivery_type** (string) - Optional - The COD disbursement window. Value can be 7_days, 5_days, or 3_days.
- **destination_proof_of_delivery** (boolean) - Optional - Proof of delivery feature.
- **destination_proof_of_delivery_note** (string) - REQUIRED/ OPTIONAL - Notes for proof of delivery. It is required if proof of delivery feature is activated.

#### Courier Information
- **courier_company** (string) - Optional - Shipping provider that will be used for this particular shipment.
- **courier_type** (string) - Optional - Courier type based on the courier company used.
- **courier_insurance** (number) - Optional - The amount of the insurance value.

#### Delivery Information
- **delivery_type** (string) - REQUIRED - Type of delivery order is now and scheduled.
- **delivery_date** (string) - Optional - The delivery date format: “YYYY-MM-DD”.
- **delivery_time** (string) - Optional - The delivery time format: “HH:mm”.
- **order_note** (string) - Optional - Additional information for the shipment.

#### Additional Information
- **metadata** (object) - Optional - You can insert any kind of data through this object for internal purposes.
- **reference_id** (string) - Optional - You can insert your internal order id here.
- **tags** (array) - Optional - You can insert multiple custom tags for filtering your orders by tag later on.

#### Items
- **items** (array) - REQUIRED - The list of item you will send for delivery.
  - **items.name** (string) - REQUIRED - Name of your package.
  - **items.description** (string) - Optional - A description of your package.
  - **items.category** (string) - Optional - Category of your package.
```

--------------------------------

### Get Location by ID

Source: https://biteship.com/id/docs/api/locations/overview

Retrieves a specific location using its unique identifier.

```APIDOC
## GET /v1/locations/:id

### Description
Retrieves a specific location by its ID.

### Method
GET

### Endpoint
/v1/locations/:id
```

--------------------------------

### Get Draft Order

Source: https://biteship.com/id/docs/api/draft_orders/overview

Retrieves the details of a specific draft order by its ID.

```APIDOC
## Get Draft Order

### Description
Retrieves the details of a specific draft order.

### Method
GET

### Endpoint
/v1/draft_orders/:id
```
