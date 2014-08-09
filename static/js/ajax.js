function ajaxQuery (query, callback) {
  console.log(JSON.stringify(query));
  $.ajax({
    url: "/ajax",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(query),
    success: function(response_str){
      response = JSON.parse(response_str);
      console.log(response);
      callback(response);
    }
  });
}

function ajaxQuerySync (query, callback) {
  console.log(JSON.stringify(query));
  $.ajax({
    url: "/ajax",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(query),
    async: false,
    success: function(response_str){
      response = JSON.parse(response_str);
      console.log(response);
      callback(response);
    }
  });
}
