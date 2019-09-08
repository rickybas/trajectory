var outputResultDiv = $('#output-result')[0];
var forms = $('.upload-form');

$(document).ready(function () {
    forms.each(function () {
        $(this).submit(function (event) {
            onFormJSONSubmit(event, this);
        });
    });

});

function onFormJSONSubmit(event, form) {
    console.log('submit clicked');

    // Stop the browser from submitting the form.
    event.preventDefault();

    var formData = new FormData(form);

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            outputResultDiv.innerHTML = "Loading......";

            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", CSRFToken)
            }
        }
    });

    $.ajax({
        url: "/trajectory/api",
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            outputResultDiv.innerHTML = "";
            setServerReturnedOutput(response);

            },
        error: function (error) {
            outputResultDiv.innerHTML = "";
            setServerReturnedError(error)
        }
    });


}

function setServerReturnedOutput(json_data) {
    console.log(json_data);

    for (i in json_data) {
        var p = document.createElement("p");
        p.innerText = json_data[i];
        outputResultDiv.appendChild(p);
    }
}

function setServerReturnedError(error) {
    console.log(error);

    var p = document.createElement("p");
    p.innerText = "Error: " + error.responseJSON.data;
    outputResultDiv.appendChild(p);
}


// add filenames chosen from file choose dialog
$('.custom-file-input').on('change', function () {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html("<b>"+ files.join(', ') + "</b>");
});

// https://stackoverflow.com/questions/32811069/how-to-submit-a-flask-wtf-form-with-ajax
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
