var startNum;
var currentNum;

function addClassDelayed(jqObj, c, to) {    
    setTimeout(function() { jqObj.addClass(c); }, to);
}

function anim() { 
  addClassDelayed($("#countdown"), "puffer", 600);
  if (currentNum == 0) currentNum = startNum-1; else currentNum--;
  $('#countdown').html(currentNum+1);
  $('#countdown').removeClass("puffer");
}
      
$(function() {
  startNum = 20; 
  currentNum = startNum;
  $("#countdown").html(currentNum); // init first time based on n
  self.setInterval(function(){anim()},1325);
});