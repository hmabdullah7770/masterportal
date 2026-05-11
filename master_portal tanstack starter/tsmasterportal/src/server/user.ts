import {createServerFn} from "@tanstack/react-start"

export const getUser = createServerFn({
  method: "GET",
}).handler(async () => {
  
const response = await fetch("https://jsonplaceholder.typicode.com/users")
const data = await response.json()

console.log("Executing a secure database/Api call on the server...")

console.log(data)
    
return data
})