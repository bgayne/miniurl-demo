function packageData() {
  outbound = {
    url:$("redirect").attr("id"),
    password : $(".pass").val()
  }
  return outbound
}

function sendData() {
  $.ajax({
    url:"http://localhost:3000/denied/",
    method:"POST",
    data: packageData(),
    dataType: "json",
  }).done((data) => {
    console.log(data);
    if(data.status === "success")
      window.location.replace(data.message);
    else console.log(data.message);
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
