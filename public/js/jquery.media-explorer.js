/*
|
| jquery.media-explorer.js
| 
| by eezhal92
|
*/


;(function ( $, window, document, undefined ) {
	// checking namespace
	if(!$.eezhal) {
		$.eezhal = {};
	};

	if(typeof $.fn.modal === 'undefined') {
		throw new Error('$.fn.modal is not defined; please double check you have included the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ for more details.');
	}

	if(typeof $.fn.bootpag === 'undefined') {
		throw new Error('$.fn.bootpag is not defined; please double check you have included the bootpag jQuery plugin. See http://botmonster.com/jquery-bootpag/ for more details.');
	}

	if(typeof bootbox === 'undefined') {
		throw new Error('bootbox is not defined. See http://bootboxjs.com/ for more details.')
	}

	$.eezhal.mediaExplorer = function(el, functionParam, options) {
		// avoid scope issus
		var base = this;

		base.$el = $(el);
		base.el = el;

		base.$invoker = null;

		// html components .mexplorer
		base.components = {
			modalContent: '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-body"><div class="mexplorer-body"></div></div></div></div>',
			modalHeader: '<div class="modal-header" id=""><h4 class="modal-title" id="">Media Explorer</h4></div>',
			modalFooter: '<div class="mexplorer-footer modal-footer"></div>',			
			tab: '<div role="tabpanel"><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#tabExplorer" aria-controls="tabExplorer" role="tab" data-toggle="tab">Explorer</a></li><li role="presentation"><a href="#tabUploader" aria-controls="tabUploader" role="tab" data-toggle="tab">Uploader</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane active" id="tabExplorer"></div><div role="tabpanel" class="tab-pane" id="tabUploader"></div></div></div>',
			form: '<form class="mexplorer-form"></form>',
			div: '<div></div>',
            inputs: {
            	text: '<input type="text" class="mexplorer-input-text form-control">',
            	textarea:'<textarea class="mexplorer-input mexplorer-input-textarea form-control"></textarea>',
            	select: '<select class="mexplorer-input mexplorer-input-select form-control"></select>',
            	file: '<input type="file" class="mexplorer-input mexplorer-input-file">'
            },
            buttons: {
            	buttonPrimary: '<button class="mexplorer-btn mexplorer-btn-primary btn btn-primary">',
            	buttonDefault: '<button class="mexplorer-btn mexplorer-btn-default btn btn-default">',
            	closeButton: '<button type="button" class="mexplorer-btn-close close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            },            
		};

		base.$el.data('eezhal.mediaExplorer', base);

		base.init = function () {
			base.functionParam = functionParam;

			base.options = $.extend({}, $.eezhal.mediaExplorer.defaultOptions, options);

			// initialization code goes here
			base.generateModalBase();
			base.setModalAttribut();
			
			base.setListeners();

			console.log('hit init. options:');
			console.log(base.options);
			console.log('requesting ...');
			base.getMediaItems(base.options.requestParams);

		}

		// generate html -
		base.generateModalBase = function () {
			var components = base.components;
			var btn = $(components.buttons.buttonPrimary).text('Masukkan').attr('id', 'tabExplorerButton');
			base.$el.append(components.modalContent)
				.find('.modal-content')
				.prepend(components.modalHeader)
				.append(components.modalFooter)								
				.find('.modal-footer')
				.append(btn);

			var body = base.$el.find('.mexplorer-body')
				.append(components.tab);

			body.find('#tabExplorer').append(base.makeExplorer());
			body.find('#tabUploader').append(base.makeUploader());
		};

		// make html string
		base.makeUploader = function () {
			// var c = base.components;
			
			// var html = $(c.div);
			// var input = $(c.inputs.file).attr('name', 'file_media');

			// var inputGroup = $(c.div).addClass('col-md-6').append(input);

			// html.attr('class', 'row')
			// 	.append(base.components.form)
			// 	.attr('enctype', 'multipart/form-data')
			// 	.append(inputGroup);
			var html = $('<div class="row" style="padding: 20px 0 5px">\
						  <form id="mediaUploadForm" action="'+ base.options.storeUrl +'" method="post" enctype="multipart/form-data">\
						    <div class="col-md-6">\
						      <input id="fileInput" name="file_input" type="file" required="">\
						      <p class="help-block">Choose files.</p>\
						    </div>\
						    <div class="col-md-6">\
						      <div id="progressBox" class="progress">\
						        <div class="progress-bar" id="progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0;"></div>\
						      </div>\
						    </div>\
						  </form>\
						</div>');
			
			return html;
		}

		base.makeExplorer = function () {
			return 'explorer';			
		};

		base.setModalAttribut = function () {
			var el = base.$el;

			var classAttr 			= el.attr('class');
			var tabIndexAttr 		= el.attr('tabindex');
			var roleAttr 			= el.attr('role');
			var ariaLabelledByAttr 	= el.attr('aria-labelledby');
			var ariaHiddenAttr 		= el.attr('aria-hidden');

			if ( typeof classAttr != typeof '') el.attr('class', 'mexplorer modal fade');
			if ( typeof tabIndexAttr != typeof '') el.attr('tabindex', -1);
			if ( typeof roleAttr != typeof '') el.attr('role', 'dialog');
			if ( typeof ariaLabelledByAttr != typeof '') el.attr('aria-labelledby', el.attr('id') + 'Label');
			if ( typeof ariaHiddenAttr != typeof '') el.attr('aria-hidden', true);

			if ( el.attr('id') + 'Label' != el.attr('aria-labelledby') ) {
				throw new Error("Please correct the value of aria-labelledby attribute, or remove the attribute.");
			}
		};

		base.setListeners = function () {
			base.setModalListener();
			base.setModalFormListener();
			base.setModalExplorerListener();
		};

		base.setModalListener = function() {
			$(base.el).on('show.bs.modal', function(e) {
	            base.$invoker = $(e.relatedTarget);
	            
	            var job = base.$invoker.data('job');
	            console.log('the job is ... ' + job);	            

	            switch(job) {
	                case 'insert_content':
	               		
	                break;
	                case 'set_value':
	                
	                break;
	                default:
	                    throw new Error('Please specify data-job either "set_value" or "insert_content"')
	                break;
	            }
                
                $('a[href="#tabExplorer"]').trigger('shown.bs.tab');
	            console.log('hit modal listener');
	        });
            
            $(base.el).on('hide.bs.modal', function() {
                base.resetForm();
                
            });

	        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {	        	
                var tab = $(this);
	        	var href = tab.attr('href');

	        	var btn = $('.modal-footer button').attr('id', href.substring(1) + 'Button'); // remove #
	        	
	        	// console.log(tab.attr('href'));

	        	if(tab.attr('href') == '#tabExplorer') {
	        		btn.text('Masukkan');
                    console.log('tab explorer shown. get media items...');
	        	} else {
	        		btn.text('Upload');
	        	}
                
	        });
	       
		}

		base.setModalFormListener = function () {
			var file, name, size, type;

			$('#fileInput').change(function(){
			    file = this.files[0];
			    name = file.name;
			    size = file.size;
			    type = file.type;			    
			});

			$('.modal-footer').on('click', '#tabUploaderButton', function() {
				var formData = new FormData($('#mediaUploadForm')[0]);

				if( !$.isEmptyObject(base.options.storeToken) ) {
					var headers = {};
					headers[base.options.storeToken.name] = base.options.storeToken.value;

					$.ajaxSetup({
					   headers: headers
					});
				}

				$.ajax({
			        url: base.options.storeUrl , 
			        type: 'POST',
			        dataType: 'json',
			        xhr: function() {
			            var myXhr = $.ajaxSettings.xhr();
			            if(myXhr.upload){ // Check if upload property exists
			                myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
			            }
			            return myXhr;
			        },
			        data: formData,
			        //Options to tell jQuery not to process data or worry about content-type.
			        cache: false,
			        contentType: false,
			        processData: false
			    }).then(
                    function(res){ // success block                        
                        bootalert(res.success);
                        $('ul.nav-tabs a[href="#tabExplorer"]').tab('show');
                    }, function(xhr, error) { // error block
                        var errors = $.parseJSON(xhr.responseText);
                        console.log('error block');
                        bootalert(error);
                    }
                );
                
                function bootalert(message) {
                    bootbox.alert({
                        message: message, 
                        callback: function() {
                             $('#progressBar').width('0%');
                        }
                    });
                }
                
                function progressHandlingFunction(e){
				    if(e.lengthComputable){
				        $('#progressBar').width(Math.ceil(e.loaded/e.total) * 100 + '%');
				    }
				}

			});
		}

		base.setModalExplorerListener = function () {
			$('.modal-footer').on('click', '#tabExplorerButton',function() {
				alert('insert!');
			});
		}

		base.getMediaItems = function(request_params) {
			return $.get(base.indexUrl, request_params);
		}
        
        base.resetForm = function() {
            return $('#mediaUploadForm').each(function() {                
                // guard against an input with the name of 'reset'
                // note that IE reports the reset function as an 'object'
                if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
                    this.reset();
                }
            });
        };

		base.init();
	};

	$.eezhal.mediaExplorer.defaultOptions = {
		indexUrl: null,
		storeUrl: null,
		storeToken: {},
		requestParams: {
            page: 1,
            per_page: 8,
            filter: 'all',
            sort: 'date_desc'
        },
		insertContentCallback: function() {},
		setValueCallback: function() {}
	};

	$.fn.mediaExplorer = function( functionParam, options ) {
		return this.each(function () {
			(new $.eezhal.mediaExplorer( this, functionParam, options ))
		});
	};


})(jQuery, window, document);