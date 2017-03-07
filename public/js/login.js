var validEmail = false;
var passMatch  = true;
//var nameLock   = false; TODO
var typeLock;

function packageData() {
  outbound = {
    username:$("#username").val(),
    password:$("#password").val(),
    email:$("#email").val(),
  }
  return outbound
}

function sendData() {
  $.ajax({
    url:"http://localhost:3000/login",
    method:"POST",
    data: packageData(),
    dataType: "json",
  }).done((data) => {
    console.log(data);
    if(data.status === "success")
      window.location.replace("/");
    else console.log(data.status);
  });
}

$(() => {
  $("#submit").on("click", () => {
    sendData();
  });

  $("input").on("keyup", (key) => {
    if(key.which === 13) sendData();
  })
})
