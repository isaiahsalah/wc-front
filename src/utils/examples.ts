import { faker } from "@faker-js/faker"


export type Product = {
  nombre: string
  fecha: Date 
  cantidad: number
  status: 'relationship' | 'complicated' | 'single' 

}


const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Product => {
  return {
    nombre: faker.commerce.product(),
    fecha: faker.date.anytime(), 
    cantidad: faker.number.int(1000),
    status: faker.helpers.shuffle<Product['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0]!,
  }
}


export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Product[] => {
    const len = lens[depth]!
    return range(len).map((d): Product => {
      return {
        ...newPerson()
      }
    })
  }

  return makeDataLevel()
}