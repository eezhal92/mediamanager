@extends('app')

@section('content')

<div class="container">
	<div class="row">
		<div class="col-md-6">
			@if( session()->has('errors') )
			<div class="alert alert-danger">
				<p>Ooops. It looks like something went wrong.</p>
			</div>
			@endif
			<h1>Formulir Pendaftaran</h1>
			<form action="{{ route('admissions.store') }}" method="POST">
				<input type="hidden" name="_token" value="{{ csrf_token() }}">
				<div class="form-group @if($errors->first('name')) has-error @endif">
					<label for="name">Nama</label>
					<input type="text" name="name" class="form-control" placeholder="Masukkan nama anda" value="{{ old('name') }}" autofocus>
					@if($errors->first('name'))
					<span class="help-block">{{ $errors->first('name') }}</span>
					@endif
				</div>

				<div class="form-group @if($errors->first('age')) has-error @endif">
					<label for="age">Umur</label>
					<input type="text" name="age" class="form-control" placeholder="Masukkan umur anda" value="{{ old('age') }}">
					@if($errors->first('age'))
					<span class="help-block">{{ $errors->first('age') }}</span>
					@endif
				</div>

				<div class="form-group @if($errors->first('gender')) has-error @endif">
					<label for="gender">Jenis Kelamin</label>
					<div class="radio-inline">
						<input type="radio" name="gender" value="m" checked> Laki-laki
					</div>
					<div class="radio-inline">
						<input type="radio" name="gender" value="f"> Perempuan
					</div>
					@if($errors->first('gender'))
					<span class="help-block">{{ $errors->first('gender') }}</span>
					@endif
				</div>

				<div class="form-group @if($errors->first('address')) has-error @endif">
					<label for="address">Alamat</label>
					<textarea name="address" class="form-control" rows="3">{{ old('address') }}</textarea>
					@if($errors->first('address'))
					<span class="help-block">{{ $errors->first('address') }}</span>
					@endif
				</div>

				<div class="form-group">
					<button type="submit" class="btn btn-primary"><i class="glyphicon glyphicon-ok"></i> Daftar</button>
				</div>

			</form>
		</div>
	</div>
</div>

@endsection