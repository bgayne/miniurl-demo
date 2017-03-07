var validEmail = false;
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
    url:"http://localhost:3000/register",
    method:"POST",
    data: packageData(),
    dataType: "json",
  }).done((data) => {
    console.log(data);
    if(data.status === "success")
      window.location.replace("/login");
    else $(".error-message").text(data.message);
  });
}

function validateEmail() {
  console.log("Hello?");
  clearTimeout(typeLock)
  typeLock = setTimeout(() => {
    if(!$("#email").val().match(/.*@.*\.[a-zA-Z][a-zA-Z].*/) && $("#email").val() !== "") {
      $("#email").addClass("error");
      validEmail = false;
    }
    else {
      validEmail = true;
      $("#email").removeClass("error");
    }
  }, 450)
}

$(() => {

  $("#submit").on("click", () => {
    sendData();
    console.log("Hello?");
  });

  $("#email").on("keyup", () => {
    validateEmail();
  });

  $(".form-object").on("keyup", (key) => {
    if(key.which === 13) sendData();
  })

  $(".btn-signup").on("click", () => {
    sendData();
  })
})
