$(document).ready(function () {
  var apiUrl = "https://api.wazirx.com/sapi/v1/tickers/24hr";
  var pageSize = 10; // Number of items per page
  var currentPage = 1;
  var data; // API data

  // Obtain data API
  function getData() {
    $.ajax({
      type: "GET",
      url: apiUrl,
      success: function (response) {
        data = response;
        showData();
        createPagination();
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  //  Show data in HTML
  function showData() {
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    var currentData = data.slice(startIndex, endIndex); // data from the current page
    var html = "";
    for (var i = 0; i < currentData.length; i++) {
      html +=
        `
        <div class="d-style btn   w-100 my-2 py-3 shadow-sm">
            <div class="row align-items-center">
              <div class="col-12 col-md-4">
                <h4 class="pt-3 text-170 text-600 text-purple-d1 letter-spacing">` +
        currentData[i].baseAsset +
        ` </h4>
    
                <div class="text-secondary-d1 text-120">
                <span class="text-180">` +
        currentData[i].symbol +
        ` (Volume: ` +
        currentData[i].volume +
        `)</span> 
                </div>
              </div>
    
              <ul class="list-unstyled mb-0 col-12 col-md-4 text-dark-l1 text-90 text-left my-4 my-md-0">
                <li>
                  <i class="fa fa-check text-success-m2 text-110 mr-2 mt-1"></i>
                  <span>
                    <span class="text-110">Open Price: $` +
        currentData[i].openPrice +
        `</span>
                  </span>
                </li>
    
                <li class="mt-25">
                  <i class="fa fa-check text-success-m2 text-110 mr-2 mt-1"></i>
                  <span class="text-110">
                  High Price: $` +
        currentData[i].highPrice +
        `
                </span>
                </li>
    
                <li class="mt-25">
                  <i class="fa fa-check text-success-m2 text-110 mr-2 mt-1"></i>
                  <span class="text-110">
                  Low Price: $` +
        currentData[i].lowPrice +
        `
                </span>
                </li>
              </ul>
    
              <div class="col-12 col-md-4 text-center">
                <a href="#" class="btn btn-warning px-4 py-25 w-75 text-600">$` +
        currentData[i].lowPrice +
        `</a>
              </div>
            </div>
    
          </div>
        </div>`;
      //   html += '<li class="list-group-item">';
      //   html += "<p>Symbol: " + currentData[i].symbol + "</p>";
      //   html += "<p>Base Asset: " + currentData[i].baseAsset + "</p>";
      //   html += "<p>Quote Asset: " + currentData[i].quoteAsset + "</p>";
      //   html += "<p>Open Price: " + currentData[i].openPrice + "</p>";
      //   html += "<p>Low Price: " + currentData[i].lowPrice + "</p>";
      //   html += "<p>High Price: " + currentData[i].highPrice + "</p>";
      //   html += "<p>Last Price: " + currentData[i].lastPrice + "</p>";
      //   html += "<p>Volume: " + currentData[i].volume + "</p>";
      //   html += "<p>Bid Price: " + currentData[i].bidPrice + "</p>";
      //   html += "<p>Ask Price: " + currentData[i].askPrice + "</p>";
      //   html += "<p>Timestamp: " + currentData[i].at + "</p>";
      //   html += "</li>";
    }
    $(".list-container").html(html);
  }

  function createPagination() {
    var totalPages = Math.ceil(data.length / pageSize);
    // If there is only one page, hide the pagination
    if (totalPages <= 1) {
      $("#page-container").hide();
    } else {
      var pagination =
        '<li class="page-item previous"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&lt;</span></a></li>';
      for (var i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
          pagination +=
            '<li class="page-item active"><a class="page-link page-number" data-page="' +
            i +
            '" href="#">' +
            i +
            "</a></li>";
        } else if (i > currentPage && i <= currentPage + 6) {
          // Next pages
          pagination +=
            '<li class="page-item"><a class="page-link page-number" data-page="' +
            i +
            '" href="#">' +
            i +
            "</a></li>";
          pagination +=
            '<li class="page-item d-none"><a class="page-link page-number" data-page="' +
            i +
            '" href="#">' +
            i +
            "</a></li>";
        } else {
          // Previous pages
          pagination +=
            '<li class="page-item d-none"><a class="page-link page-number" data-page="' +
            i +
            '" href="#">' +
            i +
            "</a></li>";
        }
      }
      pagination +=
        '<li class="page-item next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">></span> </a></li>';
      $("#page-container").show();
      $("#page-container").html(pagination);

      if (currentPage === 1) {
        // Hide previous button if it is the first page
        $(".previous").addClass("d-none");
      } else {
        $(".previous").removeClass("d-none");
      }

      if (currentPage === totalPages) {
        // Hide next button if it is the last page
        $(".next").addClass("d-none");
      } else {
        $(".next").removeClass("d-none");
      }
      $(".page-number").click(function () {
        // Navigate between pages
        currentPage = $(this).data("page");
        showData();
        createPagination();
      });
      $(".previous").click(function () {
        // Navigate to the previous page
        currentPage--;
        console.log(currentPage);
        showData();
        createPagination();
      });
      $(".next").click(function () {
        // Navigate to the next page
        currentPage++;
        console.log(currentPage);
        showData();
        createPagination();
      });
    }
  }

  getData(); // Get data from the API and display in the HTML
});
