if("undefined" == typeof jQuery)
    throw new Error("SmartFeedback JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");

var SmartFeedback = {};

SmartFeedback.show = function(elementOrElementId, type, message, messagePlace, options) {
    var element;
    if("undefined" == typeof elementOrElementId || "undefined" == typeof type
                || "undefined" == typeof message) {
        throw new Error("One or More mandatory inputs are missing.");
        return;
    }
    if("string" == typeof elementOrElementId) {
        element = $("#" + elementOrElementId);
    } else {
        element = $(elementOrElementId);
    }
    var elementClass = options && options.class ? options.class : "animated zoomIn";
    var elementStyle = options && options.style ? options.style : "";
    var elementIcon, elementColor;
    if(type === "info") {
        elementIcon = "<i class='fa fa-check-circle' aria-hidden='true'></i> ";
        elementColor = "text-info";
    } else if(type === "warning") {
        elementIcon = "<i class='fa fa-exclamation-circle' aria-hidden='true'></i> ";
        elementColor = "text-warning";
    } else if(type === "error") {
        elementIcon = "<i class='fa fa-times-circle' aria-hidden='true'></i> ";
        elementColor = "text-danger";
    }
    var infoElement = $("<div class='"+ elementClass + " " + elementColor +"'>" + elementIcon + "<span>" + message +"</span></div>");
    var position = element.position(), width = element.outerWidth(), height = element.outerHeight();
    var infoElementCss = { top : position.top, 
            left : position.left + width + 10, 
            "position" : "absolute"
        };
    if(messagePlace && messagePlace === "bottom") {
        infoElementCss.top = position.top + height + 15;
        infoElementCss.left = position.left;
    } else if(messagePlace && messagePlace === "left") {
        infoElementCss.top = position.top;
        infoElementCss.left = position.left - 50;
    } else if(messagePlace && messagePlace === "top") {
        infoElementCss.top = position.top - 30;
        infoElementCss.left = position.left;
    }
    infoElement.css(infoElementCss);
    infoElement.insertAfter(element);
    var showTime = options && options.time ? options.time : 800;
    var fadeTime = options && options.fadeTime ? options.fadeTime : 1000;
    setTimeout(function() {
        infoElement.fadeOut(fadeTime, function(){
            infoElement.remove();
        });
    }, showTime);
};