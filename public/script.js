let socket = io.connect("http://localhost:8080");
const startbtn = document.getElementById("startbtn");
let topic = 'notification';
let inputVal; 
startbtn.addEventListener("click", () => {
    inputVal = document.getElementById("val").value.trim();
    console.log(inputVal);
    console.log("Sending join notification request");
    socket.emit('join', {email: inputVal});
})

socket.on('notification', (notification) => {
    console.log(notification.message);
    const notificationsList = document.getElementById('notifications');
    const newNotificationItem = document.createElement('li');
    newNotificationItem.textContent = notification.message + "  " + notification.id;
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

    function check(){
      console.log(inputVal);
    }
    function disconnectSocket() {
      socket.disconnect(); // Disconnect the socket
      console.log('Socket disconnected');
    }

    const closebtn = document.getElementById("closebtn");
    closebtn.addEventListener("click", ()=> {
      disconnectSocket();
    })