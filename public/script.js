// import { json } from "body-parser";

let socket = io.connect("http://localhost:8080");
const startbtn = document.getElementById("startbtn");
// let topic = 'notification';
// let inputVal; 
startbtn.addEventListener("click", async () => {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    console.log(email, password);
    console.log("Sending join notification request");
    // socket.emit('join', {email: email});

    const res = await fetch(`http://localhost:8080/api/login`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        email: email,
        password: password
      })
    })
    console.log(await res.json());
})

socket.on('notification', (notification) => {
    console.log(notification.message);
    const notificationsList = document.getElementById('notifications');
    const newNotificationItem = document.createElement('li');
    newNotificationItem.textContent = notification.message;
    notificationsList.appendChild(newNotificationItem);
});

    const markAsRead = document.getElementById("markAsRead");
    markAsRead.addEventListener("click", async () => {
      const notId = document.getElementById("notId").value.trim();
      const res = await fetch(`http:localhost:8080/api/notifications/${notId}`, 
        {method: 'PUT'}
      )
      console.log(res);
    })

    // function check(){
    //   console.log(inputVal);
    // }
    function disconnectSocket() {
      socket.disconnect(); // Disconnect the socket
      console.log('Socket disconnected');
    }

    const closebtn = document.getElementById("closebtn");
    closebtn.addEventListener("click", ()=> {
      disconnectSocket();
    })