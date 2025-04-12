import { Customer } from "@/types";

// Mock customers data
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "KASABA TERMAL GAYR. YAT. VE TİC. AŞ.",
    surname: "",
    email: "termakasaba@gmail.com",
    phone: "+90 555 123 4567",
    associatedProjectIds: ["1"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mehmet",
    surname: "Çelik",
    email: "mehmet.celik@gmail.com",
    phone: "+90 555 987 6543",
    associatedProjectIds: ["2"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ahmet",
    surname: "Yılmaz",
    email: "ahmet.yilmaz@gmail.com",
    phone: "+90 555 456 7890",
    associatedProjectIds: ["1", "3"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Ayşe",
    surname: "Demir",
    email: "ayse.demir@gmail.com",
    phone: "+90 555 234 5678",
    associatedProjectIds: ["2"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Mehmet",
    surname: "Kaya",
    email: "mehmet.kaya@gmail.com",
    phone: "+90 555 345 6789",
    associatedProjectIds: ["1", "5"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Zeynep",
    surname: "Şahin",
    email: "zeynep.sahin@gmail.com",
    phone: "+90 555 456 7890",
    associatedProjectIds: ["3", "4"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Mustafa",
    surname: "Çelik",
    email: "mustafa.celik@gmail.com",
    phone: "+90 555 567 8901",
    associatedProjectIds: ["2", "5"],
    createdAt: new Date().toISOString(),
  }
];
