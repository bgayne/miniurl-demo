
function retrieveHash() {
  $.ajax({
    url:"http://localhost:3000/l/",
    method:"POST",
    data: {url:$(".url-text").val()},
    dataType: "json",
  }).done((data) => {
    $(".url-text").val('');
    $(".output").val(window.location.host+"/l/"+data.url);
    console.log(data.url);
  });
}

$(() => {

  var clipboard = new Clipboard(".output");

  clipboard.on('success', (e) => {
    var tmp = $(".output").val();
    $(".output").val("Copied!");
    $(".output").toggleClass("output-mutex");
    setTimeout(() => {
      $(".output").val(tmp);
      $(".output").toggleClass("output-mutex")
    }, 500);
  })

  $(".url-text").on("keyup", () => {
    if($(".url-text").val() !== "") $(".submit-button").addClass("sb-active");
    else $(".submit-button").removeClass("sb-active");
  });

  $(".url-text").on("keydown", (key) => {
    if(key.which === 13) retrieveHash();
  })

  $(".submit-button").on("click", () => {
      retrieveHash();
  })
});
