@extends('app')

@section('content')

<div class="container">
	
	<div class="row">
		<div class="col-md-12">
			<h1 class="page-header">Media <a href="{{ route('medias.create') }}" class="btn btn-primary pull-right"><i class="glyphicon glyphicon-plus"></i> Create New</a></h1>
		</div>
	</div>

	<div class="row">
		<div class="col-md-10 col-md-offset-1">
			
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
	</div>

	<div class="row">
		<div class="col-md-5 col-md-offset-1">
			<a href="#" id="btnInsert" data-toggle="modal" data-target="#explorer" data-job="insert_content" class="btn btn-info">Insert a content</a>
			<a href="#" id="btnSet" data-toggle="modal" data-target="#explorer" data-job="set_value" class="btn btn-success">Set a value</a>
		</div>
		<div id=""output class="col-md-5">
			<div class=".insert-container">
				<span>Please insert content here...</span>
			</div>
			<hr>
			<div class="set-container">
				<form>
				<input type="text" name="foo" class="form-control" placeholder="Please set my value...">
				</form>
			</div>
		</div>
	</div>

	<div id="explorer"></div>

	<div class="row">
		<!-- Button trigger modal -->
<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
	</div>

</div>

@endsection

@section('extra_js')
	<script src="{{ asset('js/bootbox.min.js') }}"></script>
	<script src="{{ asset('js/jquery.bootpag.min.js') }}"></script>
	<script src="{{ asset('js/jquery.media-explorer.js') }}"></script>
		
	<script>
	$(document).ready(function() {
		
		$('#explorer').mediaExplorer('foo', {
			indexUrl: '/medias',
			storeUrl: '/medias',
			storeToken: {
				name: 'X-CSRF-TOKEN',
				value: $('meta[name="csrf-token"]').attr('content')
			}
		});

	});
	</script>
@endsection
