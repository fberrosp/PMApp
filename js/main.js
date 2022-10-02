import { getTasks } from "./firebase.js";

//getTasks
window.addEventListener('DOMContentLoaded', async () => {

    const querySnapshot = await getTasks()
  
    console.log(querySnapshot)
  
  })
  