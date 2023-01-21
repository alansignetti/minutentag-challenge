$(document).ready(function () {
  $(this).scrollTop(0);
  var apiUrl = "https://api.wazirx.com/sapi/v1/tickers/24hr";
  var pageSize = 10; // Number of items per page
  var currentPage = 1;
  var data; // API data
  var newData = [];
  var orderPrice = 0;
  var orderAlphabetic = 0;
  var searching = 0;
  var paginationSize = 9;

  // Obtain data API
  function getData() {
    showSpinner();
    $.ajax({
      type: "GET",
      url: apiUrl,
      success: function (response) {
        data = response;
        hideSpinner();
        showData();
        createPagination();
        searching = 0;
      },
      error: function (error) {
        searching = 0;
        hideSpinner();
        console.log(error);
      },
    });
  }

  function searchByBaseAsset() {
    $("#searchInput").keyup(function (event) {
      newData = [];
      let valueSearched = $(this).val();
      if (!valueSearched && searching == 0) {
        // to avoid too many requests
        searching = 1;
        getData();
      } else {
        data.filter(function (element) {
          if (element.baseAsset == valueSearched) {
            newData.push(element);
          }
        });
        if (event.keyCode == 13) {
          data = newData;
        }
      }
      showData();
      createPagination();
      currentPage = 1;
    });
  }

  function orderByPrice() {
    $("#price").click(function () {
      if (orderPrice == 2) {
        // no filter
        orderPrice = 0;
        $("#price-icon").removeClass("fa-angle-up");
        $("#price-icon").removeClass("fa-angle-down");

        if ($("#searchInput").val()) {
          searchByBaseAsset();
        } else {
          getData();
        }
      } else if (orderPrice == 1) {
        // high to low (desc)
        orderPrice = 2;
        $("#price-icon").addClass("fa-angle-down");
        data.sort((a, b) => parseFloat(b.openPrice) - parseFloat(a.openPrice));
        showData();
        createPagination();
      } else {
        // low to high (asc)
        orderPrice = 1;
        $("#price-icon").addClass("fa-angle-up");
        data.sort((a, b) => parseFloat(a.openPrice) - parseFloat(b.openPrice));
        showData();
        createPagination();
      }
    });
  }

  function orderByAlphabet() {
    $("#alphabetic").click(function () {
      if (orderAlphabetic == 2) {
        // no filter
        orderAlphabetic = 0;
        $("#alphabetic-icon").removeClass("fa-angle-up");
        $("#alphabetic-icon").removeClass("fa-angle-down");

        if ($("#searchInput").val()) {
          searchByBaseAsset();
        } else {
          getData();
        }
      } else if (orderAlphabetic == 1) {
        // Z-A (desc)
        orderAlphabetic = 2;
        $("#alphabetic-icon").addClass("fa-angle-down");
        data.sort((a, b) =>
          a.baseAsset !== b.baseAsset ? (a.baseAsset > b.baseAsset ? -1 : 1) : 0
        );
        showData();
        createPagination();
      } else {
        // A-Z (asc)
        orderAlphabetic = 1;
        $("#alphabetic-icon").addClass("fa-angle-up");
        data.sort((a, b) =>
          a.baseAsset !== b.baseAsset ? (a.baseAsset < b.baseAsset ? -1 : 1) : 0
        );
        showData();
        createPagination();
      }
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
    }
    $(".list-container").html(html);
  }

  function createPagination() {
    var totalPages = Math.ceil(data.length / pageSize);
    // If there is not a page, hide the pagination

    if (totalPages > 0) {
      $(".col-md-6").show();
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
        } else if (i > currentPage && i <= currentPage + paginationSize) {
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

      if (currentPage === totalPages || totalPages <= 0) {
        // Hide next button if it is the last page
        $(".next").addClass("d-none");
      } else {
        $(".next").removeClass("d-none");
      }
      $(".page-number").click(function () {
        // Navigate between pages
        $("html, body").animate(
          {
            scrollTop: $("html, body").get(0).scrollHeight,
          },
          100
        );
        currentPage = $(this).data("page");
        showData();
        createPagination();
      });
      $(".previous").click(function () {
        // Navigate to the previous page
        $("html, body").animate(
          {
            scrollTop: $("html, body").get(0).scrollHeight,
          },
          100
        );
        if (currentPage <= 0) {
          currentPage = 1;
        } else {
          currentPage--;
        }
        showData();
        createPagination();
      });
      $(".next").click(function () {
        // Navigate to the next page
        currentPage++;
        $("html, body").animate(
          {
            scrollTop: $("html, body").get(0).scrollHeight,
          },
          100
        );
        showData();
        createPagination();
      });
    }
    // show not found
    else {
      $(".col-md-6").hide();
      $("#notFound").show();
    }
  }

  function showSpinner() {
    $("#searchInput").prop("disabled", true);
    $("#loadingSpinner").show();
    $("#notFound").hide();
    $("#row-container").hide();
  }

  function hideSpinner() {
    $("#searchInput").prop("disabled", false);
    $("#notFound").hide();
    $("#loadingSpinner").hide();
    $("#row-container").show();
  }

  function clearSearhInput() {
    $("#searchInput").keyup(function (event) {
      if (event.key === "Backspace") {
        $("#searchInput").val("");
        getData();
      }
    });
  }

  getData(); // Get data from the API and display in the HTML

  searchByBaseAsset();

  orderByPrice();

  orderByAlphabet();

  clearSearhInput();
});
