import { Customer } from './test.js'

let item = {
  id: 123,
  name: 'Jane Smith',
  company: 'ACME',
  age: 35,
  status: 'active',
  date_added: '2020-04-24'
}

let result = await Customer.put(item)
