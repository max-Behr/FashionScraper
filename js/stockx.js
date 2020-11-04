$(document).ready(function () {

    function getProductName() {
        return $("#inputProductUrl").val();
    }

    /**
     *
     * Holt die Product Id aus der API
     * **/
    function getParentProductId() {
        let productId = null;
        let stockxProductUrl = "https://stockx.com/api/products/"+ getProductName() +"?currency=EUR&country=DE";
        $.ajax({
            url: stockxProductUrl,
            dataType: 'json',
            async: false,
            success: function(data) {
                productId = data['Product'].id;
            }
        });
        return productId;
    }



    function getProductSizes(productId) {
        let stockxProductUrl = "https://stockx.com/api/products/" + productId;
        let productSizes = [];
        $.ajax({
            url: stockxProductUrl,
            dataType: 'json',
            async: false,
            success: function (data) {
                let child_dict = data['Product']['children']
                for(let i in child_dict){
                    productSizes.push(child_dict[i]['shoeSize']);
                }
            }
        })
        return productSizes;
    }

    function updateProductSizes(productSizes) {
        $("#inputProductSize").empty();
        $("#inputProductSize").append("<option selected value='all'>All Sizes</option>")
        for (let i in productSizes) {
            $("#inputProductSize").append("<option value="+ productSizes[i] +">"+ productSizes[i] +"</option>")
        }
    }

    function getCheckedSize() {
        return $( "#inputProductSize option:selected" ).val();
    }

    function getChildProductId(productSize) {
        let childProductId = null;
        let parentProductId = getParentProductId();
        let stockxProductUrl = "https://stockx.com/api/products/" + parentProductId;

        $.ajax({
            url: stockxProductUrl,
            dataType: 'json',
            async: false,
            success: function (data) {
                let child_dict = data['Product']['children']
                for(let i in child_dict){
                    if(child_dict[i]['shoeSize'] === productSize.toString()) {
                        childProductId = child_dict[i]['id'];
                    }
                }
            }
        })
        return childProductId;
    }

    function getStartDate() {
        return $("#inputStartDate").val();
    }

    function getEndDate() {
        return $("#inputEndDate").val();
    }

    function getIntervals() {
        return $("#inputInterval").val();
    }

    function getChildProductSales(childProductId, startDate, endDate,) {
        let stockxProductUrl = "https://stockx.com/api/products/"+ childProductId +
            "/chart?start_date="+ startDate +"&end_date="+ endDate + "&currency=EUR&country=DE";
        let childProductSales = null;
        console.log(stockxProductUrl);
        $.ajax({
            url: stockxProductUrl,
            dataType: 'json',
            async: false,
            success: function (data) {
                childProductSales = data;
            }
        })
        return childProductSales;
    }

    function getChildProductInfo(childProductId) {
        stockxProductUrl = "https://stockx.com/api/products/" + childProductId;
        let childProductInfos = null;

        $.ajax({
            url: stockxProductUrl,
            dataType: 'json',
            async: false,
            success: function (data) {
                childProductInfos = data;
            }
        })
        return childProductInfos;
    }

    function getAveragePrice(data) {
        let sales = data['series'][0]['data'];
        let allPrices = 0;

        for(let i = 0; i<sales.length; i++) {
            allPrices+=sales[i];
        }
        console.log(allPrices);
        return allPrices/sales.length;
    }

    function countSales(data) {
        let salesCounter = null;
        let salesArray = data['series'][0]['data'];

        for(let i = 0; i<salesArray.length; i++) {
            if(salesArray[i] != "0") {
                salesCounter++;
            }
        }
        return salesCounter;

    }

    function clearTable() {
        $("#trProductInfos").html("");
    }

    function updateTable() {
        let childProductId = getChildProductId(getCheckedSize());
        let startDate = getStartDate();
        let endDate = getEndDate();
        let childProductSales = getChildProductSales(childProductId, startDate, endDate);
        let childProductInfos = getChildProductInfo(childProductId);
        let averagePrice = getAveragePrice(childProductSales);
        let salesCounter = countSales(childProductSales);
        let averagePriceRounded = averagePrice.toFixed(2);

        let productSku = childProductInfos['Product']['styleId'];
        let productSize = childProductInfos['Product']['shoeSize'];
        $("#trProductInfos").append("<th>"+ productSku +"</th>");
        $("#trProductInfos").append("<td>"+ productSize +"</td>");
        $("#trProductInfos").append("<td>"+ startDate +"</td>");
        $("#trProductInfos").append("<td>"+ endDate +"</td>");
        //$("#trProductInfos").append("<td>"+ interval +"</td>");
        $("#trProductInfos").append("<td>"+ salesCounter +"</td>");
        $("#trProductInfos").append("<td>"+ averagePriceRounded +"</td>");


    }

    $("#btnCreateChart").click(function () {
        clearTable();
        updateTable();
    })

    $("#inputProductUrl").change(function () {
        let parentProductId = getParentProductId();
        updateProductSizes(getProductSizes(parentProductId));
    })
})


