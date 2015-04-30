@extends('app')

@section('content')

<div class="container">
	<div class="row">
		<div class="col-md-8">
			<h1>Pendaftar</h1>
			@if($applicants->count() < 0)
				<div class="alert alert-info">
					There's no any applicant yet.
				</div>
			@else
				<table class="table">
					<thead>
						<tr>
							<th>Reg ID</th>
							<th>Nama</th>
							<th>Umur</th>
							<th>Gender</th>
							<th>Address</th>
						</tr>
					</thead>
					<tbody>
						@foreach($applicants as $applicant)
						<tr>
							<td>{{ $applicant->id }}</td>
							<td>{{ $applicant->name }}</td>
							<td>{{ $applicant->age }}</td>
							<td>{{ $applicant->gender }}</td>
							<td>{{ $applicant->address }}</td>
						</tr>
						@endforeach 
					</tbody>
				</table>
			@endif

			{{ $applicants->render() }}
		</div>
	</div>
</div>

@endsection