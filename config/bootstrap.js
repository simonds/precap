/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

User.find().limit(1).done(function(err, users) {

  if (err || users[0] == null) {
      User.create({
        firstName: "Mark",
        lastName: "Simonds",
        email: "marksimonds@gmail.com",
        password: "password"
      }).done(function(err, user){

        if (err) {
            console.log(err);
        } else {
            console.log(user);
            Precap.create({
                name: "Mark's Precap",
                description: "Wedding to be held at the beautiful Trezzi Orchards in the Green Bluff Area. A short ceremony attended by family and close friends, followed by a beautiful outdoor dinner and dancing/general good times, etc.",
                userId: user.id,
                publicUrl: "",
                url: "",
                sections: {
                    "note": {
                        "type": "Note",
                        "format": "html",
                        "name": "A Note About Today",
                        "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    },
                    "location": {
                        "type": "Location",
                        "name": "Trezzi Farm",
                        "map": true,
                        "storedLat": 47.819387,
                        "storedLng": -117.28001,
                        "gPlace": {
                            "address_components": [
                                {
                                    "long_name": "17710",
                                    "short_name": "17710",
                                    "types": [
                                        "street_number"
                                    ]
                                },
                                {
                                    "long_name": "N Dunn Rd",
                                    "short_name": "N Dunn Rd",
                                    "types": [
                                        "route"
                                    ]
                                },
                                {
                                    "long_name": "Colbert",
                                    "short_name": "Colbert",
                                    "types": [
                                        "locality",
                                        "political"
                                    ]
                                },
                                {
                                    "long_name": "Spokane",
                                    "short_name": "Spokane",
                                    "types": [
                                        "administrative_area_level_2",
                                        "political"
                                    ]
                                },
                                {
                                    "long_name": "Washington",
                                    "short_name": "WA",
                                    "types": [
                                        "administrative_area_level_1",
                                        "political"
                                    ]
                                },
                                {
                                    "long_name": "United States",
                                    "short_name": "US",
                                    "types": [
                                        "country",
                                        "political"
                                    ]
                                },
                                {
                                    "long_name": "99005",
                                    "short_name": "99005",
                                    "types": [
                                        "postal_code"
                                    ]
                                }
                            ],
                            "adr_address": "<span class=\"street-address\">17710 N Dunn Rd</span>, <span class=\"locality\">Colbert</span>, <span class=\"region\">WA</span> <span class=\"postal-code\">99005</span>, <span class=\"country-name\">USA</span>",
                            "formatted_address": "17710 N Dunn Rd, Colbert, WA 99005, USA",
                            "geometry": {
                                "location": {
                                    "ob": 47.819387,
                                    "nb": -117.28001
                                }
                            },
                            "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
                            "id": "1c2d2296b803fd3a4ad3a9c31a99d612ad756737",
                            "name": "17710 N Dunn Rd",
                            "reference": "CpQBhwAAAKFN2x4he1VagD-zW-UQFgKOe4FJfWJ-gegF7ieeCrfjWTon1huuV3uhik90lB_wJgVsGmXB-4YEDqQzbNrAEPaqSw9GHyvjzuVu7xqwwrjYVUr31g_jL6tXASJAPHAX7-YdztXuwlE01-JwDaRH80tqBTp6nmRNWKWVXbIvklHhskSYbL5IcAUPFXA6dEeR4hIQYGEi8UCuC5jd18-1vEFhKBoUWoxTxosyIECa9AIcb233lAK7hUs",
                            "types": [
                                "street_address"
                            ],
                            "url": "https://maps.google.com/maps/place?q=17710+N+Dunn+Rd&ftid=0x5361e31404c38b3b:0xfd511737bb600fd9",
                            "vicinity": "Colbert",
                            "html_attributions": []
                        }
                    },
                    "list": {
                        "type": "List",
                        "name": "A Short List of Reminders",
                        "items": [
                            {
                                "checked": true,
                                "text": "This is a list item!"
                            },
                            {
                                "checked": false,
                                "text": "Like all text in Precap, simply click to start editing."
                            },
                            {
                                "checked": false,
                                "text": "Hit ENTER to save."
                            },
                            {
                                "checked": false,
                                "text": "To delete an item, just delete all the text!"
                            },
                            {
                                "checked": false,
                                "text": "Drag and drop items to reorder them."
                            }
                        ]
                    },
                    "timeline": {
                        "type": "Timeline",
                        "name": "Timeline",
                        "date": "2014-03-15",
                        "items": [
                            {
                                "startTime": "2014-03-15T16:00Z",
                                "endTime": "2014-03-15T17:30Z",
                                "text": "Morning coffee with girlfriends at Rockwood Bakery"
                            },
                            {
                                "startTime": "2014-03-15T17:30Z",
                                "endTime": "2014-03-15T20:30Z",
                                "text": "Hair and nails with girlfriends at Jazzz Salon"
                            },
                            {
                                "startTime": "2014-03-15T20:30Z",
                                "endTime": "2014-03-15T22:00Z",
                                "text": "Dresses on, champange, relaxation"
                            },
                            {
                                "startTime": "2014-03-15T22:30Z",
                                "endTime": "2014-03-15T23:00Z",
                                "text": "Pre-wedding photos at Manito"
                            },
                            {
                                "startTime": "2014-03-18T00:00Z",
                                "endTime": "2014-03-18T00:20Z",
                                "text": "Ceremony"
                            }
                        ]
                    },
                    "contactgroup": {
                        "type": "ContactGroup",
                        "name": "Group of Contacts / Collaborators",
                        "contacts": [
                            {
                                "name": "abc",
                                "title": "abc",
                                "primary_email": "abc@abc.com",
                                "primary_phone": "509-123-1234",
                                "vCard": "??"
                            }
                        ]
                    },
                    "photoset": {
                        "type": "PhotoSet",
                        "name": "A photo set - Photography examples",
                        "photos": [
                            {
                                "caption": "Bike",
                                "sizes": {
                                    "original": {
                                        "width": 1412,
                                        "height": 1769,
                                        "url": "/assets/images/photoset_fpo/DSC_0445.jpg",
                                        "filename": "DSC_0445.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_0445_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 718,
                                        "height": 900,
                                        "url": "/assets/images/photoset_fpo/900/DSC_0445_900.jpg"
                                    }
                                }
                            },
                            {
                                "caption": "Girl",
                                "sizes": {
                                    "original": {
                                        "width": 2128,
                                        "height": 1414,
                                        "url": "/assets/images/photoset_fpo/DSC_0450.jpg",
                                        "filename": "DSC_0450.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_0450_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 900,
                                        "height": 598,
                                        "url": "/assets/images/photoset_fpo/900/DSC_0450_900.jpg"
                                    }
                                }
                            },
                            {
                                "caption": "I love this little \"scene\"",
                                "sizes": {
                                    "original": {
                                        "width": 1813,
                                        "height": 1209,
                                        "url": "/assets/images/photoset_fpo/DSC_0535.jpg",
                                        "filename": "DSC_0535.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_0535_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 900,
                                        "height": 600,
                                        "url": "/assets/images/photoset_fpo/900/DSC_0535_900.jpg"
                                    }
                                }
                            },
                            {
                                "caption": "Amazing!",
                                "sizes": {
                                    "original": {
                                        "width": 2128,
                                        "height": 1414,
                                        "url": "/assets/images/photoset_fpo/DSC_0934.jpg",
                                        "filename": "DSC_0934.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_0934_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 900,
                                        "height": 598,
                                        "url": "/assets/images/photoset_fpo/900/DSC_0934_900.jpg"
                                    }
                                }
                            },
                            {
                                "caption": "The motion and black and white make this feel like a classic.",
                                "sizes": {
                                    "original": {
                                        "width": 2128,
                                        "height": 1416,
                                        "url": "/assets/images/photoset_fpo/DSC_1143.jpg",
                                        "filename": "DSC_1143.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_1143_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 900,
                                        "height": 599,
                                        "url": "/assets/images/photoset_fpo/900/DSC_1143_900.jpg"
                                    }
                                }
                            },
                            {
                                "caption": "",
                                "sizes": {
                                    "original": {
                                        "width": 2128,
                                        "height": 1414,
                                        "url": "/assets/images/photoset_fpo/DSC_1717.jpg",
                                        "filename": "DSC_1717.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_1717_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 900,
                                        "height": 598,
                                        "url": "/assets/images/photoset_fpo/900/DSC_1717_900.jpg"
                                    }
                                }
                            },
                            {
                                "caption": "Another classic look.",
                                "sizes": {
                                    "original": {
                                        "width": 2128,
                                        "height": 1416,
                                        "url": "/assets/images/photoset_fpo/DSC_1927.jpg",
                                        "filename": "DSC_1927.jpg",
                                        "mimetype": "image/jpg"
                                    },
                                    "square_165": {
                                        "width": 165,
                                        "height": 165,
                                        "url": "/assets/images/photoset_fpo/165/DSC_1927_sq_165.jpg"
                                    },
                                    "max_900": {
                                        "width": 900,
                                        "height": 599,
                                        "url": "/assets/images/photoset_fpo/900/DSC_1927_900.jpg"
                                    }
                                }
                            }
                        ]
                    },
                    "fileset": {
                        "type": "FileSet",
                        "name": "Some Documents",
                        "files": [
                            {
                                "id": 122332433,
                                "filepath": "/abc123.pdf",
                                "filesize": 444444,
                                "filename": "Menu from Caterer.pdf",
                                "ext": "pdf"
                            },
                            {
                                "id": 122332234433,
                                "filepath": "/abc2123.doc",
                                "filesize": 44444,
                                "filename": "Contract.doc",
                                "ext": "doc"
                            }
                        ]
                    }

                }
            }).done(function(err, precap){
                if (err) {
                    console.log(err);
                } else {
                    console.log(precap);
                };
            });

        }


     });

  }
});


  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};