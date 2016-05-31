/*global $*/
/*global location*/

// so that it updated the content all the time
$.ajaxSetup({
    cache: false
});

$(function() {
    
    // fetch tabs from json file on server
    $.getJSON("files/storage.json", function(data) {
        fetchTabs(data).done(loadTab(data, 1));
    });
    
    // when form is submitted send data via POST to add.php, next one save.php, etc.
    $("#add-btn").click( function(event) {
        event.preventDefault();

        $.post("add.php", $(".tab-input")).done( function(data) {   
            
            // update tabs
            $("[class$=tab]").remove();
            fetchTabs(data).done( function() {
                loadTab(data);
                // clear input
                $(".tab-input").val(undefined);
                $(".tab-input").blur();
            });
        });
    });
    
    $("#save-btn").click( function(event) {
        event.preventDefault();
        $.post("save.php", $(".tab-input")).done( function(data) {
            $("[class$=tab]").remove();
            var val = $("#new-index-input").val();
            
            // let index-input have the same value as new-index-input, otherwise form will go wild
            if ( val > data.length - 1) {
                $("#index-input").val(data.length - 1);
            } else if (val > 0) {
                $("#index-input").val(val);
            }
            
            fetchTabs(data).done(loadTab(data));
        });
    });
    
    $("#delete-btn").click( function(data) {
        if (window.confirm("Are you sure you want to delete this tab?")) {
            data.preventDefault();
            $.post("delete.php", $(".tab-input")).done( function(data) {
                $("[class$=tab]").remove();
                $("#index-input").val("");
                fetchTabs(data).done(loadTab(data));
            });
        }
    });
    
    $("#close-btn").click( function() {
        $(".tab-input").val(undefined);
        $(".tab-input").blur();        
        location.reload();
    });
    
    // new-index-input exists so that it could be used in updating tabs in save.php, will be enabled later
    $("#index-input")
        .attr("disabled", false)
        .css("z-index", "1");
    $("#new-index-input")
        .attr("disabled", true)
        .css("z-index", "-1");
        
});


/**
 * Configures tabs and shows them. data is the json file from server gotten via POST
 * It was called fetched before, now it should be show, but it's too much to change now
 */
function fetchTabs(data) {
    
    var dfd = $.Deferred();
    $.each(data, function(i) {
        if (i != 0) {
            var button = document.createElement("button");
            var title = document.createTextNode(data[i].title);
            button.appendChild(title);
            $("#content").before(button);
            
            $(button)
                .addClass("btn btn-default tab")
                .attr("id", i)
                .focus( function() {
                    $(".tab").css("background-color", "rgb(220, 220, 220)");
                    $(this).css("background-color", $("#content").css("background-color"));
                })
                .click( function() {
                    loadTab(data, i);
                    if ($("form").attr("class") == "edit-form") {
                        $(button).trigger("dblclick");
                    }
                })
                .dblclick( function() {
    
                    $("#index-input")
                        .attr("visibility", "hidden")
                        .attr("disabled", true)
                        .val(i)
                        .css("z-index", "-2");
                    
                    toggleCollapse(true);
                    
                    $("#new-index-input")
                        .attr("visibility", "visible")
                        .attr("disabled", false)
                        .val(i)
                        .css("z-index", "1");
                    
                    $("#title-input").val(data[i].title);
                    $("#content-input").val(data[i].content);
                    
                    $("#add-btn").hide();
                    $(".edit-btn").css("visibility", "visible");
                    
                    $("form").addClass("edit-form");
                });
        }
        dfd.resolve();
    });
    
    return $.when(dfd).promise();
}

/**
 * Loads the content of the current tab.
 * Data is JSON from server, tab - number/id of the tab to load
 */
function loadTab(data, tab) {
    var dfd = $.Deferred();
    
    // show the tab
    if (tab == undefined) {
        tab = Number(data[0]);
    }
    console.log(tab);
    $("#content").html(data[tab].content);
    $("#"+tab).trigger("focus");
    dfd.resolve();
        
    return dfd.promise();
}

/**
 * Shows or hides the left nav.
 * KeepVisible should be set true when it has to stay visible 
 * if it already is, and show up if it isn't (e.g. on double-click)
 */
function toggleCollapse(keepVisible = false) {
    if ($("#left-nav").css("left") == "-310px") {
        
        $("#left-nav").css("left", "0px");
        $("#container").css("margin-left", "320px");
        $("#collapse").css({"left": "278px", "color": "lightblue", "text-shadow": "-5px 0px 5px black"})
            .html("&#9664;");
            
    } else if (keepVisible == false) {
        
        $("#left-nav").css("left", "-310px");
        $("#container").css("margin-left", "20px");
        $("#collapse").css({"color": "rgb(50,50,50)", "text-shadow": "none", "left": "303px"})
            .html("&#9654;");
    }
}

