/*

 media manager - jQuery plugin for simple media manager

 Copyright (c) 2015 eezhal92

 Licensed under the MIT license:
   http://www.opensource.org/licenses/mit-license.php

 Version:  0.0.1

*/

(function( $ ){
    $.fn.mediaManager = function( options ) {
        var settings = $.extend({
            'modalId': '#mediaManager',
            'indexEndPoint': null,
            'storeUrl': null,
            'callback': null, // 'callback': nanti custom, saat definisi/init. tergantung dimana d attach, misal di attach di button yg terasosiasi dengan text, baerati callbacknya demikian. bila di attach di link add feature image, jg demikian 
            'request_params': {
                page: 1,
                per_page: 8,
                filter: 'all',
                sort: 'date_desc'
            }
        }, options);
        
        var html = $('<div class="modal-dialog modal-lg">\
            <div class="modal-content">\
              <div class="modal-header" id="mediaManagerHeader">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" id="myModalLabel">Media Explorer</h4>\
              </div>\
              <div class="modal-body" id="mediaManagerBody">\
                <div class="row">\
                  <div class="col-md-9">\
                    <div class="row"><form id="mediaManagerPanel" class="form-inline">\
                        <div class="form-group">\
                            <label for="exampleInputName2">Filter By:</label>\
                            <select id="panelFilter" class="form-control input-sm">\
                                 <option value="all">All</option>\
                                 <option value="files">File</option>\
                                 <option value="images">Image</option>\
                            </select>\
                        </div>\
                        <div class="form-group">\
                            <label for="">Sort By:</label>\
                            <select id="panelSort" class="form-control input-sm">\
                                 <option value="date_asc">Date Ascending</option>\
                                 <option value="date_desc">Date Descending</option>\
                                 <option value="name_asc">Name Ascending</option>\
                                 <option value="name_desc">Name Descending</option>\
                            </select>\
                        </div>\
                        <button class="btn btn-sm btn-default pull-right" id="search">Go</button>\
                    </form><hr></div>\
                    <div class="row"></div>\
                        <div id="mediaManagerItemContainer" class="row"></div>\
                  </div>\
                  <div class="col-md-3">\
                    <form id="mediaDetail">\
                        <div class="form-group">\
                            <label>Judul</label>\
                            <input type="hidden" id="detailId" value="">\
                            <input type="text" placeholder="Judul File" id="detailJudulFile" class="form-control">\
                        </div>\
                        <div class="form-group">\
                            <label>Mime Type</label>\
                            <input type="text" placeholder="Type File" id="detailMimeType" class="form-control">\
                        </div>\
                        <div class="form-group">\
                            <label>Ukuran</label>\
                            <input type="text" placeholder="Ukuran" id="detailSize" class="form-control">\
                        </div>\
                        <div class="form-group">\
                            <label>Tanggal Unggah</label>\
                            <input type="text" placeholder="Tanggal" id="detailDate" class="form-control">\
                        </div>\
                        <div class="form-group">\
                            <!--<a class="btn btn-info btn-block btn-upload">Unggah</a>-->\
                         </div>\
                     </form>\
                  </div>\
                </div>\
                <div class="row">\
                    <div id="mediaManagerPagination"></div>\
                </div>\
              </div>\
              <div class="modal-footer" id="mediaManagerFooter">\
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                <button type="button" class="btn btn-primary btn-insert-content">Insert</button>\
                <button type="button" class="btn btn-primary btn-set-value">Set</button>\
              </div>\
            </div>\
          </div>');
        
        this.append(html);

        $('#panelFilter').val(settings.request_params.filter);

        var output;

        // catch invoker element
        $(this).on('show.bs.modal', function(e) {
            var $invoker = $(e.relatedTarget);
            output = $invoker.data('output');
            switch(output) {
                case 'insert_content':
                    $('.btn-set-value').hide();
                    $('.btn-insert-content').show();                    
                    break;
                case 'set_value':
                    $('.btn-set-value').show();
                    $('.btn-insert-content').hide();
                    break;
                default:
                    throw new Error('Please specify data-out either "set_value" or "insert_content"')
                    break;
            }

            console.log(output);
        });



        // require https://github.com/botmonster/jquery-bootpag  Version:  1.0.7        
        var data = [];
        
        var getIndex = function(params) {
            console.log('getting index with...');
            console.log(params);
            $('#mediaManagerItemContainer').empty().append('<div class="loading"><i class="fa fa-cog fa-spin fa-5x"></i></div>');
            return $.get(settings.indexEndPoint, params);            
        }
        
        var generateItems = function(data) {
            var container = $('#mediaManagerBody .col-md-9 #mediaManagerItemContainer');
            container.empty();
            var vals = '';

            console.log('generate data...');
            console.log(data);
            
            $(data).each(function(key, val) {     
                var url = val.url;
                if(val.mime.split('/')[0] == 'image'){
                    url = val.file.lg;
                }


                vals += '<div class="col-sm-3 col-xs-6 media-item"> \
                    <a class="link" data-id="'+ val.id +'" data-url="'+ url +'" data-date="'+ val.created_at +'" data-nama-file ="'+ val.nama_file +'" data-mime-type="'+ val.mime +'" data-size ="'+ val.size_format +'">';
                if(val.mime.split('/')[0] != 'image'){
                    vals += '<div class="thumb '+ val.ekstensi +'"><div class="filename">'+ val.nama_file +'</div></div>';
                } else {
                    vals += '<img width="220" class="img img-rounded img-responsive" src="'+ val.file.md +'">';
                }
                vals += '</a></div>';      
                
            });
            
            container.append(vals);
        }
        
        var generateImageTag = function(data) {
            return '<img width="400" class="img img-rounded img-responsive img-featured" src="'+ data.url +'" alt="'+ data.nama_file +'">';
        };

        $("#mediaManagerPanel").on('submit', function(event)
        {
            event.preventDefault(); // cancel default behavior
            
            request_params.filter = $('#panelFilter').val();
            request_params.sort = $('#panelSort').val();
            request_params.page = 1;
            
            request = getIndex(request_params);
            
            request.done(function(res) {
                console.log('request is done...');
                console.log(res);

                generateItems(res.data);
                $('#mediaManagerPagination').bootpag({
                    page: res.current_page,
                    maxVisible: 10,
                    total: res.last_page
                }).on("page", function(event, num){
                    
                });

            });
            
        });
        
        // catch event on appended .link element on #mediaManagerBody
        $('#mediaManagerBody').on('click', '.link', function() {
            id = $(this).data('id');
            judul = $(this).data('nama-file');
            size = $(this).data('size');
            mime_tipe = $(this).data('mime-type');
            url = $(this).data('url');
            tgl = $(this).data('date');
            
            current_item = {
                id: id,
                title: judul,
                url: url,
                size: size,
                mime: mime_tipe,
                date: tgl
            };
            
            console.log('.link clicked! current item...');
            console.log(current_item);
            
            $('#detailId').val(id);
            $('#detailJudulFile').val(judul);
            $('#detailSize').val(size);
            $('#detailMimeType').val(mime_tipe);
            $('#detailDate').val(tgl);
            
            $('#mediaManagerItemContainer .media-item').not(this).removeClass('selected');
            $(this).parent().toggleClass('selected');
        });
        
        $('#mediaManagerFooter').on('click', '.btn-insert-content', function() {
            if($.isEmptyObject(current_item)) {
                throw new Error('Please select item first.');
            }
            
            if ( $.isFunction( settings.callback ) ) {
                settings.callback.call( this,  current_item, output);                
                $(settings.modalId).modal('hide');
            }    
        });

        $('#mediaManagerFooter').on('click', '.btn-set-value', function() {
            if($.isEmptyObject(current_item)) {
                throw new Error('Please select item first.');
            }
            
            if ( $.isFunction( settings.callback ) ) {
                settings.callback.call( this,   current_item, output, generateImageTag(current_item));                
                $(settings.modalId).modal('hide');
            }    
        });

        var current_item = {};
        
        // var request_params = {
        //     page: 1,
        //     per_page: 8,
        //     filter: 'all',
        //     sort: 'date_desc'
        // }

        var request_params = settings.request_params;

        // console.log('1...');
        // console.log(request_params);
        // console.log('2....');
        // console.log(settings.request_params);
        
        var request = getIndex(request_params);
        
        request.done(function(res){
            data = res.data;

            console.log('retrieving data...');
            console.log(data);
            
            $('#mediaManagerPagination').bootpag({
                total: res.last_page
            }).on("page", function(event, num){
                request_params.page = num; 
                request = getIndex(request_params);
                
                request.done(function(res) {
                    generateItems(res.data);
                });

            });
            
            $('#mediaManagerBody .col-md-9 #mediaManagerItemContainer').empty();
            
            generateItems(data);
        });        
        
        return this;
    };
    
    $.fn.uploader = function(options) {
        var settings = $.extend({
            'modalId': '#mediaUploaderModal',
            'storeUrl': null,
            'callback': null
        }, options);
        
        var html = $('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">Ã—</button><h4 class="modal-title" id="mediaModalLabel">Insert Media</h4></div><div class="modal-body"><div class="row"><form id="mediaUploadForm" action="'+ settings.storeUrl +'" method="post" enctype="multipart/form-data"><div class="col-md-6"><input id="fileInput" name="file_input" type="file" required=""><p class="help-block">Choose files.</p></div><div class="col-md-6"><input type="submit" class="btn btn-md btn-primary pull-right" value="Upload"></div></form></div><div id="progressBox" class="progress"><div class="progress-bar" id="progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0;"></div></div></div></div></div>');
        
        this.append(html);

        var bar = $('#progressBar');
           
        $('#mediaUploadForm').ajaxForm({
            resetForm: true ,
            beforeSend: function() {
                // status.empty();
                var percentVal = '0%';
                bar.width(percentVal);
            },
            uploadProgress: function(event, position, total, percentComplete) {
                var percentVal = percentComplete + '%';
                bar.css('width', percentComplete );
                //console.log(percentVal, position, total);
            },
            beforeSubmit: function() {
                // check whether client browser fully supports all File API
                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    var fsize = $('#fileInput')[0].files[0].size; //get file size
                    var ftype = $('#fileInput')[0].files[0].type; // get file type
                    
                    if(fsize>5242880) 
                    {
                     bootbox.alert("File harus dibawah 5MB.");
                     return false;
                    }

                } else {
                    //Error for older unsupported browsers that doesn't support HTML5 File API
                    bootbox.alert("Mohon upgrade browser anda. Karena browser anda tidak mendukung fitur ini.");
                    return false;
                }
            },
            success: function(data) {
                var percentVal = '100%';
                bar.width(percentVal);              
                bootbox.alert({
                    message: data.success, 
                    callback: function() {
                         window.location.reload();
                    }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#progressBar').addClass('progress-bar-danger');                
                bootbox.alert(jqXHR.responseJSON.error);                

            }
        }); 
        
    }; // end of function
    
}(jQuery));