function newPrivateLink() {
  if($("#pl-url").val() !== "" && $("pl-password") !== "")
    $.ajax({
      url:"http://localhost:3000/p/",
      method:"POST",
      data: {
        url:$("#pl-url").val(),
        password:$("#pl-password").val()
      },
      dataType: "json",
    }).done((data) => {
      $("#pl-output").val("http://localhost:3000/p/"+data.hash);
      $("#pl-url").val("");
      $("#pl-password").val("");
    })
  else
    $("#pl-output").val("error");
}

function getLogs() {
  $.ajax({
    url:"http://localhost:3000/user/",
    method:"POST",
  }).done((data) => {
    renderLogs(data, console.log(data));
  });
}

function renderLogs(data) {
  var logTemplate = " \
                <div class=\"link-log-item\"> \
                  <div class=\"link-log-target link-log-text\"> \
                    <p class=\"link-log-target-text\">{log-target}</p>\
                  </div>\
                  <div class=\"link-log-timestamp link-log-text\">\
                    <p class=\"link-log-timestamp-text\">{log-hash}</p>\
                  </div>\
                </div>"

  for(var i in data)
    if(!data[i].privacy.isPrivate)
      $(".link-log").append(
        logTemplate
          .replace(/{log-target}/, data[i].target)
          .replace(/{log-hash}/, data[i].hash)
      )
    else 
      $(".pl-list").append(
        logTemplate
          .replace(/{log-target}/, data[i].target)
          .replace(/{log-hash}/, data[i].hash)
      )

}



$(() => {
  getLogs();

  var clipboard = new Clipboard("#pl-output");

  clipboard.on('success', (e) => {
    var tmp = $("#pl-output").val();
    $("#pl-output").val("Copied!");
    $("#pl-output").toggleClass("output-mutex");
    setTimeout(() => {
      $("#pl-output").val(tmp);
      $("#pl-output").toggleClass("output-mutex")
    }, 500);
  })

  $(".pl-input").on("keyup", (key) => {
    if(key.which === 13) newPrivateLink();
  })


  $("#pl-submit").on("click", () => {
    newPrivateLink();
  })

  $(".nav-option").on("click", function() {
    $(".panel-item").addClass("hidden");
    var selector = "." + $(this).attr("id").slice(0);
    if($(selector).hasClass("hidden")) {
      $(selector).removeClass("hidden");
    }
  })
})
