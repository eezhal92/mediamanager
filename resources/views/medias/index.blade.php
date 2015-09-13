@extends('app')

@section('content')

<div class="container">

	<div class="row">
		<div class="col-md-12">
			<h1 class="page-header">Media <a href="{{ route('medias.create') }}" class="btn btn-primary pull-right"><i class="glyphicon glyphicon-plus"></i> Create New</a></h1>
		</div>
	</div>

	<div class="row">
		<div class="col-md-7">
			<h3>Data</h3>
			<table class="table table-striped">
				<thead>
					<tr>
						<th>Filename</th>
						<th>Mime Type</th>
						<th>Size</th>
						<th>Path</th>
						<th>Created At</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					@foreach($medias as $m)
					<tr>
						<td>{{ $m->filename }}</td>
						<td>{{ $m->mime_type }}</td>
						<td>{{ $m->size }}</td>
						<td>{{ $m->path }}</td>
						<td>{{ $m->created_at->toFormattedDateString() }}</td>
						<td>
							<a href="{{ route('medias.edit', $m->id) }}" class="btn btn-warning btn-xs">Edit</a>
							<a href="#" class="btn btn-danger btn-xs" data-item="{{ $m->filename }}" data-url="{{ route('medias.destroy', $m->id) }}">Delete</a>
						</td>
					</tr>
					@endforeach
				</tbody>
			</table>
		</div>
		<div class="col-md-3">
			<h3>Explorer</h3>
			<a href="#" id="btnInsert" data-toggle="modal" data-target="#explorer" data-job="insert_content" class="btn btn-info">Insert a content</a>
			<a href="#" id="btnSet" data-toggle="modal" data-target="#explorer" data-job="set_value" class="btn btn-success">Set a value</a>
			<hr>
			<div class="insert-container">
				<span>Please insert content here...</span>
			</div>
			<hr>
			<div class="set-container">
				<form>
				<input type="text" name="foo" class="form-control" placeholder="Please set my value..." value="">
				</form>
				<pre class="dump"></pre>
			</div>
		</div>
		<div id=""output class="col-md-2">
			<h3>Uploader</h3>
			<a href="#" id="btnSet" data-toggle="modal" data-target="#explorer" data-show-tab="#tabUploader" data-job="set_value" class="btn btn-warning">Upload</a>
		</div>
	</div>

	<div id="explorer"></div>

	<div class="row">

	</div>

</div>

@endsection

@section('extra_js')
	<script src="{{ asset('js/bootbox.min.js') }}"></script>
	<script src="{{ asset('js/jquery.bootpag.min.js') }}"></script>
	<script src="{{ asset('js/jquery.media-explorer.js') }}"></script>

	<script>
	$(document).ready(function() {

		$('#explorer').mediaManager('foo', {
			indexUrl: '/medias',
			storeUrl: '/medias',
			storeToken: {
				name: 'X-CSRF-TOKEN',
				value: $('meta[name="csrf-token"]').attr('content')
			},
			callback: {
				insertContent: function(sesuatu, img_tag) {
					$('.insert-container').html(sesuatu).append(img_tag);
				},
				setValue: function(something, current_item) {
					$('.set-container form input[type="text"][name="foo"]').val(something);
					$('.set-container pre.dump').text(JSON.stringify(current_item));
				}
			}
		});

	});
	</script>
@endsection
