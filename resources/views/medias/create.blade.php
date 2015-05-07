@extends('app')

@section('content')

<div class="container">
	
	<div class="row">
		<div class="col-md-12">
			<h1 class="page-header">Upload a File</h1>
		</div>
	</div>

	<div class="row">
		<div class="col-md-4 col-md-offset-1">
			
			<form class="form" action="{{ route('medias.store') }}" method="post" enctype="multipart/form-data">
				<input type="hidden" name="_token" value="{{ csrf_token() }}">
				<div class="form-group @if($errors->first('media_file')) has-error @endif">
					<label for="media_file">Media file</label>
					<input type="file" name="file_input">
					<span class="help-block">Allowed extension: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .rar, .zip, .jpg, .png</span>
					@if($errors->first('media_file'))
					<span class="help-block">{{ $errors->first('media_file') }}</span>					
					@endif
				</div>				
				<div class="form-group">
					<input type="submit" class="btn btn-primary" value="Upload">
				</div>
			</form>

		</div>
	</div>

</div>

@endsection