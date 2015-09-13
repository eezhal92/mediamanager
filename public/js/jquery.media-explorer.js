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
		throw new Error('$.fn.modal is not defined. Please double check you have included the Bootstrap JavaScript Library. See http://getbootstrap.com/javascript/ for more details.');
	}

	if(typeof $.fn.bootpag === 'undefined') {
		throw new Error('$.fn.bootpag is not defined. Please double check you have included the bootpag jQuery plugin. See http://botmonster.com/jquery-bootpag/ for more details.');
	}

	if(typeof bootbox === 'undefined') {
		throw new Error('bootbox is not defined. See http://bootboxjs.com/ for more details.')
	}

	$.eezhal.mediaManager = function(el, functionParam, options) {
		// avoid scope issus
		var base = this;

		base.$el = $(el);
		base.el = el;
		base.explorer = {
			topPanel: {},
			content: {},
			pagination: {}
		};
		base.uploader = {};

		base.$invoker = null;

		// html components .mexplorer
		base.components = {
			modalContent: '<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-body"><div class="mexplorer-body"></div></div></div></div>',
			modalHeader: '<div class="modal-header" id=""><h4 class="modal-title" id="">Media Manager</h4></div>',
			modalFooter: '<div class="mexplorer-footer modal-footer"></div>',
			tab: '<div role="tabpanel"><ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#tabExplorer" aria-controls="tabExplorer" role="tab" data-toggle="tab">Explorer</a></li><li role="presentation"><a href="#tabUploader" aria-controls="tabUploader" role="tab" data-toggle="tab">Uploader</a></li></ul><div class="tab-content"><div role="tabpanel" class="tab-pane active" id="tabExplorer"></div><div role="tabpanel" class="tab-pane" id="tabUploader"></div></div></div>',
			form: '<form></form>',
			label: '<label></label>',
			div: '<div></div>',
      inputs: {
      	text: '<input type="text" class="mexplorer-input-text form-control">',
      	textarea:'<textarea class="mexplorer-input mexplorer-input-textarea form-control"></textarea>',
      	select: '<select class="mexplorer-input mexplorer-input-select form-control"></select>',
      	file: '<input type="file" class="mexplorer-input mexplorer-input-file">'
      },
      buttons: {
      	common: '<button class="mexplorer-btn btn"></button>',
      	closeButton: '<button type="button" class="mexplorer-btn-close close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
      },
		};

		base.$el.data('eezhal.mediaManager', base);

		base.init = function () {
			base.functionParam = functionParam;

			base.options = $.extend({}, $.eezhal.mediaManager.defaultOptions, options);

			// initialization code goes here
			base.generateModalBase();
			base.setModalAttribut();
			base.setListeners();

			console.log('Initializing with options:', base.options);
		}

		base.generator = {};

		base.generator.label = function(text) {
			return $(base.components.label).text(text);
		}

		base.generator.div = function() {
			return $(base.components.div);
		}

		base.generator.button = function(text) {
			return $(base.components.buttons.common).text(text);
		}

		base.generator.select = function(attr) {
			return $(base.components.inputs.select);
		}

		base.generator.option = function(items) {
			var html = '';

			if(items.length == 0) throw new Error("Please provide element");

			items.forEach(function(item) {
				html += '<option value="'+ item.value +'">'+ item.text +'</option>';
			});

			return html;
		};

		// generate html -
		base.generateModalBase = function () {
			var components = base.components;
			var btn = $(components.buttons.common).addClass('btn-primary').text('Masukkan').attr('id', 'tabExplorerButton');
			base.$el.append(components.modalContent)
				.find('.modal-content')
				.prepend(components.modalHeader)
				.append(components.modalFooter)
				.find('.modal-footer')
				.append(btn);

			var body = base.$el.find('.mexplorer-body')
								.append(components.tab);

			base.explorer.make();
			base.uploader.make();
		};

		base.explorer.make = function () {
			base.explorer.clear();

			var tabExplorer = base.$el.find('#tabExplorer');

			// make div.row.container
			var container = $('<div></div>').attr('class', 'row explorer-container').css('margin-top', '15px');

			// make div.col-md-9.left
			var left =  $('<div></div>').attr('class', 'col-md-9');
			// make div.col-md-3.right
			var right =  $('<div></div>').attr('class', 'col-md-3');

			// isi panel ke div.left
			// isi content ke div.left

			var gen = base.generator;
			// isi detail ke div.right

			var topPanel = base.explorer.topPanel.make();

			var content = gen.div().attr('class', 'explorer-content');

			// base.explorer.generateLists().then(function(html) {
			// 	content.append(html);
			// });
			base.explorer.getMediaItems(base.options.requestParams).then(function(response) {
				content.append(base.explorer.generateLists(response.data));
				$('.explorer-pagination').bootpag({
						page: 1,
						total: response.last_page,
						maxVisible: 10,
						per_page: 2
				});
			});

			var pagination = gen.div().attr('class', 'explorer-pagination');
			var clearfix = gen.div().attr('class', 'clearfix');

			left.append(topPanel).append('<hr>').append(content).append(clearfix).append(pagination);
			container.append(left).append(right);
			tabExplorer.append(container);

		};

		base.explorer.content.update = function(items) {
			base.$el.find('.explorer-content')
				.empty()
				.append(base.explorer.generateLists(items));
		};

		base.explorer.pagination.make = function() {

		};

		base.explorer.topPanel.make = function() {
			var gen = base.generator;
			var filterOptions = [
				{ value: 'all', text: 'All'},
				{ value: 'files', text: 'Files'},
				{ value: 'images', text: 'Image'}
			];

			var sortOptions = [
				{ value: 'date_asc', text: 'Date ASC'},
				{ value: 'date_desc', text: 'Date DESC'},
				{ value: 'name_asc', text: 'Name ASC'},
				{ value: 'name_desc', text: 'Name DESC'}
			];

			var filterControl = gen.select().addClass('input-sm').attr('id', 'filterControl')
														.append(base.generator.option(filterOptions));

			var sortControl = gen.select().addClass('input-sm').attr('id', 'sortControl')
													.append(base.generator.option(sortOptions));

			var filterFormGroup = gen.div().attr('class', 'form-group')
															.append(gen.label('Filter By:'))
															.append(filterControl);
			var sortFormGroup = gen.div().attr('class', 'form-group')
														.append(gen.label('Sort By:'))
														.append(sortControl);

			var form = $(base.components.form).attr('class', 'form-inline')
						.append(filterFormGroup)
						.append(sortFormGroup)
						.append(gen.button('Go').addClass('btn-default pull-right'));

			return $('<div></div>').attr('class', 'explorer-top-panel').append(form);
		};

		base.explorer.generateLists = function(items) {
			// function generateHtml(response) {
				// var items = response.data;
				var html = "";
				items.forEach(function(item, index) {
					console.log(item);
					html += base.explorer.generateItemTag(item);
				});

				return html;
			// };




			// return base.explorer.getMediaItems(base.options.requestParams)
			// 				.then(generateHtml);
		};

		base.explorer.generateItemTag = function(item) {
			// var url = item.path;
      // if(item.mime_type.split('/')[0] == 'image'){
      // 	url = item.file.lg;
      // }

      var items = '<div class="col-sm-3 col-xs-6 media-item"> \
                  		<a class="link" data-id="'+ item.id +'" data-url="'+ item.path +'" data-date="'+ item.created_at +'" \
												data-filename="'+ item.filename +'" data-mime-type="'+ item.mime_type +'" \
												data-size ="'+ item.size +'">';

			// if(item.mime_type.split('/')[0] != 'image'){
      // 	items += '<div class="thumb"><div class="filename">'+ item.filename +'</div></div>';
      // } else {
      	items += '<img width="220" class="img img-rounded img-responsive" src="'+ item.path +'">';
      // }

			items += '</a></div>';

			return items;
		};

		base.explorer.generateImgTag = function (item) {
			return '<img class="img img-responsive img-rounded" src="'+ item.url +'">';
		}

		base.explorer.getMediaItems = function (request_params) {
			return $.get(base.indexUrl, request_params);
		};

		base.explorer.clear = function() {
			base.$el.find('#tabExplorer').empty();
		};

		base.setModalAttribut = function () {
			var el = base.$el;

			var classAttr 			= el.attr('class');
			var tabIndexAttr 		= el.attr('tabindex');
			var roleAttr 			= el.attr('role');
			var ariaLabelledByAttr 	= el.attr('aria-labelledby');
			var ariaHiddenAttr 		= el.attr('aria-hidden');

			if ( typeof tabIndexAttr != typeof '') el.attr('tabindex', -1);
			if ( typeof classAttr != typeof '') el.attr('class', 'mexplorer modal fade');
			if ( typeof roleAttr != typeof '') el.attr('role', 'dialog');
			if ( typeof ariaLabelledByAttr != typeof '') el.attr('aria-labelledby', el.attr('id') + 'Label');
			if ( typeof ariaHiddenAttr != typeof '') el.attr('aria-hidden', true);

			if ( el.attr('id') + 'Label' != el.attr('aria-labelledby') ) {
				throw new Error("Please correct the value of aria-labelledby attribute, or remove the attribute.");
			}
		};

		// make html string
		base.uploader.make = function () {
			var html = $('<div class="row" style="padding: 20px 0 5px">\
						  <form id="mediaUploadForm" action="'+ base.options.storeUrl +'" method="post" enctype="multipart/form-data">\
						    <div class="col-md-9">\
						      <input id="fileInput" name="file_input" type="file" required="">\
						      <p class="help-block">Choose files.</p>\
						    </div>\
						    <div class="col-md-3">\
						      <div id="progressBox" class="progress">\
						        <div class="progress-bar" id="progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0;"></div>\
						      </div>\
						    </div>\
						  </form>\
						</div>');


				base.$el.find('#tabUploader').append(html);
		};

		base.uploader.resetForm = function() {
      return $('#mediaUploadForm').each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
          this.reset();
        }
      });
    };

		base.setListeners = function () {
			base.setModalListener();
			base.setUploaderListener();
			base.setExplorerListener();
		};

		base.setModalListener = function() {
			$(base.el).on('show.bs.modal', function(e) {
				console.log('hit modal listener');

				base.$invoker = $(e.relatedTarget);

				base.explorer.job = base.$invoker.data('job') || base.options.job;
	      console.log('the job is ... ' + base.explorer.job);

	      switch(base.explorer.job) {
	        case 'insert_content':

          	break;
	        case 'set_value':

	        	break;
	        default:
	          throw new Error('Value of data-job attribute must be either "set_value" or "insert_content".')
	          break;
	    	}

				// alert(base.$invoker.data('show-tab'));
				var tab_target = base.$invoker.data('show-tab') || '#tabExplorer';
        $('a[href="'+tab_target+'"]').tab('show');
	    });

      $(base.el).on('hide.bs.modal', function() {
        base.uploader.resetForm();
      });

      $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
      	var tab = $(this);
	      var href = tab.attr('href');

	      var btn = $('.modal-footer button').attr('id', href.substring(1) + 'Button'); // remove #

	      // console.log(tab.attr('href'));
				if(tab.attr('href') == '#tabExplorer') {
	      	btn.text('Masukkan');
	      } else {
	      	btn.text('Upload');
	    	}
			});

			$('.modal-footer').on('click', '#tabExplorerButton',function() {
				console.log("#tabExplorerButton hit!", base.explorer.job);
				if(base.explorer.job === "insert_content") {
					if ( $.isFunction( base.options.callback.insertContent ) ) {
							base.options.callback.insertContent.call( this,  'selected content to insert', base.explorer.generateImgTag(base.explorer.current_item));
					}

					$(base.el).modal('hide');
				}

				if(base.explorer.job === "set_value") {
					if ( $.isFunction( base.options.callback.setValue ) ) {
							base.options.callback.setValue.call( this,  'selected content to set', base.explorer.current_item);
					}

					$(base.el).modal('hide');
				}

			});

		};

		base.setUploaderListener = function () {
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
		    }).then(successCallback, failCallback);

				function progressHandlingFunction(e){
    			if(e.lengthComputable){
        		$('#progressBar').width(Math.ceil(e.loaded/e.total) * 100 + '%');
    			}
				}

				function successCallback(res) { // success block
						//jika success
						bootalert(res.success);
            $('ul.nav-tabs a[href="#tabExplorer"]').tab('show');
						base.options.requestParams.page = 1;
						base.uploader.resetForm();
						base.explorer.make();
        }

				function failCallback(xhr, error) { // error block
            var errors = $.parseJSON(xhr.responseText);
            console.log('error block', xhr);
						base.uploader.resetForm();
						$('#progressBar').css('background-color', '#c9302c');
						bootalert(error);
        }

        function bootalert(message) {
          bootbox.alert({
          	message: message,
            	callback: function() {
                 $('#progressBar').width('0%');
								 $('#progressBar').css('background-color', 'none');								 
              }
          });
        }

			});
		}

		base.setExplorerListener = function () {
			$('.mexplorer-body').on('click', '.link', function() {
					base.explorer.current_item = {
							id: $(this).data('id'),
							title: $(this).data('filename'),
							size: $(this).data('size'),
							mime_type: $(this).data('mime-type'),
							url: $(this).data('url'),
							date: $(this).data('date')
					};

					console.log('.link clicked! Current item: ', base.explorer.current_item);

					$('.explorer-content .media-item').not(this).removeClass('selected');
					$(this).parent().toggleClass('selected');
			});

			$('.mexplorer-body').on('page', '.explorer-pagination', function(event, num){
					base.options.requestParams.page = num;
					// alert();

					base.explorer.getMediaItems(base.options.requestParams)
						.done(function(response) {
							console.log('page ' + num + ':', response.data);
							base.explorer.content.update(response.data);
					});

			});
		};

		// Execute Init function
		base.init();

	};

	$.eezhal.mediaManager.defaultOptions = {
		indexUrl: null,
		storeUrl: null,
		storeToken: {},
		requestParams: {
      page: 1,
      per_page: 2,
      filter: 'all',
      sort: 'date_desc'
    },
		job: 'set_value',
		callback: {
			insertContent: function () {},
			setValue: function() {}
		}
	};

	$.fn.mediaManager = function( functionParam, options ) {
		return this.each(function () {
			(new $.eezhal.mediaManager( this, functionParam, options ))
		});
	};


})(jQuery, window, document);
