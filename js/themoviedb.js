/*
 * The MIT License (MIT)
 *
 * Copyright (c) Franco Cavestri
 *
 * https://github.com/cavestri/themoviedb-javascript-library
 *
 */

/* eslint-disable */ 

var theMovieDb = {};

theMovieDb.common = {
    api_key: '90ff7bdcef695d5a8f0bf347aa512623',
    base_uri: 'https://api.themoviedb.org/3/',
    images_uri: 'https://image.tmdb.org/t/p/',
    timeout: 5000,
    language: 'fr-FR',
    generateQuery: function(options) {
        'use strict';
        var myOptions, query, option;

        myOptions = options || {};
        query = '?api_key=' + theMovieDb.common.api_key + '&language=' + theMovieDb.common.language;

        if (Object.keys(myOptions).length > 0) {
            for (option in myOptions) {
                if (myOptions.hasOwnProperty(option) && option !== 'id' && option !== 'body') {
                    query = query + '&' + option + '=' + myOptions[option];
                }
            }
        }
        return query;
    },
    validateCallbacks: function(success, error) {
        'use strict';
        if (typeof success !== 'function' || typeof error !== 'function') {
            throw 'success and error parameters must be functions!';
        }
    },
    validateRequired: function(args, argsReq, opt, optReq, allOpt) {
        'use strict';
        var i, allOptional;

        allOptional = allOpt || false;

        if (args.length !== argsReq) {
            throw 'The method requires  ' + argsReq + ' arguments and you are sending ' + args.length + '!';
        }

        if (allOptional) {
            return;
        }

        if (argsReq > 2) {
            for (i = 0; i < optReq.length; i = i + 1) {
                if (!opt.hasOwnProperty(optReq[i])) {
                    throw optReq[i] + ' is a required parameter and is not present in the options!';
                }
            }
        }
    },
    getImage: function(options) {
        'use strict';
        return theMovieDb.common.images_uri + options.size + '/' + options.file;
    },
    client: function(options, success, error) {
        'use strict';
        var method, status, xhr;

        method = options.method || 'GET';
        status = options.status || 200;
        xhr = new XMLHttpRequest();

        xhr.ontimeout = function() {
            error('{"status_code":408,"status_message":"Request timed out"}');
        };

        xhr.open(method, theMovieDb.common.base_uri + options.url, true);

        if (options.method === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
        }

        xhr.timeout = theMovieDb.common.timeout;

        xhr.onload = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === status) {
                    success(xhr.responseText);
                } else {
                    error(xhr.responseText);
                }
            } else {
                error(xhr.responseText);
            }
        };

        xhr.onerror = function(e) {
            error(xhr.responseText);
        };
        if (options.method === 'POST') {
            xhr.send(JSON.stringify(options.body));
        } else {
            xhr.send(null);
        }
    }
};

theMovieDb.configurations = {
    getConfiguration: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'configuration' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    },
    getCountries: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'configuration/countries' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    },
    getJobs: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'configuration/jobs' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    },
    getLanguages: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'configuration/languages' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    },
    getPrimaryTranslations: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'configuration/primary_translations' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    },
    getTimezones: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'configuration/timezones' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    }
};

theMovieDb.collections = {
    getDetails: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'collection/' + options.id + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'collection/' + options.id + '/images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getTranslations: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'collection/' + options.id + '/translations' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    }
};

theMovieDb.credits = {
    getDetails: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'credit/' + options.id + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    }
};

theMovieDb.find = {
    getById: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id', 'external_source']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'find/' + options.id + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    }
};

theMovieDb.movies = {
    getById: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getExternalIds: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/external_ids' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getProviders: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/watch/providers' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getKeywords: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/keywords' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getReleases: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/release_dates' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getVideos: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/videos' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getSimilarMovies: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/similar' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getReviews: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'movie/' + options.id + '/reviews' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
};

theMovieDb.people = {
    getById: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getMovieCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/movie_credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getTvCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/tv_credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/combined_credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getExternalIds: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/external_ids' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getTaggedImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/tagged_images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getChanges: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/' + options.id + '/changes' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getPopular: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, '', '', true);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/popular' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getLatest: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'person/latest' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    }
};

theMovieDb.tv = {
    getById: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getProviders: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/watch/providers' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getContentRatings: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/content_ratings' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getExternalIds: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/external_ids' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getKeywords: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/keywords' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );

    },
    getReviews: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/reviews' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getTranslations: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/translations' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getVideos: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/videos' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getLatest: function(success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2, '', '', true);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/latest' + theMovieDb.common.generateQuery()
        },
        success,
        error
        );
    }
};

theMovieDb.tvSeasons = {
    getById: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getChanges: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/season/' + options.id + '/changes' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getAccountStates: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['session_id', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/account_states' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getAccountStatesGuest: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['guest_session_id', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/account_states' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getExternalIds: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/external_ids' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getVideos: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/videos' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    }
};

theMovieDb.tvEpisodes = {
    getById: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getChanges: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/episode/' + options.id + '/changes' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getAccountStates: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['session_id', 'episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/account_states' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getAccountStatesGuest: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['guest_session_id', 'episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/account_states' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getCredits: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/credits' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getExternalIds: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/external_ids' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getImages: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/images' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    getVideos: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/videos' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    rate: function(options, rate, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 4, options, ['episode_number', 'season_number', 'session_id', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            method: 'POST',
            status: 201,
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/rating' + theMovieDb.common.generateQuery(options),
            body: {
                'value': rate
            }
        },
        success,
        error
        );
    },
    rateGuest: function(options, rate, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 4, options, ['episode_number', 'season_number', 'guest_session_id', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            method: 'POST',
            status: 201,
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/rating' + theMovieDb.common.generateQuery(options),
            body: {
                'value': rate
            }
        },
        success,
        error
        );
    },
    removeRate: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'session_id', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            method: 'DELETE',
            status: 200,
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/rating' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    },
    removeRateGuest: function(options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ['episode_number', 'season_number', 'guest_session_id', 'id']);

        theMovieDb.common.validateCallbacks(success, error);

        theMovieDb.common.client({
            method: 'DELETE',
            status: 200,
            url: 'tv/' + options.id + '/season/' + options.season_number + '/episode/' + options.episode_number + '/rating' + theMovieDb.common.generateQuery(options)
        },
        success,
        error
        );
    }
};

if ((typeof module != 'undefined') && (module.exports)) {
    module.exports = theMovieDb;
}
