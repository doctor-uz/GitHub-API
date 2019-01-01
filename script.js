(function() {
    //////////////////////////////////////////////////////////
    ////////////////////// DO NOT TOUCH Handelbar////////////////////
    //////////////////////////////////////////////////////////

    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    //////////////////////////////////////////////////////////
    ////////////////////// DO NOT TOUCH ////////////////////
    //////////////////////////////////////////////////////////

    $("button").on("click", function(e) {
        e.preventDefault();

        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var userToSearch = $('input[name="search"]').val();

        //console.log(username,  search);

        var baseUrl = "https://api.github.com";
        var endpoint = "/users/" + userToSearch + "/repos";

        console.log(baseUrl + endpoint);

        $.ajax({
            url: baseUrl + endpoint,
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            },
            success: function(jsdata) {
                console.log("data: ", jsdata);

                var reposList = $("#repos-list");
                reposList.html(
                    Handlebars.templates.reposTemplate({
                        htmlData: jsdata
                    })
                );
                ////
                ////
                ////
                ///
                ////here starts commits
                $(".repo-name").on("click", function(e) {
                    var endPointCommits =
                        "/repos/" + $(e.target).html() + "/commits?per_page=10";
                    // delete existing commits
                    if (
                        $(e.target)
                            .next()
                            .children().length > 0
                    ) {
                        $(e.target)
                            .next()
                            .html("");
                        return;
                    }

                    // call 2nd ajax for commits
                    $.ajax({
                        url: baseUrl + endPointCommits,
                        headers: {
                            Authorization:
                                "Basic " + btoa(username + ":" + password)
                        },
                        success: function(jsdata) {
                            var repoCommits = $(".repo-commits").eq(
                                $(e.target)
                                    .parent()
                                    .index()
                            );
                            repoCommits.html(
                                Handlebars.templates.commitsTemplate({
                                    htmlData: jsdata
                                })
                            );
                        }
                    });
                });
            }
        });
    });
})();
