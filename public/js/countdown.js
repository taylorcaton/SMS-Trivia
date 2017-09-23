var startNum;
var currentNum;

function addClassDelayed(jqObj, c, to) {
  setTimeout(function() {
    jqObj.addClass(c);
  }, to);
}

function anim() {
  addClassDelayed($("#countdown"), "puffer", 600);
  if (currentNum == 0) window.location.href = "/results";
  else currentNum--;
  $("#countdown").html(currentNum + 1);
  $("#countdown").removeClass("puffer");
}

$(function() {
  if ($("#countdown").length) {
    startNum = 20;
    currentNum = startNum;
    $("#countdown").html(currentNum); // init first time based on n
    setTimeout(function() {
      self.setInterval(function() {
        anim();
      }, 1000);
    }, 5000);
  }
});
