# LeaseLock Coding Challenge

Write a program to consume API responses and create a report. You are provided an endpoint with a few test IDs you can use to model your program.

You may write this program in any language using any libraries you choose. The only requirement is you provide a README on how to build and run your program.

Good luck!

# Instructions

API URL: https://idy4d4ejzi.execute-api.us-west-2.amazonaws.com/prod/

Test Company IDs: 1, 2

##### URLS (For ID: 1):

- https://idy4d4ejzi.execute-api.us-west-2.amazonaws.com/prod/companies/1
- https://idy4d4ejzi.execute-api.us-west-2.amazonaws.com/prod/companies/1/certs
- https://idy4d4ejzi.execute-api.us-west-2.amazonaws.com/prod/companies/1/properties

### Input

Your program should accept a single parameter from the command line. The parameter will be a comma separated list (without spaces) of ids. The program should iterate over each ID to create the report. Assume there will always be one or many ids in the comma separated list

For example: `node index.js 1,2` (Note the lack of spaces between numbers)

### Output

Using the API, we should compile a report with information about revenue, properties, coverage, and certificates (certs) aggregated by company. **If any validations or assumptions are violated, the ids of the violating items should be included in the error section. The report should be printed to `STDOUT`**

The root level of the object contains information about the company as a whole. The `total_units` and `total_certs` are company-wide amounts. `total_coverage` is calculated by dividing the number of certs over the number of units. `monthly_revenue` is calculated by either `installment_payment + monthly_fee` _or_ `down_payment / 12`.

The properties section should aggregate the information by property. Calculations are the same as above, but will only be property-wide.

The certs section contains data about the type of products used at the company. For each product used at the company, provide the total number of certs with that product and the percentage that product is used (`certs_of_that_type / total_certs`).

**Please be sure to output valid JSON, as we will be deserializing the output for grading!**

The report should follow the schema below:

```
{
  report: [
    {
      company_name: String,
      total_units: Number,
      total_certs: Number,
      total_coverage: Number,
      monthly_revenue: Number,
      annual_revenue: Number,
      properties: [
        {
          "property_id": String,
          "certs": Number,
          "units": Number,
          "coverage": Number,
          "monthly_revenue": Number
        },
        ...
      ],
      certs: [
        {
          "product_id": String,
          "amount": Number,
          "percent": Number
        },
        ...
      ]
    },
    ...
  ],
  errors: [
    {
      "error_code": String,
      "company_id": String,
    },
    ...
  ]
}
```

## Testing

Once you have completed writing your program, please provide some unit/integration tests to prove your solution is correct.

## Assumptions / Validations

- A property should not have more certs than total units (Error Code: `MORE_CERTS_THAN_UNITS`)
- Products can be limited to a certain property type: (Error Code: `INVALID_PRODUCT_FOR_PROPERTY`)
  - A cert with $0 `down_payment` cannot be attached to a `PAY_IN_FULL` property
  - A cert with $0 `installment_payment` cannot be attached to a `INSTALLMENTS` property
- A Company may have 0 properties and 0 certs

If one of these assumptions are violated, they should be reported with the appropiate status code and the data omitted from the report.

## Endpoints and Response Schemas

##### GET /companies/{id}/

Returns company information for the given id.

```
{
  "success": String,
  "company": {
    "id": String,
    "name": String
  }
}
```

##### GET /companies/{id}/certs

Returns an array of certs for the given id.

```
{
  "success": String,
  "certs": [
    {
      "down_payment": Number,
      "id": String,
      "installment_payment": Number,
      "monthly_fee": Number,
      "property_id": String
    },
    ...
  ]
}
```

##### GET /companies/{id}/properties

Returns an array of properties for the given id.

```
{
  "success": String,
  "company": [
    {
    "id": String,
    "type": Enum<String> { "PAY_IN_FULL", "INSTALLMENTS" },
    "units": Number
    },
    ...
  ]
}
```

